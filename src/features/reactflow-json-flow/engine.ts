import type {
  CompiledGraph,
  ExecutionLogEntry,
  ExecutionResult,
  FilterOperator,
  FilterValueType,
  JsonFlowEdge,
  JsonFlowNode,
  JsonFlowNodeType,
  NodeExecutionStatus,
  ValidationIssue
} from './types';

const unaryNodeTypes: JsonFlowNodeType[] = ['pick', 'filter', 'map'];

function pushIssue(issues: ValidationIssue[], message: string, nodeId?: string, level: ValidationIssue['level'] = 'error') {
  issues.push({ message, nodeId, level });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && !Array.isArray(value);
}

function getByPath(value: unknown, path: string): unknown {
  const normalized = path.trim();
  if (!normalized) {
    return value;
  }

  return normalized.split('.').reduce<unknown>((current, segment) => {
    if (!isRecord(current)) {
      return undefined;
    }
    return current[segment];
  }, value);
}

function pickFields(value: unknown, fields: string[]): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => pickFields(item, fields));
  }

  if (!isPlainObject(value)) {
    throw new Error('Pick 节点需要对象或对象数组输入。');
  }

  return fields.reduce<Record<string, unknown>>((result, field) => {
    result[field] = getByPath(value, field);
    return result;
  }, {});
}

function parseCompareValue(raw: string, valueType: FilterValueType): unknown {
  const text = raw.trim();
  if (valueType === 'string') {
    return raw;
  }

  if (valueType === 'number') {
    const parsed = Number(text);
    if (!Number.isFinite(parsed)) {
      throw new Error('Filter 比较值不是合法数字。');
    }
    return parsed;
  }

  if (valueType === 'boolean') {
    if (text === 'true') {
      return true;
    }
    if (text === 'false') {
      return false;
    }
    throw new Error('Filter 布尔值仅支持 true / false。');
  }

  if (text === 'true') {
    return true;
  }
  if (text === 'false') {
    return false;
  }
  if (text === 'null') {
    return null;
  }

  const maybeNumber = Number(text);
  if (text.length > 0 && Number.isFinite(maybeNumber)) {
    return maybeNumber;
  }

  return raw;
}

function compareValues(actual: unknown, expected: unknown, operator: FilterOperator) {
  switch (operator) {
    case 'eq':
      return actual === expected;
    case 'neq':
      return actual !== expected;
    case 'gt':
      return typeof actual === 'number' && typeof expected === 'number' && actual > expected;
    case 'gte':
      return typeof actual === 'number' && typeof expected === 'number' && actual >= expected;
    case 'lt':
      return typeof actual === 'number' && typeof expected === 'number' && actual < expected;
    case 'lte':
      return typeof actual === 'number' && typeof expected === 'number' && actual <= expected;
    case 'contains':
      if (typeof actual === 'string') {
        return actual.includes(String(expected));
      }
      if (Array.isArray(actual)) {
        return actual.includes(expected);
      }
      return false;
    default:
      return false;
  }
}

function requireSingleInput(inputs: unknown[], nodeLabel: string) {
  if (inputs.length !== 1) {
    throw new Error(`${nodeLabel} 需要且仅需要 1 个输入，当前为 ${inputs.length}。`);
  }
  return inputs[0];
}

function executeNode(node: JsonFlowNode, inputs: unknown[]): unknown {
  const { data } = node;

  switch (data.nodeType) {
    case 'input': {
      const text = data.config.jsonText.trim();
      if (!text) {
        throw new Error('Input 节点的 JSON 内容为空。');
      }
      return JSON.parse(text);
    }

    case 'pick': {
      const input = requireSingleInput(inputs, data.label);
      return pickFields(input, data.config.fields);
    }

    case 'filter': {
      const input = requireSingleInput(inputs, data.label);
      if (!Array.isArray(input)) {
        throw new Error('Filter 节点只支持数组输入。');
      }

      const expected = parseCompareValue(data.config.compareValue, data.config.valueType);
      return input.filter((item) => compareValues(getByPath(item, data.config.fieldPath), expected, data.config.operator));
    }

    case 'map': {
      const input = requireSingleInput(inputs, data.label);
      if (!Array.isArray(input)) {
        throw new Error('Map 节点只支持数组输入。');
      }

      return input.map((item) => {
        const result: Record<string, unknown> = {};
        data.config.rules.forEach((rule) => {
          result[rule.targetKey] = getByPath(item, rule.sourcePath);
        });
        return result;
      });
    }

    case 'merge': {
      if (inputs.length < 2) {
        throw new Error('Merge 节点至少需要 2 个输入。');
      }

      if (data.config.mode === 'array-concat') {
        if (!inputs.every(Array.isArray)) {
          throw new Error('Merge(array-concat) 要求所有输入都是数组。');
        }
        return (inputs as unknown[][]).flat();
      }

      if (data.config.mode === 'object-merge') {
        if (!inputs.every(isPlainObject)) {
          throw new Error('Merge(object-merge) 要求所有输入都是对象。');
        }
        return Object.assign({}, ...inputs);
      }

      const allArrays = inputs.every(Array.isArray);
      if (allArrays) {
        return (inputs as unknown[][]).flat();
      }

      const allObjects = inputs.every(isPlainObject);
      if (allObjects) {
        return Object.assign({}, ...inputs);
      }

      return inputs;
    }

    case 'output': {
      if (inputs.length === 0) {
        throw new Error('Output 节点缺少输入。');
      }
      return inputs.length === 1 ? inputs[0] : inputs;
    }

    default:
      throw new Error(`不支持的节点类型: ${(data as { nodeType: string }).nodeType}`);
  }
}

function makeAdjacency(nodes: JsonFlowNode[], edges: JsonFlowEdge[], issues: ValidationIssue[]) {
  const nodeMap = new Map<string, JsonFlowNode>();
  const incomingByNode = new Map<string, string[]>();
  const outgoingByNode = new Map<string, string[]>();

  nodes.forEach((node) => {
    if (nodeMap.has(node.id)) {
      pushIssue(issues, `检测到重复节点 id: ${node.id}`, node.id);
      return;
    }

    nodeMap.set(node.id, node);
    incomingByNode.set(node.id, []);
    outgoingByNode.set(node.id, []);
  });

  edges.forEach((edge) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode || !targetNode) {
      pushIssue(
        issues,
        `连线 ${edge.id || '(no-id)'} 引用了不存在的节点（${edge.source} -> ${edge.target}）。`
      );
      return;
    }

    outgoingByNode.get(edge.source)?.push(edge.target);
    incomingByNode.get(edge.target)?.push(edge.source);
  });

  return {
    nodeMap,
    incomingByNode,
    outgoingByNode
  };
}

function buildTopologicalOrder(nodeMap: Map<string, JsonFlowNode>, incomingByNode: Map<string, string[]>, outgoingByNode: Map<string, string[]>) {
  const indegree = new Map<string, number>();
  nodeMap.forEach((_node, id) => {
    indegree.set(id, incomingByNode.get(id)?.length ?? 0);
  });

  const queue = Array.from(indegree.entries())
    .filter(([, degree]) => degree === 0)
    .map(([id]) => id);

  const order: string[] = [];

  while (queue.length) {
    const current = queue.shift();
    if (!current) {
      break;
    }

    order.push(current);
    const outgoing = outgoingByNode.get(current) ?? [];
    outgoing.forEach((target) => {
      const nextDegree = (indegree.get(target) ?? 0) - 1;
      indegree.set(target, nextDegree);
      if (nextDegree === 0) {
        queue.push(target);
      }
    });
  }

  return {
    order,
    hasCycle: order.length !== nodeMap.size
  };
}

function collectReachability(
  nodes: JsonFlowNode[],
  incomingByNode: Map<string, string[]>,
  outgoingByNode: Map<string, string[]>
) {
  const inputIds = nodes.filter((node) => node.data.nodeType === 'input').map((node) => node.id);
  const outputIds = nodes.filter((node) => node.data.nodeType === 'output').map((node) => node.id);

  const reachableFromInput = new Set<string>();
  const canReachOutput = new Set<string>();

  const forwardStack = [...inputIds];
  while (forwardStack.length) {
    const id = forwardStack.pop();
    if (!id || reachableFromInput.has(id)) {
      continue;
    }
    reachableFromInput.add(id);
    const outgoing = outgoingByNode.get(id) ?? [];
    outgoing.forEach((next) => {
      if (!reachableFromInput.has(next)) {
        forwardStack.push(next);
      }
    });
  }

  const reverseStack = [...outputIds];
  while (reverseStack.length) {
    const id = reverseStack.pop();
    if (!id || canReachOutput.has(id)) {
      continue;
    }
    canReachOutput.add(id);
    const incoming = incomingByNode.get(id) ?? [];
    incoming.forEach((prev) => {
      if (!canReachOutput.has(prev)) {
        reverseStack.push(prev);
      }
    });
  }

  return {
    inputIds,
    outputIds,
    reachableFromInput,
    canReachOutput
  };
}

function validateNodeConfig(node: JsonFlowNode, incomingCount: number, issues: ValidationIssue[]) {
  const { data } = node;

  if (unaryNodeTypes.includes(data.nodeType) && incomingCount !== 1) {
    pushIssue(issues, `${data.label} 需要且仅需要 1 条输入连线。`, node.id);
  }

  if (data.nodeType === 'merge' && incomingCount < 2) {
    pushIssue(issues, `${data.label} 至少需要 2 条输入连线。`, node.id);
  }

  if (data.nodeType === 'output' && incomingCount < 1) {
    pushIssue(issues, `${data.label} 需要至少 1 条输入连线。`, node.id);
  }

  if (data.nodeType === 'input' && incomingCount > 0) {
    pushIssue(issues, `${data.label} 是输入节点，不建议有入边。`, node.id, 'warning');
  }

  switch (data.nodeType) {
    case 'input': {
      const content = data.config.jsonText.trim();
      if (!content) {
        pushIssue(issues, `${data.label} 的 JSON 内容不能为空。`, node.id);
        break;
      }

      try {
        JSON.parse(content);
      } catch {
        pushIssue(issues, `${data.label} 的 JSON 格式无效。`, node.id);
      }
      break;
    }

    case 'pick': {
      if (!data.config.fields.length) {
        pushIssue(issues, `${data.label} 至少需要 1 个字段。`, node.id);
      }
      break;
    }

    case 'filter': {
      if (!data.config.fieldPath.trim()) {
        pushIssue(issues, `${data.label} 的 fieldPath 不能为空。`, node.id);
      }

      try {
        parseCompareValue(data.config.compareValue, data.config.valueType);
      } catch (error) {
        pushIssue(issues, `${data.label} 的比较值无效：${(error as Error).message}`, node.id);
      }
      break;
    }

    case 'map': {
      if (!data.config.rules.length) {
        pushIssue(issues, `${data.label} 至少需要 1 条映射规则。`, node.id);
      }

      data.config.rules.forEach((rule, index) => {
        if (!rule.targetKey.trim()) {
          pushIssue(issues, `${data.label} 第 ${index + 1} 条映射缺少 targetKey。`, node.id);
        }
        if (!rule.sourcePath.trim()) {
          pushIssue(issues, `${data.label} 第 ${index + 1} 条映射缺少 sourcePath。`, node.id);
        }
      });
      break;
    }

    case 'merge':
    case 'output':
      break;
  }
}

export function hasErrorIssues(issues: ValidationIssue[]) {
  return issues.some((issue) => issue.level === 'error');
}

export function validateGraph(nodes: JsonFlowNode[], edges: JsonFlowEdge[]) {
  const issues: ValidationIssue[] = [];

  if (!nodes.length) {
    pushIssue(issues, '当前流程没有节点，无法执行。');
    return {
      issues
    };
  }

  const { nodeMap, incomingByNode, outgoingByNode } = makeAdjacency(nodes, edges, issues);
  const { order, hasCycle } = buildTopologicalOrder(nodeMap, incomingByNode, outgoingByNode);

  if (hasCycle) {
    pushIssue(issues, '流程图存在环路，无法进行拓扑执行。');
  }

  const reachability = collectReachability(nodes, incomingByNode, outgoingByNode);

  if (!reachability.inputIds.length) {
    pushIssue(issues, '至少需要 1 个 Input 节点。');
  }

  if (!reachability.outputIds.length) {
    pushIssue(issues, '至少需要 1 个 Output 节点。');
  }

  nodes.forEach((node) => {
    const incomingCount = incomingByNode.get(node.id)?.length ?? 0;

    validateNodeConfig(node, incomingCount, issues);

    if (!reachability.reachableFromInput.has(node.id)) {
      pushIssue(issues, `${node.data.label} 不在任何输入可达路径上。`, node.id);
    }

    if (!reachability.canReachOutput.has(node.id)) {
      pushIssue(issues, `${node.data.label} 不会影响任何输出结果。`, node.id);
    }
  });

  if (hasErrorIssues(issues) || hasCycle) {
    return {
      issues
    };
  }

  const compiled: CompiledGraph = {
    nodeMap,
    incomingByNode,
    outgoingByNode,
    outputNodeIds: reachability.outputIds,
    topoOrder: order
  };

  return {
    issues,
    compiled
  };
}

function logStep(logs: ExecutionLogEntry[], node: JsonFlowNode, status: NodeExecutionStatus, message: string) {
  logs.push({
    nodeId: node.id,
    nodeLabel: node.data.label,
    status,
    message,
    timestamp: new Date().toISOString()
  });
}

export function executeGraph(nodes: JsonFlowNode[], edges: JsonFlowEdge[]): ExecutionResult {
  const nodeStatuses: Record<string, NodeExecutionStatus> = {};
  const outputsByNode: Record<string, unknown> = {};
  const outputByOutputNode: Record<string, unknown> = {};
  const logs: ExecutionLogEntry[] = [];

  nodes.forEach((node) => {
    nodeStatuses[node.id] = 'idle';
  });

  const validation = validateGraph(nodes, edges);
  if (!validation.compiled || hasErrorIssues(validation.issues)) {
    return {
      ok: false,
      issues: validation.issues,
      nodeStatuses,
      logs,
      outputsByNode,
      outputByOutputNode,
      compiled: validation.compiled
    };
  }

  for (const nodeId of validation.compiled.topoOrder) {
    const node = validation.compiled.nodeMap.get(nodeId);
    if (!node) {
      continue;
    }

    const incomingNodeIds = validation.compiled.incomingByNode.get(node.id) ?? [];
    const upstreamFailed = incomingNodeIds.some((id) => {
      const status = nodeStatuses[id];
      return status === 'error' || status === 'skipped';
    });

    if (upstreamFailed) {
      nodeStatuses[node.id] = 'skipped';
      logStep(logs, node, 'skipped', '上游节点失败，当前节点已跳过。');
      continue;
    }

    nodeStatuses[node.id] = 'running';

    try {
      const inputs = incomingNodeIds.map((id) => outputsByNode[id]);
      const output = executeNode(node, inputs);
      outputsByNode[node.id] = output;
      nodeStatuses[node.id] = 'success';
      logStep(logs, node, 'success', '执行成功。');

      if (node.data.nodeType === 'output') {
        outputByOutputNode[node.id] = output;
      }
    } catch (error) {
      nodeStatuses[node.id] = 'error';
      logStep(logs, node, 'error', (error as Error).message);
    }
  }

  const primaryOutputNodeId = validation.compiled.outputNodeIds.find((nodeId) => nodeStatuses[nodeId] === 'success');
  const executionFailed = Object.values(nodeStatuses).some((status) => status === 'error');

  return {
    ok: !executionFailed,
    issues: validation.issues,
    nodeStatuses,
    logs,
    outputsByNode,
    outputByOutputNode,
    primaryOutputNodeId,
    compiled: validation.compiled
  };
}

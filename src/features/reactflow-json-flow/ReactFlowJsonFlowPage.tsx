import '@xyflow/react/dist/style.css';

import {
  addEdge,
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  type Connection,
  type NodeProps,
  type OnSelectionChangeParams,
  useEdgesState,
  useNodesState
} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { SectionCard } from '../../common/ui/SectionCard';
import { executeGraph, hasErrorIssues, validateGraph } from './engine';
import styles from './ReactFlowJsonFlowPage.module.css';
import type {
  ExecutionResult,
  FilterOperator,
  FilterValueType,
  JsonFlowConfigByType,
  JsonFlowEdge,
  JsonFlowExportSchema,
  JsonFlowNode,
  JsonFlowNodeData,
  JsonFlowNodeType,
  MapRule,
  MergeMode,
  NodeExecutionStatus,
  ValidationIssue
} from './types';
import { JSON_FLOW_VERSION } from './types';

const STORAGE_KEY = 'reactflow-json-flow';

const SAMPLE_INPUT_JSON = JSON.stringify(
  [
    { id: 1, name: 'Ada', age: 22, city: 'Shanghai', active: true },
    { id: 2, name: 'Bob', age: 31, city: 'Beijing', active: false },
    { id: 3, name: 'Cindy', age: 27, city: 'Shanghai', active: true }
  ],
  null,
  2
);

const edgeVisual = {
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { stroke: '#2563eb', strokeWidth: 2 }
} as const;

const nodeMeta: Record<JsonFlowNodeType, { label: string; tone: string; description: string }> = {
  input: {
    label: 'Input',
    tone: '#0ea5e9',
    description: '输入或粘贴 JSON 数据。'
  },
  pick: {
    label: 'Pick',
    tone: '#14b8a6',
    description: '提取对象字段，支持数组逐项提取。'
  },
  filter: {
    label: 'Filter',
    tone: '#8b5cf6',
    description: '按字段条件过滤数组。'
  },
  map: {
    label: 'Map',
    tone: '#06b6d4',
    description: '将数组项映射为新对象结构。'
  },
  merge: {
    label: 'Merge',
    tone: '#f59e0b',
    description: '多输入合并（数组 concat / 对象 merge）。'
  },
  output: {
    label: 'Output',
    tone: '#f97316',
    description: '预览并下载结果。'
  }
};

const filterOperators: Array<{ value: FilterOperator; label: string }> = [
  { value: 'eq', label: '==' },
  { value: 'neq', label: '!=' },
  { value: 'gt', label: '>' },
  { value: 'gte', label: '>=' },
  { value: 'lt', label: '<' },
  { value: 'lte', label: '<=' },
  { value: 'contains', label: 'contains' }
];

const filterValueTypes: Array<{ value: FilterValueType; label: string }> = [
  { value: 'auto', label: 'Auto' },
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' }
];

const mergeModes: Array<{ value: MergeMode; label: string; note: string }> = [
  { value: 'auto', label: 'Auto', note: '数组 -> concat，对象 -> merge，否则输出数组。' },
  { value: 'array-concat', label: 'Array Concat', note: '强制所有输入为数组并拼接。' },
  { value: 'object-merge', label: 'Object Merge', note: '强制所有输入为对象并浅合并。' }
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isJsonFlowNodeType(value: unknown): value is JsonFlowNodeType {
  return value === 'input' || value === 'pick' || value === 'filter' || value === 'map' || value === 'merge' || value === 'output';
}

function buildDefaultConfig(nodeType: 'input'): JsonFlowConfigByType['input'];
function buildDefaultConfig(nodeType: 'pick'): JsonFlowConfigByType['pick'];
function buildDefaultConfig(nodeType: 'filter'): JsonFlowConfigByType['filter'];
function buildDefaultConfig(nodeType: 'map'): JsonFlowConfigByType['map'];
function buildDefaultConfig(nodeType: 'merge'): JsonFlowConfigByType['merge'];
function buildDefaultConfig(nodeType: 'output'): JsonFlowConfigByType['output'];
function buildDefaultConfig(nodeType: JsonFlowNodeType): JsonFlowConfigByType[JsonFlowNodeType] {
  switch (nodeType) {
    case 'input':
      return { jsonText: SAMPLE_INPUT_JSON };
    case 'pick':
      return { fields: ['id', 'name'] };
    case 'filter':
      return {
        fieldPath: 'age',
        operator: 'gte',
        compareValue: '25',
        valueType: 'number'
      };
    case 'map':
      return {
        rules: [
          { id: `rule-${Date.now()}-1`, targetKey: 'userName', sourcePath: 'name' },
          { id: `rule-${Date.now()}-2`, targetKey: 'city', sourcePath: 'city' }
        ]
      };
    case 'merge':
      return { mode: 'auto' };
    case 'output':
      return { pretty: true };
  }
}

function createNodeData(nodeType: JsonFlowNodeType, label?: string): JsonFlowNodeData {
  const finalLabel = label?.trim() ? label.trim() : nodeMeta[nodeType].label;

  switch (nodeType) {
    case 'input':
      return {
        nodeType,
        label: finalLabel,
        config: buildDefaultConfig(nodeType)
      };
    case 'pick':
      return {
        nodeType,
        label: finalLabel,
        config: buildDefaultConfig(nodeType)
      };
    case 'filter':
      return {
        nodeType,
        label: finalLabel,
        config: buildDefaultConfig(nodeType)
      };
    case 'map':
      return {
        nodeType,
        label: finalLabel,
        config: buildDefaultConfig(nodeType)
      };
    case 'merge':
      return {
        nodeType,
        label: finalLabel,
        config: buildDefaultConfig(nodeType)
      };
    case 'output':
      return {
        nodeType,
        label: finalLabel,
        config: buildDefaultConfig(nodeType)
      };
  }
}

function createNode(id: string, nodeType: JsonFlowNodeType, x: number, y: number, label?: string): JsonFlowNode {
  return {
    id,
    type: 'jsonflow',
    position: { x, y },
    data: createNodeData(nodeType, label)
  };
}

function createInitialGraph() {
  const nodes: JsonFlowNode[] = [
    createNode('node-1', 'input', 60, 160, 'Input Data'),
    createNode('node-2', 'filter', 340, 160, 'Filter Active'),
    createNode('node-3', 'map', 620, 160, 'Map Fields'),
    createNode('node-4', 'output', 900, 160, 'Output Preview')
  ];

  const edges: JsonFlowEdge[] = [
    { id: 'edge-1', source: 'node-1', target: 'node-2' },
    { id: 'edge-2', source: 'node-2', target: 'node-3' },
    { id: 'edge-3', source: 'node-3', target: 'node-4' }
  ].map((edge) => ({ ...edge, ...edgeVisual }));

  const filterNode = nodes.find((node) => node.id === 'node-2');
  if (filterNode && filterNode.data.nodeType === 'filter') {
    filterNode.data.config.fieldPath = 'active';
    filterNode.data.config.operator = 'eq';
    filterNode.data.config.compareValue = 'true';
    filterNode.data.config.valueType = 'boolean';
  }

  const mapNode = nodes.find((node) => node.id === 'node-3');
  if (mapNode && mapNode.data.nodeType === 'map') {
    mapNode.data.config.rules = [
      { id: 'rule-1', targetKey: 'id', sourcePath: 'id' },
      { id: 'rule-2', targetKey: 'name', sourcePath: 'name' },
      { id: 'rule-3', targetKey: 'city', sourcePath: 'city' }
    ];
  }

  return {
    nodes,
    edges
  };
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toFiniteNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function sanitizeMapRules(rawRules: unknown): MapRule[] {
  if (!Array.isArray(rawRules)) {
    return [];
  }

  return rawRules
    .map((rule, index) => {
      if (!isRecord(rule)) {
        return null;
      }

      const targetKey = typeof rule.targetKey === 'string' ? rule.targetKey : '';
      const sourcePath = typeof rule.sourcePath === 'string' ? rule.sourcePath : '';
      const id = typeof rule.id === 'string' ? rule.id : `rule-${Date.now()}-${index + 1}`;

      return {
        id,
        targetKey,
        sourcePath
      };
    })
    .filter((rule): rule is MapRule => rule !== null);
}

function sanitizeNodeData(rawData: unknown): JsonFlowNodeData | null {
  if (!isRecord(rawData)) {
    return null;
  }

  const nodeType = rawData.nodeType;
  if (!isJsonFlowNodeType(nodeType)) {
    return null;
  }

  const config = isRecord(rawData.config) ? rawData.config : {};
  const label = typeof rawData.label === 'string' && rawData.label.trim() ? rawData.label : nodeMeta[nodeType].label;

  switch (nodeType) {
    case 'input':
      return {
        nodeType,
        label,
        config: {
          jsonText: typeof config.jsonText === 'string' ? config.jsonText : SAMPLE_INPUT_JSON
        }
      };

    case 'pick':
      return {
        nodeType,
        label,
        config: {
          fields: Array.isArray(config.fields) ? config.fields.filter((item): item is string => typeof item === 'string').map((field) => field.trim()).filter(Boolean) : []
        }
      };

    case 'filter':
      return {
        nodeType,
        label,
        config: {
          fieldPath: typeof config.fieldPath === 'string' ? config.fieldPath : '',
          operator: filterOperators.some((item) => item.value === config.operator) ? (config.operator as FilterOperator) : 'eq',
          compareValue: typeof config.compareValue === 'string' ? config.compareValue : '',
          valueType: filterValueTypes.some((item) => item.value === config.valueType) ? (config.valueType as FilterValueType) : 'auto'
        }
      };

    case 'map':
      return {
        nodeType,
        label,
        config: {
          rules: sanitizeMapRules(config.rules)
        }
      };

    case 'merge':
      return {
        nodeType,
        label,
        config: {
          mode: mergeModes.some((item) => item.value === config.mode) ? (config.mode as MergeMode) : 'auto'
        }
      };

    case 'output':
      return {
        nodeType,
        label,
        config: {
          pretty: typeof config.pretty === 'boolean' ? config.pretty : true
        }
      };

    default:
      return null;
  }
}

function parseWorkflowPayload(raw: string): { nodes: JsonFlowNode[]; edges: JsonFlowEdge[] } {
  const parsed = JSON.parse(raw) as unknown;
  if (!isRecord(parsed)) {
    throw new Error('导入内容不是对象。');
  }

  if (parsed.version !== JSON_FLOW_VERSION) {
    throw new Error(`仅支持 version=${JSON_FLOW_VERSION} 的工作流文件。`);
  }

  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
    throw new Error('导入文件缺少 nodes / edges 数组。');
  }

  const nodes: JsonFlowNode[] = parsed.nodes
    .map((rawNode, index) => {
      if (!isRecord(rawNode) || typeof rawNode.id !== 'string') {
        return null;
      }

      const data = sanitizeNodeData(rawNode.data);
      if (!data) {
        return null;
      }

      return {
        id: rawNode.id,
        type: 'jsonflow',
        position: {
          x: toFiniteNumber(isRecord(rawNode.position) ? rawNode.position.x : undefined, 60 + index * 40),
          y: toFiniteNumber(isRecord(rawNode.position) ? rawNode.position.y : undefined, 120 + index * 40)
        },
        data
      };
    })
    .filter((node): node is JsonFlowNode => node !== null);

  if (!nodes.length) {
    throw new Error('导入文件中没有可用节点。');
  }

  const nodeIds = new Set(nodes.map((node) => node.id));

  const edges: JsonFlowEdge[] = parsed.edges
    .map((rawEdge, index) => {
      if (!isRecord(rawEdge) || typeof rawEdge.source !== 'string' || typeof rawEdge.target !== 'string') {
        return null;
      }

      if (!nodeIds.has(rawEdge.source) || !nodeIds.has(rawEdge.target)) {
        return null;
      }

      const edge: JsonFlowEdge = {
        id: typeof rawEdge.id === 'string' ? rawEdge.id : `edge-${index + 1}`,
        source: rawEdge.source,
        target: rawEdge.target,
        ...edgeVisual
      };
      return edge;
    })
    .filter((edge) => edge !== null);

  return {
    nodes,
    edges
  };
}

function getMaxIdValue(items: string[], prefix: string) {
  return items.reduce((maxValue, value) => {
    const match = value.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (!match) {
      return maxValue;
    }

    const num = Number(match[1]);
    return Number.isFinite(num) ? Math.max(maxValue, num) : maxValue;
  }, 0);
}

interface JsonFlowNodeCardProps extends NodeProps<JsonFlowNode> {
  runStatus: NodeExecutionStatus;
  hasIssue: boolean;
}

function JsonFlowNodeCard({ data, selected, runStatus, hasIssue }: JsonFlowNodeCardProps) {
  const meta = nodeMeta[data.nodeType];
  const allowInput = data.nodeType !== 'input';
  const allowOutput = data.nodeType !== 'output';

  return (
    <article
      className={`${styles.flowNode} ${selected ? styles.flowNodeSelected : ''} ${hasIssue ? styles.flowNodeIssue : ''}`}
      style={{ borderColor: meta.tone }}
    >
      {allowInput ? <Handle className={styles.handleIn} position={Position.Left} type="target" /> : null}

      <header className={styles.flowNodeHeader}>
        <strong>{data.label}</strong>
        <span>{meta.label}</span>
      </header>

      <p className={styles.flowNodeDescription}>{meta.description}</p>

      <footer className={styles.flowNodeFooter}>
        <span className={styles.statusLabel}>状态: {runStatus}</span>
      </footer>

      {allowOutput ? <Handle className={styles.handleOut} position={Position.Right} type="source" /> : null}
    </article>
  );
}

export default function ReactFlowJsonFlowPage() {
  const initialGraph = useMemo(() => createInitialGraph(), []);
  const [nodes, setNodes, onNodesChange] = useNodesState<JsonFlowNode>(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<JsonFlowEdge>(initialGraph.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-4');
  const [connectMode, setConnectMode] = useState(false);
  const [autoConnectToSelected, setAutoConnectToSelected] = useState(true);

  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [notice, setNotice] = useState<string>('');
  const [hydrated, setHydrated] = useState(false);

  const importInputRef = useRef<HTMLInputElement | null>(null);
  const nodeIdRef = useRef(100);
  const edgeIdRef = useRef(1000);

  useEffect(() => {
    const maxNodeId = getMaxIdValue(initialGraph.nodes.map((node) => node.id), 'node');
    const maxEdgeId = getMaxIdValue(initialGraph.edges.map((edge) => edge.id), 'edge');
    nodeIdRef.current = Math.max(nodeIdRef.current, maxNodeId + 1);
    edgeIdRef.current = Math.max(edgeIdRef.current, maxEdgeId + 1);
  }, [initialGraph.edges, initialGraph.nodes]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setHydrated(true);
      return;
    }

    try {
      const parsed = parseWorkflowPayload(raw);
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
      setSelectedNodeId(parsed.nodes[0]?.id ?? null);

      const maxNodeId = getMaxIdValue(parsed.nodes.map((node) => node.id), 'node');
      const maxEdgeId = getMaxIdValue(parsed.edges.map((edge) => edge.id), 'edge');
      nodeIdRef.current = Math.max(nodeIdRef.current, maxNodeId + 1);
      edgeIdRef.current = Math.max(edgeIdRef.current, maxEdgeId + 1);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, [setEdges, setNodes]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const timer = window.setTimeout(() => {
      const payload: JsonFlowExportSchema = {
        version: JSON_FLOW_VERSION,
        meta: {
          name: 'reactflow-json-flow',
          exportedAt: new Date().toISOString()
        },
        nodes,
        edges
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }, 320);

    return () => {
      window.clearTimeout(timer);
    };
  }, [edges, hydrated, nodes]);

  const issueNodeIds = useMemo(() => {
    return new Set(validationIssues.filter((issue) => issue.nodeId).map((issue) => issue.nodeId as string));
  }, [validationIssues]);

  const nodeStatuses = executionResult?.nodeStatuses ?? {};

  const nodeTypes = useMemo(
    () => ({
      jsonflow: (props: NodeProps<JsonFlowNode>) => (
        <JsonFlowNodeCard
          {...props}
          hasIssue={issueNodeIds.has(props.id)}
          runStatus={nodeStatuses[props.id] ?? 'idle'}
        />
      )
    }),
    [issueNodeIds, nodeStatuses]
  );

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);

  const graphStats = useMemo(() => {
    const kindCounts: Record<JsonFlowNodeType, number> = {
      input: 0,
      pick: 0,
      filter: 0,
      map: 0,
      merge: 0,
      output: 0
    };

    nodes.forEach((node) => {
      kindCounts[node.data.nodeType] += 1;
    });

    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      kindCounts
    };
  }, [edges.length, nodes]);

  const primaryOutput = useMemo(() => {
    if (!executionResult?.primaryOutputNodeId) {
      return undefined;
    }

    return executionResult.outputByOutputNode[executionResult.primaryOutputNodeId];
  }, [executionResult]);

  const primaryOutputPretty = useMemo(() => {
    if (!executionResult?.primaryOutputNodeId) {
      return true;
    }

    const outputNode = nodes.find((node) => node.id === executionResult.primaryOutputNodeId);
    if (!outputNode || outputNode.data.nodeType !== 'output') {
      return true;
    }

    return outputNode.data.config.pretty;
  }, [executionResult?.primaryOutputNodeId, nodes]);

  const outputPreviewText = useMemo(() => {
    if (primaryOutput === undefined) {
      return '';
    }

    return JSON.stringify(primaryOutput, null, primaryOutputPretty ? 2 : 0);
  }, [primaryOutput, primaryOutputPretty]);

  const selectedMergeMode = selectedNode?.data.nodeType === 'merge' ? selectedNode.data.config.mode : 'auto';

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            id: `edge-${edgeIdRef.current++}`,
            ...edgeVisual
          },
          currentEdges
        )
      );
    },
    [setEdges]
  );

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    const nextSelected = params.nodes[0];
    setSelectedNodeId(nextSelected ? nextSelected.id : null);
  }, []);

  const updateSelectedNodeData = useCallback(
    (updater: (data: JsonFlowNodeData) => JsonFlowNodeData) => {
      if (!selectedNodeId) {
        return;
      }

      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id !== selectedNodeId) {
            return node;
          }

          return {
            ...node,
            data: updater(node.data)
          };
        })
      );
    },
    [selectedNodeId, setNodes]
  );

  const appendNode = useCallback(
    (nodeType: JsonFlowNodeType) => {
      const id = `node-${nodeIdRef.current++}`;
      const sourceNode = autoConnectToSelected && selectedNodeId ? nodes.find((node) => node.id === selectedNodeId) : undefined;

      const position = sourceNode
        ? {
            x: sourceNode.position.x + 260,
            y: sourceNode.position.y + 80
          }
        : {
            x: 120 + (nodes.length % 3) * 260,
            y: 90 + (nodes.length % 4) * 140
          };

      const nextNode = createNode(id, nodeType, position.x, position.y, `${nodeMeta[nodeType].label}-${nodeIdRef.current}`);

      setNodes((currentNodes) => [...currentNodes, nextNode]);
      setSelectedNodeId(id);

      if (sourceNode) {
        setEdges((currentEdges) => [
          ...currentEdges,
          {
            id: `edge-${edgeIdRef.current++}`,
            source: sourceNode.id,
            target: id,
            ...edgeVisual
          }
        ]);
      }
    },
    [autoConnectToSelected, nodes, selectedNodeId, setEdges, setNodes]
  );

  const removeSelectedNode = useCallback(() => {
    if (!selectedNodeId) {
      return;
    }

    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== selectedNodeId));
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setEdges, setNodes]);

  const resetGraph = useCallback(() => {
    const next = createInitialGraph();
    setNodes(next.nodes);
    setEdges(next.edges);
    setSelectedNodeId('node-4');
    setValidationIssues([]);
    setExecutionResult(null);
    setNotice('已恢复默认工作流。');

    const maxNodeId = getMaxIdValue(next.nodes.map((node) => node.id), 'node');
    const maxEdgeId = getMaxIdValue(next.edges.map((edge) => edge.id), 'edge');
    nodeIdRef.current = maxNodeId + 1;
    edgeIdRef.current = maxEdgeId + 1;
  }, [setEdges, setNodes]);

  const autoArrange = useCallback(() => {
    const laneX: Record<JsonFlowNodeType, number> = {
      input: 40,
      pick: 300,
      filter: 560,
      map: 820,
      merge: 1080,
      output: 1340
    };

    const laneYCount: Record<JsonFlowNodeType, number> = {
      input: 0,
      pick: 0,
      filter: 0,
      map: 0,
      merge: 0,
      output: 0
    };

    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const nodeType = node.data.nodeType;
        const slot = laneYCount[nodeType];
        laneYCount[nodeType] += 1;

        return {
          ...node,
          position: {
            x: laneX[nodeType],
            y: 80 + slot * 150
          }
        };
      })
    );
  }, [setNodes]);

  const runValidation = useCallback(() => {
    const result = validateGraph(nodes, edges);
    setValidationIssues(result.issues);
    setNotice(result.issues.length ? `校验完成：${result.issues.length} 条提示。` : '校验通过，可执行。');
  }, [edges, nodes]);

  const runExecution = useCallback(() => {
    const result = executeGraph(nodes, edges);
    setExecutionResult(result);
    setValidationIssues(result.issues);

    if (result.ok) {
      setNotice('执行成功，结果已生成。');
    } else if (hasErrorIssues(result.issues)) {
      setNotice('执行被阻止：请先修复校验错误。');
    } else {
      setNotice('执行结束，但存在失败节点。');
    }

    const failedLog = result.logs.find((log) => log.status === 'error');
    if (failedLog) {
      setSelectedNodeId(failedLog.nodeId);
      return;
    }

    const issueNode = result.issues.find((issue) => issue.nodeId);
    if (issueNode?.nodeId) {
      setSelectedNodeId(issueNode.nodeId);
    }
  }, [edges, nodes]);

  const exportWorkflow = useCallback(() => {
    const payload: JsonFlowExportSchema = {
      version: JSON_FLOW_VERSION,
      meta: {
        name: 'reactflow-json-flow',
        exportedAt: new Date().toISOString()
      },
      nodes,
      edges
    };

    downloadJson('json-flow-workflow.json', payload);
    setNotice('工作流已导出。');
  }, [edges, nodes]);

  const importWorkflow = useCallback(async (file: File) => {
    const raw = await file.text();
    const parsed = parseWorkflowPayload(raw);

    setNodes(parsed.nodes);
    setEdges(parsed.edges);
    setSelectedNodeId(parsed.nodes[0]?.id ?? null);
    setValidationIssues([]);
    setExecutionResult(null);
    setNotice(`导入成功：${parsed.nodes.length} 个节点，${parsed.edges.length} 条连线。`);

    const maxNodeId = getMaxIdValue(parsed.nodes.map((node) => node.id), 'node');
    const maxEdgeId = getMaxIdValue(parsed.edges.map((edge) => edge.id), 'edge');
    nodeIdRef.current = Math.max(nodeIdRef.current, maxNodeId + 1);
    edgeIdRef.current = Math.max(edgeIdRef.current, maxEdgeId + 1);
  }, [setEdges, setNodes]);

  const exportResult = useCallback(() => {
    if (primaryOutput === undefined) {
      setNotice('当前没有可导出的输出结果。');
      return;
    }

    downloadJson('result.json', primaryOutput);
    setNotice('执行结果 result.json 已下载。');
  }, [primaryOutput]);

  const onImportFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';

      if (!file) {
        return;
      }

      try {
        await importWorkflow(file);
      } catch (error) {
        setNotice(`导入失败：${(error as Error).message}`);
      }
    },
    [importWorkflow]
  );

  const issueSummary = useMemo(() => {
    const errors = validationIssues.filter((issue) => issue.level === 'error').length;
    const warnings = validationIssues.filter((issue) => issue.level === 'warning').length;
    return {
      errors,
      warnings
    };
  }, [validationIssues]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h2>React Flow JSON Data Workflow</h2>
        <p>以本地 JSON 数据为输入，进行 Pick / Filter / Map / Merge 编排，支持校验、执行、导入导出与自动持久化。</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.controlSlot}>
            <SectionCard title="控制区" note="用意：校验、执行与流程管理。">
              <div className={`${styles.buttonGroup} ${styles.controlButtonGroup}`}>
                <button className={`${styles.button} ${styles.controlButton}`} onClick={runValidation} type="button">
                  校验流程
                </button>
                <button className={`${styles.buttonPrimary} ${styles.controlButton}`} onClick={runExecution} type="button">
                  执行流程
                </button>
                <button className={`${styles.buttonGhost} ${styles.controlButton}`} onClick={autoArrange} type="button">
                  自动排布
                </button>
                <button
                  className={`${styles.buttonGhost} ${styles.controlButton}`}
                  onClick={() => setConnectMode((prev) => !prev)}
                  type="button"
                >
                  {connectMode ? '连线模式：开启' : '连线模式：关闭'}
                </button>
                <button className={`${styles.buttonGhost} ${styles.controlButton}`} onClick={resetGraph} type="button">
                  重置图
                </button>
                <button
                  className={`${styles.buttonDanger} ${styles.controlButton}`}
                  disabled={!selectedNodeId}
                  onClick={removeSelectedNode}
                  type="button"
                >
                  删除选中节点
                </button>
              </div>

              <label className={styles.checkboxRow}>
                <input
                  checked={autoConnectToSelected}
                  onChange={(event) => setAutoConnectToSelected(event.target.checked)}
                  type="checkbox"
                />
                <span>新增节点后自动连接到当前选中节点</span>
              </label>

              <div className={styles.metaPanel}>
                <p>Errors: {issueSummary.errors}</p>
                <p>Warnings: {issueSummary.warnings}</p>
                <p>节点: {graphStats.nodeCount}</p>
                <p>连线: {graphStats.edgeCount}</p>
              </div>

              {notice ? <p className={styles.notice}>{notice}</p> : null}
            </SectionCard>
          </div>

          <SectionCard title="模板节点" note="用意：快速拼装可执行 JSON 流程。">
            <div className={styles.templateList}>
              {(Object.keys(nodeMeta) as JsonFlowNodeType[]).map((nodeType) => (
                <button className={styles.templateButton} key={nodeType} onClick={() => appendNode(nodeType)} type="button">
                  <strong>{nodeMeta[nodeType].label}</strong>
                  <span>{nodeMeta[nodeType].description}</span>
                </button>
              ))}
            </div>

            <div className={styles.distribution}>
              {(Object.keys(graphStats.kindCounts) as JsonFlowNodeType[]).map((nodeType) => (
                <p key={nodeType}>
                  {nodeMeta[nodeType].label}: {graphStats.kindCounts[nodeType]}
                </p>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="导入/导出" note="用意：流程可复现与跨环境分享。">
            <div className={styles.buttonGroup}>
              <button className={styles.buttonGhost} onClick={exportWorkflow} type="button">
                导出工作流 JSON
              </button>
              <button className={styles.buttonGhost} onClick={() => importInputRef.current?.click()} type="button">
                导入工作流 JSON
              </button>
              <button className={styles.buttonGhost} onClick={exportResult} type="button">
                下载 result.json
              </button>
              <button
                className={styles.buttonDanger}
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setNotice('已清空本地缓存，刷新后将使用默认流程。');
                }}
                type="button"
              >
                清空本地缓存
              </button>
            </div>

            <p className={styles.storageKey}>storage key: {STORAGE_KEY}</p>
            <input
              accept="application/json"
              className={styles.hiddenInput}
              onChange={onImportFileChange}
              ref={importInputRef}
              type="file"
            />
          </SectionCard>

          <div className={styles.inspectorSlot}>
            <SectionCard title="Inspector" note="用意：按节点类型编辑配置。">
              {selectedNode ? (
                <div className={styles.inspectorBody}>
                <label className={styles.field}>
                  <span>节点名称</span>
                  <input
                    onChange={(event) =>
                      updateSelectedNodeData((data) => ({
                        ...data,
                        label: event.target.value
                      }))
                    }
                    value={selectedNode.data.label}
                  />
                </label>

                <p className={styles.nodeTypeBadge}>节点类型：{nodeMeta[selectedNode.data.nodeType].label}</p>

                {selectedNode.data.nodeType === 'input' ? (
                  <>
                    <label className={styles.field}>
                      <span>JSON 输入</span>
                      <textarea
                        onChange={(event) =>
                          updateSelectedNodeData((data) =>
                            data.nodeType === 'input'
                              ? {
                                  ...data,
                                  config: {
                                    ...data.config,
                                    jsonText: event.target.value
                                  }
                                }
                              : data
                          )
                        }
                        rows={8}
                        value={selectedNode.data.config.jsonText}
                      />
                    </label>
                    <button
                      className={styles.buttonGhost}
                      onClick={() =>
                        updateSelectedNodeData((data) =>
                          data.nodeType === 'input'
                            ? {
                                ...data,
                                config: {
                                  ...data.config,
                                  jsonText: SAMPLE_INPUT_JSON
                                }
                              }
                            : data
                        )
                      }
                      type="button"
                    >
                      使用示例 JSON
                    </button>
                  </>
                ) : null}

                {selectedNode.data.nodeType === 'pick' ? (
                  <label className={styles.field}>
                    <span>字段列表（逗号分隔）</span>
                    <input
                      onChange={(event) =>
                        updateSelectedNodeData((data) =>
                          data.nodeType === 'pick'
                            ? {
                                ...data,
                                config: {
                                  ...data.config,
                                  fields: event.target.value
                                    .split(',')
                                    .map((item) => item.trim())
                                    .filter(Boolean)
                                }
                              }
                            : data
                        )
                      }
                      placeholder="id,name,city"
                      value={selectedNode.data.config.fields.join(', ')}
                    />
                  </label>
                ) : null}

                {selectedNode.data.nodeType === 'filter' ? (
                  <>
                    <label className={styles.field}>
                      <span>fieldPath</span>
                      <input
                        onChange={(event) =>
                          updateSelectedNodeData((data) =>
                            data.nodeType === 'filter'
                              ? {
                                  ...data,
                                  config: {
                                    ...data.config,
                                    fieldPath: event.target.value
                                  }
                                }
                              : data
                          )
                        }
                        placeholder="age / active / profile.score"
                        value={selectedNode.data.config.fieldPath}
                      />
                    </label>

                    <div className={styles.inlineFields}>
                      <label className={styles.field}>
                        <span>operator</span>
                        <select
                          onChange={(event) =>
                            updateSelectedNodeData((data) =>
                              data.nodeType === 'filter'
                                ? {
                                    ...data,
                                    config: {
                                      ...data.config,
                                      operator: event.target.value as FilterOperator
                                    }
                                  }
                                : data
                            )
                          }
                          value={selectedNode.data.config.operator}
                        >
                          {filterOperators.map((operator) => (
                            <option key={operator.value} value={operator.value}>
                              {operator.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className={styles.field}>
                        <span>value type</span>
                        <select
                          onChange={(event) =>
                            updateSelectedNodeData((data) =>
                              data.nodeType === 'filter'
                                ? {
                                    ...data,
                                    config: {
                                      ...data.config,
                                      valueType: event.target.value as FilterValueType
                                    }
                                  }
                                : data
                            )
                          }
                          value={selectedNode.data.config.valueType}
                        >
                          {filterValueTypes.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className={styles.field}>
                      <span>compare value</span>
                      <input
                        onChange={(event) =>
                          updateSelectedNodeData((data) =>
                            data.nodeType === 'filter'
                              ? {
                                  ...data,
                                  config: {
                                    ...data.config,
                                    compareValue: event.target.value
                                  }
                                }
                              : data
                          )
                        }
                        value={selectedNode.data.config.compareValue}
                      />
                    </label>
                  </>
                ) : null}

                {selectedNode.data.nodeType === 'map' ? (
                  <div className={styles.mappingPanel}>
                    <div className={styles.mappingHeader}>
                      <p>映射规则</p>
                      <button
                        className={styles.smallButton}
                        onClick={() =>
                          updateSelectedNodeData((data) =>
                            data.nodeType === 'map'
                              ? {
                                  ...data,
                                  config: {
                                    ...data.config,
                                    rules: data.config.rules.concat({
                                      id: `rule-${Date.now()}`,
                                      targetKey: '',
                                      sourcePath: ''
                                    })
                                  }
                                }
                              : data
                          )
                        }
                        type="button"
                      >
                        + Add Rule
                      </button>
                    </div>

                    {selectedNode.data.config.rules.map((rule) => (
                      <div className={styles.mapRow} key={rule.id}>
                        <input
                          onChange={(event) =>
                            updateSelectedNodeData((data) =>
                              data.nodeType === 'map'
                                ? {
                                    ...data,
                                    config: {
                                      ...data.config,
                                      rules: data.config.rules.map((item) =>
                                        item.id === rule.id ? { ...item, targetKey: event.target.value } : item
                                      )
                                    }
                                  }
                                : data
                            )
                          }
                          placeholder="targetKey"
                          value={rule.targetKey}
                        />
                        <input
                          onChange={(event) =>
                            updateSelectedNodeData((data) =>
                              data.nodeType === 'map'
                                ? {
                                    ...data,
                                    config: {
                                      ...data.config,
                                      rules: data.config.rules.map((item) =>
                                        item.id === rule.id ? { ...item, sourcePath: event.target.value } : item
                                      )
                                    }
                                  }
                                : data
                            )
                          }
                          placeholder="sourcePath"
                          value={rule.sourcePath}
                        />
                        <button
                          className={styles.mapDelete}
                          onClick={() =>
                            updateSelectedNodeData((data) =>
                              data.nodeType === 'map'
                                ? {
                                    ...data,
                                    config: {
                                      ...data.config,
                                      rules: data.config.rules.filter((item) => item.id !== rule.id)
                                    }
                                  }
                                : data
                            )
                          }
                          type="button"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                {selectedNode.data.nodeType === 'merge' ? (
                  <label className={styles.field}>
                    <span>合并模式</span>
                    <select
                      onChange={(event) =>
                        updateSelectedNodeData((data) =>
                          data.nodeType === 'merge'
                            ? {
                                ...data,
                                config: {
                                  ...data.config,
                                  mode: event.target.value as MergeMode
                                }
                              }
                            : data
                        )
                      }
                      value={selectedMergeMode}
                    >
                      {mergeModes.map((mode) => (
                        <option key={mode.value} value={mode.value}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                    <small className={styles.fieldHint}>
                      {mergeModes.find((item) => item.value === selectedMergeMode)?.note}
                    </small>
                  </label>
                ) : null}

                {selectedNode.data.nodeType === 'output' ? (
                  <label className={styles.checkboxRow}>
                    <input
                      checked={selectedNode.data.config.pretty}
                      onChange={(event) =>
                        updateSelectedNodeData((data) =>
                          data.nodeType === 'output'
                            ? {
                                ...data,
                                config: {
                                  ...data.config,
                                  pretty: event.target.checked
                                }
                              }
                            : data
                        )
                      }
                      type="checkbox"
                    />
                    <span>结果预览使用格式化 JSON</span>
                  </label>
                ) : null}
                </div>
              ) : (
                <p className={styles.emptyState}>请选择一个节点后编辑。</p>
              )}
            </SectionCard>
          </div>
        </aside>

        <section className={styles.mainSection}>
          <SectionCard title="画布区" note="用意：节点编排、连线与拓扑结构调整。">
            <div className={styles.canvasShell}>
              <ReactFlow<JsonFlowNode, JsonFlowEdge>
                connectOnClick={connectMode}
                defaultEdgeOptions={edgeVisual}
                edges={edges}
                fitView
                nodes={nodes}
                nodeTypes={nodeTypes}
                onConnect={onConnect}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                onSelectionChange={onSelectionChange}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="#cbd5e1" gap={26} size={1} />
                <MiniMap nodeColor={(node) => nodeMeta[(node.data as JsonFlowNodeData).nodeType].tone} pannable zoomable />
                <Controls showInteractive={false} />
                <Panel className={styles.panelInfo} position="top-right">
                  <span>{graphStats.nodeCount} nodes</span>
                  <span>{graphStats.edgeCount} edges</span>
                </Panel>
              </ReactFlow>
            </div>
          </SectionCard>

          <SectionCard title="结果与日志" note="用意：查看执行结果并定位失败节点。">
            <div className={styles.resultGrid}>
              <div className={`${styles.resultBlock} ${styles.outputBlock}`}>
                <div className={styles.outputHeader}>
                  <h4>Primary Output</h4>
                  <span>核心结果</span>
                </div>
                <p className={styles.outputHint}>这是当前流程的主输出，可直接下载为 `result.json`。</p>
                {primaryOutput !== undefined ? (
                  <pre className={styles.outputPre}>{outputPreviewText}</pre>
                ) : (
                  <p className={styles.emptyState}>尚未产生输出，先执行流程。</p>
                )}
              </div>

              <div className={styles.resultBlock}>
                <h4>Execution Logs</h4>
                {executionResult?.logs.length ? (
                  <ul className={styles.logList}>
                    {executionResult.logs.map((log, index) => (
                      <li key={`${log.nodeId}-${index}`}>
                        <button className={styles.logItem} onClick={() => setSelectedNodeId(log.nodeId)} type="button">
                          <strong>{log.nodeLabel}</strong>
                          <span>{log.status}</span>
                          <em>{log.message}</em>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyState}>执行后会显示逐节点日志。</p>
                )}
              </div>
            </div>

            {validationIssues.length ? (
              <div className={styles.issuePanel}>
                <h4>Validation Issues</h4>
                <ul>
                  {validationIssues.map((issue, index) => (
                    <li key={`${issue.message}-${index}`}>
                      <button
                        className={styles.issueItem}
                        onClick={() => {
                          if (issue.nodeId) {
                            setSelectedNodeId(issue.nodeId);
                          }
                        }}
                        type="button"
                      >
                        <span>[{issue.level}]</span> {issue.message}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </SectionCard>
        </section>
      </div>
    </div>
  );
}

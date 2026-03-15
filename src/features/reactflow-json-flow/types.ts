import type { Edge, Node } from '@xyflow/react';

export const JSON_FLOW_VERSION = 1 as const;

export type JsonFlowNodeType = 'input' | 'pick' | 'filter' | 'map' | 'merge' | 'output';

export interface InputNodeConfig {
  jsonText: string;
}

export interface PickNodeConfig {
  fields: string[];
}

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';
export type FilterValueType = 'auto' | 'string' | 'number' | 'boolean';

export interface FilterNodeConfig {
  fieldPath: string;
  operator: FilterOperator;
  compareValue: string;
  valueType: FilterValueType;
}

export interface MapRule {
  id: string;
  targetKey: string;
  sourcePath: string;
}

export interface MapNodeConfig {
  rules: MapRule[];
}

export type MergeMode = 'auto' | 'array-concat' | 'object-merge';

export interface MergeNodeConfig {
  mode: MergeMode;
}

export interface OutputNodeConfig {
  pretty: boolean;
}

export interface JsonFlowConfigByType {
  input: InputNodeConfig;
  pick: PickNodeConfig;
  filter: FilterNodeConfig;
  map: MapNodeConfig;
  merge: MergeNodeConfig;
  output: OutputNodeConfig;
}

export type JsonFlowNodeData =
  | {
      label: string;
      nodeType: 'input';
      config: InputNodeConfig;
    }
  | {
      label: string;
      nodeType: 'pick';
      config: PickNodeConfig;
    }
  | {
      label: string;
      nodeType: 'filter';
      config: FilterNodeConfig;
    }
  | {
      label: string;
      nodeType: 'map';
      config: MapNodeConfig;
    }
  | {
      label: string;
      nodeType: 'merge';
      config: MergeNodeConfig;
    }
  | {
      label: string;
      nodeType: 'output';
      config: OutputNodeConfig;
    };

export type JsonFlowNode = Node<JsonFlowNodeData, 'jsonflow'>;
export type JsonFlowEdge = Edge;

export type ValidationIssueLevel = 'error' | 'warning';

export interface ValidationIssue {
  nodeId?: string;
  level: ValidationIssueLevel;
  message: string;
}

export interface CompiledGraph {
  nodeMap: Map<string, JsonFlowNode>;
  incomingByNode: Map<string, string[]>;
  outgoingByNode: Map<string, string[]>;
  outputNodeIds: string[];
  topoOrder: string[];
}

export type NodeExecutionStatus = 'idle' | 'running' | 'success' | 'error' | 'skipped';

export interface ExecutionContext {
  outputsByNode: Record<string, unknown>;
}

export interface ExecutionLogEntry {
  nodeId: string;
  nodeLabel: string;
  status: NodeExecutionStatus;
  message: string;
  timestamp: string;
}

export interface ExecutionResult {
  ok: boolean;
  issues: ValidationIssue[];
  nodeStatuses: Record<string, NodeExecutionStatus>;
  logs: ExecutionLogEntry[];
  outputsByNode: Record<string, unknown>;
  outputByOutputNode: Record<string, unknown>;
  primaryOutputNodeId?: string;
  compiled?: CompiledGraph;
}

export interface JsonFlowExportSchema {
  version: typeof JSON_FLOW_VERSION;
  meta?: {
    name?: string;
    exportedAt?: string;
  };
  nodes: JsonFlowNode[];
  edges: JsonFlowEdge[];
}

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
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  type OnSelectionChangeParams,
  ReactFlow,
  useEdgesState,
  useNodesState
} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SectionCard } from '../../common/ui/SectionCard';
import styles from './ReactFlowDemoPage.module.css';

type NodeKind = 'input' | 'model' | 'control' | 'sampler' | 'utility' | 'output';
type ParamType = 'text' | 'number' | 'boolean';

interface WorkflowParam {
  id: string;
  key: string;
  label: string;
  type: ParamType;
  value: string | number | boolean;
}

interface WorkflowNodeData {
  [key: string]: unknown;
  label: string;
  description: string;
  meta: string;
  kind: NodeKind;
  inputs: number;
  outputs: number;
  params: WorkflowParam[];
}

type WorkflowNode = Node<WorkflowNodeData, 'workflow'>;
type WorkflowEdge = Edge;

interface NodeTemplate {
  label: string;
  description: string;
  meta: string;
  kind: NodeKind;
  inputs: number;
  outputs: number;
  params: WorkflowParam[];
}

const edgeVisual = {
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { stroke: '#22d3ee', strokeWidth: 2 }
} as const;

const kindMeta: Record<
  NodeKind,
  {
    label: string;
    defaultDescription: string;
    defaultMeta: string;
    defaultInputs: number;
    defaultOutputs: number;
    defaultParams: WorkflowParam[];
  }
> = {
  input: {
    label: '输入节点',
    defaultDescription: '负责注入文本、图像或条件数据。',
    defaultMeta: 'source',
    defaultInputs: 0,
    defaultOutputs: 1,
    defaultParams: [
      { id: 'p_text', key: 'text', label: '文本', type: 'text', value: '' },
      { id: 'p_weight', key: 'weight', label: '权重', type: 'number', value: 1 }
    ]
  },
  model: {
    label: '模型节点',
    defaultDescription: '加载主模型、LoRA 或 VAE。',
    defaultMeta: 'model-loader',
    defaultInputs: 1,
    defaultOutputs: 1,
    defaultParams: [
      { id: 'p_model', key: 'model', label: '模型名', type: 'text', value: 'sdxl_base_1.0.safetensors' },
      { id: 'p_lora', key: 'lora_strength', label: 'LoRA 强度', type: 'number', value: 0.8 }
    ]
  },
  control: {
    label: '控制节点',
    defaultDescription: '提供姿态、深度、参考图等条件控制。',
    defaultMeta: 'control',
    defaultInputs: 1,
    defaultOutputs: 1,
    defaultParams: [
      { id: 'p_control_type', key: 'control_type', label: '控制类型', type: 'text', value: 'pose' },
      { id: 'p_strength', key: 'strength', label: '强度', type: 'number', value: 0.75 }
    ]
  },
  sampler: {
    label: '采样节点',
    defaultDescription: '执行扩散采样并生成潜空间。',
    defaultMeta: 'ksampler',
    defaultInputs: 3,
    defaultOutputs: 1,
    defaultParams: [
      { id: 'p_steps', key: 'steps', label: '步数', type: 'number', value: 30 },
      { id: 'p_cfg', key: 'cfg', label: 'CFG', type: 'number', value: 6.5 },
      { id: 'p_scheduler', key: 'scheduler', label: '调度器', type: 'text', value: 'karras' }
    ]
  },
  utility: {
    label: '工具节点',
    defaultDescription: '执行预处理、开关路由、种子管理等。',
    defaultMeta: 'utility',
    defaultInputs: 1,
    defaultOutputs: 1,
    defaultParams: [
      { id: 'p_seed', key: 'seed', label: '种子', type: 'number', value: 924117 },
      { id: 'p_enable', key: 'enabled', label: '启用', type: 'boolean', value: true }
    ]
  },
  output: {
    label: '输出节点',
    defaultDescription: '负责预览、放大、保存等结果输出。',
    defaultMeta: 'output',
    defaultInputs: 1,
    defaultOutputs: 0,
    defaultParams: [
      { id: 'p_format', key: 'format', label: '格式', type: 'text', value: 'PNG' },
      { id: 'p_quality', key: 'quality', label: '质量', type: 'number', value: 95 }
    ]
  }
};

function cloneParams(params: WorkflowParam[]) {
  return params.map((param) => ({ ...param }));
}

function normalizePortCount(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function createNodeData(kind: NodeKind, overrides?: Partial<WorkflowNodeData>): WorkflowNodeData {
  const meta = kindMeta[kind];
  return {
    label: overrides?.label ?? `${meta.label}`,
    description: overrides?.description ?? meta.defaultDescription,
    meta: overrides?.meta ?? meta.defaultMeta,
    kind,
    inputs: normalizePortCount(overrides?.inputs ?? meta.defaultInputs),
    outputs: normalizePortCount(overrides?.outputs ?? meta.defaultOutputs),
    params: overrides?.params ? cloneParams(overrides.params) : cloneParams(meta.defaultParams)
  };
}

function createNode(id: string, data: WorkflowNodeData, x: number, y: number): WorkflowNode {
  return {
    id,
    type: 'workflow',
    position: { x, y },
    data
  };
}

function getKindClass(kind: NodeKind) {
  switch (kind) {
    case 'input':
      return styles.kindInput;
    case 'model':
      return styles.kindModel;
    case 'control':
      return styles.kindControl;
    case 'sampler':
      return styles.kindSampler;
    case 'utility':
      return styles.kindUtility;
    case 'output':
      return styles.kindOutput;
    default:
      return '';
  }
}

function miniMapNodeColor(node: Node) {
  const kind = (node.data as WorkflowNodeData).kind;
  switch (kind) {
    case 'input':
      return '#06b6d4';
    case 'model':
      return '#3b82f6';
    case 'control':
      return '#8b5cf6';
    case 'sampler':
      return '#16a34a';
    case 'utility':
      return '#64748b';
    case 'output':
      return '#f97316';
    default:
      return '#0f172a';
  }
}

function formatParamValue(value: WorkflowParam['value']) {
  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }
  return String(value);
}

function WorkflowNodeCard({ data, selected }: NodeProps<WorkflowNode>) {
  const previewParams = data.params.slice(0, 2);

  return (
    <article className={`${styles.workflowNode} ${getKindClass(data.kind)} ${selected ? styles.nodeSelected : ''}`}>
      {data.inputs > 0 ? <Handle className={`${styles.handle} ${styles.handleIn}`} position={Position.Left} type="target" /> : null}

      <header className={styles.nodeHeader}>
        <strong>{data.label}</strong>
        <span>{kindMeta[data.kind].label}</span>
      </header>

      <div className={styles.nodeBody}>
        <p>{data.description}</p>
        <small>{data.meta}</small>

        {previewParams.length ? (
          <ul className={styles.paramPreview}>
            {previewParams.map((param) => (
              <li key={param.id}>
                <span>{param.label}</span>
                <em>{formatParamValue(param.value)}</em>
              </li>
            ))}
            {data.params.length > previewParams.length ? (
              <li className={styles.paramMore}>+{data.params.length - previewParams.length} 参数</li>
            ) : null}
          </ul>
        ) : null}
      </div>

      <footer className={styles.nodePorts}>
        <span>输入 {data.inputs}</span>
        <span>输出 {data.outputs}</span>
      </footer>

      {data.outputs > 0 ? <Handle className={`${styles.handle} ${styles.handleOut}`} position={Position.Right} type="source" /> : null}
    </article>
  );
}

const nodeTypes = {
  workflow: WorkflowNodeCard
};

const initialNodes: WorkflowNode[] = [
  createNode(
    'node-1',
    createNodeData('input', {
      label: '正向提示词',
      description: '输入画面主体与风格关键词。',
      meta: 'prompt',
      params: [
        { id: 'p_text', key: 'text', label: '提示词', type: 'text', value: '赛博城市，电影感，体积光' },
        { id: 'p_weight', key: 'weight', label: '权重', type: 'number', value: 1.1 }
      ]
    }),
    50,
    100
  ),
  createNode(
    'node-2',
    createNodeData('input', {
      label: '反向提示词',
      description: '抑制低质量或不期望元素。',
      meta: 'negative',
      params: [
        { id: 'n_text', key: 'text', label: '反向词', type: 'text', value: '模糊, 低分辨率, 变形手指' },
        { id: 'n_weight', key: 'weight', label: '权重', type: 'number', value: 1 }
      ]
    }),
    50,
    280
  ),
  createNode(
    'node-3',
    createNodeData('model', {
      label: '底模加载器',
      description: '加载 SDXL 基础模型。',
      meta: 'model',
      inputs: 0,
      outputs: 2,
      params: [
        { id: 'm_name', key: 'model_name', label: '模型', type: 'text', value: 'sdxl_base_1.0.safetensors' },
        { id: 'm_clip_skip', key: 'clip_skip', label: 'Clip Skip', type: 'number', value: 2 }
      ]
    }),
    340,
    85
  ),
  createNode(
    'node-4',
    createNodeData('model', {
      label: 'LoRA 叠加',
      description: '追加风格 LoRA 与角色 LoRA。',
      meta: 'lora-stack',
      params: [
        { id: 'l_style', key: 'style_lora', label: '风格 LoRA', type: 'text', value: 'cinematic_v2' },
        { id: 'l_strength', key: 'strength', label: '强度', type: 'number', value: 0.75 }
      ]
    }),
    340,
    260
  ),
  createNode(
    'node-5',
    createNodeData('control', {
      label: '姿态控制',
      description: '以 OpenPose 控制角色动作。',
      meta: 'controlnet-pose',
      params: [
        { id: 'c_type', key: 'control_type', label: '控制类型', type: 'text', value: 'openpose' },
        { id: 'c_strength', key: 'strength', label: '强度', type: 'number', value: 0.82 }
      ]
    }),
    340,
    450
  ),
  createNode(
    'node-6',
    createNodeData('sampler', {
      label: '采样器',
      description: '执行 DPM++ 采样流程。',
      meta: 'ksampler',
      inputs: 4,
      outputs: 1,
      params: [
        { id: 's_steps', key: 'steps', label: '步数', type: 'number', value: 30 },
        { id: 's_cfg', key: 'cfg', label: 'CFG', type: 'number', value: 6.5 },
        { id: 's_scheduler', key: 'scheduler', label: '调度器', type: 'text', value: 'karras' }
      ]
    }),
    650,
    220
  ),
  createNode(
    'node-7',
    createNodeData('utility', {
      label: '随机种子',
      description: '控制随机种子与批次数。',
      meta: 'seed-control',
      inputs: 0,
      outputs: 1,
      params: [
        { id: 'u_seed', key: 'seed', label: '种子', type: 'number', value: 924117 },
        { id: 'u_batch', key: 'batch', label: '批次数', type: 'number', value: 2 }
      ]
    }),
    650,
    415
  ),
  createNode(
    'node-8',
    createNodeData('output', {
      label: 'VAE 解码',
      description: '将潜空间解码为图像。',
      meta: 'vae-decode',
      inputs: 2,
      outputs: 1,
      params: [
        { id: 'o_vae', key: 'vae', label: 'VAE', type: 'text', value: 'vae-ft-mse-840000' },
        { id: 'o_tiling', key: 'tiling', label: '平铺', type: 'boolean', value: false }
      ]
    }),
    950,
    220
  ),
  createNode(
    'node-9',
    createNodeData('output', {
      label: '高清放大',
      description: '对结果图进行 2x 放大增强。',
      meta: 'upscale',
      params: [
        { id: 'up_scale', key: 'scale', label: '倍率', type: 'number', value: 2 },
        { id: 'up_algo', key: 'algo', label: '算法', type: 'text', value: 'ESRGAN' }
      ]
    }),
    1210,
    150
  ),
  createNode(
    'node-10',
    createNodeData('utility', {
      label: '预览节点',
      description: '实时查看中间图像结果。',
      meta: 'preview',
      outputs: 0,
      params: [{ id: 'pv_live', key: 'live', label: '实时刷新', type: 'boolean', value: true }]
    }),
    1210,
    345
  ),
  createNode(
    'node-11',
    createNodeData('output', {
      label: '保存图像',
      description: '输出最终图片文件与元数据。',
      meta: 'save-image',
      outputs: 0,
      params: [
        { id: 'sv_format', key: 'format', label: '格式', type: 'text', value: 'PNG' },
        { id: 'sv_meta', key: 'embed_meta', label: '写入元数据', type: 'boolean', value: true }
      ]
    }),
    1490,
    230
  )
];

const initialEdges: WorkflowEdge[] = [
  { id: 'edge-1', source: 'node-1', target: 'node-6' },
  { id: 'edge-2', source: 'node-2', target: 'node-6' },
  { id: 'edge-3', source: 'node-3', target: 'node-4' },
  { id: 'edge-4', source: 'node-4', target: 'node-6' },
  { id: 'edge-5', source: 'node-5', target: 'node-6' },
  { id: 'edge-6', source: 'node-7', target: 'node-6' },
  { id: 'edge-7', source: 'node-6', target: 'node-8' },
  { id: 'edge-8', source: 'node-8', target: 'node-9' },
  { id: 'edge-9', source: 'node-8', target: 'node-10' },
  { id: 'edge-10', source: 'node-9', target: 'node-11' }
].map((edge) => ({ ...edge, ...edgeVisual }));

const nodeTemplates: NodeTemplate[] = [
  {
    ...createNodeData('control', {
      label: 'IP 参考图控制',
      description: '使用参考图控制风格一致性。',
      meta: 'ip-adapter'
    })
  },
  {
    ...createNodeData('control', {
      label: '深度控制',
      description: '通过深度图约束空间关系。',
      meta: 'depth-control'
    })
  },
  {
    ...createNodeData('output', {
      label: '人脸细化',
      description: '对人脸细节进行二次增强。',
      meta: 'face-detailer'
    })
  },
  {
    ...createNodeData('utility', {
      label: '分支路由',
      description: '切换不同流程分支。',
      meta: 'branch-switch',
      inputs: 2,
      outputs: 2
    })
  },
  {
    ...createNodeData('model', {
      label: '风格模型切换',
      description: '在不同风格模型间切换。',
      meta: 'model-switch'
    })
  }
];

export default function ReactFlowDemoPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-6');
  const [connectMode, setConnectMode] = useState(false);

  const [createKind, setCreateKind] = useState<NodeKind>('control');
  const [createLabel, setCreateLabel] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createMeta, setCreateMeta] = useState('');
  const [createInputs, setCreateInputs] = useState(1);
  const [createOutputs, setCreateOutputs] = useState(1);
  const [createConnectToSelected, setCreateConnectToSelected] = useState(true);

  const nodeIdRef = useRef(300);
  const edgeIdRef = useRef(3000);

  useEffect(() => {
    const preset = kindMeta[createKind];
    setCreateLabel(`${preset.label}-${nodeIdRef.current}`);
    setCreateDescription(preset.defaultDescription);
    setCreateMeta(preset.defaultMeta);
    setCreateInputs(preset.defaultInputs);
    setCreateOutputs(preset.defaultOutputs);
  }, [createKind]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const graphStats = useMemo(() => {
    const kindCount: Record<NodeKind, number> = {
      input: 0,
      model: 0,
      control: 0,
      sampler: 0,
      utility: 0,
      output: 0
    };

    nodes.forEach((node) => {
      kindCount[node.data.kind] += 1;
    });

    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      kindCount
    };
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...params,
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
    const selected = params.nodes[0];
    setSelectedNodeId(selected ? selected.id : null);
  }, []);

  const appendNode = useCallback(
    (data: WorkflowNodeData, sourceNodeId?: string) => {
      const id = `node-${nodeIdRef.current++}`;
      const baseNode = sourceNodeId ? nodes.find((node) => node.id === sourceNodeId) : undefined;

      const position = baseNode
        ? {
            x: Math.min(baseNode.position.x + 280, 1650),
            y: Math.min(baseNode.position.y + 130, 920)
          }
        : {
            x: 120 + (nodes.length % 4) * 260,
            y: 90 + (nodes.length % 5) * 140
          };

      const nextNode = createNode(id, data, position.x, position.y);
      setNodes((current) => current.concat(nextNode));
      setSelectedNodeId(id);

      if (sourceNodeId) {
        setEdges((current) =>
          current.concat({
            id: `edge-${edgeIdRef.current++}`,
            source: sourceNodeId,
            target: id,
            ...edgeVisual
          })
        );
      }
    },
    [nodes, setEdges, setNodes]
  );

  const addTemplateNode = useCallback(
    (template: NodeTemplate) => {
      appendNode(
        createNodeData(template.kind, {
          ...template,
          params: cloneParams(template.params)
        }),
        createConnectToSelected && selectedNodeId ? selectedNodeId : undefined
      );
    },
    [appendNode, createConnectToSelected, selectedNodeId]
  );

  const addCustomNode = useCallback(() => {
    appendNode(
      createNodeData(createKind, {
        label: createLabel.trim() || `${kindMeta[createKind].label}-${nodeIdRef.current}`,
        description: createDescription.trim() || kindMeta[createKind].defaultDescription,
        meta: createMeta.trim() || kindMeta[createKind].defaultMeta,
        inputs: normalizePortCount(createInputs),
        outputs: normalizePortCount(createOutputs)
      }),
      createConnectToSelected && selectedNodeId ? selectedNodeId : undefined
    );
  }, [appendNode, createConnectToSelected, createDescription, createInputs, createKind, createLabel, createMeta, createOutputs, selectedNodeId]);

  const autoArrange = useCallback(() => {
    const laneX: Record<NodeKind, number> = {
      input: 40,
      model: 330,
      control: 640,
      sampler: 940,
      utility: 1230,
      output: 1500
    };

    const laneIndex: Record<NodeKind, number> = {
      input: 0,
      model: 0,
      control: 0,
      sampler: 0,
      utility: 0,
      output: 0
    };

    setNodes((current) =>
      current.map((node) => {
        const slot = laneIndex[node.data.kind];
        laneIndex[node.data.kind] += 1;

        return {
          ...node,
          position: {
            x: laneX[node.data.kind],
            y: 80 + slot * 145
          }
        };
      })
    );
  }, [setNodes]);

  const resetGraph = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNodeId('node-6');
  }, [setEdges, setNodes]);

  const removeSelectedNode = useCallback(() => {
    if (!selectedNodeId) {
      return;
    }

    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== selectedNodeId));
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setEdges, setNodes]);

  const updateSelectedNodeData = useCallback(
    (updater: (data: WorkflowNodeData) => WorkflowNodeData) => {
      if (!selectedNodeId) {
        return;
      }

      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === selectedNodeId
            ? {
                ...node,
                data: updater(node.data)
              }
            : node
        )
      );
    },
    [selectedNodeId, setNodes]
  );

  const changeParam = useCallback(
    (paramId: string, patch: Partial<WorkflowParam>) => {
      updateSelectedNodeData((data) => ({
        ...data,
        params: data.params.map((param) => (param.id === paramId ? { ...param, ...patch } : param))
      }));
    },
    [updateSelectedNodeData]
  );

  const changeParamType = useCallback(
    (paramId: string, nextType: ParamType) => {
      updateSelectedNodeData((data) => ({
        ...data,
        params: data.params.map((param) => {
          if (param.id !== paramId) {
            return param;
          }

          const normalizedValue =
            nextType === 'boolean'
              ? Boolean(param.value)
              : nextType === 'number'
                ? Number(param.value) || 0
                : String(param.value ?? '');

          return {
            ...param,
            type: nextType,
            value: normalizedValue
          };
        })
      }));
    },
    [updateSelectedNodeData]
  );

  const addParamToSelectedNode = useCallback(() => {
    updateSelectedNodeData((data) => ({
      ...data,
      params: data.params.concat({
        id: `param-${Date.now()}`,
        key: `param_${data.params.length + 1}`,
        label: `参数${data.params.length + 1}`,
        type: 'text',
        value: ''
      })
    }));
  }, [updateSelectedNodeData]);

  const removeParamFromSelectedNode = useCallback(
    (paramId: string) => {
      updateSelectedNodeData((data) => ({
        ...data,
        params: data.params.filter((param) => param.id !== paramId)
      }));
    },
    [updateSelectedNodeData]
  );

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h2>React Flow 工作流节点编辑器（中文示例）</h2>
        <p>支持按类型创建节点、模板加点、连线、拖拽、参数编辑，模拟真实工作流系统中“图 + 节点参数面板”的协同模式。</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <SectionCard title="控制面板" note="用意：验证基础图编辑能力。">
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.button} ${connectMode ? styles.buttonAccent : ''}`}
                onClick={() => setConnectMode((prev) => !prev)}
                type="button"
              >
                {connectMode ? '连线模式：开启' : '连线模式：关闭'}
              </button>
              <button className={styles.buttonGhost} onClick={autoArrange} type="button">
                自动排布
              </button>
              <button className={styles.buttonGhost} onClick={resetGraph} type="button">
                重置图
              </button>
              <button className={styles.buttonDanger} disabled={!selectedNodeId} onClick={removeSelectedNode} type="button">
                删除选中节点
              </button>
            </div>

            <ul className={styles.tipList}>
              <li>拖拽节点可调整布局。</li>
              <li>从节点右侧 Handle 拉线到左侧 Handle 可建立连接。</li>
              <li>连线模式开启后，点击 Handle 可快速连线。</li>
            </ul>
          </SectionCard>

          <SectionCard title="按类型创建节点" note="用意：支持不同类型节点的动态添加。">
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>节点类型</span>
                <select onChange={(event) => setCreateKind(event.target.value as NodeKind)} value={createKind}>
                  {Object.entries(kindMeta).map(([kind, meta]) => (
                    <option key={kind} value={kind}>
                      {meta.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>节点名称</span>
                <input onChange={(event) => setCreateLabel(event.target.value)} value={createLabel} />
              </label>

              <label className={styles.field}>
                <span>节点描述</span>
                <input onChange={(event) => setCreateDescription(event.target.value)} value={createDescription} />
              </label>

              <label className={styles.field}>
                <span>Meta</span>
                <input onChange={(event) => setCreateMeta(event.target.value)} value={createMeta} />
              </label>

              <div className={styles.inlineFields}>
                <label className={styles.field}>
                  <span>输入口</span>
                  <input
                    min={0}
                    onChange={(event) => setCreateInputs(Number(event.target.value))}
                    type="number"
                    value={createInputs}
                  />
                </label>
                <label className={styles.field}>
                  <span>输出口</span>
                  <input
                    min={0}
                    onChange={(event) => setCreateOutputs(Number(event.target.value))}
                    type="number"
                    value={createOutputs}
                  />
                </label>
              </div>

              <label className={styles.checkboxRow}>
                <input
                  checked={createConnectToSelected}
                  onChange={(event) => setCreateConnectToSelected(event.target.checked)}
                  type="checkbox"
                />
                <span>创建后自动连接到当前选中节点</span>
              </label>

              <button className={styles.button} onClick={addCustomNode} type="button">
                添加该类型节点
              </button>
            </div>
          </SectionCard>

          <SectionCard title="模板节点" note="用意：快速补齐常见工作流节点。">
            <div className={styles.templateList}>
              {nodeTemplates.map((template) => (
                <button className={styles.templateItem} key={template.label} onClick={() => addTemplateNode(template)} type="button">
                  <strong>{template.label}</strong>
                  <span>{template.description}</span>
                  <em>{kindMeta[template.kind].label}</em>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="图指标" note="用意：观察图规模和节点类型分布。">
            <div className={styles.statsGrid}>
              <div>
                <p>{graphStats.nodeCount}</p>
                <span>节点总数</span>
              </div>
              <div>
                <p>{graphStats.edgeCount}</p>
                <span>连线总数</span>
              </div>
              <div>
                <p>{graphStats.kindCount.control}</p>
                <span>控制节点</span>
              </div>
              <div>
                <p>{graphStats.kindCount.output}</p>
                <span>输出节点</span>
              </div>
            </div>
          </SectionCard>
        </aside>

        <section className={styles.stageSection}>
          <div className={styles.stageHeader}>
            <h3>工作流画布</h3>
            <p>{connectMode ? '连线模式中：优先操作节点 Handle。' : '编辑模式中：可拖拽、框选、删除。'}</p>
          </div>

          <div className={styles.flowShell}>
            <ReactFlow<WorkflowNode, WorkflowEdge>
              connectOnClick={connectMode}
              defaultEdgeOptions={edgeVisual}
              edges={edges}
              fitView
              nodes={nodes}
              nodesConnectable
              nodeTypes={nodeTypes}
              onConnect={onConnect}
              onEdgesChange={onEdgesChange}
              onNodesChange={onNodesChange}
              onSelectionChange={onSelectionChange}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#cbd5e1" gap={24} size={1} />
              <MiniMap nodeColor={miniMapNodeColor} nodeStrokeWidth={3} pannable zoomable />
              <Controls showInteractive={false} />
              <Panel className={styles.flowPanel} position="top-right">
                <span>{graphStats.nodeCount} 节点</span>
                <span>{graphStats.edgeCount} 连线</span>
              </Panel>
            </ReactFlow>
          </div>

          <div className={styles.inspector}>
            <h4>节点参数编辑器</h4>
            {selectedNode ? (
              <div className={styles.inspectorGrid}>
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

                <label className={styles.field}>
                  <span>节点描述</span>
                  <textarea
                    onChange={(event) =>
                      updateSelectedNodeData((data) => ({
                        ...data,
                        description: event.target.value
                      }))
                    }
                    rows={2}
                    value={selectedNode.data.description}
                  />
                </label>

                <label className={styles.field}>
                  <span>Meta</span>
                  <input
                    onChange={(event) =>
                      updateSelectedNodeData((data) => ({
                        ...data,
                        meta: event.target.value
                      }))
                    }
                    value={selectedNode.data.meta}
                  />
                </label>

                <div className={styles.inlineFields}>
                  <label className={styles.field}>
                    <span>输入口</span>
                    <input
                      min={0}
                      onChange={(event) =>
                        updateSelectedNodeData((data) => ({
                          ...data,
                          inputs: normalizePortCount(Number(event.target.value))
                        }))
                      }
                      type="number"
                      value={selectedNode.data.inputs}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>输出口</span>
                    <input
                      min={0}
                      onChange={(event) =>
                        updateSelectedNodeData((data) => ({
                          ...data,
                          outputs: normalizePortCount(Number(event.target.value))
                        }))
                      }
                      type="number"
                      value={selectedNode.data.outputs}
                    />
                  </label>
                </div>

                <div className={styles.paramEditor}>
                  <div className={styles.paramEditorHeader}>
                    <p>参数列表（可编辑）</p>
                    <button className={styles.smallButton} onClick={addParamToSelectedNode} type="button">
                      + 新增参数
                    </button>
                  </div>

                  {selectedNode.data.params.length ? (
                    <div className={styles.paramList}>
                      {selectedNode.data.params.map((param) => (
                        <div className={styles.paramRow} key={param.id}>
                          <input
                            className={styles.paramKey}
                            onChange={(event) => changeParam(param.id, { key: event.target.value })}
                            placeholder="key"
                            value={param.key}
                          />

                          <input
                            className={styles.paramLabel}
                            onChange={(event) => changeParam(param.id, { label: event.target.value })}
                            placeholder="参数名"
                            value={param.label}
                          />

                          <select
                            className={styles.paramType}
                            onChange={(event) => changeParamType(param.id, event.target.value as ParamType)}
                            value={param.type}
                          >
                            <option value="text">文本</option>
                            <option value="number">数字</option>
                            <option value="boolean">布尔</option>
                          </select>

                          {param.type === 'boolean' ? (
                            <label className={styles.paramBoolean}>
                              <input
                                checked={Boolean(param.value)}
                                onChange={(event) => changeParam(param.id, { value: event.target.checked })}
                                type="checkbox"
                              />
                              <span>{Boolean(param.value) ? '开启' : '关闭'}</span>
                            </label>
                          ) : (
                            <input
                              className={styles.paramValue}
                              onChange={(event) =>
                                changeParam(param.id, {
                                  value: param.type === 'number' ? Number(event.target.value) || 0 : event.target.value
                                })
                              }
                              placeholder="值"
                              type={param.type === 'number' ? 'number' : 'text'}
                              value={String(param.value)}
                            />
                          )}

                          <button className={styles.paramDelete} onClick={() => removeParamFromSelectedNode(param.id)} type="button">
                            删除
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.emptyState}>当前节点暂无参数，点击“新增参数”开始编辑。</p>
                  )}
                </div>

                <p className={styles.positionText}>
                  位置：{Math.round(selectedNode.position.x)} / {Math.round(selectedNode.position.y)}
                </p>
              </div>
            ) : (
              <p className={styles.emptyState}>请选择一个节点后编辑参数。</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

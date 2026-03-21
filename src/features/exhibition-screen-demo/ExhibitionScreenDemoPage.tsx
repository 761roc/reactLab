import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import styles from './ExhibitionScreenDemoPage.module.css';

type EChartsInstance = {
  dispose: () => void;
  resize: () => void;
  setOption: (option: unknown, notMerge?: boolean) => void;
};

type EChartsGlobal = {
  getMap?: (name: string) => unknown;
  getInstanceByDom?: (node: HTMLDivElement) => EChartsInstance | undefined;
  init: (node: HTMLDivElement, theme?: unknown, opts?: { renderer?: 'canvas' | 'svg' }) => EChartsInstance;
  registerMap?: (name: string, data: unknown) => void;
};

declare global {
  interface Window {
    echarts?: EChartsGlobal;
  }
}

const stagePresets = [
  { id: 'fhd', label: '1080P', width: 1920, height: 1080 },
  { id: 'qhd', label: '2K', width: 2560, height: 1440 },
  { id: 'uhd', label: '4K', width: 3840, height: 2160 }
] as const;

const provinceNodes = [
  { id: 'beijing', name: '北京', valueLabel: '2.4M', metric: 2.4, coord: [116.40, 39.90] },
  { id: 'shandong', name: '山东', valueLabel: '1.9M', metric: 1.9, coord: [117.00, 36.65] },
  { id: 'shanghai', name: '上海', valueLabel: '2.8M', metric: 2.8, coord: [121.47, 31.23] },
  { id: 'henan', name: '河南', valueLabel: '1.5M', metric: 1.5, coord: [113.62, 34.75] },
  { id: 'hubei', name: '湖北', valueLabel: '1.3M', metric: 1.3, coord: [114.31, 30.52] },
  { id: 'sichuan', name: '四川', valueLabel: '1.7M', metric: 1.7, coord: [104.06, 30.67] },
  { id: 'guangdong', name: '广东', valueLabel: '3.6M', metric: 3.6, coord: [113.27, 23.13] },
  { id: 'chongqing', name: '重庆', valueLabel: '1.1M', metric: 1.1, coord: [106.55, 29.56] },
  { id: 'zhejiang', name: '浙江', valueLabel: '2.1M', metric: 2.1, coord: [120.15, 30.28] }
] as const;

const mapFlows = [
  { from: 'beijing', to: 'shanghai', label: '京沪签约协同', accent: '#22d3ee' },
  { from: 'beijing', to: 'guangdong', label: '北广渠道流转', accent: '#38bdf8' },
  { from: 'shanghai', to: 'zhejiang', label: '华东供应联动', accent: '#4ade80' },
  { from: 'sichuan', to: 'guangdong', label: '西南发运入华南', accent: '#f59e0b' },
  { from: 'henan', to: 'guangdong', label: '中部补货链路', accent: '#fb7185' },
  { from: 'chongqing', to: 'shanghai', label: '山城样板客户回流', accent: '#a78bfa' }
] as const;

const growthSeries = [
  { month: '1月', revenue: 28, orders: 18, color: '#2dd4bf' },
  { month: '2月', revenue: 31, orders: 20, color: '#22c55e' },
  { month: '3月', revenue: 35, orders: 23, color: '#84cc16' },
  { month: '4月', revenue: 40, orders: 26, color: '#f59e0b' },
  { month: '5月', revenue: 46, orders: 30, color: '#f97316' },
  { month: '6月', revenue: 53, orders: 34, color: '#ec4899' },
  { month: '7月', revenue: 59, orders: 37, color: '#8b5cf6' },
  { month: '8月', revenue: 64, orders: 41, color: '#22d3ee' },
  { month: '9月', revenue: 70, orders: 44, color: '#38bdf8' },
  { month: '10月', revenue: 76, orders: 48, color: '#0ea5e9' },
  { month: '11月', revenue: 83, orders: 52, color: '#14b8a6' },
  { month: '12月', revenue: 90, orders: 57, color: '#f472b6' }
] as const;

const salesMix = [
  { channel: '智慧零售', value: 38, color: '#38bdf8', summary: '门店互动屏、导购终端、数字陈列' },
  { channel: '工业方案', value: 27, color: '#22c55e', summary: '产线看板、设备状态屏、调度终端' },
  { channel: '城市服务', value: 19, color: '#f59e0b', summary: '政务大厅、城市窗口、公共触达' },
  { channel: '海外项目', value: 16, color: '#f472b6', summary: '海外渠道、区域代理、项目交付' }
] as const;

const leadScatter = [
  { channel: '智慧零售', heat: 84, conversion: 72, size: 34, color: '#38bdf8' },
  { channel: '工业方案', heat: 66, conversion: 78, size: 28, color: '#22c55e' },
  { channel: '城市服务', heat: 58, conversion: 63, size: 24, color: '#f59e0b' },
  { channel: '海外项目', heat: 73, conversion: 59, size: 30, color: '#f472b6' }
] as const;

const newsItems = [
  { time: '09:12', title: '华东渠道补货计划完成 112%', tag: '渠道', accent: '#38bdf8' },
  { time: '10:05', title: '智慧展厅互动区本周累计接待突破 8,000 人次', tag: '展厅', accent: '#2dd4bf' },
  { time: '11:28', title: '新品解决方案在深圳样板客户完成首批交付', tag: '交付', accent: '#f59e0b' },
  { time: '13:40', title: '西南区域签约金额连续 4 周保持双位数增长', tag: '增长', accent: '#84cc16' },
  { time: '15:06', title: '售后满意度提升至 97.8%，工单平均响应缩短 18 分钟', tag: '服务', accent: '#fb7185' }
] as const;

const regionRanks = [
  { region: '华南区', amount: '¥ 6.2M', completion: 88, accent: '#22d3ee' },
  { region: '华东区', amount: '¥ 5.7M', completion: 81, accent: '#38bdf8' },
  { region: '西南区', amount: '¥ 3.4M', completion: 68, accent: '#f59e0b' },
  { region: '华北区', amount: '¥ 2.9M', completion: 62, accent: '#a78bfa' }
] as const;

const kpiCards = [
  { label: '本日签约额', value: '¥ 18.6M', delta: '+12.4%', tone: 'positive', accent: '#22d3ee', glow: 'rgba(34,211,238,0.22)' },
  { label: '展厅访客数', value: '2,846', delta: '+318', tone: 'positive', accent: '#38bdf8', glow: 'rgba(56,189,248,0.2)' },
  { label: '全国发货单', value: '1,092', delta: '+8.1%', tone: 'positive', accent: '#4ade80', glow: 'rgba(74,222,128,0.18)' },
  { label: '预警工单', value: '07', delta: '-3', tone: 'calm', accent: '#fb7185', glow: 'rgba(251,113,133,0.18)' }
] as const;

const signalCards = [
  { title: '客户停留热度', value: '91%', note: '互动区平均驻留 14.2 min', accent: '#22d3ee' },
  { title: '讲解转化率', value: '36%', note: '重点方案页留资提升 6.8%', accent: '#f59e0b' },
  { title: '远程连线数', value: '12', note: '今日已连通 7 城客户中心', accent: '#a78bfa' },
  { title: '体验预约排期', value: '19', note: '未来三日接待时段已排满', accent: '#2dd4bf' }
] as const;

const commandFeed = [
  { level: 'A1', title: '大客户会客模式已开启', detail: '主屏切换为品牌总览 + 全国经营看板。', accent: '#f59e0b' },
  { level: 'B2', title: '巡检机器人状态正常', detail: '馆内 3 台设备均在线，定位轨迹稳定。', accent: '#22d3ee' },
  { level: 'A2', title: '沉浸式演示脚本更新', detail: '新增“行业增长对比”与“区域热力播报”片段。', accent: '#a78bfa' },
  { level: 'C1', title: '库存补给提醒', detail: '华南体验区宣传物料库存降至安全线以下。', accent: '#fb7185' }
] as const;

const echartsScriptCache = new Map<string, Promise<void>>();

function loadScript(src: string) {
  const cached = echartsScriptCache.get(src);
  if (cached) {
    return cached;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[data-exhibition-src="${src}"]`) as HTMLScriptElement | null;
    if (existing?.dataset.loaded === 'true') {
      resolve();
      return;
    }

    const script = existing ?? document.createElement('script');
    script.async = true;
    script.src = src;
    script.dataset.exhibitionSrc = src;

    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => {
      echartsScriptCache.delete(src);
      reject(new Error(`Failed to load ${src}`));
    };

    if (!existing) {
      document.head.appendChild(script);
    }
  });

  echartsScriptCache.set(src, promise);
  return promise;
}

async function ensureECharts() {
  await loadScript('https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js');

  if (!window.echarts) {
    throw new Error('ECharts runtime unavailable.');
  }

  return window.echarts;
}

function formatClock(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

function getChartInstance(echarts: EChartsGlobal, node: HTMLDivElement) {
  return echarts.getInstanceByDom?.(node) ?? echarts.init(node, undefined, { renderer: 'svg' });
}

function getVisibleWindow<T>(items: readonly T[], activeIndex: number, count: number) {
  if (items.length <= count) {
    return items;
  }

  const half = Math.floor(count / 2);
  let start = Math.max(0, activeIndex - half);

  if (start + count > items.length) {
    start = items.length - count;
  }

  return items.slice(start, start + count);
}

export default function ExhibitionScreenDemoPage() {
  const [presetId, setPresetId] = useState<(typeof stagePresets)[number]['id']>('fhd');
  const [autoPlay, setAutoPlay] = useState(true);
  const [tick, setTick] = useState(0);
  const [scale, setScale] = useState(1);
  const [clock, setClock] = useState(() => new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [chartsReady, setChartsReady] = useState(false);
  const [chartRuntimeError, setChartRuntimeError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const simulatorRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const mapChartRef = useRef<HTMLDivElement | null>(null);
  const trendChartRef = useRef<HTMLDivElement | null>(null);
  const mixChartRef = useRef<HTMLDivElement | null>(null);
  const radarChartRef = useRef<HTMLDivElement | null>(null);
  const scatterChartRef = useRef<HTMLDivElement | null>(null);
  const chinaMapReadyRef = useRef(false);
  const toolbarTimerRef = useRef<number | null>(null);

  const selectedPreset = useMemo(
    () => stagePresets.find((item) => item.id === presetId) ?? stagePresets[0],
    [presetId]
  );

  const densityClass =
    presetId === 'fhd' ? styles.stageCanvasFhd : presetId === 'qhd' ? styles.stageCanvasQhd : styles.stageCanvasUhd;

  const flowProgress = useMemo(
    () =>
      mapFlows.map((flow, index) => ({
        ...flow,
        progress: Math.min(100, 32 + ((tick * 17 + index * 11) % 68))
      })),
    [tick]
  );

  const activeFlowIndex = tick % mapFlows.length;
  const activeNewsIndex = tick % newsItems.length;
  const activeMonthIndex = tick % growthSeries.length;
  const activeMixIndex = tick % salesMix.length;
  const activeCommandIndex = tick % commandFeed.length;
  const activeKpiIndex = tick % kpiCards.length;
  const activeFlow = flowProgress[activeFlowIndex];
  const activeNews = newsItems[activeNewsIndex];
  const activeMonth = growthSeries[activeMonthIndex];
  const activeMix = salesMix[activeMixIndex];
  const gaugeValue = 78 + ((tick * 5) % 18);
  const visibleFlowItems = useMemo(() => getVisibleWindow(flowProgress, activeFlowIndex, 2), [activeFlowIndex, flowProgress]);
  const visibleNewsItems = useMemo(() => getVisibleWindow(newsItems, activeNewsIndex, 2), [activeNewsIndex]);
  const visibleRegionRanks = useMemo(() => regionRanks.slice(0, 2), []);
  const visibleCommandItems = useMemo(() => getVisibleWindow(commandFeed, activeCommandIndex, 3), [activeCommandIndex]);
  const monthRailItems = useMemo(() => {
    const visibleCount = 2;
    let start = Math.max(0, activeMonthIndex - 1);

    if (start + visibleCount > growthSeries.length) {
      start = Math.max(0, growthSeries.length - visibleCount);
    }

    return growthSeries.slice(start, start + visibleCount);
  }, [activeMonthIndex]);
  const radarValues = [
    74 + ((tick * 3) % 10),
    82 + ((activeMixIndex * 2) % 8),
    69 + ((tick * 4) % 12),
    77 + ((activeFlowIndex * 3) % 9),
    86 + ((tick * 2) % 8),
    73 + ((activeNewsIndex * 4) % 10)
  ];

  useEffect(() => {
    let cancelled = false;

    ensureECharts()
      .then(() => {
        if (cancelled) {
          return;
        }
        setChartsReady(true);
        setChartRuntimeError(null);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setChartRuntimeError(error instanceof Error ? error.message : '图表资源加载失败。');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [autoPlay]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === simulatorRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    handleFullscreenChange();

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const clearTimer = () => {
      if (toolbarTimerRef.current !== null) {
        window.clearTimeout(toolbarTimerRef.current);
        toolbarTimerRef.current = null;
      }
    };

    if (!isFullscreen) {
      clearTimer();
      setToolbarVisible(true);
      return undefined;
    }

    const host = simulatorRef.current;
    if (!host) {
      return undefined;
    }

    const revealToolbar = () => {
      setToolbarVisible(true);
      clearTimer();
      toolbarTimerRef.current = window.setTimeout(() => {
        setToolbarVisible(false);
      }, 3000);
    };

    revealToolbar();

    host.addEventListener('mousemove', revealToolbar);
    host.addEventListener('mousedown', revealToolbar);
    host.addEventListener('touchstart', revealToolbar, { passive: true });
    window.addEventListener('keydown', revealToolbar);

    return () => {
      clearTimer();
      host.removeEventListener('mousemove', revealToolbar);
      host.removeEventListener('mousedown', revealToolbar);
      host.removeEventListener('touchstart', revealToolbar);
      window.removeEventListener('keydown', revealToolbar);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const node = viewportRef.current;
    if (!node) {
      return undefined;
    }

    const measure = () => {
      const rect = node.getBoundingClientRect();
      const horizontalSafePadding = isFullscreen ? 0 : 28;
      const verticalSafePadding = isFullscreen ? 116 : 28;
      const nextScale = Math.min(
        (rect.width - horizontalSafePadding) / selectedPreset.width,
        (rect.height - verticalSafePadding) / selectedPreset.height
      );

      setScale(Number(Math.max(nextScale, 0.16).toFixed(3)));
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(node);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isFullscreen, selectedPreset.height, selectedPreset.width]);

  useEffect(() => {
    if (!chartsReady || !window.echarts || !mapChartRef.current) {
      return;
    }

    let cancelled = false;

    const render = async () => {
      const echarts = window.echarts!;

      if (!chinaMapReadyRef.current && !echarts.getMap?.('china')) {
        const response = await fetch('https://ecomfe.github.io/echarts-builder-web/map/json/china.json');
        if (!response.ok) {
          throw new Error(`地图数据请求失败: ${response.status}`);
        }
        const geoJson = await response.json();
        echarts.registerMap?.('china', geoJson);
        chinaMapReadyRef.current = true;
      }

      if (cancelled) {
        return;
      }

      if (mapChartRef.current!.clientWidth === 0 || mapChartRef.current!.clientHeight === 0) {
        return;
      }

      const chart = getChartInstance(echarts, mapChartRef.current!);
      const linesData = flowProgress.map((item, index) => {
        const from = provinceNodes.find((province) => province.id === item.from);
        const to = provinceNodes.find((province) => province.id === item.to);

        return {
          coords: [from?.coord ?? [0, 0], to?.coord ?? [0, 0]],
          name: item.label,
          lineStyle: {
            color: item.accent,
            curveness: index === activeFlowIndex ? 0.24 : 0.18,
            opacity: index === activeFlowIndex ? 1 : 0.34,
            width: index === activeFlowIndex ? 4 : 2
          },
          value: item.progress
        };
      });

      chart.setOption(
        {
          animationDuration: 700,
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(4, 17, 27, 0.92)',
            borderColor: 'rgba(56, 189, 248, 0.32)',
            textStyle: {
              color: '#e0f2fe'
            },
            formatter: (params: any) => {
              if (params.seriesType === 'lines' && params.value) {
                return `${params.name ?? '数据流转'}<br/>当前进度 ${params.value}%`;
              }

              if (params.data?.labelText) {
                return params.data.labelText.replace('\n', '<br/>');
              }

              return params.name ?? '';
            }
          },
          geo: {
            map: 'china',
            roam: false,
            zoom: 1,
            layoutCenter: ['43%', '54%'],
            layoutSize: presetId === 'uhd' ? '110%' : presetId === 'qhd' ? '106%' : '102%',
            aspectScale: 0.96,
            itemStyle: {
              areaColor: '#102d46',
              borderColor: '#1ec8ff',
              borderWidth: 1.1
            },
            emphasis: {
              itemStyle: {
                areaColor: '#174b6a'
              },
              label: {
                color: '#f8fdff'
              }
            }
          },
          series: [
            {
              type: 'map',
              map: 'china',
              geoIndex: 0,
              data: provinceNodes.map((item) => ({
                name: item.name,
                value: item.metric
              })),
              label: {
                show: false
              }
            },
            {
              type: 'lines',
              coordinateSystem: 'geo',
              zlevel: 2,
              effect: {
                show: true,
                symbol: 'circle',
                color: '#d9fbff',
                symbolSize: 8,
                trailLength: 0.28
              },
              data: linesData
            },
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 3,
              rippleEffect: {
                scale: 5,
                brushType: 'stroke'
              },
              symbolSize: (value: number[]) => 10 + value[2] * 2,
              itemStyle: {
                color: '#67e8f9',
                shadowBlur: 18,
                shadowColor: 'rgba(34, 211, 238, 0.45)'
              },
              label: {
                show: true,
                position: 'right',
                distance: 8,
                color: '#e0f2fe',
                fontSize: presetId === 'fhd' ? 10 : 12,
                formatter: (params: any) => `${params.name}\n${params.data?.value?.[2] ?? ''}M`
              },
              data: provinceNodes.map((item) => ({
                name: item.name,
                value: [...item.coord, item.metric],
                labelText: `${item.name}\n${item.valueLabel}`
              }))
            }
          ]
        },
        true
      );

      chart.resize();
      setMapError(null);
    };

    render().catch((error) => {
      if (!cancelled) {
        setMapError(error instanceof Error ? error.message : '地图数据加载失败。');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeFlowIndex, chartsReady, flowProgress, presetId]);

  useEffect(() => {
    if (!chartsReady || !window.echarts || !trendChartRef.current) {
      return;
    }

    const echarts = window.echarts;
    if (trendChartRef.current.clientWidth === 0 || trendChartRef.current.clientHeight === 0) {
      return;
    }
    const chart = getChartInstance(echarts, trendChartRef.current);

    chart.setOption(
      {
        animationDuration: 700,
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(4, 17, 27, 0.92)',
          borderColor: 'rgba(56, 189, 248, 0.32)',
          textStyle: {
            color: '#e0f2fe'
          }
        },
        grid: {
          left: 20,
          right: 16,
          top: 22,
          bottom: 20,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: growthSeries.map((item) => item.month),
          axisLine: {
            lineStyle: {
              color: 'rgba(125, 211, 252, 0.18)'
            }
          },
          axisLabel: {
            color: '#8cb9d8'
          }
        },
        yAxis: [
          {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: 'rgba(125, 211, 252, 0.12)'
              }
            },
            axisLabel: {
              color: '#8cb9d8'
            }
          },
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '营收指数',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 7,
            lineStyle: {
              color: '#60a5fa',
              width: presetId === 'fhd' ? 2 : 2.4
            },
            itemStyle: {
              color: '#eff6ff',
              borderColor: '#60a5fa',
              borderWidth: 2
            },
            areaStyle: {
              color: 'rgba(96, 165, 250, 0.12)'
            },
            data: growthSeries.map((item, index) => ({
              value: item.revenue,
              symbolSize: index === activeMonthIndex ? 11 : 7
            }))
          },
          {
            name: '订单指数',
            type: 'bar',
            yAxisIndex: 1,
            barWidth: presetId === 'fhd' ? 8 : presetId === 'qhd' ? 10 : 12,
            barCategoryGap: presetId === 'fhd' ? '34%' : '38%',
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: (params: { dataIndex: number }) => growthSeries[params.dataIndex]?.color ?? '#22c55e'
            },
            data: growthSeries.map((item) => item.orders)
          }
        ]
      },
      true
    );

    chart.resize();
  }, [activeMonthIndex, chartsReady, presetId]);

  useEffect(() => {
    if (!chartsReady || !window.echarts || !mixChartRef.current) {
      return;
    }

    const echarts = window.echarts;
    if (mixChartRef.current.clientWidth === 0 || mixChartRef.current.clientHeight === 0) {
      return;
    }
    const chart = getChartInstance(echarts, mixChartRef.current);

    chart.setOption(
      {
        animationDuration: 700,
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(4, 17, 27, 0.92)',
          borderColor: 'rgba(56, 189, 248, 0.32)',
          textStyle: {
            color: '#e0f2fe'
          },
          formatter: '{b}<br/>{c}%'
        },
        series: [
          {
            type: 'pie',
            radius: presetId === 'fhd' ? ['34%', '54%'] : presetId === 'qhd' ? ['38%', '58%'] : ['42%', '64%'],
            center: ['50%', '50%'],
            label: {
              show: true,
              color: '#d8f3ff',
              fontSize: presetId === 'fhd' ? 9 : 10,
              formatter: (params: { name: string; percent?: number }) => `${params.name}\n${Math.round(params.percent ?? 0)}%`
            },
            labelLine: {
              show: true,
              length: presetId === 'fhd' ? 6 : 8,
              length2: presetId === 'fhd' ? 6 : 10,
              lineStyle: {
                color: 'rgba(148, 211, 252, 0.5)'
              }
            },
            itemStyle: {
              borderColor: '#081b2c',
              borderWidth: 3
            },
            emphasis: {
              scale: true,
              scaleSize: 10
            },
            data: salesMix.map((item, index) => ({
              name: item.channel,
              value: item.value,
              itemStyle: {
                color: item.color,
                opacity: index === activeMixIndex ? 1 : 0.82
              }
            }))
          }
        ]
      },
      true
    );

    chart.resize();
  }, [activeMixIndex, chartsReady, presetId]);

  useEffect(() => {
    if (!chartsReady || !window.echarts || !radarChartRef.current) {
      return;
    }

    const echarts = window.echarts;
    if (radarChartRef.current.clientWidth === 0 || radarChartRef.current.clientHeight === 0) {
      return;
    }
    const chart = getChartInstance(echarts, radarChartRef.current);

    chart.setOption(
      {
        animationDuration: 700,
        backgroundColor: 'transparent',
        radar: {
          center: ['50%', '54%'],
          radius: '64%',
          splitNumber: 4,
          indicator: [
            { name: '品牌触达', max: 100 },
            { name: '讲解效率', max: 100 },
            { name: '留资转化', max: 100 },
            { name: '交付可视', max: 100 },
            { name: '渠道联动', max: 100 },
            { name: '售后反馈', max: 100 }
          ],
          axisName: {
            color: '#a7d3ec',
            fontSize: presetId === 'fhd' ? 10 : 11
          },
          splitLine: {
            lineStyle: {
              color: ['rgba(125, 211, 252, 0.08)']
            }
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(6, 23, 37, 0.1)', 'rgba(6, 23, 37, 0.18)']
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(125, 211, 252, 0.16)'
            }
          }
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                value: radarValues,
                areaStyle: {
                  color: 'rgba(45, 212, 191, 0.22)'
                },
                lineStyle: {
                  color: '#2dd4bf',
                  width: 2.5
                },
                itemStyle: {
                  color: '#2dd4bf'
                }
              }
            ]
          }
        ]
      },
      true
    );

    chart.resize();
  }, [chartsReady, presetId, radarValues]);

  useEffect(() => {
    if (!chartsReady || !window.echarts || !scatterChartRef.current) {
      return;
    }

    const echarts = window.echarts;
    if (scatterChartRef.current.clientWidth === 0 || scatterChartRef.current.clientHeight === 0) {
      return;
    }
    const chart = getChartInstance(echarts, scatterChartRef.current);

    chart.setOption(
      {
        animationDuration: 700,
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(4, 17, 27, 0.92)',
          borderColor: 'rgba(56, 189, 248, 0.32)',
          textStyle: {
            color: '#e0f2fe'
          },
          formatter: (params: any) =>
            `${params.name}<br/>线索热度 ${params.value?.[0]}<br/>转化效率 ${params.value?.[1]}%`
        },
        grid: {
          left: 34,
          right: 14,
          top: 20,
          bottom: 26
        },
        xAxis: {
          type: 'value',
          min: 45,
          max: 90,
          name: '线索热度',
          nameLocation: 'middle',
          nameGap: 20,
          nameTextStyle: {
            color: '#8cb9d8',
            fontSize: presetId === 'fhd' ? 10 : 11
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(125, 211, 252, 0.2)'
            }
          },
          axisLabel: {
            color: '#8cb9d8',
            fontSize: presetId === 'fhd' ? 10 : 11
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(125, 211, 252, 0.08)'
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 50,
          max: 85,
          name: '转化效率',
          nameTextStyle: {
            color: '#8cb9d8',
            fontSize: presetId === 'fhd' ? 10 : 11
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#8cb9d8',
            fontSize: presetId === 'fhd' ? 10 : 11
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(125, 211, 252, 0.08)'
            }
          }
        },
        series: [
          {
            type: 'scatter',
            data: leadScatter.map((item, index) => ({
              name: item.channel,
              value: [item.heat, item.conversion, index === activeMixIndex ? item.size + 10 : item.size],
              itemStyle: {
                color: item.color,
                opacity: index === activeMixIndex ? 1 : 0.72,
                shadowBlur: index === activeMixIndex ? 18 : 8,
                shadowColor: item.color
              },
              label: {
                show: true,
                position: 'top',
                color: '#d8f3ff',
                fontSize: presetId === 'fhd' ? 10 : 11,
                formatter: item.channel
              }
            })),
            symbolSize: (value: number[]) => value[2]
          }
        ]
      },
      true
    );

    chart.resize();
  }, [activeMixIndex, chartsReady, presetId]);

  useEffect(() => {
    const refs = [
      mapChartRef.current,
      trendChartRef.current,
      mixChartRef.current,
      radarChartRef.current,
      scatterChartRef.current
    ].filter((item): item is HTMLDivElement => Boolean(item));

    if (!refs.length || !window.echarts) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(() => {
      refs.forEach((node) => {
        if (node.clientWidth === 0 || node.clientHeight === 0) {
          return;
        }
        const chart = window.echarts?.getInstanceByDom?.(node);
        chart?.resize();
      });
    });

    refs.forEach((node) => resizeObserver.observe(node));

    return () => resizeObserver.disconnect();
  }, [chartsReady, presetId, selectedPreset.height, selectedPreset.width]);

  useEffect(() => {
    return () => {
      [mapChartRef.current, trendChartRef.current, mixChartRef.current, radarChartRef.current, scatterChartRef.current].forEach((node) => {
        const chart = node ? window.echarts?.getInstanceByDom?.(node) : undefined;
        chart?.dispose();
      });
    };
  }, []);

  const stageStyle = {
    width: `${selectedPreset.width}px`,
    height: `${selectedPreset.height}px`,
    transform: `translate(-50%, -50%) scale(${scale})`
  };

  const handleAdvance = () => {
    setTick((value) => value + 1);
    if (isFullscreen) {
      setToolbarVisible(true);
    }
  };

  const handleToggleFullscreen = async () => {
    const node = simulatorRef.current;
    if (!node) {
      return;
    }

    if (document.fullscreenElement === node) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      return;
    }

    if (node.requestFullscreen) {
      await node.requestFullscreen();
    }
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.simulatorFrame} ${isFullscreen ? styles.simulatorFrameFullscreen : ''}`} ref={simulatorRef}>
          <div
            className={`${styles.simulatorToolbar} ${isFullscreen && !toolbarVisible ? styles.toolbarHidden : ''}`}
          >
            <div className={styles.toolbarMeta}>
              <strong>展厅大屏模拟器</strong>
              <span>
                当前画布 {selectedPreset.width} × {selectedPreset.height} / 缩放 {Math.round(scale * 100)}%
              </span>
            </div>

            <div className={styles.toolbarActions}>
              <div className={styles.presetGroup}>
                {stagePresets.map((preset) => (
                  <button
                    className={`${styles.toolbarButton} ${preset.id === presetId ? styles.toolbarButtonActive : ''}`}
                    key={preset.id}
                    onClick={() => setPresetId(preset.id)}
                    type="button"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <button
                className={`${styles.toolbarButton} ${autoPlay ? styles.toolbarButtonActive : ''}`}
                onClick={() => setAutoPlay((value) => !value)}
                type="button"
              >
                {autoPlay ? '自动轮播中' : '自动轮播已停'}
              </button>
              <button className={styles.toolbarButton} onClick={handleAdvance} type="button">
                下一轮
              </button>
              <button className={styles.toolbarButton} onClick={handleToggleFullscreen} type="button">
                {isFullscreen ? '退出全屏' : '大屏全屏'}
              </button>
            </div>
          </div>

          <div className={styles.stageViewport} ref={viewportRef}>
            <div
              className={`${styles.stageCanvas} ${densityClass} ${isFullscreen ? styles.stageCanvasFullscreen : ''}`}
              style={stageStyle}
            >
              <div className={styles.stageBackdrop} />
              <div className={styles.stageHalo} />

              <header className={styles.stageHeader}>
                <div>
                  <p className={styles.stageEyebrow}>Enterprise Demo Center</p>
                  <h3 className={styles.stageTitle}>企业展厅经营可视化大屏</h3>
                  <p className={styles.stageLead}>
                    模拟品牌馆、客户接待厅与公司展厅主屏的常见展示结构，重点展示地图流转、实时播报、趋势增长、
                    业务结构与服务状态。
                  </p>
                </div>

                <div className={styles.stageMeta}>
                  <div className={styles.metaCard}>
                    <span>场馆模式</span>
                    <strong>{autoPlay ? '自动播控 / 接待演示' : '手动观察 / 布局检查'}</strong>
                  </div>
                  <div className={styles.metaCard}>
                    <span>系统时间</span>
                    <strong>{formatClock(clock)}</strong>
                  </div>
                  <div className={styles.metaCard}>
                    <span>当前聚焦</span>
                    <strong>{activeFlow.label}</strong>
                  </div>
                </div>
              </header>

              <section className={styles.kpiGrid}>
                {kpiCards.map((item, index) => (
                  <article
                    className={`${styles.kpiCard} ${index === activeKpiIndex ? styles.kpiCardActive : ''}`}
                    key={item.label}
                    style={{ '--card-accent': item.accent, '--card-glow': item.glow } as CSSProperties}
                  >
                    <p>{item.label}</p>
                    <strong>{item.value}</strong>
                    <span className={item.tone === 'positive' ? styles.positive : styles.calm}>{item.delta}</span>
                  </article>
                ))}
              </section>

              <section className={styles.signalGrid}>
                {signalCards.map((item) => (
                  <article
                    className={styles.signalCard}
                    key={item.title}
                    style={{ '--signal-accent': item.accent } as CSSProperties}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.note}</p>
                    </div>
                    <span>{item.value}</span>
                  </article>
                ))}
              </section>

              <section className={styles.stageBody}>
                <div className={styles.leftColumn}>
                  <section className={styles.stagePanel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <span>全国流向</span>
                        <strong>省份热区与数据流转地图</strong>
                      </div>
                      <em>{activeFlow.label}</em>
                    </div>

                    <div className={styles.mapLayout}>
                      <div className={styles.chartShell}>
                        {mapError ?? chartRuntimeError ? (
                          <div className={styles.chartFallback}>{mapError ?? chartRuntimeError}</div>
                        ) : (
                          <div className={`${styles.chartMount} ${styles.mapChart}`} ref={mapChartRef} />
                        )}
                      </div>

                      <div className={styles.mapSideColumn}>
                        <article className={styles.gaugeCard}>
                          <div className={styles.gaugeHeader}>
                            <strong>交付效率</strong>
                            <span>交付达标</span>
                          </div>
                          <div className={styles.gaugeShell} aria-hidden="true">
                            <div className={styles.gaugeRing} style={{ '--gauge-progress': `${gaugeValue}%` } as CSSProperties}>
                              <div className={styles.gaugeRingInner}>
                                <strong>{gaugeValue}%</strong>
                                <span>准时率</span>
                              </div>
                            </div>
                          </div>
                          <p>重点方案从签约到演示脚本上线的整体节奏。</p>
                        </article>

                        <div className={styles.rankColumn}>
                          {visibleRegionRanks.map((item) => (
                            <article
                              className={styles.rankCard}
                              key={item.region}
                              style={{ '--rank-accent': item.accent } as CSSProperties}
                            >
                              <div className={styles.rankRow}>
                                <strong>{item.region}</strong>
                                <span>{item.amount}</span>
                              </div>
                              <div className={styles.rankBar}>
                                <div style={{ width: `${item.completion}%`, background: item.accent }} />
                              </div>
                              <p>目标完成度 {item.completion}%</p>
                            </article>
                          ))}
                        </div>

                        <div className={styles.flowList}>
                          {visibleFlowItems.map((item) => (
                            <article
                              className={`${styles.flowCard} ${item.from === activeFlow.from && item.to === activeFlow.to ? styles.flowCardActive : ''}`}
                              key={`${item.from}-${item.to}`}
                              style={{ '--flow-accent': item.accent } as CSSProperties}
                            >
                              <div className={styles.flowCardHeader}>
                                <strong>{item.label}</strong>
                                <span>{item.progress}%</span>
                              </div>
                              <div className={styles.flowProgressBar}>
                                <div style={{ width: `${item.progress}%`, background: item.accent }} />
                              </div>
                              <p>
                                {provinceNodes.find((node) => node.id === item.from)?.name} →
                                {provinceNodes.find((node) => node.id === item.to)?.name}
                              </p>
                            </article>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className={styles.stagePanel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <span>增长趋势</span>
                        <strong>营收、订单与能力雷达</strong>
                      </div>
                      <em>{activeMonth.month} 焦点</em>
                    </div>

                    <div className={styles.chartContent}>
                      <div className={styles.chartShell}>
                        {chartRuntimeError ? (
                          <div className={styles.chartFallback}>{chartRuntimeError}</div>
                        ) : (
                          <div className={`${styles.chartMount} ${styles.trendChart}`} ref={trendChartRef} />
                        )}
                      </div>

                      <div className={styles.analyticsRail}>
                        <div className={styles.monthStrip}>
                          {monthRailItems.map((item) => {
                            const index = growthSeries.findIndex((seriesItem) => seriesItem.month === item.month);

                            return (
                              <article
                                className={`${styles.monthCard} ${index === activeMonthIndex ? styles.monthCardActive : ''}`}
                                key={item.month}
                                style={{ '--month-accent': item.color } as CSSProperties}
                              >
                                <strong>{item.month}</strong>
                                <span>营收 {item.revenue}</span>
                                <span>订单 {item.orders}</span>
                              </article>
                            );
                          })}
                        </div>

                        <article className={styles.radarCard}>
                          <div className={styles.radarHeader}>
                            <strong>渠道能力雷达</strong>
                            <span>{activeMix.channel}</span>
                          </div>
                          <div className={styles.radarShell}>
                            {chartRuntimeError ? (
                              <div className={styles.chartFallback}>{chartRuntimeError}</div>
                            ) : (
                              <div className={`${styles.chartMount} ${styles.radarChart}`} ref={radarChartRef} />
                            )}
                          </div>
                        </article>

                        <article className={styles.insightCard}>
                          <div className={styles.insightHeader}>
                            <strong>线索热度象限</strong>
                            <span>{activeMix.channel}</span>
                          </div>
                          <div className={styles.insightShell}>
                            {chartRuntimeError ? (
                              <div className={styles.chartFallback}>{chartRuntimeError}</div>
                            ) : (
                              <div className={`${styles.chartMount} ${styles.insightChart}`} ref={scatterChartRef} />
                            )}
                          </div>
                        </article>
                      </div>
                    </div>
                  </section>
                </div>

                <div className={styles.rightColumn}>
                  <section className={styles.stagePanel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <span>最新播报</span>
                        <strong>接待场景滚动新闻</strong>
                      </div>
                      <em>{activeNews.time} 更新</em>
                    </div>

                    <article
                      className={styles.newsLeadCard}
                      style={{ '--news-accent': activeNews.accent } as CSSProperties}
                    >
                      <span>{activeNews.tag}</span>
                      <strong>{activeNews.title}</strong>
                      <p>当前轮播焦点，适合在展厅大屏上自动刷新或与播报脚本同步切换。</p>
                    </article>

                    <div className={styles.newsList}>
                      {visibleNewsItems.map((item) => (
                        <article
                          className={`${styles.newsCard} ${item.time === activeNews.time && item.title === activeNews.title ? styles.newsCardActive : ''}`}
                          key={`${item.time}-${item.title}`}
                          style={{ '--news-accent': item.accent } as CSSProperties}
                        >
                          <span className={styles.newsTag}>{item.tag}</span>
                          <div>
                            <strong>{item.title}</strong>
                            <p>{item.time} 更新</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <div className={styles.rightBottom}>
                    <section className={styles.stagePanel}>
                      <div className={styles.panelHeader}>
                        <div>
                          <span>销售结构</span>
                          <strong>业务占比与渠道构成</strong>
                        </div>
                        <em>{activeMix.channel}</em>
                      </div>

                      <div className={styles.mixLayout}>
                        <div className={`${styles.chartShell} ${styles.mixChartShell}`}>
                          {chartRuntimeError ? (
                            <div className={styles.chartFallback}>{chartRuntimeError}</div>
                          ) : (
                            <div className={`${styles.chartMount} ${styles.mixChart}`} ref={mixChartRef} />
                          )}
                        </div>

                        <div className={styles.mixLegend}>
                          {salesMix.map((item, index) => (
                            <article
                              className={`${styles.mixLegendItem} ${index === activeMixIndex ? styles.mixLegendItemActive : ''}`}
                              key={item.channel}
                              style={{ '--mix-accent': item.color } as CSSProperties}
                            >
                              <div className={styles.mixLegendHead}>
                                <span className={styles.mixLegendDot} style={{ backgroundColor: item.color }} />
                                <strong>{item.channel}</strong>
                                <span>{item.value}%</span>
                              </div>
                              <div className={styles.mixTrack}>
                                <div style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                              </div>
                              <p>{item.summary}</p>
                            </article>
                          ))}
                        </div>
                      </div>
                    </section>

                    <section className={styles.stagePanel}>
                      <div className={styles.panelHeader}>
                        <div>
                          <span>播控状态</span>
                          <strong>指令流与系统提示</strong>
                        </div>
                        <em>{commandFeed[activeCommandIndex].level}</em>
                      </div>

                      <div className={styles.commandGrid}>
                        {visibleCommandItems.map((item) => (
                          <article
                            className={`${styles.commandCard} ${item.title === commandFeed[activeCommandIndex].title ? styles.commandCardActive : ''}`}
                            key={item.title}
                            style={{ '--command-accent': item.accent } as CSSProperties}
                          >
                            <span>{item.level}</span>
                            <strong>{item.title}</strong>
                            <p>{item.detail}</p>
                          </article>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
    </div>
  );
}

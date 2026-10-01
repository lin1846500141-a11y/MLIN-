export interface Part {
  id: string;
  name: string;
  spec: string;
  /** CPU / 主板填写插槽，用于兼容性检查 */
  socket?: 'LGA1851' | 'LGA1700' | 'AM5';
}

export interface PartCategory {
  id: string;
  label: string;
  labelZh: string;
  options: Part[];
}

/**
 * 配件库：展示向，无价格，只做配置选择。
 * 增删配件只需改这里，页面自动渲染。
 */
export const categories: PartCategory[] = [
  {
    id: 'cpu',
    label: 'CPU',
    labelZh: '处理器',
    options: [
      { id: 'cpu-1', name: 'Intel Core Ultra 5 245KF', spec: '14核14线程 · LGA1851', socket: 'LGA1851' },
      { id: 'cpu-2', name: 'Intel i7-14700KF', spec: '20核28线程 · LGA1700', socket: 'LGA1700' },
      { id: 'cpu-3', name: 'AMD R5 9600X', spec: '6核12线程 · AM5', socket: 'AM5' },
      { id: 'cpu-4', name: 'AMD R7 9800X3D', spec: '8核16线程 · 3D缓存 · AM5', socket: 'AM5' },
      { id: 'cpu-5', name: 'AMD R5 8600G', spec: '6核12线程 · 核显可用 · AM5', socket: 'AM5' },
    ],
  },
  {
    id: 'board',
    label: 'MOTHERBOARD',
    labelZh: '主板',
    options: [
      { id: 'board-1', name: '微星 B860M MORTAR', spec: 'M-ATX · DDR5 · LGA1851', socket: 'LGA1851' },
      { id: 'board-2', name: '华硕 TUF B760M-PLUS', spec: 'M-ATX · DDR5 · LGA1700', socket: 'LGA1700' },
      { id: 'board-3', name: '微星 B650M MORTAR', spec: 'M-ATX · DDR5 · AM5', socket: 'AM5' },
      { id: 'board-4', name: '华硕 ROG STRIX B850-A', spec: 'ATX · DDR5 · AM5', socket: 'AM5' },
    ],
  },
  {
    id: 'ram',
    label: 'MEMORY',
    labelZh: '内存',
    options: [
      { id: 'ram-1', name: 'DDR5 16GB ×2', spec: '6000MHz · C30' },
      { id: 'ram-2', name: 'DDR5 32GB ×2', spec: '6400MHz · C32' },
      { id: 'ram-3', name: 'DDR5 16GB ×2 RGB', spec: '6400MHz · 灯条版' },
    ],
  },
  {
    id: 'gpu',
    label: 'GPU',
    labelZh: '显卡',
    options: [
      { id: 'gpu-0', name: '核显 / 暂不配独显', spec: '适合办公与轻度使用' },
      { id: 'gpu-1', name: 'RTX 4060 8GB', spec: '1080p 畅玩' },
      { id: 'gpu-2', name: 'RX 7800 XT 16GB', spec: '2K 高刷' },
      { id: 'gpu-3', name: 'RTX 5070 12GB', spec: '2K 光追' },
      { id: 'gpu-4', name: 'RTX 5090 32GB', spec: '4K 旗舰 · 需要大电源' },
    ],
  },
  {
    id: 'ssd',
    label: 'STORAGE',
    labelZh: '硬盘',
    options: [
      { id: 'ssd-1', name: '1TB NVMe Gen4', spec: '读速 7400MB/s' },
      { id: 'ssd-2', name: '2TB NVMe Gen4', spec: '读速 7400MB/s' },
      { id: 'ssd-3', name: '4TB NVMe Gen5', spec: '读速 14000MB/s' },
    ],
  },
  {
    id: 'psu',
    label: 'PSU',
    labelZh: '电源',
    options: [
      { id: 'psu-1', name: '650W 金牌全模组', spec: 'ATX 3.0' },
      { id: 'psu-2', name: '750W 金牌全模组', spec: 'ATX 3.0' },
      { id: 'psu-3', name: '1000W 白金全模组', spec: 'ATX 3.1 · 旗舰卡推荐' },
    ],
  },
  {
    id: 'case',
    label: 'CASE',
    labelZh: '机箱',
    options: [
      { id: 'case-1', name: 'M-ATX 紧凑机箱', spec: '桌面小钢炮' },
      { id: 'case-2', name: '中塔 ATX 海景房', spec: '侧透 · 展示向' },
      { id: 'case-3', name: '全塔 ATX', spec: '扩展拉满' },
    ],
  },
  {
    id: 'cooler',
    label: 'COOLING',
    labelZh: '散热',
    options: [
      { id: 'cooler-1', name: '双塔风冷', spec: '安静 · 免维护' },
      { id: 'cooler-2', name: '240 一体水冷', spec: '均衡' },
      { id: 'cooler-3', name: '360 一体水冷', spec: '压制旗舰 U' },
    ],
  },
];

/** 用途预设：一键填入一套合理的搭配 */
export const presets: Record<string, { label: string; picks: Record<string, string> }> = {
  gaming: {
    label: '均衡游戏',
    picks: {
      cpu: 'cpu-4', board: 'board-3', ram: 'ram-1', gpu: 'gpu-2',
      ssd: 'ssd-2', psu: 'psu-2', case: 'case-2', cooler: 'cooler-2',
    },
  },
  flagship: {
    label: '4K 旗舰',
    picks: {
      cpu: 'cpu-4', board: 'board-4', ram: 'ram-2', gpu: 'gpu-4',
      ssd: 'ssd-3', psu: 'psu-3', case: 'case-3', cooler: 'cooler-3',
    },
  },
  office: {
    label: '办公静音',
    picks: {
      cpu: 'cpu-5', board: 'board-3', ram: 'ram-1', gpu: 'gpu-0',
      ssd: 'ssd-1', psu: 'psu-1', case: 'case-1', cooler: 'cooler-1',
    },
  },
};

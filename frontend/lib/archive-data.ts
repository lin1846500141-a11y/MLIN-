import type { WikiItem } from './types'

export const wikiFallback: WikiItem[] = [
  {
    index: '01',
    title: 'Coastal Editorial',
    desc: '以海岸、天空和留白建立视觉空间，用编辑设计的秩序组织数字内容。',
    tag: 'VISUAL',
  },
  {
    index: '02',
    title: 'Motion Grammar',
    desc: '滚动负责叙事，悬停负责反馈；动效始终服务于阅读节奏。',
    tag: 'MOTION',
  },
  {
    index: '03',
    title: 'Interface Systems',
    desc: '把页面拆解为可复用的网格、字体、颜色与交互规则。',
    tag: 'SYSTEM',
  },
  {
    index: '04',
    title: 'PC Hardware',
    desc: '根据实际用途搭配硬件，并完成台式机整机装配。',
    tag: 'HARDWARE',
  },
  {
    index: '05',
    title: 'SMT Equipment',
    desc: '生产设备操作经验，包括松下、西门子与富士贴片机。',
    tag: 'EQUIPMENT',
  },
  {
    index: '06',
    title: 'AI Development',
    desc: '持续学习并实践 AI 辅助开发，把想法转化为可运行的作品。',
    tag: 'RESEARCH',
  },
]

export const capabilityNotes = [
  {
    no: '01',
    kicker: 'DIGITAL / INTERFACE',
    title: 'BUILDING\nSYSTEMS',
    body: '把视觉概念转化为可以运行、可以维护，也可以继续生长的界面系统。',
    meta: 'NEXT.JS · MOTION · UI',
  },
  {
    no: '02',
    kicker: 'PHYSICAL / MACHINE',
    title: 'OPERATING\nMACHINES',
    body: '来自硬件装配与生产设备的经验，让设计不只停留在屏幕表面。',
    meta: 'PC · SMT · DIE BONDER',
  },
  {
    no: '03',
    kicker: 'ONGOING / PRACTICE',
    title: 'RECORDING\nPROCESS',
    body: 'MLIN Wiki 是持续更新的个人索引：记录判断、过程和仍未完成的实验。',
    meta: 'WIKI · NOTES · ARCHIVE',
  },
]

import type { Experiment } from "@/types";

export const PHYSICS_EXPERIMENTS: Experiment[] = [
  {
    id: "refraction",
    name: "光的折射",
    scientist: "斯涅尔",
    description: "拖动激光束，观察光线从空气进入水中时的折射现象",
    icon: "sun",
  },
  {
    id: "circuit",
    name: "串联与并联电路",
    scientist: "欧姆",
    description: "拖拽导线和灯泡，搭建不同的电路并观察灯泡亮度",
    icon: "zap",
  },
  {
    id: "buoyancy",
    name: "阿基米德原理",
    scientist: "阿基米德",
    description: "将物体浸入水中，观察浮力与排开水体积的关系",
    icon: "waves",
  },
  {
    id: "convex-lens",
    name: "凸透镜成像",
    scientist: "开普勒",
    description: "拖动蜡烛改变物距，观察光屏上像的大小和虚实变化",
    icon: "camera",
  },
];

export const CHEMISTRY_EXPERIMENTS: Experiment[] = [
  {
    id: "oxygen",
    name: "实验室制取氧气",
    scientist: "拉瓦锡",
    description: "组装装置，加热高锰酸钾，观察气泡和带火星木条复燃",
    icon: "flame",
  },
  {
    id: "co2",
    name: "CO₂制取与检验",
    scientist: "布莱克",
    description: "滴加稀盐酸于大理石，观察石灰水变浑浊",
    icon: "beaker",
  },
  {
    id: "metal-acid",
    name: "金属与酸的反应",
    scientist: "贝采里乌斯",
    description: "将不同金属放入稀盐酸，比较气泡产生速率",
    icon: "test-tube",
  },
  {
    id: "titration",
    name: "酸碱中和滴定",
    scientist: "阿伦尼乌斯",
    description: "逐滴加入酸液，观察指示剂颜色渐变和pH变化",
    icon: "droplet",
  },
];

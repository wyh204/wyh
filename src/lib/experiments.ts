import type { Experiment } from "@/types";

export const PHYSICS_EXPERIMENTS: Experiment[] = [
  {
    id: "refraction",
    name: "光的折射",
    scientist: "斯涅尔",
    description: "拖动激光束，观察光线从空气进入水中时的折射现象",
    icon: "sun",
    difficulty: "入门级",
    url: "https://wuli.wkepu.com/3.html",
  },
  {
    id: "boiling-water",
    name: "水的沸腾",
    scientist: "摄尔修斯",
    description: "加热烧杯中的水，观察温度变化和水沸腾时的气泡现象",
    icon: "flame",
    difficulty: "入门级",
    url: "https://wuli.wkepu.com/19.html",
  },
  {
    id: "buoyancy",
    name: "阿基米德原理",
    scientist: "阿基米德",
    description: "将物体浸入水中，观察浮力与排开水体积的关系",
    icon: "waves",
    difficulty: "入门级",
    url: "https://wuli.wkepu.com/10.html",
  },
  {
    id: "convex-lens",
    name: "凸透镜成像",
    scientist: "开普勒",
    description: "拖动蜡烛改变物距，观察光屏上像的大小和虚实变化",
    icon: "camera",
    difficulty: "进阶级",
    url: "https://wuli.wkepu.com/4.html",
  },
];

export const CHEMISTRY_EXPERIMENTS: Experiment[] = [
  {
    id: "solution-prep", name: "配制一定溶质质量分数的溶液", scientist: "莫尔",
    description: "使用天平称量固体药品，用量筒量取水，配制指定浓度的溶液",
    icon: "beaker", difficulty: "入门级",
    url: "https://chemcollective.org/vlab/vlab.php",
  },
  {
    id: "oxygen", name: "制取氧气", scientist: "普里斯特利",
    description: "使用过氧化氢溶液和二氧化锰催化剂，在实验室中制取并收集氧气",
    icon: "wind", difficulty: "入门级",
    url: "https://chemcollective.org/vlab/vlab.php",
  },
  {
    id: "ph-test", name: "用pH试纸测溶液酸碱性", scientist: "阿伦尼乌斯",
    description: "将不同溶液滴在pH试纸上，观察颜色变化并判断酸碱性",
    icon: "droplet", difficulty: "入门级",
    url: "https://chemcollective.org/vlab/vlab.php",
  },
  {
    id: "titration", name: "酸碱中和滴定", scientist: "阿伦尼乌斯",
    description: "逐滴加入酸液，观察指示剂颜色渐变和pH变化，找到滴定终点",
    icon: "test-tube", difficulty: "进阶级",
    url: "https://chemcollective.org/activities/type_page/1",
  },
];

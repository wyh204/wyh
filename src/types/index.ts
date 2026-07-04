// ============ 学科标识 ============
export type Subject = "yuwen" | "math" | "english" | "physics" | "chemistry";

// ============ 语文 ============
export type YuwenMode = "modern" | "classical" | "essay" | "fun";

export interface YuwenRequest {
  mode: YuwenMode;
  input: string;
}

export interface EssayHook {
  hookText: string;
  styleTag: string;
  clickBaitScore: number;
  reason: string;
}

// 生字信息
export interface CharacterInfo {
  char: string;
  pinyin: string;
  definition: string;
  words: string[];
  strokeCount?: number;
  radical?: string;
}

// 学习进度
export interface LearningProgress {
  totalSections: number;
  completedSections: number;
  stars: number;
  currentText?: string;
}

// 学习笔记
export interface StudyNote {
  id: string;
  content: string;
  timestamp: number;
  relatedText?: string;
  color?: string;
}

// 趣味拓展内容
export interface FunContent {
  type: "story" | "game" | "idiom";
  title: string;
  description: string;
  content?: string;
  characters?: CharacterInfo[];
  gameType?: "match" | "fill" | "choose";
}

// 快捷提问
export interface QuickAction {
  icon: string;
  label: string;
  prompt: string;
  color: string;
}

// ============ 数学 ============
export interface MathRequest {
  question: string;
  image?: string; // base64 图片数据
}

// 图片上传状态
export type ImageUploadStatus = "idle" | "selected" | "uploading" | "recognized" | "error";

// 图片状态
export interface MathImageState {
  status: ImageUploadStatus;
  file: File | null;
  previewUrl: string | null;
  recognizedText: string | null;
  errorMessage?: string;
}

// 解题步骤
export interface MathSolveSection {
  title: string;
  icon: string;
  content: string;
  color: string;
}

// ============ 英语 ============
export type EnglishMode = "grammar" | "essay";

export interface EnglishRequest {
  mode: EnglishMode;
  input: string;
}

export interface EnglishHook {
  hookText: string;
  styleTag: string;
  clickBaitScore: number;
  reason: string;
}

// ============ 实验 ============
export interface Experiment {
  id: string;
  name: string;
  scientist: string;
  description: string;
  icon: string;
  difficulty?: "入门级" | "进阶级" | "挑战级";
  url?: string;
}

// 实验步骤
export interface ExperimentStep {
  step: number;
  title: string;
  instruction: string;
  icon: string;
}

// 实验测验题
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

// ============ 历史 & 收藏 ============
export interface HistoryItem {
  id: string;
  subject: Subject;
  mode?: string;
  input: string;
  output: unknown;
  timestamp: number;
}

export interface FavoriteItem extends HistoryItem {}

// ============ API 通用 ============
export interface ApiErrorResponse {
  error: string;
  code: "NO_API_KEY" | "AI_ERROR" | "TIMEOUT" | "INVALID_REQUEST";
}

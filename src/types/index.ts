// ============ 学科标识 ============
export type Subject = "yuwen" | "math" | "english" | "physics" | "chemistry";

// ============ 语文 ============
export type YuwenMode = "modern" | "classical" | "essay";

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

// ============ 数学 ============
export interface MathRequest {
  question: string;
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

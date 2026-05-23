import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { mathPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.question) {
      return NextResponse.json(
        { error: "请输入数学题目", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }
    if (body.question.length > 1000) {
      return NextResponse.json(
        { error: "题目过长，请控制在1000字以内", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }

    const { system, user } = mathPrompt(body.question);
    const responseText = await callDeepSeek(system, user);
    return NextResponse.json({ data: { raw: responseText } });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NO_API_KEY") {
        return NextResponse.json({ error: "API Key 未配置", code: "NO_API_KEY" }, { status: 503 });
      }
      if (e.message === "TIMEOUT") {
        return NextResponse.json({ error: "AI 响应超时，请重试", code: "TIMEOUT" }, { status: 504 });
      }
    }
    return NextResponse.json({ error: "AI 服务异常，请稍后重试", code: "AI_ERROR" }, { status: 500 });
  }
}

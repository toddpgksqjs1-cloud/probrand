import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hyun-dev-secret";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "이메일, 비밀번호, 이름은 필수입니다." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = Date.now().toString(36) + Math.random().toString(36).substring(2, 10);

    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ hashedPassword, token, userId });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

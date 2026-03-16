import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hyun-dev-secret";

export async function POST(req: NextRequest) {
  try {
    const { email, password, storedHash } = await req.json();

    if (!email || !password || !storedHash) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    const isValid = await bcrypt.compare(password, storedHash);

    if (!isValid) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

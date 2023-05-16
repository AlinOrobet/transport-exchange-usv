import {NextResponse} from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const verifyCode = body.verifyEmail;
  const code = body.code;
  if (!verifyCode || !code) {
    return NextResponse.error();
  }
  if (verifyCode !== code) {
    return NextResponse.error();
  }
  return NextResponse.json(body);
}

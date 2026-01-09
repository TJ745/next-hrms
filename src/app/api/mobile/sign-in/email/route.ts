import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.email || !body.password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const result = await auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
      },
    });

    return NextResponse.json({
      token: result.token,
      user: result.user,
    //   expiresAt: result.session?.expiresAt,
    });
  } catch (err) {
    if (err instanceof APIError) {
      return NextResponse.json(
        {
          code: err.body?.code ?? "UNKNOWN",
          message: err.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

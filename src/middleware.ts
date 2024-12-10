import { NextRequest, NextResponse } from "next/server";
import { createNextAuthMiddleware } from "nextjs-basic-auth-middleware";

const options = { users: [{ name: "everfit", password: "T0g3th3r2024" }] };

export const middleware = (req: NextRequest) => {
  const isIgnorePath = req.nextUrl.pathname.startsWith("/healthcheck");
  if (!isIgnorePath && process.env.NEXT_PUBLIC_APP_ENABLE_BASIC_AUTH === "true")
    return createNextAuthMiddleware(options)(req);
  return NextResponse.next();
};

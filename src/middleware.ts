import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getNeonAuthOrNull } from "@/lib/auth";

const PROTECTED_PREFIXES = ["/dashboard", "/vendas", "/custos", "/historico"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }
  const auth = getNeonAuthOrNull();
  if (!auth) {
    return NextResponse.next();
  }
  const run = auth.middleware({ loginUrl: "/login" });
  return run(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/vendas/:path*", "/custos/:path*", "/historico/:path*"],
};

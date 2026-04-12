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
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  const run = auth.middleware({ loginUrl: loginUrl.toString() });
  return run(request);
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/vendas",
    "/vendas/:path*",
    "/custos",
    "/custos/:path*",
    "/historico",
    "/historico/:path*",
  ],
};

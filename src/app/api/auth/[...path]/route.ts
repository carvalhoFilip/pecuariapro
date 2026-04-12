import { getNeonAuthOrNull } from "@/lib/auth";

function respostaAuthIndisponivel() {
  return Response.json(
    { mensagem: "Defina NEON_AUTH_BASE_URL e NEON_AUTH_COOKIE_SECRET (32+ caracteres) no ambiente." },
    { status: 503 },
  );
}

type RouteCtx = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, ctx: RouteCtx) {
  const auth = getNeonAuthOrNull();
  if (!auth) return respostaAuthIndisponivel();
  const { GET } = auth.handler();
  const params = await ctx.params;
  return GET(request, { params: Promise.resolve({ path: params.path }) });
}

export async function POST(request: Request, ctx: RouteCtx) {
  const auth = getNeonAuthOrNull();
  if (!auth) return respostaAuthIndisponivel();
  const { POST } = auth.handler();
  const params = await ctx.params;
  return POST(request, { params: Promise.resolve({ path: params.path }) });
}

export async function PUT(request: Request, ctx: RouteCtx) {
  const auth = getNeonAuthOrNull();
  if (!auth) return respostaAuthIndisponivel();
  const { PUT } = auth.handler();
  const params = await ctx.params;
  return PUT(request, { params: Promise.resolve({ path: params.path }) });
}

export async function DELETE(request: Request, ctx: RouteCtx) {
  const auth = getNeonAuthOrNull();
  if (!auth) return respostaAuthIndisponivel();
  const { DELETE } = auth.handler();
  const params = await ctx.params;
  return DELETE(request, { params: Promise.resolve({ path: params.path }) });
}

export async function PATCH(request: Request, ctx: RouteCtx) {
  const auth = getNeonAuthOrNull();
  if (!auth) return respostaAuthIndisponivel();
  const { PATCH } = auth.handler();
  const params = await ctx.params;
  return PATCH(request, { params: Promise.resolve({ path: params.path }) });
}

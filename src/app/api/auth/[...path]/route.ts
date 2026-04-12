import { getNeonAuthOrNull } from "@/lib/auth";

function respostaAuthIndisponivel() {
  return Response.json(
    { mensagem: "Defina NEON_AUTH_BASE_URL e NEON_AUTH_COOKIE_SECRET (32+ caracteres) no ambiente." },
    { status: 503 },
  );
}

type RouteCtx = { params: { path: string[] } };

export async function GET(request: Request, ctx: RouteCtx) {
  const auth = getNeonAuthOrNull();
  if (!auth) return respostaAuthIndisponivel();
  const { GET } = auth.handler();
  return GET(request, { params: Promise.resolve({ path: ctx.params.path }) });
}

export async function POST(request: Request, ctx: RouteCtx) {
  const auth = getNeonAuthOrNull();
  if (!auth) return respostaAuthIndisponivel();
  const { POST } = auth.handler();
  return POST(request, { params: Promise.resolve({ path: ctx.params.path }) });
}

export async function PUT(request: Request, ctx: RouteCtx) {
  const auth = getNeonAuthOrNull();
  if (!auth) return respostaAuthIndisponivel();
  const { PUT } = auth.handler();
  return PUT(request, { params: Promise.resolve({ path: ctx.params.path }) });
}

export async function DELETE(request: Request, ctx: RouteCtx) {
  const auth = getNeonAuthOrNull();
  if (!auth) return respostaAuthIndisponivel();
  const { DELETE } = auth.handler();
  return DELETE(request, { params: Promise.resolve({ path: ctx.params.path }) });
}

export async function PATCH(request: Request, ctx: RouteCtx) {
  const auth = getNeonAuthOrNull();
  if (!auth) return respostaAuthIndisponivel();
  const { PATCH } = auth.handler();
  return PATCH(request, { params: Promise.resolve({ path: ctx.params.path }) });
}

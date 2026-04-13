import { NextResponse } from "next/server";

type MetricPayload = {
  id?: string;
  name?: string;
  value?: number;
  label?: string;
  url?: string;
};

export async function POST(request: Request) {
  try {
    const metric = (await request.json()) as MetricPayload;
    if (!metric?.name) return NextResponse.json({ ok: false }, { status: 400 });

    console.info("[web-vitals]", {
      name: metric.name,
      value: metric.value,
      label: metric.label,
      path: metric.url,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

import { Loader2 } from "lucide-react";

export default function RegisterLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-4 py-3 sm:py-6">
      <div role="status" aria-live="polite" aria-busy="true">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-700" aria-hidden />
      </div>
    </div>
  );
}

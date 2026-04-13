import { getNeonAuthOrNull } from "@/lib/auth";
import { SignInPanel } from "./SignInPanel";

export const metadata = {
  title: "Entrar | Pecuária Pro",
};

export default function LoginPage() {
  const configured = getNeonAuthOrNull() !== null;

  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-4 py-3 sm:py-6">
      <SignInPanel configured={configured} />
    </div>
  );
}

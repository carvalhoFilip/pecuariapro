import { getNeonAuthOrNull } from "@/lib/auth";
import { SignInPanel } from "./SignInPanel";

export const metadata = {
  title: "Entrar | Pecuária Pro",
};

export default function LoginPage() {
  const configured = getNeonAuthOrNull() !== null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-8">
      <SignInPanel configured={configured} />
    </div>
  );
}

import { getNeonAuthOrNull } from "@/lib/auth";
import { SignUpPanel } from "./SignUpPanel";

export const metadata = {
  title: "Criar conta | Pecuária Pro",
};

export default function RegisterPage() {
  const configured = getNeonAuthOrNull() !== null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-8">
      <SignUpPanel configured={configured} />
    </div>
  );
}

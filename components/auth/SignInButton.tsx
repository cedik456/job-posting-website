import type { ComponentType } from "react";

type SignInButtonProps = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  providerName: string;
  action: () => Promise<void>;
};

export default function SignInButton({
  icon: Icon,
  providerName,
  action,
}: SignInButtonProps) {
  return (
    <form action={action} className="mt-8">
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-600 bg-gray-900 px-4 py-3.5 text-sm font-medium text-gray-100 transition hover:bg-gray-950"
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden={true} />
        <span>Continue with {providerName}</span>
      </button>
    </form>
  );
}

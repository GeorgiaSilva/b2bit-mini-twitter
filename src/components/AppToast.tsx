import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

type AppToastProps = {
  open: boolean;
  message: string | null;
  variant?: "success" | "error" | "info";
  onClose: () => void;
  className?: string;
};

export const AppToast = ({
  open,
  message,
  variant = "info",
  onClose,
  className = "",
}: AppToastProps) => {
  if (!open || !message) return null;

  const toneClass =
    variant === "success"
      ? "border-emerald-400/45 text-emerald-100 shadow-[0_8px_30px_rgba(16,185,129,0.25)]"
      : variant === "error"
        ? "border-red-400/45 text-red-100 shadow-[0_8px_30px_rgba(239,68,68,0.25)]"
        : "border-sky-400/45 text-sky-100 shadow-[0_8px_30px_rgba(14,165,233,0.25)]";

  const Icon =
    variant === "success" ? CheckCircle2 : variant === "error" ? AlertTriangle : Info;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`fixed right-4 top-20 z-[60] w-[min(92vw,420px)] rounded-xl border bg-[#10182B]/92 backdrop-blur-md px-4 py-3 ${toneClass} ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className="mt-0.5 shrink-0" />
        <p className="text-sm leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Fechar notificacao"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

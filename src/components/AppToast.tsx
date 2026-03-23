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
      ? "border-emerald-400/45 text-emerald-100 "
      : variant === "error"
        ? "border-red-400/45 text-red-100 "
        : "border-sky-400/45 text-sky-100 ";

  const Icon =
    variant === "success" ? CheckCircle2 : variant === "error" ? AlertTriangle : Info;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`fixed right-4 top-10 z-60  rounded-xl border bg-(--card-bg) backdrop-blur-md px-4 py-3 ${toneClass} ${className}`}
    >
      <div className="flex items-center  gap-3 text-(--text)">
        <Icon size={18} className="" />
        <p className=" text-(--text) text-sm">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-md p-1 text-(--text)"
          aria-label="Fechar notificação"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

import { AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null;

  return (
    <section className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-[#10182B] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <div className="mb-3 flex items-center gap-2 text-red-300">
          <AlertTriangle size={18} />
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        {description && <p className="text-sm text-[#9FAAB8]">{description}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-600 px-4 py-2 text-sm text-[#C7D2E0] hover:bg-white/5 transition-colors"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Excluindo..." : confirmText}
          </button>
        </div>
      </div>
    </section>
  );
};

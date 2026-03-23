type PostTitleModalProps = {
  open: boolean;
  title: string;
  isSubmitting: boolean;
  onClose: () => void;
  onTitleChange: (value: string) => void;
  onConfirm: () => void;
};

export const PostTitleModal = ({
  open,
  title,
  isSubmitting,
  onClose,
  onTitleChange,
  onConfirm,
}: PostTitleModalProps) => {
  if (!open) return null;

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm();
        }}
        className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-(--bg) p-5 shadow-xl"
      >
        <h2 className="text-lg font-semibold mb-3">Título do post</h2>
        <input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-(--card-bg) p-2 outline-none"
          placeholder="Digite um título"
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-md bg-(--blue) px-4 py-2 text-white disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Postando..." : "Confirmar"}
          </button>
        </div>
      </form>
    </section>
  );
};

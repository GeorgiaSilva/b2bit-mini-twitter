import type { FormEvent } from "react";
import type { UpdatePostData } from "../../types/posts";

type EditPostModalProps = {
  open: boolean;
  editForm: UpdatePostData;
  isSubmitting: boolean;
  onClose: () => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onImageChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const EditPostModal = ({
  open,
  editForm,
  isSubmitting,
  onClose,
  onTitleChange,
  onContentChange,
  onImageChange,
  onSubmit,
}: EditPostModalProps) => {
  if (!open) return null;

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-xl rounded-lg border border-gray-300 dark:border-gray-600 bg-(--bg) p-5 shadow-xl"
      >
        <h2 className="text-lg font-semibold mb-4">Editar post</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editForm.title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-(--card-bg) p-2 outline-none"
            placeholder="Titulo"
          />
          <textarea
            value={editForm.content}
            onChange={(event) => onContentChange(event.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-(--card-bg) p-2 outline-none min-h-24"
            placeholder="Conteudo"
          />
          <input
            type="url"
            value={editForm.image || ""}
            onChange={(event) => onImageChange(event.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-(--card-bg) p-2 outline-none"
            placeholder="URL da imagem (opcional)"
          />
        </div>
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
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </section>
  );
};

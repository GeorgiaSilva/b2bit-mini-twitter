import { ImagePlus } from "lucide-react";
import type { FormEvent } from "react";
import type { CreatePostData } from "../../types/posts";

type PostComposerProps = {
  createForm: CreatePostData;
  showImageField: boolean;
  isSubmitting: boolean;
  onToggleImageField: () => void;
  onContentChange: (value: string) => void;
  onImageChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const PostComposer = ({
  createForm,
  showImageField,
  isSubmitting,
  onToggleImageField,
  onContentChange,
  onImageChange,
  onSubmit,
}: PostComposerProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-(--card-bg) flex flex-col gap-3 p-3"
    >
      <textarea
        value={createForm.content}
        onChange={(event) => onContentChange(event.target.value)}
        placeholder="E ai, o que esta rolando?"
        className="w-full bg-transparent p-2 outline-none min-h-20 resize-none"
      />
      {showImageField && (
        <input
          type="url"
          value={createForm.image || ""}
          onChange={(event) => onImageChange(event.target.value)}
          placeholder="URL da imagem (opcional)"
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 outline-none"
        />
      )}
      <div className="flex items-center justify-between border-t border-gray-300 dark:border-gray-600 pt-2">
        <button
          type="button"
          onClick={onToggleImageField}
          className="rounded-md p-2 text-(--blue) hover:bg-white/5 transition-colors"
          aria-label="Adicionar imagem"
        >
          <ImagePlus size={18} />
        </button>
        <button
          type="submit"
          className="rounded-full bg-(--blue) px-5 py-1.5 text-white text-sm transition-opacity disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Postando..." : "Postar"}
        </button>
      </div>
    </form>
  );
};

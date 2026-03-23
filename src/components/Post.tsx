
import { Heart, Pencil, Trash2 } from "lucide-react";
import type { PostType } from "../types/posts";

type PostProps = PostType & {
  currentUserId?: string | number;
  onLike?: (postId: string) => void;
  onEdit?: (post: PostType) => void;
  onDelete?: (postId: string) => void;
};

export const Post = ({
  id,
  title,
  content,
  image,
  authorName,
  likesCount,
  createdAt,
  authorId,
  onLike,
  onEdit,
  onDelete,
  currentUserId,
}: PostProps) => {
  const isOwner = String(authorId) === String(currentUserId);
  return (
    <main className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg text-(--text) dark:text-white shadow-sm bg-(--card-bg)">
        <div className="flex gap-4 items-center">
            <h5 className="text-lg font-semibold">{authorName}</h5>
            <span className="text-gray-500">{new Date(createdAt).toLocaleString("pt-BR")}</span>
        </div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-(--text)">{content}</p>
      {( image) && (
        <img
          src={ image}
          alt={title}
          className="mt-3 w-full rounded-md  object-cover max-h-80"
        />
      )}
      <footer className="mt-2 flex items-center justify-between">
        <button
          className="flex items-center gap-1 text-sm transition-colors hover:text-red-400"
          onClick={() => onLike?.(String(id))}
          type="button"
          aria-label="Curtir post"
        >
          <Heart size={16} />
          <span>{likesCount}</span>
        </button>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() =>
                onEdit?.({
                  id,
                  title,
                  content,
                  image,
                  authorName,
                  likesCount,
                  createdAt,
                  authorId,
                })
              }
              type="button"
            >
              <Pencil size={16} />
            </button>
            <button
              className="p-2 rounded-md hover:bg-red-500/20 transition-colors"
              onClick={() => onDelete?.(String(id))}
              type="button"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </footer>
    </main>
  )
}

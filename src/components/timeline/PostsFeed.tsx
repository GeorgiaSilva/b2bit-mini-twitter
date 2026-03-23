import { Post } from "../Post";
import type { RefObject } from "react";
import type { PostType } from "../../types/posts";

type PostsFeedProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  posts: PostType[];
  currentUserId?: string | number;
  onLike: (postId: string) => void;
  onEdit: (post: PostType) => void;
  onDelete: (postId: string) => void;
  isFetchingNextPage: boolean;
  loadMoreRef: RefObject<HTMLDivElement | null>;
};

export const PostsFeed = ({
  isLoading,
  isError,
  error,
  posts,
  currentUserId,
  onLike,
  onEdit,
  onDelete,
  isFetchingNextPage,
  loadMoreRef,
}: PostsFeedProps) => {
  if (isLoading) return <p>Carregando posts...</p>;

  if (isError) {
    return (
      <p className="text-red-400">
        Erro ao carregar posts: {error instanceof Error ? error.message : "Erro desconhecido"}
      </p>
    );
  }

  if (posts.length === 0) return <p>Nenhum post encontrado.</p>;

  return (
    <>
      {posts.map((post) => (
        <Post
          key={post.id}
          {...post}
          currentUserId={currentUserId}
          onLike={onLike}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      <div ref={loadMoreRef} className="h-8" />
      {isFetchingNextPage && <p>Carregando mais...</p>}
    </>
  );
};

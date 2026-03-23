import { useEffect, useRef, useState, type FormEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Post } from "../components/Post";
import { AppToast } from "../components/AppToast";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { getToken, logout } from "../services/auth.service";
import {
  useCreatePost,
  useDeletePost,
  useInfinitePosts,
  useLikePost,
  useUpdatePost,
} from "../hooks/usePosts";
import type { CreatePostData, PostType, UpdatePostData } from "../types/posts";

export const Timeline = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = user?.id;
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()));

  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showImageField, setShowImageField] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreatePostData>({
    title: "",
    content: "",
    image: "",
  });
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [editForm, setEditForm] = useState<UpdatePostData>({
    title: "",
    content: "",
    image: "",
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    postsFlattened,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfinitePosts(search);

  const createMutation = useCreatePost(search);
  const updateMutation = useUpdatePost(search);
  const deleteMutation = useDeletePost(search);
  const likeMutation = useLikePost(search);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!actionSuccess) return;
    const timer = setTimeout(() => setActionSuccess(null), 2500);
    return () => clearTimeout(timer);
  }, [actionSuccess]);

  useEffect(() => {
    if (!actionError) return;
    const timer = setTimeout(() => setActionError(null), 4000);
    return () => clearTimeout(timer);
  }, [actionError]);

  const getStatusCodeFromError = (unknownError: unknown): number | null => {
    if (!(unknownError instanceof Error)) return null;
    const cause = unknownError.cause as { response?: { status?: number } } | undefined;
    return cause?.response?.status ?? null;
  };

  const onLogout = async () => {
    try {
      setActionError(null);
      await logout();
      setIsAuthenticated(false);
      setActionSuccess("Sessao encerrada. A timeline continua publica.");
    } catch (logoutError) {
      console.error("Logout failed", logoutError);
      setActionError("Falha ao fazer logout.");
    }
  };

  const onCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!createForm.content.trim()) {
      setActionError("Escreva algo para postar.");
      return;
    }

    if (!createForm.title.trim()) {
      setShowTitleModal(true);
      return;
    }

    await submitCreatePost();
  };

  const submitCreatePost = async () => {
    try {
      setActionError(null);
      await createMutation.mutateAsync({
        title: createForm.title.trim(),
        content: createForm.content.trim(),
        image: createForm.image?.trim() || undefined,
      });
      setActionSuccess("Post criado com sucesso.");
      setCreateForm({ title: "", content: "", image: "" });
      setShowImageField(false);
      setShowTitleModal(false);
    } catch (createError) {
      setActionError(createError instanceof Error ? createError.message : "Falha ao criar post.");
    }
  };

  const onDelete = (postId: string) => {
    setDeletePostId(postId);
  };

  const onConfirmDelete = async () => {
    if (!deletePostId) return;
    try {
      setActionError(null);
      await deleteMutation.mutateAsync(deletePostId);
      setActionSuccess("Post excluido com sucesso.");
      setDeletePostId(null);
    } catch (deleteError) {
      const statusCode = getStatusCodeFromError(deleteError);
      if (statusCode === 403) {
        setActionError("Voce nao tem permissao para excluir esse post.");
      } else {
        setActionError(deleteError instanceof Error ? deleteError.message : "Falha ao excluir post.");
      }
    }
  };

  const onLike = async (postId: string) => {
    try {
      setActionError(null);
      await likeMutation.mutateAsync(postId);
      setActionSuccess("Like atualizado.");
    } catch (likeError) {
      setActionError(likeError instanceof Error ? likeError.message : "Falha ao curtir post.");
    }
  };

  const onEdit = (post: PostType) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      content: post.content,
      image: post.image || "",
    });
  };

  const onUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingPost) return;
    if (!editForm.title.trim() || !editForm.content.trim()) {
      setActionError("Titulo e conteudo sao obrigatorios.");
      return;
    }

    try {
      setActionError(null);
      await updateMutation.mutateAsync({
        id: String(editingPost.id),
        data: {
          title: editForm.title.trim(),
          content: editForm.content.trim(),
          image: editForm.image?.trim() || undefined,
        },
      });
      setEditingPost(null);
      setActionSuccess("Post atualizado com sucesso.");
    } catch (updateError) {
      const statusCode = getStatusCodeFromError(updateError);
      if (statusCode === 403) {
        setActionError("Voce nao tem permissao para editar esse post.");
      } else {
        setActionError(updateError instanceof Error ? updateError.message : "Falha ao editar post.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)" style={{ backgroundImage: "var(--bg-gradient)" }}>
      <Navbar
        onLogout={onLogout}
        search={search}
        onSearchChange={setSearch}
        isAuthenticated={isAuthenticated}
      />
      <AppToast
        open={Boolean(actionError)}
        message={actionError}
        variant="error"
        onClose={() => setActionError(null)}
      />
      <AppToast
        open={Boolean(actionSuccess)}
        message={actionSuccess}
        variant="success"
        onClose={() => setActionSuccess(null)}
        className="top-[152px]"
      />

      <section className="flex w-full justify-center pt-24 px-4">
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          <form
            onSubmit={onCreateSubmit}
            className="border border-gray-700 rounded-lg shadow-sm bg-(--card-bg) flex flex-col gap-3 p-3"
          >
            <textarea
              value={createForm.content}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, content: event.target.value }))
              }
              placeholder="E ai, o que esta rolando?"
              className="w-full bg-transparent p-2 outline-none min-h-20 resize-none"
            />
            {showImageField && (
              <input
                type="url"
                value={createForm.image || ""}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, image: event.target.value }))
                }
                placeholder="URL da imagem (opcional)"
                className="w-full rounded-md border border-gray-600 bg-transparent p-2 outline-none"
              />
            )}
            <div className="flex items-center justify-between border-t border-gray-700 pt-2">
              <button
                type="button"
                onClick={() => setShowImageField((prev) => !prev)}
                className="rounded-md p-2 text-(--blue) hover:bg-white/5 transition-colors"
                aria-label="Adicionar imagem"
              >
                <ImagePlus size={18} />
              </button>
              <button
                type="submit"
                className="rounded-full bg-(--blue) px-5 py-1.5 text-white text-sm transition-opacity disabled:opacity-60"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Postando..." : "Postar"}
              </button>
            </div>
          </form>

          {isLoading && <p>Carregando posts...</p>}
          {isError && (
            <p className="text-red-400">
              Erro ao carregar posts: {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          )}

          {!isLoading && !isError && postsFlattened.length === 0 && (
            <p>Nenhum post encontrado.</p>
          )}

          {postsFlattened.map((post) => (
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
        </div>
      </section>

      {editingPost && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <form
            onSubmit={onUpdateSubmit}
            className="w-full max-w-xl rounded-lg border border-gray-700 bg-(--bg) p-5 shadow-xl"
          >
            <h2 className="text-lg font-semibold mb-4">Editar post</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={editForm.title}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="w-full rounded-md border border-gray-600 bg-(--card-bg) p-2 outline-none"
                placeholder="Titulo"
              />
              <textarea
                value={editForm.content}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, content: event.target.value }))
                }
                className="w-full rounded-md border border-gray-600 bg-(--card-bg) p-2 outline-none min-h-24"
                placeholder="Conteudo"
              />
              <input
                type="url"
                value={editForm.image || ""}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, image: event.target.value }))
                }
                className="w-full rounded-md border border-gray-600 bg-(--card-bg) p-2 outline-none"
                placeholder="URL da imagem (opcional)"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-gray-600 px-4 py-2"
                onClick={() => setEditingPost(null)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-(--blue) px-4 py-2 text-white disabled:opacity-60"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </section>
      )}

      {showTitleModal && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (!createForm.title.trim()) {
                setActionError("Digite um titulo para o post.");
                return;
              }
              await submitCreatePost();
            }}
            className="w-full max-w-md rounded-lg border border-gray-700 bg-(--bg) p-5 shadow-xl"
          >
            <h2 className="text-lg font-semibold mb-3">Titulo do post</h2>
            <input
              type="text"
              value={createForm.title}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className="w-full rounded-md border border-gray-600 bg-(--card-bg) p-2 outline-none"
              placeholder="Digite um titulo"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-gray-600 px-4 py-2"
                onClick={() => setShowTitleModal(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-(--blue) px-4 py-2 text-white disabled:opacity-60"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Postando..." : "Confirmar"}
              </button>
            </div>
          </form>
        </section>
      )}

      <ConfirmDialog
        open={Boolean(deletePostId)}
        title="Excluir post"
        description="Essa acao nao pode ser desfeita. Deseja continuar?"
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={deleteMutation.isPending}
        onCancel={() => setDeletePostId(null)}
        onConfirm={onConfirmDelete}
      />
    </main>
  );
};

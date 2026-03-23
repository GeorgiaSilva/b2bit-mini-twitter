import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, deletePost, getPosts, likePost, updatePost } from "../services/post.service";
import type { CreatePostData, PaginatedPosts, PostType, UpdatePostData } from "../types/posts";

export const postKeys = {
  all: ["posts"] as const,
  list: (search: string) => [...postKeys.all, { search }] as const,
};

export const useInfinitePosts = (search: string) => {
  const query = useInfiniteQuery({
    queryKey: postKeys.list(search),
    queryFn: ({ pageParam }) =>
      getPosts({
        page: Number(pageParam),
        limit: 10,
        search,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.max(1, Math.ceil(lastPage.total / lastPage.limit));
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
  });

  const postsFlattened = query.data?.pages.flatMap((page) => page.posts) ?? [];

  return {
    ...query,
    postsFlattened,
  };
};

const invalidatePostsList = async (queryClient: ReturnType<typeof useQueryClient>, search: string) => {
  await queryClient.invalidateQueries({
    queryKey: postKeys.list(search),
  });
};

export const useCreatePost = (search = "") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onSuccess: async () => {
      await invalidatePostsList(queryClient, search);
    },
  });
};

export const useUpdatePost = (search = "") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostData }) => updatePost(id, data),
    onSuccess: async () => {
      await invalidatePostsList(queryClient, search);
    },
  });
};

export const useDeletePost = (search = "") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: async () => {
      await invalidatePostsList(queryClient, search);
    },
  });
};

export const useLikePost = (search = "") => {
  const queryClient = useQueryClient();
  type InfinitePostsData = {
    pages: PaginatedPosts[];
    pageParams: number[];
  };

  return useMutation({
    mutationFn: (id: string) => likePost(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: postKeys.list(search) });
      const previousData = queryClient.getQueryData<InfinitePostsData>(postKeys.list(search));

      queryClient.setQueryData<InfinitePostsData>(postKeys.list(search), (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post: PostType) =>
              String(post.id) === String(id)
                ? {
                    ...post,
                    likedByMe: !post.likedByMe,
                    likesCount: post.likedByMe
                      ? Math.max(0, post.likesCount - 1)
                      : post.likesCount + 1,
                  }
                : post,
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(postKeys.list(search), context.previousData);
      }
    },
    onSettled: async () => {
      await invalidatePostsList(queryClient, search);
    },
  });
};

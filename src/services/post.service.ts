import axios, { isAxiosError } from "axios";
import { getToken } from "./auth.service";
import type { CreatePostData, GetPostsParams, PaginatedPosts, PostType, UpdatePostData } from "../types/posts";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const postApi = axios.create({
  baseURL: `${apiUrl}/posts`,
  headers: {
    "Content-Type": "application/json",
  },
});

postApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const resolvePostApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
  unauthenticatedMessage = "Você precisa estar logado para continuar.",
) => {
  if (isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 401) {
      return unauthenticatedMessage;
    }
    return error.response?.data?.message || fallbackMessage;
  }
  return fallbackMessage;
};

export const createPost = async (postData: CreatePostData): Promise<PostType> => {
  try {
    const response = await postApi.post("/", postData);
    return response.data;
  } catch (error) {
    throw new Error(
      resolvePostApiErrorMessage(error, "Falha ao criar post.", "Você precisa estar logado para postar."),
      { cause: error },
    );
  }
};

export const getPosts = async (params: GetPostsParams): Promise<PaginatedPosts> => {
  try {
    const response = await postApi.get("/", {
      params: {
        page: params.page,
        limit: params.limit ?? 10,
        search: params.search || undefined,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(resolvePostApiErrorMessage(error, "Falha ao carregar posts."), {
      cause: error,
    });
  }
};

export const deletePost = async (postId: string) => {
  try {
    await postApi.delete(`/${postId}`);
  } catch (error) {
    throw new Error(
      resolvePostApiErrorMessage(error, "Falha ao excluir post.", "Você precisa estar logado para excluir posts."),
      { cause: error },
    );
  }
};

export const updatePost = async (postId: string, postData: UpdatePostData): Promise<PostType> => {
  try {
    const response = await postApi.put(`/${postId}`, postData);
    return response.data;
  } catch (error) {
    throw new Error(
      resolvePostApiErrorMessage(error, "Falha ao editar post.", "Você precisa estar logado para editar posts."),
      { cause: error },
    );
  }
};

export const likePost = async (postId: string): Promise<PostType> => {
  try {
    const response = await postApi.post(`/${postId}/like`);
    return response.data;
  } catch (error) {
    throw new Error(
      resolvePostApiErrorMessage(error, "Falha ao curtir post.", "Você precisa estar logado para curtir posts."),
      { cause: error },
    );
  }
};

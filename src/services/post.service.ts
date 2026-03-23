import axios from "axios";
import { getToken } from "./auth.service";
import type { CreatePostData, GetPostsParams, PaginatedPosts, PostType, UpdatePostData } from "../types/posts";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const postApi = axios.create({
    baseURL: `${apiUrl}/posts`,
    headers: {
        'Content-Type': 'application/json',
    },
});

postApi.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createPost = async (postData: CreatePostData): Promise<PostType> => {
    try {
        const response = await postApi.post('/', postData);
        return response.data;
    } catch (error) {
        throw new Error("Failed to create post", { cause: error });
    }
};

export const getPosts = async (params: GetPostsParams): Promise<PaginatedPosts> => {
    try {
        const response = await postApi.get('/', {
            params: {
                page: params.page,
                limit: params.limit ?? 10,
                search: params.search || undefined,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch posts", { cause: error });
    }

};

export const deletePost = async (postId: string) => {
    try {
        await postApi.delete(`/${postId}`);
    } catch (error) {
        throw new Error("Failed to delete post", { cause: error });
    }
};

export const updatePost = async (postId: string, postData: UpdatePostData): Promise<PostType> => {
    try {
        const response = await postApi.put(`/${postId}`, postData);
        return response.data;
    } catch (error) {
        throw new Error("Failed to update post", { cause: error });
    }
};

export const likePost = async (postId: string): Promise<PostType> => {
    try {
        const response = await postApi.post(`/${postId}/like`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to like post", { cause: error });
    }
};

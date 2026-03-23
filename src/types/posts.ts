

export type PostType = {
	id: number | string,
	title: string,
	content: string,
	image: string,
	authorId: number | string,
	    authorName: string,
		createdAt: string
	    likesCount: number,
	    likedByMe?: boolean
}

export type PaginatedPosts = {
    posts: PostType[],
    total: number,
    page: number,
    limit: number
}
export type GetPostsParams = {
	    page: number,
	    limit?: number,
	    search?: string
}

export type CreatePostData = {
	    title: string,
	    content: string,
	    image?: string
}
export type UpdatePostData = {
	    title: string,
	    content: string,
    image?: string
}

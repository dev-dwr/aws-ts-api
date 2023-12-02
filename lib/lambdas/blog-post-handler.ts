import {APIGatewayEvent} from "aws-lambda";
import {v4 as uuid} from "uuid";
import {BlogPost} from "./BlogPost";
import {BlogPostService} from "./BlogPostService";

const TABLE_NAME = process.env.TABLE_NAME!;
const blogPostService = new BlogPostService(TABLE_NAME);
export const createBlogPostHandler = async (event: APIGatewayEvent) => {
    const blogPostData = JSON.parse(event.body!) as {
        title: string;
        author: string;
        content: string;
    }
    const id = uuid();
    const createdAt = new Date().toISOString();

    const blogPost: BlogPost = {
        id: id,
        title: blogPostData.title,
        author: blogPostData.author,
        content: blogPostData.content,
        createdAt: createdAt
    }

    await blogPostService.saveBlogPost(blogPost);

    return {
        statusCode: 201,
        body: JSON.stringify(blogPost),
    }
}


export const getBlogPostsHandler = async (event: APIGatewayEvent) => {
    const order = event?.queryStringParameters?.order!;
    let blogPosts: BlogPost[] = await blogPostService.getAllBlogPosts();
    const sortedBlogPosts = sortBlogPosts(order, blogPosts)
    return {
        statusCode: 200,
        body: JSON.stringify(sortedBlogPosts)
    }
}

function sortBlogPosts(order: string, blogPosts: BlogPost[]): BlogPost[] {
    if (order === "ASC") {
        blogPosts = blogPosts.sort(sortAscending)
    } else {
        blogPosts = blogPosts.sort(sortDescending)
    }
    return blogPosts
}

function sortAscending(blogA: BlogPost, blogB: BlogPost) {
    return blogA.createdAt.localeCompare(blogB.createdAt);
}

function sortDescending(blogA: BlogPost, blogB: BlogPost) {
    return blogB.createdAt.localeCompare(blogA.createdAt);
}


export const getBlogPostHandler = async (event: APIGatewayEvent) => {
    const id = event.pathParameters!.id!;
    const blogPost = await blogPostService.getBlogPostById(id);
    return {
        statusCode: 200,
        body: JSON.stringify(blogPost)
    }
}

export const deleteBlogPostHandler = async (event: APIGatewayEvent) => {
    const id = event.pathParameters!.id!;
    const blogPost = await blogPostService.getBlogPostById(id);
    return {
        statusCode: 204,
        body: JSON.stringify(blogPost)
    }
}
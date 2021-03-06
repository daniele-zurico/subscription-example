import { Post } from "../models/posts";


const postController = {
    posts: () => Post.find({}),
    addPost: (post: any) => {
        const newPost = new Post({author: post.author, comment: post.comment});
        return newPost.save();
    }
};

export { postController };

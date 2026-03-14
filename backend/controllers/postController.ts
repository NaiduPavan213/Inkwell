import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { PostService } from '../services/postService';

export class PostController {
    static async createPost(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const postData = {
                ...req.body,
                coverImage: req.file ? req.file.path : ''
            };
            const post = await PostService.createPost(postData, req.user!.id);
            res.status(201).json(post);
        } catch (err) {
            next(err);
        }
    }

    static async getAllPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const posts = await PostService.getAllPosts();
            res.json(posts);
        } catch (err) {
            next(err);
        }
    }

    static async getPostById(req: Request, res: Response, next: NextFunction) {
        try {
            const post = await PostService.getPostById(req.params.id as string);
            res.json(post);
        } catch (err: any) {
            if (err.message === 'Post not found') {
                return res.status(404).json({ msg: err.message });
            }
            next(err);
        }
    }

    static async updatePost(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const post = await PostService.updatePost(req.params.id as string, req.body, req.user!.id);
            res.json(post);
        } catch (err: any) {
            if (err.message === 'Post not found') return res.status(404).json({ msg: err.message });
            if (err.message === 'Not authorized') return res.status(401).json({ msg: err.message });
            next(err);
        }
    }

    static async deletePost(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await PostService.deletePost(req.params.id as string, req.user!.id);
            res.json(result);
        } catch (err: any) {
            if (err.message === 'Post not found') return res.status(404).json({ msg: err.message });
            if (err.message === 'Not authorized') return res.status(401).json({ msg: err.message });
            next(err);
        }
    }
}

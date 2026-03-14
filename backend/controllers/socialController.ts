import { Request, Response, NextFunction } from 'express';
import { SocialService } from '../services/socialService';

export class SocialController {
    static async addComment(req: Request, res: Response, next: NextFunction) {
        try {
            const comment = await SocialService.addComment(req.params.postId as string, req.user!.id, req.body.text);
            res.status(201).json(comment);
        } catch (err: any) {
            if (err.message === 'User not found') return res.status(404).json({ msg: err.message });
            next(err);
        }
    }

    static async getComments(req: Request, res: Response, next: NextFunction) {
        try {
            const comments = await SocialService.getComments(req.params.postId as string);
            res.json(comments);
        } catch (err) {
            next(err);
        }
    }

    static async toggleLike(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await SocialService.toggleLike(req.params.postId as string, req.user!.id);
            if (result.liked) {
                res.status(201).json({ msg: result.msg });
            } else {
                res.json({ msg: result.msg });
            }
        } catch (err) {
            next(err);
        }
    }

    static async getLikes(req: Request, res: Response, next: NextFunction) {
        try {
            const likes = await SocialService.getLikes(req.params.postId as string);
            res.json(likes);
        } catch (err) {
            next(err);
        }
    }
}

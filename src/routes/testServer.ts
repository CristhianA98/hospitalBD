import { Router, Request, Response } from "express";

const testRouter: Router = Router();

testRouter.get('/', (_req: Request, res: Response) => {

    const date = new Date();

    return res.status(200).json({
        ok: true,
        msg: "The server is runnig ok",
        date
    })
});

export default testRouter;
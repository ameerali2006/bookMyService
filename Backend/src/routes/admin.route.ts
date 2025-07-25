import { NextFunction, Request, Response } from "express";
import { BaseRoute } from "../routes/base.route";
import { authAdminController} from "../config/di/resolver";



export class AdminRoute extends BaseRoute {

    constructor() {
        super();
    }

    protected initializeRoutes(): void {
        this.router.post('/login', (req: Request, res: Response, next: NextFunction) => {
            authAdminController.login(req, res, next);
        })
        this.router.get('/users', (req: Request, res: Response, next: NextFunction) => {
            authAdminController.getAllUsers(req, res, next);
        })
    }
}
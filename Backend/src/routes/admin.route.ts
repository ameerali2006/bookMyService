import { NextFunction, Request, Response } from "express";
import { BaseRoute } from "../routes/base.route";
import { authAdminController,managementAdminController} from "../config/di/resolver";
import { authorizeRole, verifyAuth } from "../middleware/auth.middleware";



export class AdminRoute extends BaseRoute {

    constructor() {
        super();
    }

    protected initializeRoutes(): void {
        this.router.post('/login', (req: Request, res: Response, next: NextFunction) => {
            authAdminController.login(req, res, next);
        })
        this.router.post('/logout',verifyAuth("admin"),authorizeRole(["admin"]), (req: Request, res: Response, next: NextFunction) => {
            authAdminController.logout(req, res, next);
        })
        this.router.get('/users', (req: Request, res: Response, next: NextFunction) => {
            managementAdminController.getAllUsers(req, res, next);
        })
        this.router.patch("/users/:userId/status",(req: Request, res: Response, next: NextFunction)=>{
            managementAdminController.updateUserStatus(req,res,next)
        })
        this.router.get('/workers', (req: Request, res: Response, next: NextFunction) => {
            managementAdminController.getAllWorkers(req, res, next);
        })
        this.router.patch("/workers/:userId/status",(req: Request, res: Response, next: NextFunction)=>{
            managementAdminController.updateWorkerStatus(req,res,next)
        })
        this.router.patch("/workers/:workerId/unverified",(req:Request,res:Response,next:NextFunction)=>{
            managementAdminController.verifyWorker(req,res,next)

        })
        this.router.get("/workers/unverified",(req:Request,res:Response,next:NextFunction)=>{
            
            managementAdminController.unVerifiedWorkers(req,res,next)

        })
        
    }
}
import { Response,Request,NextFunction } from "express";
import { BaseRoute } from "./base.route.js";
import {
    authController,
    

 } from '../config/di/resolver.js' 
import { authorizeRole, verifyAuth } from "../middleware/auth.middleware.js";
 export class UserRoute extends BaseRoute{
    constructor (){
        super()
    }
    protected initializeRoutes(): void {
        this.router.post('/register',(req: Request, res: Response, next: NextFunction) =>
            authController.register(req,res,next)
        )
        this.router.post("/generate-otp",(req: Request, res: Response, next: NextFunction) =>
            authController.generateOtp(req, res, next)
        );
        this.router.post("/verify-otp", (req: Request, res: Response, next: NextFunction) =>
            authController.verifyOtp(req, res, next)
            
        );
        this.router.post("/login", (req: Request, res: Response, next: NextFunction) =>
            authController.login(req, res, next)
            
        );
         this.router.post("/google-login", (req: Request, res: Response, next: NextFunction) =>
            authController.googleLogin(req, res, next)
            
        );
        

        
        this.router.post('/logout',verifyAuth("user"),authorizeRole(["user"]),(req:Request,res:Response,next:NextFunction)=>{
            authController.logout(req,res,next)
        });
        this.router.post("/forgot-password", (req: Request, res: Response, next: NextFunction) =>
            authController.forgotPassword(req, res, next)
            
        );
        this.router.post("/reset-password", (req: Request, res: Response, next: NextFunction) =>
            authController.resetPassword(req, res, next)
            
        );
        this.router.get("/getService", (req: Request, res: Response, next: NextFunction) =>
            authController.getServices(req, res, next)
            
        );

    }
 } 
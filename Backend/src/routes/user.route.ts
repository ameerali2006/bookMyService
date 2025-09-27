import { Response,Request,NextFunction, RequestHandler } from "express";
import { BaseRoute } from "./base.route.js";
import {
    authController,
    blockStatusMiddleware,
    serviceController,
    tokenController,
    userController,
    

 } from '../config/di/resolver.js' 
import {  verifyAuth } from "../middleware/auth.middleware.js";

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
        

        
        this.router.post('/logout',verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler,(req:Request,res:Response,next:NextFunction)=>{
            authController.logout(req,res,next)
        });
        this.router.post("/forgot-password", (req: Request, res: Response, next: NextFunction) =>
            authController.forgotPassword(req, res, next)
            
        );
        this.router.post("/reset-password", (req: Request, res: Response, next: NextFunction) =>
            authController.resetPassword(req, res, next)
            
        );
        this.router.get("/getService", (req: Request, res: Response, next: NextFunction) =>
            serviceController.getServices(req, res, next)
            
        );
        this.router.post("/refresh-token", (req: Request, res: Response, next: NextFunction) =>
            tokenController.handleTokenRefresh(req, res)
                    
        );

        this.router.get('/profile/userDetails',verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) =>
            userController.userProfileDetails(req, res, next)
            
        );

    }
 } 
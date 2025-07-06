import { Response,Request,NextFunction } from "express";
import { BaseRoute } from "./base.route.js";
import {
    authController,
    

 } from '../config/di/resolver.js' 
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
    }
 } 
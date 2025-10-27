import express ,{ Response,Request,NextFunction, RequestHandler} from "express";
import { BaseRoute } from "./base.route.js";
import {
    authController,
    blockStatusMiddleware,
    bookingController,
    serviceController,
    stripeController,
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
         this.router.post("/google-login", (req: Request, res: Response, next: NextFunction) =>{
             console.log("google.login")
            authController.googleLogin(req, res, next)
         }
           
            
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
        this.router.put('/profile/updateUserDetails',verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) =>
            userController.updateProfileDetails(req, res, next)
            
        );
        this.router.get('/workers/nearby',verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) =>
            serviceController.getNearByWorkers(req, res, next)
        );
        this.router.get('/workers/availability',verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) =>
            serviceController.getWorkerAvailability(req, res, next)
        );
        this.router.get('/addresses',verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) =>
            userController.getUserAddresses(req, res, next)
        );
        this.router.post("/addAddress",verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler ,(req: Request, res: Response, next: NextFunction) =>
            userController.addUserAddress(req, res,next)
                    
        );
        this.router.put("/address/setPrimary",verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler ,(req: Request, res: Response, next: NextFunction) =>
            userController.setPrimaryAddress(req, res,next)
                            
        );
        this.router.post("/basicBookingDetails",verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler ,(req: Request, res: Response, next: NextFunction) =>
           bookingController.setBasicBookingDetails(req, res,next)
                    
        );
        this.router.get('/getBoookingDetails',verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler,(req: Request, res: Response, next: NextFunction) =>
            bookingController.getBookingDetails(req, res, next)
        );
        this.router.post("/payment/create-payment-intent",verifyAuth(),blockStatusMiddleware.checkStatus as RequestHandler ,(req: Request, res: Response, next: NextFunction) =>
          stripeController.createPaymentIntent(req, res,next)
                    
        );
        
    }
 } 
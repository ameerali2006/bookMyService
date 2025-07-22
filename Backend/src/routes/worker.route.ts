import { Response,Request,NextFunction } from "express";
import { BaseRoute } from "./base.route.js";
import { authWorkerController ,cloudinaryController} from "../config/di/resolver.js";


export class WorkerRoute extends BaseRoute{
    constructor (){
        super()
    }
    protected initializeRoutes(): void {
        this.router.post('/generate-otp',(req: Request, res: Response, next: NextFunction) =>
            authWorkerController.generateOtp(req,res,next)
            
        )
        this.router.post("/verify-otp", (req: Request, res: Response, next: NextFunction) =>
            authWorkerController.verifyOtp(req, res, next)
                    
        );
        this.router.post("/cloudinary-signature", (req: Request, res: Response, next: NextFunction) =>{
           cloudinaryController.getSignature(req ,res ,next )
            }
        );
        this.router.post("/register", (req: Request, res: Response, next: NextFunction) =>
        
            authWorkerController.register(req, res, next)
                    
        );
        this.router.post("/login", (req: Request, res: Response, next: NextFunction) =>
        
            authWorkerController.login(req, res, next)
                    
        );
    }
}
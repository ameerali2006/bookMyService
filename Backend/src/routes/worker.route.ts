import { Response, Request, NextFunction } from 'express';
import { BaseRoute } from './base.route.js';
import {
  authWorkerController, bookingController, cloudinaryController, tokenController, workerbookingController, workingDetailsController,
} from '../config/di/resolver.js';
import { authorizeRole, verifyAuth } from '../middleware/auth.middleware.js';

export class WorkerRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post('/generate-otp', (req: Request, res: Response, next: NextFunction) => authWorkerController.generateOtp(req, res, next));
    this.router.post('/verify-otp', (req: Request, res: Response, next: NextFunction) => authWorkerController.verifyOtp(req, res, next));
    this.router.post('/cloudinary-signature', (req: Request, res: Response, next: NextFunction) => {
      cloudinaryController.getSignature(req, res, next);
    });
    this.router.post('/google-auth', (req: Request, res: Response, next: NextFunction) => authWorkerController.googleAuth(req, res, next));
    this.router.post('/register', (req: Request, res: Response, next: NextFunction) => authWorkerController.register(req, res, next));
    this.router.post('/login', (req: Request, res: Response, next: NextFunction) => authWorkerController.login(req, res, next));
    this.router.post('/logout', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => authWorkerController.logout(req, res, next));
    this.router.post('/forgot-password', (req: Request, res: Response, next: NextFunction) => authWorkerController.forgotPassword(req, res, next));
    this.router.post('/reset-password', (req: Request, res: Response, next: NextFunction) => authWorkerController.resetPassword(req, res, next));
    this.router.get('/getserviceNames', (req: Request, res: Response, next: NextFunction) => cloudinaryController.getServiceNames(req, res, next));
    this.router.get('/isVerified', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => authWorkerController.isVerified(req, res, next));
    this.router.post('/refresh-token', (req: Request, res: Response, next: NextFunction) => tokenController.handleTokenRefresh(req, res));
    this.router.get('/profile/slot', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workingDetailsController.getWorkingDetails(req, res, next));
    this.router.post('/profile/slot/update', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workingDetailsController.updateWorkingDetails(req, res, next));
    this.router.get('/appointments/requestService', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workingDetailsController.getWorkingDetails(req, res, next));
    this.router.get('/profile/details', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workingDetailsController.getProfileDetails(req, res, next));
    this.router.put('/profile/update', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workingDetailsController.updateProfileDetails(req, res, next));
    this.router.put('/profile/changePassword', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workingDetailsController.changePassword(req, res, next));
    this.router.get('/calender/getData', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workingDetailsController.getCalenderDetails(req, res, next));
    this.router.put('/calender/update', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workingDetailsController.updateCalenderDetails(req, res, next));
    this.router.put('/service/approve', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workerbookingController.approveService(req, res, next));
    this.router.put('/service/reject', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workerbookingController.rejectService(req, res, next));
    this.router.get('/service/requests', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workerbookingController.getServiceRequests(req, res, next));
    this.router.get('/service/approveds', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workerbookingController.getServiceApprovals(req, res, next));
    this.router.get('/service/approveds/:bookingId', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workerbookingController.getApprovalsDetails(req, res, next));
    this.router.get('/service/reach-location/:bookingId', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workerbookingController.reachLocation(req, res, next));
    this.router.put('/service/verify-worker', verifyAuth(), authorizeRole(['worker']), (req: Request, res: Response, next: NextFunction) => workerbookingController.verifyWorker(req, res, next));

  }
}

import { container } from "tsyringe";

import { DependencyInjection } from "./index.js";

import { AuthUserController } from "../../controller/user/auth-user.js";
import { IAuthController } from "../../interface/controller/auth-user.controller.interface.js";

import {AuthAdminController} from "../../controller/admin/auth-admin.js"
import {IAdminController} from "../../interface/controller/auth-admin.controller.interface.js"



import { IWorkerAuthController } from "../../interface/controller/auth-worker.controller.interface.js";
import {AuthWorkerController} from "../../controller/worker/auth-worker.js"
import { CloudinaryController } from "../../controller/worker/helper-worker.controller.js";
import { ICloudinaryController } from "../../interface/controller/helper-worker.controller.interface.js";
import { IAdminManagementController } from "../../interface/controller/management-admin.controller.interface.js";
import { ManagementAdmin } from "../../controller/admin/management-admin.js";
import { IServiceConroller } from "../../interface/controller/services.controller.interface.js";
import { ServiceController } from "../../controller/services.controller.js";
import { ITokenController } from "../../interface/controller/token.controller.interface.js";
import { TokenController } from "../../controller/token.controller.js";
import { BlockStatusMiddleware } from "../../middleware/block-status.middleware.js";
import { IWorkingDetailsController } from "../../interface/controller/working-details.controller.interface.js";
import { WorkingDetailsController } from "../../controller/worker/working-details.controller.js";
import { IUserController } from "../../interface/controller/user-controller.controller.interface.js";
import { UserController } from "../../controller/user/user-controller.js";
import { IBookingController } from "../../interface/controller/booking-controller.controller.interface.js";
import { BookingController } from "../../controller/booking.controller.js";
import { IStripeController } from "../../interface/controller/stripe.controller.interface.js";
import { StripeController } from "../../controller/stripe.controller.js";
import { IWorkerBookingController } from "../../interface/controller/worker-booking.controller.interface.js";
import { WorkerBookingController } from "../../controller/worker/worker-booking.controller.js";

DependencyInjection.registerAll();

export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);


export const authController = container.resolve<IAuthController>(AuthUserController);
export const authAdminController=container.resolve<IAdminController>(AuthAdminController)
export const authWorkerController=container.resolve<IWorkerAuthController>(AuthWorkerController)
export const cloudinaryController = container.resolve<ICloudinaryController>(CloudinaryController);
export const managementAdminController=container.resolve<IAdminManagementController>(ManagementAdmin)
export const serviceController=container.resolve<IServiceConroller>(ServiceController)
export const tokenController=container.resolve<ITokenController>(TokenController)
export const workingDetailsController =container.resolve<IWorkingDetailsController>(WorkingDetailsController)
export const userController =container.resolve<IUserController>(UserController)
export const bookingController =container.resolve<IBookingController>(BookingController)
export const stripeController=container.resolve<IStripeController>(StripeController)
export const workerbookingController=container.resolve<IWorkerBookingController>(WorkerBookingController)


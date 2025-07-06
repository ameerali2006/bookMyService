import { container } from "tsyringe";

import { DependencyInjection } from "./index.js";

import { AuthUserController } from "../../controller/user/auth-user.js";
import { IAuthController } from "../../interface/controller/auth-user.controller.interface.js";

import {AuthAdminController} from "../../controller/admin/auth-admin.js"
import {IAdminController} from "../../interface/controller/auth-admin.controller.interface.js"

DependencyInjection.registerAll();

export const authController = container.resolve<IAuthController>(AuthUserController);
export const authAdminController=container.resolve<IAdminController>(AuthAdminController)


import {Request,Response,NextFunction} from 'express'
import {MESSAGES} from '../config/constants/message'
import {STATUS_CODES} from '../config/constants/status-code'
import {JwtService} from '../service/helper/jwt-auth.service'
import { JwtPayload } from "jsonwebtoken";
import {CustomError} from '../utils/custom-error'
import {redisClient} from '../config/redis';

const tokenService = new JwtService();

export interface CustomJwtPayload extends JwtPayload{
    userId:string;
    role: string;
}

export interface CustomRequest extends Request {
	user: CustomJwtPayload;
}
export const verifyAuth =() => async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = extractToken(req);
		console.log('**token',token)
		if (!token || !token.access_token || !token.refresh_token) {
			console.log('in verifyToken');
			res.status(STATUS_CODES.UNAUTHORIZED).json({
				success: false,
				message: MESSAGES.UNAUTHORIZED_ACCESS,
			});
			return; 
		}

		if (await isBlacklisted(token.access_token)) {
			res.status(STATUS_CODES.FORBIDDEN).json({
				success: false, 
				message: MESSAGES.TOKEN_BLACKLISTED,
			});
			return;
		}
		console.log('1')

		const user = tokenService.verifyToken(
			token.access_token,
			'access'
		) as CustomJwtPayload;

		console.log('3',user)

		if (!user || !user._id) {
			res.status(STATUS_CODES.UNAUTHORIZED).json({
				message: MESSAGES.TOKEN_EXPIRED,
			});
			return;
		}
		

		(req as CustomRequest).user = {
			...user,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
		};
		console.log('2')

		next(); // ✅ pass control to next middleware
	} catch (error: any) {
		if (error.name === "TokenExpiredError") {
			console.error(error.name);
			res.status(STATUS_CODES.UNAUTHORIZED).json({
				message: MESSAGES.TOKEN_EXPIRED,
			});
			return;
		}

		console.error("Invalid token response sent");
		res.status(STATUS_CODES.UNAUTHORIZED).json({
			message: MESSAGES.INVALID_TOKEN,
		});
	}
};










const extractToken = (
  req: Request,
  
): { access_token: string; refresh_token: string } | null => {
	console.log(req.cookies)
  
	
  
  

  const access_token = req.cookies?.[`access_token`];
  const refresh_token = req.cookies?.[`refresh_token`];
  console.log('tokens:',{access_token,refresh_token})

  if (!access_token || !refresh_token) return null; 

  return { access_token, refresh_token };
};

//* ─────────────────────────────────────────────────────────────
//*                  🛠️ Blacklist checker Fn
//* ─────────────────────────────────────────────────────────────
const isBlacklisted = async (token: string): Promise<boolean> => {
	if (!token || typeof token !== 'string') {
		console.warn("Attempted to check blacklist with invalid token:", token);
		return false;
	}
	try {
		const result = await redisClient.get(token);
		console.log(result)
		return result !== null;
	} catch (error) {
		console.error("Redis error:", error);
		return false;
	}
};

//* ─────────────────────────────────────────────────────────────
//*                 🛠️ Authorize Role Middleware
//* ─────────────────────────────────────────────────────────────
export const authorizeRole = (allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		console.log('authrole')
		const user = (req as CustomRequest).user;
		if (!user || !allowedRoles.includes(user.role)) {
			console.log('adtha valli')

			res.status(STATUS_CODES.FORBIDDEN).json({
				success: false,
				message: MESSAGES.VALIDATION_ERROR,
				userRole: user ? user.role : "none",
			});
			return;
		}
		next();
	};
};

//* ─────────────────────────────────────────────────────────────
//*                 🛠️ Decode Token Middleware
//* ─────────────────────────────────────────────────────────────
export const decodeToken =() => async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = extractToken(req);

		if (!token) {
			res.status(STATUS_CODES.UNAUTHORIZED).json({
				message: MESSAGES.UNAUTHORIZED_ACCESS,
			});
			return;
		}
		if (await isBlacklisted(token.access_token)) {
			res.status(STATUS_CODES.FORBIDDEN).json({
				message: MESSAGES.TOKEN_BLACKLISTED,
			});
			return;
		}

		const user = tokenService.verifyToken(token?.access_token,'access');
		// console.log(`Decoded`, user);
		(req as CustomRequest).user = {
			userId: user?.userId,
			email: user?.email,
			role: user?.role,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
		};
		next();
	} catch (error) {}
};


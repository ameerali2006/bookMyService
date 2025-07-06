import {injectable} from 'inversify'
import jwt from 'jsonwebtoken';
import ms from 'ms';


@injectable() 
export class JwtService{
    generateAccessToken(_id:string,role:'user'|'admin'|'worker'):string{
        
        return jwt.sign({ _id,role }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
        });
    }
    generateRefreshToken(_id:string,role:'user'|'admin'|'worker'):string{
        
        return jwt.sign({ _id,role }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
        });
    }
    verifyToken(token:string,type:'access'|'refresh'):any{
        const secret= type==='access'?process.env.ACCESS_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET;
        try {
            return jwt.verify(token,secret as string)
        } catch (error) {
            console.error('error on jwt :',error)
            return null
        }
    }

}

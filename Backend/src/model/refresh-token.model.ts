import {Schema,model,ObjectId,Document} from 'mongoose';
import { IRefreshTokenModel } from '../interface/model/refresh-token.model.interface';




export const refreshTokenSchema = new Schema<IRefreshTokenModel>({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	userType: {
		type: String,
		enum: ["admin", "user", "worker"],
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	expiresAt: {
		type: Date,
		required: true,
		expires: 604800, 
	},
},
{
    
    timestamps: true 
});

export const RefreshTokenModel = model<IRefreshTokenModel>(
	"RefreshToken",
	refreshTokenSchema
);

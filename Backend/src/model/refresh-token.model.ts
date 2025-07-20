import {Schema,model,ObjectId,Document} from 'mongoose';

export interface IRefreshTokenEntity {
   id?: string;
   token: string;
   user: ObjectId;
   userType: "admin"|"user"|"worker";
   expiresAt: Date;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface IRefreshTokenModel
	extends Omit<IRefreshTokenEntity, "id" | "user">,
		Document {
	_id: ObjectId;
	user: ObjectId;
}


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

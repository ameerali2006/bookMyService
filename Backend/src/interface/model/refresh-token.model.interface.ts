import { ObjectId, Document } from "mongoose";

export interface IRefreshTokenEntity {
  id?: string;
  token: string;
  user: ObjectId;
  userType: "admin" | "user" | "worker";
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
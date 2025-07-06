import mongoose, {Schema,Document, Types} from 'mongoose'
export interface IUser extends Document{
    _id:string;
    name:string;
    email:string;
    password:string;
    phone:string;
    image:string;
    googleId:string;
    address:Types.ObjectId[];
    isBlocked:boolean;
    



}
const UserSchema = new Schema<IUser>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
      unique: true, 
    },
    image: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
    },
    address: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  })


export const UserModel = mongoose.model<IUser>("User", UserSchema);
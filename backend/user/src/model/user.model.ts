import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name:string;
    email: string;
    isEmailVerified: boolean;
}

const schema: Schema<IUser> = new Schema({
  name: {
  type: String,
  required: true,
  trim: true,
  minlength: 2,
  maxlength: 50,
},
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
},
    isEmailVerified: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true});

export const User = mongoose.model('user', schema);
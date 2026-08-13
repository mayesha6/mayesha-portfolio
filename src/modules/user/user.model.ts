import { Schema, model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  phone: string;
  picture?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCK';
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'USER'], default: 'USER' },
    phone: { type: String, required: true },
    picture: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'BLOCK'], default: 'ACTIVE' },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual populate for posts
UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});

export const User = model<IUser>('User', UserSchema);

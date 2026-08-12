import { Schema, model, Types } from 'mongoose';

export interface IPost {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured: boolean;
  tags: string[];
  views: number;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

export const Post = model<IPost>('Post', PostSchema);

import { Schema, model } from 'mongoose';

export interface IRepoLink {
  label: string;
  url: string;
}

export interface IProject {
  title: string;
  content: string;
  thumbnail?: string;
  livelink?: string;
  repolink?: string;
  repoLinks?: IRepoLink[];
  techStack: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const RepoLinkSchema = new Schema<IRepoLink>(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    livelink: { type: String },
    repolink: { type: String },
    repoLinks: { type: [RepoLinkSchema], default: [] },
    techStack: { type: [String], default: [] },
    views: { type: Number, default: 0 },
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

export const Project = model<IProject>('Project', ProjectSchema);

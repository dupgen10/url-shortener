import mongoose, { Document, Schema } from 'mongoose';

export interface IUrl extends Document {
  url: string;
  shortCode: string;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const urlSchema = new Schema<IUrl>(
  {
    url: {
      type: String,
      required: [true, 'URL is required'],
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Url = mongoose.model<IUrl>('Url', urlSchema);

export default Url;

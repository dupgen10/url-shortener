import mongoose, { Document, Schema } from 'mongoose';

export interface IClick extends Document {
  shortCode: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  referrer?: string;
  device: string;
  browser: string;
}

const clickSchema = new Schema<IClick>({
  shortCode: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  referrer: {
    type: String,
  },
  device: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
});

const Click = mongoose.model<IClick>('Click', clickSchema);

export default Click;

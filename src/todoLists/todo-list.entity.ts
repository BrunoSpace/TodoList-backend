import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const TodoSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  text: { type: String },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

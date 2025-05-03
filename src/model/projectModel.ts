import mongoose, { Schema, Types } from "mongoose";
import { IProject } from "../types";

// Создаем схему Mongoose
const ProjectSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  data: { type: String, required: true },
},
{
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.updatedAt;
      delete ret.userId;
      return ret;
    }
  }
});

// Создаем модель Mongoose
const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;

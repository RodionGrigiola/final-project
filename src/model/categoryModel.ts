import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types";

// Создаем схему Mongoose
const CategorySchema: Schema = new Schema({
  imageSrc: { type: String, required: true },
  category: { type: String, required: true },
},
{
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      ret.imageSrc = `${process.env.BASE_URL || 'http://localhost:3000'}${ret.imageSrc}`;
      delete ret._id;
      delete ret.__v;
      delete ret.updatedAt;
      return ret;
    }
  }
});

CategorySchema.virtual("url").get(function (this: ICategory) {
  return `${process.env.BASE_URL || "http://localhost:3000"}${this.imageSrc}`;
});

// Создаем модель Mongoose
const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;

import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types";

// Создаем схему Mongoose
const CategorySchema: Schema = new Schema({
  imageSrc: { type: String, required: true },
  category: { type: String, required: true },
});

// Создаем модель Mongoose
const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;

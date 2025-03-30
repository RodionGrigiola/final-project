import mongoose, { Schema } from "mongoose";
import { IItem } from "../types";

// Создаем схему Mongoose
const ItemSchema: Schema = new Schema({
  imageSrc: { type: String, required: true },
  category: { type: String, required: true },
});

// Создаем модель Mongoose
const Item = mongoose.model<IItem>("Item", ItemSchema);

export default Item;

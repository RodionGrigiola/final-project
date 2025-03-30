import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  imageSrc: string;
  category: string;
}

export type CategoryResponse = ICategory | null;

export interface IItem extends Document {
  _id: Types.ObjectId;
  imageSrc: string;
  category: string;
}

export type ItemResponse = IItem | null;

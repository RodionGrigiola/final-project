import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  imageSrc: string;
  category: string;
}

export type CategoryResponse = ICategory | null;

export interface IItem extends Document {
  src: string; // Путь к файлу (например: "/models/armchairs/armchair001.glb")
  type: "glb";
  properties: {
    category: string;
    name: string;
    scale?: number;
    materials?: string[];
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ItemResponse = IItem | null;

export interface IUser extends Document {
  name: string;
  email: string;
  photo?: string;
  role: "user" | "admin";
  password: string;
  active: boolean;
  // createdAt: Date;  // Added by timestamps
  // updatedAt: Date;  // Added by timestamps
}

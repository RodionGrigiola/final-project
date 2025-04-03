import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  imageSrc: string;
  category: string;
}

export type CategoryResponse = ICategory | null;

export interface IItem extends Document {
  src: string; // Путь к файлу (например: "/models/armchairs/armchair001.glb")
  type: "gltf";
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

export interface JwtPayload {
  kek: string;
  id: string
}

export type ItemResponse = IItem | null;

export interface IUser extends Document {
  correctPassword(password: string, password1: string): Promise<boolean>;
  createPasswordResetToken(): string;
  name: string;
  email: string;
  photo?: string;
  role: "user" | "admin";
  password: string;
  passwordConfirmation?: string;
  active: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date,
  // createdAt: Date;  // Added by timestamps
  // updatedAt: Date;  // Added by timestamps
}

export * from './express';
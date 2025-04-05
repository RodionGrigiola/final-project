import mongoose, { Schema } from "mongoose";
import { IItem } from "../types";

const ItemSchema = new Schema<IItem>(
  {
    src: {
      type: String,
      required: true,
      unique: true,
    },
    imageSrc: String,
    type: {
      type: String,
      required: true,
      enum: ["gltf"],
    },
    properties: {
      category: {
        type: String,
        required: true,
        lowercase: true,
      },
      name: {
        type: String,
        required: true,
      },
      scale: {
        type: Number,
        default: 1.0,
      },
      materials: {
        type: [String],
        default: [],
      },
    },
  },
  {
    versionKey: false, 
    timestamps: { 
      createdAt: true, 
      updatedAt: false 
    },
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        ret.src = `${process.env.BASE_URL || 'http://localhost:3000'}${ret.src}`;
        ret.imageSrc = `${process.env.BASE_URL || 'http://localhost:3000'}${ret.imageSrc}`;
        delete ret._id;
        delete ret.__v;
        delete ret.updatedAt;
        return ret;
      }
    }
  },
);

// 3. Виртуальное поле для полного URL
ItemSchema.virtual("url").get(function (this: IItem) {
  return `${process.env.BASE_URL || "http://localhost:3000"}${this.src}`;
});

// 4. Модель
const Item = mongoose.model<IItem>("Item", ItemSchema);
export default Item;

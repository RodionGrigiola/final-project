import mongoose from "mongoose";
import validator from "validator";
import { IUser } from "../types";
import crypto from 'crypto';
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "A user must have an email"],
      lowerCase: true,
      validate: [validator.isEmail, "email doesnt follow the format"],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please provide a password"],
      select: false,
    },
    passwordConfirmation: {
      type: String,
      trim: true,
      required: [true, "Please type the password again"],
      validate: {
        validator: function (this: IUser, passwordConfirmation: string) {
          return passwordConfirmation === this.password;
        },
        message: `Passwords don't match!`,
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    id: false,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.set("passwordConfirmation", undefined);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;

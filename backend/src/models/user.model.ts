import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../types/auth.types";

const UserSchema: Schema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  enteredPass: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPass, this.password);
};

const UserModel = mongoose.model<User>("User", UserSchema);

export default UserModel;

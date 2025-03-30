import { Request, Response } from "express";
import User from "../model/userModel";
import { IUser } from "../types";
import Email from "../services/Email";

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, passwordConfirmation, role } = req.body;
    const newUser: IUser = await User.create({
      name,
      email,
      password,
      passwordConfirmation,
      role,
      photo: req.body.photo,
    });

    newUser.set("password", undefined);
    newUser.set("passwordConfirmation", undefined);

    // const url = `${req.protocol}://${req.get("host")}/me`;
    const url = `<a href="#">user_link</a>`;
    new Email(newUser, url).sendWelcome().catch(console.error);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

export default { signup };

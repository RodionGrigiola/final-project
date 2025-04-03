import { NextFunction, Request, Response } from "express";
import User from "../model/userModel";
import { IUser, JwtPayload } from "../types";
import Email from "../services/Email";
import jwt from "jsonwebtoken";
import { ObjectId } from 'mongoose';
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '90d';

const signToken = (id: ObjectId) => {
  return jwt.sign({ id }, JWT_SECRET, 
    { expiresIn: JWT_EXPIRES } as jwt.SignOptions
  );
}

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user._id as ObjectId)
  const cookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cookie cant be modified by the browser (prevents cross attacks)
  };

  res.cookie('jwt', token, cookieOptions);

  user.set("password", undefined);
  user.set("passwordConfirmation", undefined);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, passwordConfirmation, role } = req.body;
    const user: IUser = await User.create({
      name,
      email,
      password,
      passwordConfirmation,
      role,
      photo: req.body.photo,
    });
    const url = `${req.protocol}://${req.get("host")}/users/me`;
    new Email(user, url).sendWelcome().catch(console.error);
    createSendToken(user, 201, res);
  } catch (e) {
    res.status(400).json({
      status: "fail",
      e,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({error_message: "Please provide email and password"});
      return;
    }

    const user: IUser = await User.findOne({ email }).select('-__v +password'); // bcs in schema select: false
    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
      res.status(401).json({error_message: "Incorrect email or password"});
      return;
    }

    createSendToken(user, 200, res);
  }
  catch(e) {
    res.status(400).json({
      status: "fail",
      e,
    });
  }
};

const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Получаем токен
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new Error('You are not logged in! Please log in to get access.');
    }

    // 2. Верифицируем токен
    const decoded = verifyToken(token) as { kek: string, id: string };
  
    // 3. Проверяем существование пользователя
    const currentUser: IUser | null = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error('The user belonging to this token no longer exists.');
    }

    // 4. Добавляем пользователя в запрос
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      err
    });
  }
};

const logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'userloggedout', {
    expires: new Date(Date.now() + 10 * 1000), // + 10sec
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// auth.controller.ts
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const user: IUser | null = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).send("There is no user with that email address");
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
    const resetURL = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).send("There was an error sending the email. Try again later");
    return;
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user: IUser | null = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).send("Token is invalid or has expired");
    return;
  }

  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  await user.save();

  // 3) Log the user in, send JWT
  createSendToken(user, 200, res);
  }
  catch(e){
    res.send(400).send("Error resetting password")
  }
};

const updatePassword = async (req: Request, res: Response) => {
  // 1) Get user from DB
  const user = await User.findById(req?.user?._id).select('+password');
  if (!user) {
    res.status(400).send("You are not logged in! Please login");
    // return next(new AppError('You are not logged in! Please login', 400));
    return;
  }

  // 2) Check if posted pwd is correct and update
  if (!(await user.correctPassword(req.body.password, user.password))) {
    // return next(new AppError('Your current password is wrong', 401));
    res.status(401).send("Your current password is wrong");
    return;
  }

  // 3) Update the password
  user.password = req.body.newPassword;
  user.passwordConfirmation = req.body.newPasswordConfirmation;
  await user.save();

  // 4) Log the user in
  createSendToken(user, 200, res);
};

const getMe = (req: Request, res: Response) => {
  res.status(200).json({
    user: req.user
  })
}


// For PATCH /users/updateMe
const updateMe = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req?.user?._id,
      {
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
      },
      { new: true, runValidators: true }
    );

    console.log(updatedUser)
    
    res.status(200).json({
      user: updatedUser
    });
  } catch (err) {
    res.status(400).json({
      message: 'Update failed'
    });
  }
};

const test = (req: Request, res: Response) => {
  res.status(200).send("<h1>Access granted to restricted resourse</h1>")
}

export default { signup, login, logout, protect, forgotPassword, resetPassword, updatePassword, getMe, updateMe, test };


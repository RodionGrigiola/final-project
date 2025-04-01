import { NextFunction, Request, Response } from "express";
import User from "../model/userModel";
import { IUser } from "../types";
import Email from "../services/Email";
import jwt from "jsonwebtoken";
import { promisify } from 'util';
import { ObjectId } from 'mongoose';

interface JwtPayload {
  kek: string;
  id: string
}

// Убедитесь, что JWT_SECRET точно определен в .env
const JWT_SECRET = process.env.JWT_SECRET as string; // Явное приведение типа
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
    // const url = `${req.protocol}://${req.get("host")}/me`;
    // const url = `<a href="#">user_link</a>`;
    // new Email(user, url).sendWelcome().catch(console.error);
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

const test = (req: Request, res: Response) => {
  res.status(200).send("<h1>Access granted to restricted resourse</h1>")
}

export default { signup, login, logout, protect, test };

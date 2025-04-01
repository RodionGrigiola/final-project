import { IUser } from '../index';

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Делаем необязательным для безопасности
    }
  }
}
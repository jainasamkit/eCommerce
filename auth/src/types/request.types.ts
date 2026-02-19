interface IUserToken {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserToken;
    }
  }
}

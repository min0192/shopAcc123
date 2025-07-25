export type userJwtPayload = {
  _id: string;
  email: string;
  name: string;
  role: string
  balance: number;
  iat: number;
  exp: number;
};

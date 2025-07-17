export type userJwtPayload = {
  id: string;
  email: string;
  name: string;
  role: string
  balance: number;
  iat: number;
  exp: number;
};

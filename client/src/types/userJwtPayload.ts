export type userJwtPayload = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string
  balance: number;
  iat: number;
  exp: number;
};

export interface Order {
    id?: string;
    _id: string;
    user: string;
    orderItems: {
        account: string;
        price: number;
    }[];
    totalPrice: number;
    isPaid: boolean;
    paidAt: Date;
    paymentMethod: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  } 
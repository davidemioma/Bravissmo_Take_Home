export type UserType = {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductType = {
  id: string;
  userId: string;
  name: string;
  images: string[];
  type: string;
  color: string;
  price: number;
  quantity: number;
  sizes: string[];
  bandSizes: number[];
  cupSizes: number[];
  createdAt: string;
  updatedAt: string;
};

export type CartItemType = {
  cartItem: {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
  products: {
    id: string;
    userId: string;
    name: string;
    images: string[];
    type: string;
    color: string;
    price: number;
    quantity: number;
    sizes: string[];
    bandSizes: number[];
    cupSizes: number[];
    createdAt: string;
    updatedAt: string;
  };
};

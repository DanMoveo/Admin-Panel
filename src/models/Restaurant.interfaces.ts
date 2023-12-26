export type Restaurant = {
  id: string;
  image: string;
  name: string;
  chefId: Chef;
  rate: number;
  dishes: string[];
};

export type Restaurant2 = {
  id: string;
  image: string;
  name: string;
  chefId: Chef;
  rate: number;
  dishes: Dish2[];
};

export type Dish2 = {
  _id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  price: number;
  icons: string[];
};

export type Chef = {
  id: string;
  name: string;
  image: string;
};

export type Dish = {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  price: number;
  icons: string[];
};

export type DecodedToken = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  iat: number;
};

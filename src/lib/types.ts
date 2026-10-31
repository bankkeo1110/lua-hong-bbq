export type Category = "thit" | "haisan" | "do-uong";

export type MenuItem = {
  id: string;
  category: Category;
  name: string;
  desc: string;
  price: number;
  unit: string;
  available: boolean;
};

export type Combo = {
  id: string;
  name: string;
  forWho: string;
  items: string[];
  price: number;
  featured: boolean;
  available: boolean;
};

export type Promo = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  published: boolean;
};

export type Content = {
  menu: MenuItem[];
  combos: Combo[];
  promos: Promo[];
};

export type BookingStatus = "moi" | "xac-nhan" | "huy";

export type Booking = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  branch: string;
  guests: number;
  date: string;
  time: string;
  note: string;
  status: BookingStatus;
};

export type OrderStatus = "moi" | "dang-lam" | "hoan-thanh" | "huy";

export type OrderLine = {
  kind: "menu" | "combo";
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  lines: OrderLine[];
  fee: number;
  total: number;
  status: OrderStatus;
};

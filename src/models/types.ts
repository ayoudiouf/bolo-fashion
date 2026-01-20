export type Role = "admin" | "assistant";

export type User = {
  id: string;
  name: string;
  role: Role;
};

export type Measurements = {
  chest?: number;
  waist?: number;
  hips?: number;
  length?: number;
  sleeves?: number;
};

export type Client = {
  id: string;
  name: string;
  contact?: string;
  measurements: Measurements;
  fabricPhotos: string[];
};

export type OrderStatus = "To Do" | "In Progress" | "Completed";

export type Order = {
  id: string;
  clientId: string;
  status: OrderStatus;
  startDate?: string;
};

export type CollectionItem = {
  id: string;
  name: string;
  price: number;
  sold: boolean;
};

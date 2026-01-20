import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Client, Measurements, Order, OrderStatus, Role, User, CollectionItem } from "@src/models/types";
import { uuid } from "@src/utils/uuid";

type State = {
  currentUser: User | null;
  clients: Client[];
  orders: Order[];
  assistants: User[];
  collections: CollectionItem[];
};

type Actions = {
  login: (name: string, role: Role) => void;
  logout: () => void;
  addAssistant: (name: string) => string;
  addClient: (payload: { name: string; contact?: string }) => string;
  updateMeasurements: (clientId: string, measurements: Measurements) => void;
  addFabricPhoto: (clientId: string, uri: string) => void;
  createOrder: (payload: { clientId: string; startDate?: string }) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  scheduleStartDate: (orderId: string, startDate: string) => void;
  addCollectionItem: (payload: { name: string; price: number }) => string;
  toggleCollectionSold: (id: string, sold: boolean) => void;
};

type Ctx = { state: State; actions: Actions };

const initialState: State = { currentUser: null, clients: [], orders: [], assistants: [], collections: [] };

type Action =
  | { type: "LOGIN"; name: string; role: Role }
  | { type: "LOGOUT" }
  | { type: "ADD_ASSISTANT"; id: string; name: string }
  | { type: "ADD_CLIENT"; name: string; contact?: string; id: string }
  | { type: "UPDATE_MEASUREMENTS"; clientId: string; measurements: Measurements }
  | { type: "ADD_FABRIC_PHOTO"; clientId: string; uri: string }
  | { type: "CREATE_ORDER"; clientId: string; startDate?: string; id: string }
  | { type: "UPDATE_ORDER_STATUS"; orderId: string; status: OrderStatus }
  | { type: "SCHEDULE_START"; orderId: string; startDate: string }
  | { type: "ADD_COLLECTION_ITEM"; id: string; name: string; price: number }
  | { type: "TOGGLE_COLLECTION_SOLD"; id: string; sold: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOGIN": {
      const user: User = { id: uuid(), name: action.name, role: action.role };
      return { ...state, currentUser: user };
    }
    case "LOGOUT": {
      return { ...state, currentUser: null };
    }
    case "ADD_ASSISTANT": {
      const assistant: User = { id: action.id, name: action.name, role: "assistant" };
      return { ...state, assistants: [assistant, ...state.assistants] };
    }
    case "ADD_CLIENT": {
      const client: Client = {
        id: action.id,
        name: action.name,
        contact: action.contact,
        measurements: {},
        fabricPhotos: []
      };
      return { ...state, clients: [client, ...state.clients] };
    }
    case "UPDATE_MEASUREMENTS": {
      const clients = state.clients.map(c =>
        c.id === action.clientId ? { ...c, measurements: { ...c.measurements, ...action.measurements } } : c
      );
      return { ...state, clients };
    }
    case "ADD_FABRIC_PHOTO": {
      const clients = state.clients.map(c =>
        c.id === action.clientId ? { ...c, fabricPhotos: [action.uri, ...c.fabricPhotos] } : c
      );
      return { ...state, clients };
    }
    case "CREATE_ORDER": {
      const order: Order = {
        id: action.id,
        clientId: action.clientId,
        status: "To Do",
        startDate: action.startDate
      };
      return { ...state, orders: [order, ...state.orders] };
    }
    case "UPDATE_ORDER_STATUS": {
      const orders = state.orders.map(o => (o.id === action.orderId ? { ...o, status: action.status } : o));
      return { ...state, orders };
    }
    case "SCHEDULE_START": {
      const orders = state.orders.map(o => (o.id === action.orderId ? { ...o, startDate: action.startDate } : o));
      return { ...state, orders };
    }
    case "ADD_COLLECTION_ITEM": {
      const item: CollectionItem = { id: action.id, name: action.name, price: action.price, sold: false };
      return { ...state, collections: [item, ...state.collections] };
    }
    case "TOGGLE_COLLECTION_SOLD": {
      const collections = state.collections.map(i => (i.id === action.id ? { ...i, sold: action.sold } : i));
      return { ...state, collections };
    }
    default:
      return state;
  }
}

const StoreContext = createContext<Ctx | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions: Actions = {
    login: (name, role) => dispatch({ type: "LOGIN", name, role }),
    logout: () => dispatch({ type: "LOGOUT" }),
    addAssistant: name => {
      const id = uuid();
      dispatch({ type: "ADD_ASSISTANT", id, name });
      return id;
    },
    addClient: ({ name, contact }) => {
      const id = uuid();
      dispatch({ type: "ADD_CLIENT", name, contact, id });
      return id;
    },
    updateMeasurements: (clientId, measurements) =>
      dispatch({ type: "UPDATE_MEASUREMENTS", clientId, measurements }),
    addFabricPhoto: (clientId, uri) => dispatch({ type: "ADD_FABRIC_PHOTO", clientId, uri }),
    createOrder: ({ clientId, startDate }) => {
      const id = uuid();
      dispatch({ type: "CREATE_ORDER", clientId, startDate, id });
      return id;
    },
    updateOrderStatus: (orderId, status) => dispatch({ type: "UPDATE_ORDER_STATUS", orderId, status }),
    scheduleStartDate: (orderId, startDate) => dispatch({ type: "SCHEDULE_START", orderId, startDate }),
    addCollectionItem: ({ name, price }) => {
      const id = uuid();
      dispatch({ type: "ADD_COLLECTION_ITEM", id, name, price });
      return id;
    },
    toggleCollectionSold: (id, sold) => dispatch({ type: "TOGGLE_COLLECTION_SOLD", id, sold })
  };

  return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("StoreContext not found");
  return ctx;
}

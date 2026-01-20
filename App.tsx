import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StoreProvider, useStore } from "./src/store/StoreProvider";
import AuthScreen from "./src/screens/AuthScreen";
import ClientsScreen from "./src/screens/ClientsScreen";
import ClientFormScreen from "./src/screens/ClientFormScreen";
import ClientDetailsScreen from "./src/screens/ClientDetailsScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import OrderFormScreen from "./src/screens/OrderFormScreen";
import AssistantsScreen from "./src/screens/AssistantsScreen";
import CollectionsScreen from "./src/screens/CollectionsScreen";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { state } = useStore();
  const isAuthed = !!state.currentUser;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthed ? (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ title: "Sign In" }} />
        ) : (
          <>
            <Stack.Screen name="Clients" component={ClientsScreen} options={{ title: "Clients" }} />
            <Stack.Screen name="ClientDetails" component={ClientDetailsScreen} options={{ title: "Client Details" }} />
            <Stack.Screen name="ClientForm" component={ClientFormScreen} options={{ title: "New Client" }} />
            <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: "Orders" }} />
            <Stack.Screen name="OrderForm" component={OrderFormScreen} options={{ title: "New Order" }} />
            <Stack.Screen name="Assistants" component={AssistantsScreen} options={{ title: "Assistants" }} />
            <Stack.Screen name="Collections" component={CollectionsScreen} options={{ title: "Collections" }} />
          </>
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <RootNavigator />
    </StoreProvider>
  );
}

import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "@src/store/StoreProvider";
import { Client } from "@src/models/types";

type Nav = { navigate: (name: string, params?: Record<string, unknown>) => void };

export default function ClientsScreen() {
  const { state } = useStore();
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clients</Text>
        <TouchableOpacity style={styles.add} onPress={() => navigation.navigate("ClientForm" as never)}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList<Client>
        data={state.clients}
        keyExtractor={(item: Client) => item.id}
        renderItem={({ item }: { item: Client }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ClientDetails", { id: item.id })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.contact}>{item.contact || ""}</Text>
            <Text style={styles.meta}>
              Photos {item.fabricPhotos.length} • Measures {Object.keys(item.measurements).length}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No clients yet</Text>}
      />
      <TouchableOpacity style={styles.orders} onPress={() => navigation.navigate("Orders" as never)}>
        <Text style={styles.ordersText}>View Orders</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "600" },
  add: { backgroundColor: "#2c7be5", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  addText: { color: "#fff", fontWeight: "600" },
  card: { padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: "600" },
  contact: { color: "#666", marginTop: 2 },
  meta: { marginTop: 6, color: "#444" },
  empty: { textAlign: "center", color: "#888", marginTop: 24 },
  orders: { position: "absolute", bottom: 24, right: 24, backgroundColor: "#00b894", padding: 14, borderRadius: 24 },
  ordersText: { color: "#fff", fontWeight: "700" }
});

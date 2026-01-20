import React, { useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "@src/store/StoreProvider";
import { Order, OrderStatus } from "@src/models/types";

const statuses: OrderStatus[] = ["To Do", "In Progress", "Completed"];

export default function OrdersScreen() {
  const { state, actions } = useStore();
  const navigation = useNavigation();
  const [filter, setFilter] = useState<OrderStatus | "All">("All");

  const filtered = useMemo(() => {
    if (filter === "All") return state.orders;
    return state.orders.filter((o: Order) => o.status === filter);
  }, [state.orders, filter]);

  function label(order: Order) {
    const client = state.clients.find((c: { id: string; name: string }) => c.id === order.clientId);
    const name = client ? client.name : "Unknown";
    const start = order.startDate ? ` • Start ${order.startDate}` : "";
    return `${name} • ${order.status}${start}`;
  }

  function setStartToday(id: string) {
    const today = new Date();
    const d = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;
    actions.scheduleStartDate(id, d);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <TouchableOpacity style={styles.add} onPress={() => navigation.navigate("OrderForm" as never)}>
          <Text style={styles.addText}>New</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filter, filter === "All" && styles.active]}
          onPress={() => setFilter("All")}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        {statuses.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.filter, filter === s && styles.active]}
            onPress={() => setFilter(s)}
          >
            <Text style={styles.filterText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList<Order>
        data={filtered}
        keyExtractor={(item: Order) => item.id}
        renderItem={({ item }: { item: Order }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{label(item)}</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.btn, styles.schedule]}
                onPress={() => setStartToday(item.id)}
              >
                <Text style={styles.btnText}>Set Start Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.todo]}
                onPress={() => actions.updateOrderStatus(item.id, "To Do")}
              >
                <Text style={styles.btnText}>To Do</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.progress]}
                onPress={() => actions.updateOrderStatus(item.id, "In Progress")}
              >
                <Text style={styles.btnText}>In Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.done]}
                onPress={() => actions.updateOrderStatus(item.id, "Completed")}
              >
                <Text style={styles.btnText}>Completed</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No orders yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "600" },
  add: { backgroundColor: "#2c7be5", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  addText: { color: "#fff", fontWeight: "600" },
  filters: { flexDirection: "row", gap: 8, marginBottom: 8 },
  filter: { borderWidth: 1, borderColor: "#ddd", borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  filterText: { fontSize: 14 },
  active: { backgroundColor: "#eee" },
  card: { padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", gap: 8, marginTop: 10 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  btnText: { color: "#fff", fontWeight: "700" },
  schedule: { backgroundColor: "#17a2b8" },
  todo: { backgroundColor: "#6c757d" },
  progress: { backgroundColor: "#ffc107" },
  done: { backgroundColor: "#28a745" },
  empty: { textAlign: "center", color: "#888", marginTop: 24 }
});

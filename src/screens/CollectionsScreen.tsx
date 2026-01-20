import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useStore } from "@src/store/StoreProvider";
import { CollectionItem } from "@src/models/types";

export default function CollectionsScreen() {
  const { state, actions } = useStore();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  function add() {
    const p = Number(price);
    if (!name.trim() || isNaN(p)) return;
    actions.addCollectionItem({ name: name.trim(), price: p });
    setName("");
    setPrice("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collections</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="Item name" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.add} onPress={add}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList<CollectionItem>
        data={state.collections}
        keyExtractor={(item: CollectionItem) => item.id}
        renderItem={({ item }: { item: CollectionItem }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.name} • ${item.price.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={[styles.sold, item.sold && styles.soldActive]}
              onPress={() => actions.toggleCollectionSold(item.id, !item.sold)}
            >
              <Text style={styles.soldText}>{item.sold ? "Sold" : "Mark Sold"}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No items</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12 },
  row: { flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 },
  add: { backgroundColor: "#2c7be5", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  addText: { color: "#fff", fontWeight: "700" },
  item: { padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 8, marginBottom: 8 },
  itemText: { fontSize: 16 },
  sold: { backgroundColor: "#6c757d", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginTop: 8 },
  soldActive: { backgroundColor: "#28a745" },
  soldText: { color: "#fff", fontWeight: "700" },
  empty: { textAlign: "center", color: "#888", marginTop: 24 }
});

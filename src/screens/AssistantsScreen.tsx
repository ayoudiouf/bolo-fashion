import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useStore } from "@src/store/StoreProvider";
import { User } from "@src/models/types";

export default function AssistantsScreen() {
  const { state, actions } = useStore();
  const [name, setName] = useState("");

  function add() {
    if (!name.trim()) return;
    actions.addAssistant(name.trim());
    setName("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assistants</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="Assistant name" value={name} onChangeText={setName} />
        <TouchableOpacity style={styles.add} onPress={add}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList<User>
        data={state.assistants}
        keyExtractor={(item: User) => item.id}
        renderItem={({ item }: { item: User }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No assistants</Text>}
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
  empty: { textAlign: "center", color: "#888", marginTop: 24 }
});

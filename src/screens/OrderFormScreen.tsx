import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "@src/store/StoreProvider";
import { Client } from "@src/models/types";

export default function OrderFormScreen() {
  const { state, actions } = useStore();
  const navigation = useNavigation();
  const [clientId, setClientId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");

  const clients = useMemo<Client[]>(() => state.clients, [state.clients]);

  function save() {
    if (!clientId) return;
    const id = actions.createOrder({ clientId, startDate });
    navigation.goBack();
    return id;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Order</Text>
      <Text style={styles.section}>Select Client</Text>
      <View style={styles.list}>
        {clients.map((c: Client) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.item, clientId === c.id && styles.selected]}
            onPress={() => setClientId(c.id)}
          >
            <Text style={styles.itemText}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.section}>Start Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TouchableOpacity style={styles.save} onPress={save}>
        <Text style={styles.saveText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12 },
  section: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 8 },
  list: { gap: 8 },
  item: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8 },
  selected: { backgroundColor: "#eee" },
  itemText: { fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 10 },
  save: { marginTop: 16, backgroundColor: "#00b894", padding: 14, borderRadius: 8, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700" }
});

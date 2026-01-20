import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useStore } from "@src/store/StoreProvider";

export default function AuthScreen() {
  const { actions } = useStore();
  const [name, setName] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tailoring Workshop</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.admin]}
          onPress={() => actions.login(name || "Admin", "admin")}
        >
          <Text style={styles.btnText}>Administrator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.assistant]}
          onPress={() => actions.login(name || "Assistant", "assistant")}
        >
          <Text style={styles.btnText}>Assistant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
  row: { flexDirection: "row", gap: 12, justifyContent: "center" },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  admin: { backgroundColor: "#2c7be5" },
  assistant: { backgroundColor: "#00b894" },
  btnText: { color: "#fff", fontWeight: "600" }
});

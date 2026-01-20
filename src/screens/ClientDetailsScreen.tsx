import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Platform } from "react-native";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useStore } from "@src/store/StoreProvider";
import { Measurements } from "@src/models/types";

export default function ClientDetailsScreen() {
  const route = useRoute();
  const { state, actions } = useStore();
  const params = route.params as { id: string };
  const client = useMemo(() => state.clients.find(c => c.id === params.id), [state.clients, params.id]);
  const [m, setM] = useState<Measurements>(client?.measurements || {});

  if (!client) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Client not found</Text>
      </View>
    );
  }

  const cl = client!;

  async function addPhoto() {
    const isWeb = Platform.OS === "web";
    const res = isWeb
      ? await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true })
      : await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled && res.assets && res.assets[0]?.uri) {
      actions.addFabricPhoto(cl.id, res.assets[0].uri);
    }
  }

  function setNumber(key: keyof Measurements, value: string) {
    const num = Number(value);
    setM(prev => ({ ...prev, [key]: isNaN(num) ? undefined : num }));
  }

  function saveMeasurements() {
    actions.updateMeasurements(cl.id, m);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{cl.name}</Text>
      <Text style={styles.subtitle}>{cl.contact || ""}</Text>
      <Text style={styles.section}>Fabric Photos</Text>
      <View style={styles.photos}>
        {cl.fabricPhotos.map(uri => (
          <Image key={uri} source={{ uri }} style={styles.photo} />
        ))}
      </View>
      <TouchableOpacity style={styles.photoBtn} onPress={addPhoto}>
        <Text style={styles.photoText}>Take Photo</Text>
      </TouchableOpacity>
      <Text style={styles.section}>Measurements</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSmall}
          placeholder="Chest"
          keyboardType="numeric"
          value={m.chest?.toString() || ""}
          onChangeText={v => setNumber("chest", v)}
        />
        <TextInput
          style={styles.inputSmall}
          placeholder="Waist"
          keyboardType="numeric"
          value={m.waist?.toString() || ""}
          onChangeText={v => setNumber("waist", v)}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSmall}
          placeholder="Hips"
          keyboardType="numeric"
          value={m.hips?.toString() || ""}
          onChangeText={v => setNumber("hips", v)}
        />
        <TextInput
          style={styles.inputSmall}
          placeholder="Length"
          keyboardType="numeric"
          value={m.length?.toString() || ""}
          onChangeText={v => setNumber("length", v)}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSmall}
          placeholder="Sleeves"
          keyboardType="numeric"
          value={m.sleeves?.toString() || ""}
          onChangeText={v => setNumber("sleeves", v)}
        />
      </View>
      <TouchableOpacity style={styles.save} onPress={saveMeasurements}>
        <Text style={styles.saveText}>Save Measurements</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "600" },
  subtitle: { color: "#666", marginBottom: 8 },
  section: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 8 },
  photos: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  photo: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#eee" },
  photoBtn: { backgroundColor: "#2c7be5", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginTop: 8 },
  photoText: { color: "#fff", fontWeight: "600" },
  row: { flexDirection: "row", gap: 10 },
  inputSmall: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 10 },
  save: { marginTop: 16, backgroundColor: "#00b894", padding: 14, borderRadius: 8, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700" }
});

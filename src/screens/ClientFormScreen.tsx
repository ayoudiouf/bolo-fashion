import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "@src/store/StoreProvider";
import { Measurements } from "@src/models/types";

export default function ClientFormScreen() {
  const { actions } = useStore();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [measurements, setMeasurements] = useState<Measurements>({});
  const [photos, setPhotos] = useState<string[]>([]);

  async function addPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true });
    if (!res.canceled && res.assets && res.assets[0]?.uri) {
      setPhotos((prev: string[]) => [res.assets[0].uri, ...prev]);
    }
  }

  function setNumber(key: keyof Measurements, value: string) {
    const num = Number(value);
    setMeasurements((m: Measurements) => ({ ...m, [key]: isNaN(num) ? undefined : num }));
  }

  function save() {
    const clientId = actions.addClient({ name, contact });
    photos.forEach((uri: string) => actions.addFabricPhoto(clientId, uri));
    actions.updateMeasurements(clientId, measurements);
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Client</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Contact" value={contact} onChangeText={setContact} />
      <Text style={styles.section}>Measurements</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSmall}
          placeholder="Chest"
          keyboardType="numeric"
          onChangeText={(v: string) => setNumber("chest", v)}
        />
        <TextInput
          style={styles.inputSmall}
          placeholder="Waist"
          keyboardType="numeric"
          onChangeText={(v: string) => setNumber("waist", v)}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSmall}
          placeholder="Hips"
          keyboardType="numeric"
          onChangeText={(v: string) => setNumber("hips", v)}
        />
        <TextInput
          style={styles.inputSmall}
          placeholder="Length"
          keyboardType="numeric"
          onChangeText={(v: string) => setNumber("length", v)}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSmall}
          placeholder="Sleeves"
          keyboardType="numeric"
          onChangeText={(v: string) => setNumber("sleeves", v)}
        />
      </View>
      <Text style={styles.section}>Fabric Photos</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.photoBtn} onPress={addPhoto}>
          <Text style={styles.photoText}>Add Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.photos}>
        {photos.map((uri: string) => (
          <Image key={uri} source={{ uri }} style={styles.photo} />
        ))}
      </View>
      <TouchableOpacity style={styles.save} onPress={save}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12 },
  section: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 10 },
  row: { flexDirection: "row", gap: 10 },
  inputSmall: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 10 },
  photoBtn: { backgroundColor: "#2c7be5", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  photoText: { color: "#fff", fontWeight: "600" },
  photos: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  photo: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#eee" },
  save: { marginTop: 16, backgroundColor: "#00b894", padding: 14, borderRadius: 8, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700" }
});

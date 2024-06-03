import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, storage } from "../../../lib/firebase"; // Adjust this path as needed
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const BigCardCollage = ({ collageName, image }) => {
  const handleCardPress = () => {
    navigation.navigate("Customization", { collageName, image });
  };

  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        style={styles.bigCard}
        onPress={() => handleCardPress("Customization")}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.bigCardImage} />
        ) : (
          <Image
            source={require("../../image/3033337.png")}
            style={styles.bigCardImage}
          />
        )}
        <Text style={styles.bigCardText}>{collageName}</Text>
      </TouchableOpacity>
    </View>
  );
};

export { BigCardCollage };

const MACustomization = () => {
  const navigation = useNavigation();
  const [collageName, setCollageName] = useState("");
  const [image, setImage] = useState(null);
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    loadCollageData();
  }, []);

  const loadCollageData = async () => {
    try {
      const savedCollageName = await AsyncStorage.getItem("collageName");
      const savedImage = await AsyncStorage.getItem("collageImage");
      if (savedCollageName !== null) {
        setCollageName(savedCollageName);
      }
      if (savedImage !== null) {
        setImage(savedImage);
      }
    } catch (error) {
      console.error("Error loading collage data: ", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setIsDataChanged(true);
    }
  };

  const handleCollageNameChange = (text) => {
    setCollageName(text);
    setIsDataChanged(true);
  };

  const resetCollageData = async () => {
    try {
      let imageUrl = "";
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(
          storage,
          `masteradmincustomization-images/${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`
        );
        const snapshot = await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      // Save the reset data to Firestore
      await addDoc(collection(db, "masteradmincustomization"), {
        collageName: collageName, // use the state variable
        collageImage: imageUrl, // use the state variable
        timestamp: new Date(),
      });

      Alert.alert("Success", "Collage data reset and saved to Firestore.");
      setCollageName("")
      setImage(null)
    } catch (error) {
      console.error("Error resetting collage data: ", error);
      Alert.alert("Error", "Failed to reset collage data.");
    }
  };

  return (
    <View style={styles.container}>
      <BigCardCollage collageName={collageName} image={image} />
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Enter University Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Collage Name"
        value={collageName}
        onChangeText={handleCollageNameChange}
      />
      {/* <TouchableOpacity
        style={styles.button}
        onPress={handleSaveChanges}
      >
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.button} onPress={resetCollageData}>
        <Text style={styles.buttonText}>Save changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#96DED1",
  },
  text: {
    fontWeight: "900",
    fontSize: 20,
    color: "#008080",
  },
  input: {
    margin: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "gray",
  },
  button: {
    backgroundColor: "#007FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  bigCard: {
    margin: 20,
    width: "90%",
    aspectRatio: 2,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bigCardText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    top: 60,
  },
  bigCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
});

export default MACustomization;

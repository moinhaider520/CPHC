import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useEffect, useState } from "react";
import { BASIC_URL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function AddPolicy() {
  const [userdata, setUserData] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const chooseFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      setSelectedFile(file);
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);



  useEffect(() => {
    FetchAuthor();
  }, []);

  function FetchAuthor() {
    AsyncStorage.getItem("userData")
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data); // Parse the JSON string to an object
          setUserData(userData);
        }
      })
      .catch((error) => {
        console.error("Error saving data to AsyncStorage:", error);
      });
  }

  function CreatePolicy() {
    const apiUrl = BASIC_URL + "create_policy.php";
  
    // Create a new FormData object
    const formData = new FormData();
    formData.append("authorid", userdata.id);
    formData.append("authorname", userdata.username);
    if (selectedFile) {
      formData.append("file", {
        uri: selectedFile.assets[0].uri,
        name: selectedFile.assets[0].name,
        type: selectedFile.assets[0].mimeType,
      });
    }
  
    const requestData = {
      method: "POST",
      body: formData,
    };
  
    fetch(apiUrl, requestData)
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        if(data == "success"){
          alert("Policy Created");
        }else{
          alert("Failed to Create Policy");
        }

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={chooseFile}>
        <Text style={styles.btntext}>Choose File</Text>
      </TouchableOpacity>
      {selectedFile && (
        <Text style={{fontFamily:fonts.mullishbold,marginBottom:10}}>Selected File: {selectedFile.assets[0].name}</Text>
      )}
      <TouchableOpacity style={styles.btn} onPress={() => CreatePolicy()}>
        <Text style={styles.btntext}>Upload Policy</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
  },
  formcontainer: {
    backgroundColor: Colors.White,
    marginVertical: 20,
    borderRadius: 5,
    elevation: 2,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
    fontFamily: fonts.mullishbold,
    marginBottom: 10,
  },
  input: {
    borderWidth: 0.3,
    borderColor: Colors.Platinum,
    borderRadius: 2,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: 5,
    fontFamily: fonts.mullishregular,
  },
  containerinput: {
    marginBottom: 10,
  },
  btn: {
    backgroundColor: Colors.Primary,
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: "center",
    marginBottom: 15,
  },
  btntext: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.mullishsemibold,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkboxIcon: {
    marginRight: 8,
  },
});

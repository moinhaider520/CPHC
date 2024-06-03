import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useEffect, useState } from "react";
import { BASIC_URL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function AddNotesForClient({ route }) {
  const [authorid, setAuthorID] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [note, setNote] = useState("");
  const [latitude, setlatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationAvailable, setLocationAvailable] = useState(false);

  const [notetype, setNoteType] = useState("");
  const [optionsNote, setOptionsNote] = useState([]);

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [time, setTime] = useState(new Date(1598051730000));
  const [mode2, setMode2] = useState("time");
  const [show2, setShow2] = useState(false);

  const [capturedImage, setCapturedImage] = useState(null);


  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setCapturedImage(result.uri);
    }
  };

  const selectedDate = date.toISOString().split("T")[0]; // Get the selected date in "YYYY-MM-DD" format
  const formattedTime = time
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    .replace(/ /g, ""); // Get the selected time in "HH:mm" format

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setMode("date"); // Change the mode to 'date' if needed
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setMode("date");
    setShow(true);
  };

  const onChangeTime = (event, selectedTime) => {
    setShow2(false);

    if (event.type === "set" && selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(selectedTime);
    }
  };

  const showTimepicker = () => {
    setMode2("time");
    setShow2(true);
  };

  const [optionsName, setOptionsame] = useState([]);

  function CreateRoutine() {
    fetchUserLocation();
    if (latitude === "" || longitude === "") {
      // Check if latitude and longitude are empty and display an alert
      Alert.alert(
        "Please Enable Your Location & Wait For 2 Seconds Before Creating."
      );
      return;
    }
  
    const apiUrl = BASIC_URL + "createnotes.php";
  
    // Create a new FormData object
    const formData = new FormData();
    
    // Append your text data
    formData.append("clientid", route.params.clientID);
    formData.append("clientname", route.params.clientName);
    formData.append("authorid", authorid);
    formData.append("authorname", authorName);
    formData.append("note", note);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("date", selectedDate);
    formData.append("time", formattedTime);
    formData.append("note_type", notetype);
    formData.append("note_options", JSON.stringify(selectedOptions));
    formData.append("roaster",route.params.roasterId);
    formData.append("quick_notes", JSON.stringify(selectedQuickNotes));
  
    // Append the image data
    if (capturedImage) {
      const uriParts = capturedImage.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("image", {
        uri: capturedImage,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }
  
    const requestData = {
      method: "POST",
      body: formData,
    };
  
    fetch(apiUrl, requestData)
      .then((response) => response.text())
      .then((data) => {
        if(data == "success"){
          alert("Note Created");
        }else{
          alert("Failed to Create Note");
        }

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    FetchAuthor();
    fetchUserLocation();
    FetchNoteTypes();
    FetchNoteOptions();
    FetchQuickNotes();
  }, []);

  function FetchNoteOptions() {
    fetch(BASIC_URL + "fetch_note_options.php?id="+route.params.clientID)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setNoteOption(data); // Store all the data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function FetchQuickNotes(){
    fetch(BASIC_URL + 'fetch_quick_notes.php?id='+route.params.clientID)
      .then((response) => response.json())
      .then((data) => {
          setQuickNotes(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quicknotes,setQuickNotes] = useState([{id:"1",option:"Is Checked?"}])

  const handleCheckboxChange = (id) => {
    const updatedOptions = selectedOptions.includes(id)
      ? selectedOptions.filter((item) => item !== id)
      : [...selectedOptions, id];
    console.log(updatedOptions);
    setSelectedOptions(updatedOptions);
  };

  const handleQuickNotesChange = (id) => {
    const updatedOptions = selectedQuickNotes.includes(id)
    ? selectedQuickNotes.filter((item) => item !== id)
    : [...selectedQuickNotes, id];
    setSelectedQuickNotes(updatedOptions);
  };


  const [noteOption, setNoteOption] = useState([]);

  function FetchNoteTypes() {
    fetch(BASIC_URL + "fetch-note-types.php")
      .then((response) => response.json())
      .then((data) => {
        setOptionsNote(data); // Store all the data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  function FetchAuthor() {
    AsyncStorage.getItem("userData")
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data); // Parse the JSON string to an object
          setAuthorID(userData.id);
          setAuthorName(userData.username);
        }
      })
      .catch((error) => {
        console.error("Error saving data to AsyncStorage:", error);
      });
  }
  const [selectedQuickNotes,setSelectedQuickNotes] = useState([]);
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      setLocationAvailable(true);
    } else {
      // Permission denied, show an alert and request again after a delay
      Alert.alert(
        "Location permission not granted. Please grant location permission."
      );
      setTimeout(requestLocationPermission, 1000); // Request again after 1 second
    }
  };

  const fetchUserLocation = async () => {
    requestLocationPermission();

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setlatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (error) {
      console.error("Error fetching user location:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formcontainer}>
        <View style={styles.containerinput}>
          <Image
            source={require("../assets/notes.png")}
            style={styles.cardimage}
          />
          <Text style={styles.heading}>Create Your Notes!</Text>
          <TextInput
            style={styles.input}
            placeholder="Write your Notes Here.."
            multiline
            numberOfLines={20}
            textAlignVertical="top"
            onChangeText={(text) => setNote(text)}
          />
        </View>
        <View style={styles.containerinput}>
          <Text style={styles.label}>Note Type</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={notetype}
              onValueChange={(itemValue, itemIndex) => setNoteType(itemValue)}
            >
              {optionsNote.map((option) => (
                <Picker.Item label={option.name} value={option.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.containerinput}>
        <Text style={styles.label}>IIF Factors</Text>
        </View>  

        <View style={styles.containerinput}>
          {noteOption.map((option) => (
            <CustomCheckbox
              key={option.id}
              label={option.option_name}
              isChecked={selectedOptions.includes(option.id)}
              onPress={() => handleCheckboxChange(option.id)}
            />
          ))}
        </View>

        <View style={styles.containerinput}>
        <Text style={styles.label}>Quick Notes</Text>
        </View>  

        <View style={styles.containerinput}>
        {quicknotes.map((option) => (
        <CustomCheckbox
          key={option.id}
          label={option.option_name}
          isChecked={selectedQuickNotes.includes(option.id)}
          onPress={() => handleQuickNotesChange(option.id)}
      />
      ))}
        </View>
        {capturedImage && (
          <Image
            source={{ uri: capturedImage }}
            style={{ width: 200, height: 200 }}
          />
        )}
        <TouchableOpacity style={styles.btn} onPress={takePicture}>
          <Text style={styles.btntext}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => CreateRoutine()}>
          <Text style={styles.btntext}>Save Notes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const CustomCheckbox = ({ label, isChecked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
      <AntDesign
        name={isChecked ? "checksquare" : "minussquareo"}
        size={20}
        color="black"
        style={styles.checkboxIcon}
      />
      <View style={[styles.checkbox, isChecked && styles.checked]} />
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "2.5%",
    paddingBottom: 20,
  },
  formcontainer: {
    backgroundColor: Colors.White,
    marginVertical: 20,
    borderRadius: 5,
    elevation: 2,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 18,
    fontFamily: fonts.mullishregular,
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
  cardimage: {
    alignSelf: "center",
    marginVertical: 15,
    width: 70,
    height: 70,
  },
  heading: {
    textAlign: "center",
    fontSize: 22,
    marginBottom: 10,
    fontFamily: fonts.mullishsemibold,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkboxIcon: {
    marginRight: 8,
  },
});

import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Colors, fonts } from "../utils/styles";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { BASIC_URL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function AddNotes() {
  const [serviceuser, setServiceUser] = useState("");
  const [usertype, setUsertype] = useState("serviceusers");
  const [note, setNote] = useState("");
  const [options, setOptions] = useState([]);
  const [notetype, setNoteType] = useState("");
  const [quicknotetype,setQuickNoteType] = useState("7");
  const [quicknotetypeoption,setQuickNoteTypeOption] = useState([]);

  const [optionsNote, setOptionsNote] = useState([]);

  const [quickNoteOptions, setQuickNoteOptions] = useState([]);

  const [userdata, setUserData] = useState("");
  const [latitude, setlatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationAvailable, setLocationAvailable] = useState(false);

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [time, setTime] = useState(new Date(1598051730000));
  const [mode2, setMode2] = useState("time");
  const [show2, setShow2] = useState(false);
  const [useLocation, setUseLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

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

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const datefortest = new Date();
  const selectedDate = datefortest.toISOString().split("T")[0];

  const formattedTime = datefortest
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


  useEffect(() => {
    FetchNoteTypes();
    FetchNoteOptions();
    FetchQuickNotes();
    FetchQuickNotesType();
  }, [serviceuser,quicknotetype]);

  useEffect(() => {
    FetchServiceUsers();
  }, [usertype]);

  useEffect(() => {
    FetchQuickNotes();
  }, [quicknotetype]);

  function FetchServiceUsers() {
    fetch(BASIC_URL + "fetch_users.php?usertype=" + usertype)
      .then((response) => response.json())
      .then((data) => {
        setOptions(data); 
        setServiceUser(data[0].user_id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

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

  useEffect(() => {
    FetchAuthor();
    FetchLoginFunction();
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

  function CreateRoutine() {
    if (useLocation == "Y") {
      fetchUserLocation();
      if (latitude === "" || longitude === "") {
        Alert.alert(
          "Please Enable Your Location & Wait For 2 Seconds Before Creating."
        );
        return;
      }
    }
    showLoader();
    const apiUrl = BASIC_URL + "createnotes.php";

    const formData = new FormData();
    formData.append("clientid", serviceuser);
    formData.append("clientname", getSelectedUserName(serviceuser));
    formData.append("authorid", userdata.id);
    formData.append("authorname", userdata.username);
    formData.append("note", note);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("date", selectedDate);
    formData.append("time", formattedTime);
    formData.append("note_type", notetype);
    formData.append("quicknotetype", quicknotetype);
    formData.append("note_options", JSON.stringify(selectedOptions));
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
        if (data == "success") {
          hideLoader();
          alert("Note Created");
        } else {
          alert("Failed to Create Note");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function getSelectedUserName(selectedUserId) {
    const selectedUser = options.find(
      (option) => option.user_id === selectedUserId
    );
    return selectedUser ? selectedUser.firstname : "";
  }

  function FetchNoteOptions() {
    fetch(BASIC_URL + "fetch_note_options.php?id=" + serviceuser)
      .then((response) => response.json())
      .then((data) => {
        setNoteOption(data); // Store all the data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function FetchQuickNotes() {

    fetch(BASIC_URL + "fetch_quick_notes.php?id=" + serviceuser + "&note_type=" + quicknotetype)
      .then((response) => response.json())
      .then((data) => {
        setQuickNotes(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function FetchQuickNotesType() {
    fetch(BASIC_URL + "fetch_quick_notes_type.php?id=" + serviceuser)
      .then((response) => response.json())
      .then((data) => {
        setQuickNoteTypeOption(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedQuickNotes, setSelectedQuickNotes] = useState([]);

  const handleCheckboxChange = (id) => {
    const updatedOptions = selectedOptions.includes(id)
      ? selectedOptions.filter((item) => item !== id)
      : [...selectedOptions, id];
    setSelectedOptions(updatedOptions);
  };

  const handleQuickNotesChange = (id) => {
    const updatedOptions = selectedQuickNotes.includes(id)
      ? selectedQuickNotes.filter((item) => item !== id)
      : [...selectedQuickNotes, id];
    setSelectedQuickNotes(updatedOptions);
  };

  function FetchLoginFunction() {
    AsyncStorage.getItem("is_location")
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data); // Parse the JSON string to an object
          console.log(userData);
          setUseLocation(userData);
        }
      })
      .catch((error) => {
        console.error("Error saving data to AsyncStorage:", error);
      });
  }

  const [noteOption, setNoteOption] = useState([
    { id: "1", option: "Is Checked?" },
  ]);
  const [quicknotes, setQuickNotes] = useState([
    { id: "1", option: "Is Checked?" },
  ]);

  return (
    <ScrollView style={styles.container}>
      {isLoading == false ? (
      <View>
      <View style={styles.formcontainer}>
        <View style={styles.containerinput}>
          <Text style={styles.label}>User Type</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={usertype}
              onValueChange={(itemValue, itemIndex) => setUsertype(itemValue)}
            >
              <Picker.Item label="Service User" value="serviceusers" />
              <Picker.Item label="Staff Member" value="staff" />
              <Picker.Item
                label="Significant Others"
                value="significant_others"
              />
            </Picker>
          </View>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Choose User</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={serviceuser}
              onValueChange={(itemValue, itemIndex) =>
                setServiceUser(itemValue)
              }
            >
              {options.map((option) => (
                <Picker.Item label={option.firstname} value={option.user_id} />
              ))}
            </Picker>
          </View>
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
          <Text style={styles.label}>Quick Note Type</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={quicknotetype}
              onValueChange={(itemValue, itemIndex) => setQuickNoteType(itemValue)}
            >
              {quicknotetypeoption.map((option) => (
                <Picker.Item label={option.option_name} value={option.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.containerinput}>
          <TouchableOpacity
            // onPress={() => showDatepicker()}
            style={{
              borderWidth: 0.3,
              borderColor: Colors.Primary,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{ fontFamily: fonts.mullishbold, textAlign: "center" }}
            >
              Selected Date: {selectedDate}
            </Text>
          </TouchableOpacity>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
        <View style={styles.containerinput}>
          <TouchableOpacity
            // onPress={() => showTimepicker()}
            style={{
              borderWidth: 0.3,
              borderColor: Colors.Primary,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{ fontFamily: fonts.mullishbold, textAlign: "center" }}
            >
              Selected Time: {formattedTime}
            </Text>
          </TouchableOpacity>
        </View>
        {show2 && (
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode={mode2}
            is24Hour={true}
            onChange={onChangeTime}
          />
        )}

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

        <View style={styles.containerinput}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.input}
            placeholder="Write Note"
            onChangeText={(text) => setNote(text)}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.btn} onPress={takePicture}>
        <Text style={styles.btntext}>Take Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => CreateRoutine()}>
        <Text style={styles.btntext}>Create Notes</Text>
      </TouchableOpacity>
      </View>
      ):(
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{textAlign:"center",fontFamily:fonts.mullishbold}}>Please wait while your note is being created!</Text>
        </View>
      )}
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
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkboxIcon: {
    marginRight: 8,
  },
});

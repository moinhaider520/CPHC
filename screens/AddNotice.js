import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useEffect, useState } from "react";
import { BASIC_URL } from "../utils/constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function AddNotice() {
  const [description, setDescription] = useState("");

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [time, setTime] = useState(new Date(1598051730000));
  const [mode2, setMode2] = useState("time");
  const [show2, setShow2] = useState(false);

  const [userdata, setUserData] = useState("");

  useEffect(() => {
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
  }, []);

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

  function CreateNotice() {
    const apiUrl = BASIC_URL + "createnotice.php";
    const formData = new FormData();
    formData.append("userid", userdata.id);
    formData.append("username", userdata.username);
    formData.append("noticedescription", description);
    formData.append("date", selectedDate);
    formData.append("time", formattedTime);
    const requestData = {
      method: "POST",
      body: formData,
    };
    fetch(apiUrl, requestData)
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        alert("Notice Created");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formcontainer}>
        <View style={styles.containerinput}>
          <Text style={styles.label}>Notice</Text>
          <TextInput
            style={styles.input}
            placeholder="Write Notice Details"
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            onChangeText={(text) => setDescription(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <TouchableOpacity
            onPress={() => showDatepicker()}
            style={{
              borderWidth: 0.3,
              borderColor: Colors.Primary,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{ fontFamily: fonts.mullishbold, textAlign: "center" }}
            >
              Choose Date
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              fontFamily: fonts.mullishbold,
              color: Colors.Primary,
              marginVertical: 10,
            }}
          >
            Selected Date: {selectedDate}
          </Text>
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
            onPress={() => showTimepicker()}
            style={{
              borderWidth: 0.3,
              borderColor: Colors.Primary,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{ fontFamily: fonts.mullishbold, textAlign: "center" }}
            >
              Choose Time
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              fontFamily: fonts.mullishbold,
              color: Colors.Primary,
              marginVertical: 10,
            }}
          >
            Selected Time: {formattedTime}
          </Text>
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
        <TouchableOpacity style={styles.btn} onPress={() => CreateNotice()}>
          <Text style={styles.btntext}>Create Notice</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    fontFamily: fonts.mullishbold,
  },
  input: {
    borderWidth: 0.3,
    borderColor: Colors.GrayBoder1,
    borderRadius: 2,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: 5,
    fontFamily: fonts.mullishmedium,
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
});

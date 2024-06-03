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
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { BASIC_URL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export default function AddCarePlan() {
  const [serviceuser, setServiceUser] = useState("");
  const [currentSupport,setcurrentSupport] = useState("");
  const [desiredOutcome,setdesiredOutcome] = useState("");
  const [achieveOutcome,setachieveOutcome] = useState("");
  const [reviewdays,setReviewDays] = useState("");
  const [reminderDays,setReminderDays] = useState("");
  const [userdata, setUserData] = useState("");
  const [options, setOptions] = useState([]);
  const [optionsTimeFrame,setOptionsTimeFrame] = useState([{name:"Yearly",value:"Yearly"},{name:"6 Month",value:"6 Month"}])
  const [timeframe,setTimeframe] = useState("");
  useEffect(() => {
    FetchAuthor();
    FetchServiceUsers();
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

  function FetchServiceUsers() {
    fetch(BASIC_URL + "fetchusers.php")
      .then((response) => response.json())
      .then((data) => {
        setOptions(data); // Store all the data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleValueChange = (itemValue, itemIndex) => {
    const selectedOption = options.find(option => option.user_id === itemValue);
    const combinedValue = `${itemValue},${selectedOption.firstname}`;
    setServiceUser(combinedValue);
  };

  function AddCarePlan() {
    // if (latitude === "" || longitude === "") {
    //   // Check if latitude and longitude are empty and display an alert
    //   Alert.alert(
    //     "Please Enable Your Location & Wait For 2 Seconds Before Creating."
    //   );
    //   return;
    // }

    const apiUrl = BASIC_URL + "add_care_plan.php";

    // Create a new FormData object
    const formData = new FormData();
    formData.append("service_user", serviceuser);
    formData.append("care_and_support_needs", currentSupport);
    formData.append("authorid", userdata.id);
    formData.append("authorname", userdata.username);
    formData.append("desired_outcomes", desiredOutcome);
    formData.append("staff_support", achieveOutcome);
    formData.append("review_time_frame", timeframe);
    formData.append("reminder_days_before_review", reminderDays);
    formData.append("action_days", reviewdays);


    const requestData = {
      method: "POST",
      body: formData,
    };

    fetch(apiUrl, requestData)
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        if (data == "success") {
          alert("Care Plan Created");
        } else {
          alert("Failed to Create Care Plan");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formcontainer}>
        <View style={styles.containerinput}>
          <Text style={styles.label}>Service User</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={serviceuser}
              onValueChange={handleValueChange}
            >
              {options.map((option) => (
                <Picker.Item label={option.firstname} value={option.user_id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>What care and support needs do I currently have?:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter...."
            onChangeText={(text) => setcurrentSupport(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>What are my desired outcomes?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter..."
            onChangeText={(text) => setdesiredOutcome(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>How do I want staff to support me to achieve my desired outcomes?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter..."
            onChangeText={(text) => setachieveOutcome(text)}
          />
        </View>
        <View style={styles.containerinput}>
          <Text style={styles.label}>Review Time Frame</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={timeframe}
              onValueChange={(itemValue, itemIndex) => setTimeframe(itemValue)}
            >
              {optionsTimeFrame.map((option) => (
                <Picker.Item label={option.name} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Set Reminder:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Number of Days..."
            onChangeText={(text) => setReminderDays(text)}
          />
        </View>

      </View>

      <TouchableOpacity style={styles.btn} onPress={() => AddCarePlan()}>
        <Text style={styles.btntext}>Add Care Plan</Text>
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
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkboxIcon: {
    marginRight: 8,
  },
});

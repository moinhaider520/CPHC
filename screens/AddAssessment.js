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

export default function AddAssessment() {
  const [serviceuser, setServiceUser] = useState("");
  const [staff, setStaff] = useState("");
  const [assessmentName, setAssessmentName] = useState("");
  const [activity,setActivity] = useState("");
  const [hazards,setHazards] = useState("");
  const [affectedByHazards,setAffectedByHazards] = useState("");
  const [currentMeasures,setCurrentMeasues] = useState("");
  const [furtherMeasures,setFurtherMeasures] = useState("");
  const [reviewdays,setReviewDays] = useState("");
  const [reminderDays,setReminderDays] = useState("");
  const [level,setLevel] = useState("");
  const [userdata, setUserData] = useState("");
  const [options, setOptions] = useState([]);
  const [optionsStaff, setOptionsStaff] = useState([]);
  const [optionsLevel,setOptionsLevel] = useState([{name:"Low",value:"low"},{name:"Medium",value:"medium"},{name:"High",value:"high"}]);
  const [optionsTimeFrame,setOptionsTimeFrame] = useState([{name:"Yearly",value:"Yearly"},{name:"6 Month",value:"6 Month"}])
  const [timeframe,setTimeframe] = useState("");
  useEffect(() => {
    FetchAuthor();
    FetchServiceUsers();
    FetchStaff();
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

  function FetchStaff() {
    fetch(BASIC_URL + "fetchstaffusers.php")
      .then((response) => response.json())
      .then((data) => {
        setOptionsStaff(data); // Store all the data
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

  const handleValueChangeStaff = (itemValue, itemIndex) => {
    const selectedOption = optionsStaff.find(option => option.user_id === itemValue);
    const combinedValue = `${itemValue},${selectedOption.firstname}`;
    setStaff(combinedValue);
  };

  function AddAssessment() {
    // if (latitude === "" || longitude === "") {
    //   // Check if latitude and longitude are empty and display an alert
    //   Alert.alert(
    //     "Please Enable Your Location & Wait For 2 Seconds Before Creating."
    //   );
    //   return;
    // }

    const apiUrl = BASIC_URL + "add_assessment.php";

    // Create a new FormData object
    const formData = new FormData();
    formData.append("service_user", serviceuser);
    formData.append("activity_issue", activity);
    formData.append("authorid", userdata.id);
    formData.append("authorname", userdata.username);
    formData.append("hazards_identified", hazards);
    formData.append("current_risk_control", currentMeasures);
    formData.append("review_time_frame", timeframe);
    formData.append("reminder_days_before_review", reminderDays);
    formData.append("risk_name", assessmentName);
    formData.append("risk_level", level);
    formData.append("who_is_affected", affectedByHazards);
    formData.append("future_risk_control", furtherMeasures);
    formData.append("action_days", reviewdays);
    formData.append("staff_member", staff);


    const requestData = {
      method: "POST",
      body: formData,
    };

    fetch(apiUrl, requestData)
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        if (data == "success") {
          alert("Note Created");
        } else {
          alert("Failed to Create Note");
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
          <Text style={styles.label}>Assessment Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Assessment Name"
            onChangeText={(text) => setAssessmentName(text)}
          />
        </View>

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
          <Text style={styles.label}>Staff Member</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={staff}
              onValueChange={handleValueChangeStaff}
            >
              {optionsStaff.map((option) => (
                <Picker.Item label={option.firstname} value={option.user_id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Risk Level</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={level}
              onValueChange={(itemValue, itemIndex) => setLevel(itemValue)}
            >
              {optionsLevel.map((option) => (
                <Picker.Item label={option.name} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Activity/Issue Being Assessed:</Text>
          <TextInput
            style={styles.input}
            placeholder="Activity/Issue Being Assessed"
            onChangeText={(text) => setActivity(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Hazards Identified:</Text>
          <TextInput
            style={styles.input}
            placeholder="Hazards Identified"
            onChangeText={(text) => setHazards(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Who might be affected by Hazards:</Text>
          <TextInput
            style={styles.input}
            placeholder="Who might be affected by Hazards"
            onChangeText={(text) => setAffectedByHazards(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Current Risk Control Measures in place:</Text>
          <TextInput
            style={styles.input}
            placeholder="Current Risk Control Measures in place"
            onChangeText={(text) => setCurrentMeasues(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Further Risk Control Measures that need to be put into place:</Text>
          <TextInput
            style={styles.input}
            placeholder="Further Risk Control Meas....."
            onChangeText={(text) => setFurtherMeasures(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Action Required After Days:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Number of Days..."
            onChangeText={(text) => setReviewDays(text)}
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

      <TouchableOpacity style={styles.btn} onPress={() => AddAssessment()}>
        <Text style={styles.btntext}>Add Assessment</Text>
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

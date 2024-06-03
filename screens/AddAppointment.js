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
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function AddAppointment() {
  const [serviceuser, setServiceUser] = useState("");
  const [staff, setStaff] = useState("");
  const [significantOther, setSignificantOther] = useState("");
  const [reminder, setReminder] = useState("");
  const [userdata, setUserData] = useState("");
  const [options, setOptions] = useState([]);
  const [optionsStaff, setOptionsStaff] = useState([]);
  const [optionsSignificant, setoptionsSignificant] = useState([]);
  const [optionAppointment, setOptionAppointment] = useState([]);
  const [sendReminder, setSendReminder] = useState(false);
  const [sendMessage, setSendMessage] = useState(false);
  const [sendnotice, setsendNotice] = useState(false);
  const [notice, setNotice] = useState("");
  const [details, setDetails] = useState("");
  const [teams, setTeams] = useState("");
  const [teamOption, setTeamOption] = useState([]);

  useEffect(() => {
    FetchAuthor();
    FetchTeams();
    FetchServiceUsers();
    FetchStaff(0);
    FetchSignificantOthers();
    FetchAppointmentOptions();
  }, []);

  useEffect(() => {
    FetchStaff(teams);
  }, [teams]);

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
        console.log(options);
        setOptions(data); // Store all the data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function FetchStaff(teamid) {
    fetch(BASIC_URL + "fetchstaffusers_by_team.php?id=" + teamid)
      .then((response) => response.json())
      .then((data) => {
        setOptionsStaff(data);
        console.log(teams);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function FetchTeams() {
    fetch(BASIC_URL + "fetch_teams.php")
      .then((response) => response.json())
      .then((data) => {
        setTeamOption(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function FetchSignificantOthers() {
    fetch(BASIC_URL + "fetchsignificantusers.php")
      .then((response) => response.json())
      .then((data) => {
        setoptionsSignificant(data); // Store all the data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function FetchAppointmentOptions() {
    fetch(BASIC_URL + "fetch_appointment_reminders.php")
      .then((response) => response.json())
      .then((data) => {
        setOptionAppointment(data); // Store all the data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleServiceUserChange = (user_id) => {
    const updatedOptions = serviceuser.includes(user_id)
      ? serviceuser.filter((item) => item !== user_id)
      : [...serviceuser, user_id];
    setServiceUser(updatedOptions);
  };

  const handleStaffChange = (user_id) => {
    const updatedOptions = staff.includes(user_id)
      ? staff.filter((item) => item !== user_id)
      : [...staff, user_id];
    setStaff(updatedOptions);
  };

  const handleSignificantChange = (user_id) => {
    const updatedOptions = significantOther.includes(user_id)
      ? significantOther.filter((item) => item !== user_id)
      : [...significantOther, user_id];
    setSignificantOther(updatedOptions);
  };

  const [date, setDate] = useState(new Date());
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [showTimepicker, setShowTimepicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatepicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimepicker(Platform.OS === "ios");
    if (event.type === "set" && selectedTime) {
      const selectedDate = new Date(date);
      selectedDate.setHours(selectedTime.getHours());
      selectedDate.setMinutes(selectedTime.getMinutes());
      setDate(selectedDate);
    }
  };

  function AddAppointment() {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedTime = `${hours}:${minutes}`;
    const formattedDate = `${year}-${month}-${day}`;
    const apiUrl = BASIC_URL + "create-appointment.php";

    // Create a new FormData object
    const formData = new FormData();
    formData.append("staff", staff);
    formData.append("seerviceuser", serviceuser);
    formData.append("authorid", userdata.id);
    formData.append("authorname", userdata.username);
    formData.append("significantother", significantOther);
    formData.append("date", formattedDate);
    formData.append("time", formattedTime);
    formData.append("appointment_details", details);
    formData.append("send_email", sendReminder);
    formData.append("send_notification", sendMessage);
    formData.append("create_notice", sendnotice);
    formData.append("send_reminder", reminder);
    formData.append("staffmemberteams", teams);
    formData.append("notice_details", details);

    console.log(date.toDateString());
    const requestData = {
      method: "POST",
      body: formData,
    };

    fetch(apiUrl, requestData)
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        if (data == "success") {
          alert("Appointment Created");
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
          <Text style={styles.label}>Choose Staff Team</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={teams}
              onValueChange={(itemValue, itemIndex) => setTeams(itemValue)}
            >
              {teamOption.map((option) => (
                <Picker.Item label={option.name} value={option.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Staff Members</Text>
          <View>
            {optionsStaff.map((option) => (
              <CustomCheckbox
                key={option.user_id}
                label={option.firstname}
                isChecked={staff.includes(option.user_id)}
                onPress={() => handleStaffChange(option.user_id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Service User</Text>
          <View>
            {options.map((option) => (
              <CustomCheckbox
                key={option.user_id}
                label={option.firstname}
                isChecked={serviceuser.includes(option.user_id)}
                onPress={() => handleServiceUserChange(option.user_id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Significant Others</Text>
          <View>
            {optionsSignificant.map((option) => (
              <CustomCheckbox
                key={option.user_id}
                label={option.firstname}
                isChecked={significantOther.includes(option.user_id)}
                onPress={() => handleSignificantChange(option.user_id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.containerinput}>
          <TouchableOpacity
            onPress={() => setShowDatepicker(true)}
            style={{
              borderWidth: 0.3,
              borderColor: Colors.Primary,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{ fontFamily: fonts.mullishbold, textAlign: "center" }}
            >
              Selected Date: {date.toDateString()}
            </Text>
          </TouchableOpacity>
        </View>
        {showDatepicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            onChange={onChangeDate}
          />
        )}
        <View style={styles.containerinput}>
          <TouchableOpacity
            onPress={() => setShowTimepicker(true)}
            style={{
              borderWidth: 0.3,
              borderColor: Colors.Primary,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{ fontFamily: fonts.mullishbold, textAlign: "center" }}
            >
              Selected Time: {date.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>
        {showTimepicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="time"
            is24Hour={true}
            onChange={onChangeTime}
          />
        )}

        <View style={styles.containerinput}>
          <Text style={styles.label}>Appointment Details:</Text>
          <TextInput
            style={styles.input}
            placeholder="Details..."
            onChangeText={(text) => setDetails(text)}
          />
        </View>

        <TouchableOpacity
          onPress={() => setSendReminder(!sendReminder)}
          style={styles.checkboxContainer}
        >
          <AntDesign
            name={sendReminder ? "checksquare" : "minussquareo"}
            size={20}
            color="black"
            style={styles.checkboxIcon}
          />
          <View style={[styles.checkbox, sendReminder && styles.checked]} />
          <Text>Send Email Reminder to People Involved</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSendMessage(!sendMessage)}
          style={styles.checkboxContainer}
        >
          <AntDesign
            name={sendMessage ? "checksquare" : "minussquareo"}
            size={20}
            color="black"
            style={styles.checkboxIcon}
          />
          <View style={[styles.checkbox, sendMessage && styles.checked]} />
          <Text>Send message reminder to staff Member involved mobile App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setsendNotice(!sendnotice)}
          style={styles.checkboxContainer}
        >
          <AntDesign
            name={sendnotice ? "checksquare" : "minussquareo"}
            size={20}
            color="black"
            style={styles.checkboxIcon}
          />
          <View style={[styles.checkbox, sendnotice && styles.checked]} />
          <Text>Send appointment to staff noticeboard (if applicable)</Text>
        </TouchableOpacity>

        {sendnotice && (
          <View style={styles.containerinput}>
            <Text style={styles.label}>Notice:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter...."
              onChangeText={(text) => setNotice(text)}
            />
          </View>
        )}

        <View style={styles.containerinput}>
          <Text style={styles.label}>Appointment reminder</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={reminder}
              onValueChange={(itemValue, itemIndex) => setReminder(itemValue)}
            >
              {optionAppointment.map((option) => (
                <Picker.Item label={option.title} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => AddAppointment()}>
        <Text style={styles.btntext}>Add Appointment</Text>
      </TouchableOpacity>
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkboxIcon: {
    marginRight: 8,
  },
});

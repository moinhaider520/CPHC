import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BASIC_URL } from "../utils/constants";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
export default function AddStaff() {
  const [firstname, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [prefferedShift, setPrefferedShift] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [induction, setInduction] = useState(false);
  const [training, setTraining] = useState(false);
  const [probation, setProbation] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("Upload CV");
  const [selectedCertificate, setSelectedCertificate] =
    useState("Upload Certificate");

  const [allocatedWeekHours,setAllocatedWeekHours] = useState(0);
  const [allocatedBankHours,setAllocatedBankHours] = useState(0);
  const [management,setManagement] = useState(false);

  const [allocatedOvertimeHours,setAllocatedOvertimeHours] = useState(0);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    const dateObject = new Date(currentDate);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(dateObject.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const toggleSwitch = () => {
    setInduction((prevState) => !prevState);
  };

  const toggleSwitch2 = () => {
    setTraining((prevState) => !prevState);
  };

  const toggleSwitch3 = () => {
    setProbation((prevState) => !prevState);
  };

  const toggleSwitch4 = () => {
    setManagement((prevState) => !prevState);
  };

  const [dateEmployment, setDateEmployment] = useState(new Date(1598051730000));
  const [mode2, setMode2] = useState("date");
  const [show2, setShow2] = useState(false);

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow2(false);
    const dateObject = new Date(currentDate);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(dateObject.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);
    setDateEmployment(formattedDate);
  };

  const showMode2 = (currentMode) => {
    setShow2(true);
    setMode2(currentMode);
  };

  const showDatepicker2 = () => {
    showMode2("date");
  };

  const createStaff = () => {
    // Replace 'your-api-url' with the actual URL of your PHP API

    if (
      firstname === "" ||
      surname === "" ||
      address === "" ||
      telephone === "" ||
      email === "" ||
      password === ""
    ) {
      alert("Please Fill in All The Fields");
      return;
    }
    const apiUrl = BASIC_URL + "createstaff.php";
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("surname", surname);
    formData.append("dateofbirth", date);
    formData.append("dateEmployment", dateEmployment);
    formData.append("address", address);
    formData.append("telephone", telephone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("position", position);
    formData.append("prefferedshift", prefferedShift);
    formData.append("induction", induction);
    formData.append("training", training);
    formData.append("probation", probation);
    formData.append("contracted_hours", allocatedWeekHours);
    formData.append("overtime_hours", allocatedOvertimeHours);
    formData.append("bank_hours", allocatedBankHours);
    formData.append("is_management", management);
    if (selectedDocument?.assets?.length > 0) {
      formData.append("cv", {
        uri: selectedDocument.assets[0].uri,
        type: "application/pdf", // Set the correct MIME type
        name: selectedDocument.assets[0].name,
      });
    }
    // Check if a certificate is selected and append it to the formData
    if (selectedCertificate?.assets?.length > 0) {
      formData.append("certificate", {
        uri: selectedCertificate.assets[0].uri,
        type: "application/pdf", // Set the correct MIME type
        name: selectedCertificate.assets[0].name,
      });
    }

    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "multipart/form-data");
    axios
      .post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data.status === "success") {
          Alert.alert("Success", "Staff Created");
        } else {
          Alert.alert(
            "Error",
            "Email for this User Already Exists. Please Use another Email Address."
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert(
          "Error",
          "Network request failed. Please check your connection."
        );
      });
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf", // Specify the MIME type for PDF files
    });
    setSelectedDocument(result);
  };

  const pickCertificate = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf", // Specify the MIME type for PDF files
    });
    setSelectedCertificate(result);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formcontainer}>
        <View style={styles.containerinput}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={(text) => setFirstName(text)}
          />
        </View>
        <View style={styles.containerinput}>
          <Text style={styles.label}>Sur Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Sur Name"
            onChangeText={(text) => setSurname(text)}
          />
        </View>
        <View style={styles.containerinput}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => showDatepicker()}
          >
            <Text>Date of Birth</Text>
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
          <Text style={styles.label}>Allocated Contracted Hours Per Week</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of Hours"
            onChangeText={(text) => setAllocatedWeekHours(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Allocated Bank Hours Per Week</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of Hours"
            onChangeText={(text) => setAllocatedBankHours(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Allocated Overtime Hours Per Week</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of Hours"
            onChangeText={(text) => setAllocatedOvertimeHours(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Address"
            onChangeText={(text) => setAddress(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Telephone / Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Telephone / Mobile Number"
            onChangeText={(text) => setTelephone(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Preffered Shift Pattern</Text>
          <TextInput
            style={styles.input}
            placeholder="Preffered Shift Pattern"
            onChangeText={(text) => setPrefferedShift(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Include in Management Staff?</Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={management ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleSwitch4  }
            value={management}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Position</Text>
          <Picker
            selectedValue={position}
            onValueChange={(itemValue, itemIndex) => setPosition(itemValue)}
          >
            <Picker.Item label="Manager" value="Manager" />
            <Picker.Item label="CEO" value="CEO" />
            <Picker.Item label="Finance manager" value="Finance manager" />
            <Picker.Item label="Team leader" value="Team leader" />
            <Picker.Item label="Supervisor" value="Supervisor" />
            <Picker.Item label="Deputy manager" value="Deputy manager" />
            <Picker.Item label="Director" value="Director" />
            <Picker.Item
              label="Director of services"
              value="Director of services"
            />
            <Picker.Item
              label="Operations manager"
              value="Operations manager"
            />
            <Picker.Item label="IT Admin" value="IT Admin" />
          </Picker>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Date of Employment</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => showDatepicker2()}
          >
            <Text>Date of Employment</Text>
          </TouchableOpacity>
        </View>
        {show2 && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateEmployment}
            mode={mode2}
            is24Hour={true}
            onChange={onChange2}
          />
        )}

        <View style={styles.containerinput}>
          <View style={styles.row}>
            <View style={styles.width50}>
              <Text style={styles.label}>Induction Done?</Text>
              <Switch
                style={styles.switch}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={induction ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={induction}
              />
            </View>
            <View style={styles.width50}>
              <Text style={styles.label}>Still on Probation?</Text>
              <Switch
                style={styles.switch}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={probation ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleSwitch3}
                value={probation}
              />
            </View>
          </View>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Mandatory Training Done?</Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={training ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleSwitch2}
            value={training}
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => pickDocument()}>
          <Text style={styles.btntext}>Upload CV</Text>
        </TouchableOpacity>

        {selectedDocument?.assets?.length > 0 && (
          <View style={styles.selectedcontainer}>
            <Text style={styles.selectetext}>CV Selected</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btn} onPress={() => pickCertificate()}>
          <Text style={styles.btntext}>Upload Certificate</Text>
        </TouchableOpacity>

        {selectedCertificate?.assets?.length > 0 && (
          <View style={styles.selectedcontainer}>
            <Text style={styles.selectetext}>Certificate Selected</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btn} onPress={() => createStaff()}>
          <Text style={styles.btntext}>Create Staff</Text>
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
    marginBottom: 20,
    borderRadius: 5,
    elevation: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  label: {
    fontSize: 17,
    fontFamily: fonts.mullishsemibold,
    marginBottom: 5,
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
  width50: {
    width: "48%",
    paddingHorizontal: "1%",
  },
  row: {
    flexDirection: "row",
  },
  switch: {
    alignSelf: "flex-start",
  },
  selectedcontainer: {
    backgroundColor: Colors.Primary,
    width: 150,
    justifyContent: "center",
    borderRadius: 20,
    paddingVertical: 5,
    marginVertical: 10,
  },
  selectetext: {
    textAlign: "center",
    color: "#fff",
    fontFamily: fonts.mullishbold,
  },
});

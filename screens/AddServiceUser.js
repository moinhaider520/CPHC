import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BASIC_URL } from "../utils/constants";
export default function AddServiceUser() {
  const [firstname, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [prefferedname, setPrefferedName] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [legalrepresentative, setLegalRepresentative] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [privateClient, setPrivateClient] = useState(false);

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const toggleSwitch = () => {
    setPrivateClient((prevState) => !prevState);
  };

  function CreateServiceUser() {
    if (
      firstname === "" ||
      surname === "" ||
      prefferedname === "" ||
      address === "" ||
      telephone === "" ||
      email === "" ||
      password === "" ||
      legalrepresentative === "" ||
      allergies === "" ||
      diagnosis === ""
    ) {
      alert("Please Fill in All The Fields");
      return;
    }

    const apiUrl = BASIC_URL + "createserviceuser.php"; // Replace with the actual URL

    // // Prepare the request data
    const requestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `firstname=${firstname}&surname=${surname}&prefferedname=${prefferedname}&dateofbirth=${date}&address=${address}&telephone=${telephone}&email=${email}&password=${password}&legalrepresentative=${legalrepresentative}&allergies=${allergies}&diagnosis=${diagnosis}&is_private=${privateClient}`,
    };
    fetch(apiUrl, requestData)
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        if (data.trim() === "success") {
          alert("Service User Created");
        } else {
          alert(
            "Email For this User Already Exists. Please Use another Email Address."
          );
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
          <Text style={styles.label}>Preffered Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Preffered Name"
            onChangeText={(text) => setPrefferedName(text)}
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
          <Text style={styles.label}>Is Service User a Private Client?</Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={privateClient ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={privateClient}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Legal Representive Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Legal Representive Name"
            onChangeText={(text) => setLegalRepresentative(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Allergies</Text>
          <TextInput
            style={styles.input}
            placeholder="Allergies"
            onChangeText={(text) => setAllergies(text)}
          />
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Diagnosis</Text>
          <TextInput
            style={styles.input}
            placeholder="Diagnosis"
            onChangeText={(text) => setDiagnosis(text)}
          />
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => CreateServiceUser()}
        >
          <Text style={styles.btntext}>Create Service User</Text>
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
  switch: {
    alignSelf: "flex-start",
  },
});

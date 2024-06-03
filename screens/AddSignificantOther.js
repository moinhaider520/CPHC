import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BASIC_URL } from "../utils/constants";
import { Picker } from "@react-native-picker/picker";
export default function AddSignificantOther() {
  const [firstname, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedType, setSelectedType] = useState();
  const [options, setOptions] = useState([]);
  const [serviceUser, setServiceUser] = useState("");
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

  useEffect(() => {
    FetchServiceUsers();
  }, []);
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

  function CreateServiceUser() {
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

    const apiUrl = BASIC_URL + "createsignificantother.php"; // Replace with the actual URL

    // // Prepare the request data
    const requestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `firstname=${firstname}&surname=${surname}&dateofbirth=${date}&address=${address}&telephone=${telephone}&email=${email}&password=${password}&significancetype=${selectedType}&service_user=${serviceUser}`,
    };
    fetch(apiUrl, requestData)
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        if (data.trim() === "success") {
          alert("Significant Other Created");
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
          <Text style={styles.label}>Significant Other Type</Text>
          <Picker
            selectedValue={selectedType}
            onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}
          >
            <Picker.Item label="Next of kin" value="Next of kin" />
            <Picker.Item label="GP" value="GP" />
            <Picker.Item label="Social worker" value=" Social worker" />
            <Picker.Item label="Wife" value="Wife" />
            <Picker.Item label="Husband" value="Husband" />
            <Picker.Item label="Son" value="Son" />
            <Picker.Item label="Daughter" value="Daughter" />
            <Picker.Item label="Power of Attorney" value="Power of Attorney" />
            <Picker.Item label="Legal Guardian" value="Legal Guardian" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <View style={styles.containerinput}>
          <Text style={styles.label}>Service Users</Text>
          <View style={{ borderWidth: 0.3, borderColor: Colors.GrayBoder2 }}>
            <Picker
              selectedValue={serviceUser}
              onValueChange={(itemValue, itemIndex) =>
                setServiceUser(itemValue)
              }
            >
              {options.map((option) => (
                <Picker.Item label={option.firstname} value={option.id} />
              ))}
            </Picker>
          </View>
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

        <TouchableOpacity
          style={styles.btn}
          onPress={() => CreateServiceUser()}
        >
          <Text style={styles.btntext}>Create Significant Other</Text>
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
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
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
});

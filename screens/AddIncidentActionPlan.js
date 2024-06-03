import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { BASIC_URL } from "../utils/constants";
import moment from "moment/moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function AddIncidentActionPlan({route}){
  const IncidentID = route.params.incidentID;

  const [userData,setUserData] = useState("");
  const [peopleInvolved,setpeopleInvolved] = useState("");
  const [location,setLocation] = useState("");

  const [leadName,setLeadName] = useState("");
  const [incidentDetails,setincidentDetails] = useState("");

  const [achievement,setAchievement] = useState("");
  const [summary,setSummary] = useState("");

  const [position,setPosition] = useState("");
  const [positionOptions,setPositionOptions] = useState([]);
  const [customPosition,setCustomPosition] = useState("NoOption");

  const [actionPlan,setActionPlan] = useState("");
  const actionplanoptions = [{id:"1",name:"Option 1"},{id:"2",name:"Option 2"},{id:3,name:"Option 3"}]

  const [dateofcompletion,setDateofCompletion] = useState(new Date());
  const [showDatePicker2,setShowDatePicker2] = useState(false);

  const handleDateChange2 = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowDatePicker2(false); // Close the date picker
    setDateofCompletion(currentTime);
  };

  const showDatePickerModal2 = () => {
    setShowDatePicker2(true);
  };

  const [time,setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowDatePicker(false); // Close the date picker
    setTime(currentTime);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };



  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
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
    showMode('date');
  };


    useEffect(() => {
    FetchAuthor();
    FetchPositions();
    }, []);

    function FetchAuthor(){
        AsyncStorage.getItem('userData')
              .then((data) => {
                if(data){
                    const userData = JSON.parse(data); // Parse the JSON string to an object
                    setUserData(userData);
                }
              })
              .catch((error) => {
              console.error('Error saving data to AsyncStorage:', error);
              });
    }

    function FetchPositions(){
      fetch(BASIC_URL + 'fetchpositions.php')
        .then((response) => response.json())
        .then((data) => {
            setPositionOptions(data); // Store all the data
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    
      const formattedDate = moment(date).format('DD-MM-YYYY');

      const formattedCompletionDate = moment(dateofcompletion).format('YYYY-DD-MM');

      function CreateIncidentActionPlan(){
        const formattedtime = moment(time).format('hh:mm');
        const apiUrl = BASIC_URL+'create-incident-action-plan.php'; // Replace with the actual URL

        const requestData = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `date=${formattedDate}&time=${formattedtime}&people_involved=${peopleInvolved}&location=${location}&lead_name=${leadName}&position=${position}&timeframe=${formattedCompletionDate}&achievement=${achievement}&summary=${summary}&actionplan=${actionPlan}&access_level_id=${userData.id}&incident_investigation_id=${IncidentID}`,
        };
        console.log(requestData);
        fetch(apiUrl, requestData)
          .then((response) => response.text())
          .then((data) => {
            console.log(data);
            if (data.trim() === 'success') {
                alert("Incident Investigation Created");
            } else {
              alert('Operation Failed. Please Check Details!');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }


    function CreatePosition(){
        if(customPosition === ""){
            alert("Please Enter Custom Position Value");
            return false;
        }
        const apiUrl = BASIC_URL+'add-positions-menu.php'; // Replace with the actual URL

        const requestData = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `position_option=${customPosition}`,
        };

        fetch(apiUrl, requestData)
          .then((response) => response.text())
          .then((data) => {
            if (data.trim() === 'success') {
                alert("Position Option Created");
            } else {
              alert('Position Option Already Exists');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }
    return(
        <ScrollView style={styles.container}>
            <View style={styles.formcontainer}>
                <View style={styles.containerinput}>
                    <Text style={styles.label}>Date of Action</Text>
                    <TouchableOpacity style={styles.input} onPress={()=>showDatepicker()}>
                            <Text>{formattedDate}</Text>
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
                    <Text style={styles.label}>Time of Action</Text>
                    <TouchableOpacity style={styles.input} onPress={showDatePickerModal}>
                    <Text>{moment(time).format('hh:mm A')}</Text>
                    </TouchableOpacity>
                </View>
                {showDatePicker && (
                    <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                    />
                )}

                <View style={styles.containerinput}>
                    <Text style={styles.label}>Time Frame of Completion</Text>
                    <TouchableOpacity style={styles.input} onPress={showDatePickerModal2}>
                    <Text>{formattedCompletionDate}</Text>
                    </TouchableOpacity>
                </View>
                {showDatePicker2 && (
                    <DateTimePicker
                    value={dateofcompletion}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange2}
                    />
                )}

                <View style={styles.containerinput}>
                    <Text style={styles.label}>People Involved</Text>
                    <TextInput style={styles.input} placeholder="People Involved" onChangeText={(text)=>setpeopleInvolved(text)}/>
                </View>

                
                
                <View style={styles.containerinput}>
                    <Text style={styles.label}>Action Lead Name</Text>
                    <TextInput style={styles.input} placeholder="Action Lead Name" onChangeText={(text)=>setLeadName(text)}/>
                </View>
                <View style={styles.containerinput}>
                <Text style={styles.label}>Position of Action Lead</Text>
                    <View style={{borderWidth:0.3,borderColor:Colors.GrayBoder2}}>
                    <Picker
                    selectedValue={position}
                    onValueChange={(itemValue, itemIndex) =>
                    setPosition(itemValue)
                    }>
                        <Picker.Item label="Choose Action Lead Position" value=""/>
                        {positionOptions.map((option) => (
                        <Picker.Item label={option.name} value={option.name} />
                        ))}
                        <Picker.Item label="Others" value="Others"/>
                    </Picker>
                 </View>
                </View>
                
                {position=="Others"&&(
                <View style={styles.containerinput}>
                    <Text style={styles.label}>Position Name</Text>
                    <TextInput style={styles.input} placeholder="Position Name" onChangeText={(text)=>setCustomPosition(text)} />
                    <Text style={styles.label}>Do you want to add this position to the main dropdown menu?</Text>
                    <TouchableOpacity style={styles.btn} onPress={()=>CreatePosition()}>
                        <Text style={styles.btntext}>YES</Text>
                    </TouchableOpacity>
                </View>
                )}
                
                <View style={styles.containerinput}>
                    <Text style={styles.label}>Location</Text>
                    <TextInput style={styles.input} placeholder="Location" onChangeText={(text)=>setLocation(text)} />
                </View>

                <View style={styles.containerinput}>
                <Text style={styles.label}>Action Plan</Text>
                <View style={{borderWidth:0.3,borderColor:Colors.GrayBoder2}}>
                    <Picker
                    selectedValue={actionPlan}
                    onValueChange={(itemValue, itemIndex) =>
                    setActionPlan(itemValue)
                    }>
                        <Picker.Item label="Choose Action Plan" value=""/>
                        {actionplanoptions.map((option) => (
                        <Picker.Item label={option.name} value={option.name} />
                        ))}
                    </Picker>
                    </View>
                </View>

                <View style={styles.containerinput}>
                <Text style={styles.label}>Action Plan Achievement</Text>
                    <View style={{borderWidth:0.3,borderColor:Colors.GrayBoder2}}>
                    <Picker
                    selectedValue={achievement}
                    onValueChange={(itemValue, itemIndex) =>
                    setAchievement(itemValue)
                    }>
                        <Picker.Item label="Choose Achievement" value=""/>
                        <Picker.Item label="Yes" value="Yes"/>
                        <Picker.Item label="No" value="No"/>
                        <Picker.Item label="In Progress" value="In Progress"/>
                    </Picker>
                 </View>
                </View>

                {achievement=="Yes"&&(
                   <View style={styles.containerinput}>
                   <Text style={styles.label}>Action Plan Summary</Text>
                   <TextInput style={styles.input} placeholder="Summary" onChangeText={(text)=>setSummary(text)} />
                  </View>
                )}

                <TouchableOpacity style={styles.btn} onPress={()=>CreateIncidentActionPlan()}>
                    <Text style={styles.btntext}>Create Action Plan</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:"2.5%",
        paddingBottom:20
    },
    formcontainer:{
        backgroundColor:Colors.White,
        marginVertical:20,
        borderRadius:5,
        elevation:2,
        paddingHorizontal:5
    },
    label:{
        fontSize:18,
        fontFamily:fonts.mullishregular
    },
    input:{
        borderWidth:0.3,
        borderColor:Colors.Platinum,
        borderRadius:2,
        paddingVertical:7,
        paddingHorizontal:10,
        marginTop:5,
        fontFamily:fonts.mullishregular
    },
    containerinput:{
        marginBottom:10
    },
    btn:{
        backgroundColor:Colors.Primary,
        borderRadius:10,
        paddingVertical:15,
        justifyContent:"center",
        marginBottom:15
    },
    btntext:{
        textAlign:"center",
        color:"#fff",
        fontSize:18,
        fontFamily:fonts.mullishsemibold
    }
})
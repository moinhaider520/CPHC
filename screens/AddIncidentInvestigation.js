import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { BASIC_URL } from "../utils/constants";
import moment from "moment/moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function AddIncidentInvestigation({route}){
  const IncidentID = route.params.incidentID;
  const [userData,setUserData] = useState("");
  const [peopleInvolved,setpeopleInvolved] = useState("");
  const [location,setLocation] = useState("");
  const [investigatorName,setInvestigatorName] = useState("");
  const [incidentDetails,setincidentDetails] = useState("");

  const [position,setPosition] = useState("");
  const [positionOptions,setPositionOptions] = useState([]);
  const [customPosition,setCustomPosition] = useState("NoOption");

  const [result,setResult] = useState("");
  const resultoptions = [{id:"1",name:"Option 1"},{id:"2",name:"Option 2"},{id:3,name:"Option 3"}]

  const [actionPlan,setActionPlan] = useState("");
  const actionplanoptions = [{id:"1",name:"Option 1"},{id:"2",name:"Option 2"},{id:3,name:"Option 3"}]

  const [posibbleTrigger,setPossibleTrigger] = useState("");
  const triggeroptions = [{id:"1",name:"Headache"},{id:"2",name:"Heart Failure"},{id:3,name:"Brain Hammeroge"}]

  const [recommendation,setRecommendation] = useState("");
  const [recommendationOptions,setRecommendationOptions] = useState([]);
  const [customRecommendation,setCustomRecommendation] = useState("NoOption");

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
    FetchRecommendations();
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

      function FetchRecommendations(){
        fetch(BASIC_URL + 'fetchrecommendations.php')
          .then((response) => response.json())
          .then((data) => {
              setRecommendationOptions(data); // Store all the data
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    
      const formattedDate = moment(date).format('DD-MM-YYYY');

      function CreateIncidentInvestigation(){
        const formattedtime = moment(time).format('hh:mm');
        const apiUrl = BASIC_URL+'create-incident-investigation.php'; // Replace with the actual URL

        const requestData = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `date=${formattedDate}&time=${formattedtime}&people_involved=${peopleInvolved}&location=${location}&investigator_name=${investigatorName}&position=${position}&details=${incidentDetails}&result=${result}&recommendations=${recommendation}&actionplan=${actionPlan}&access_level_id=${userData.id}&custom_recommendation=${customRecommendation}&custom_position=${customPosition}&incident_report_id=${IncidentID}`,
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

    function CreateRecommendation(){
        if(customRecommendation === ""){
            alert("Please Enter Custom Recommendation Value");
            return false;
        }
        const apiUrl = BASIC_URL+'add-recommendations-menu.php'; // Replace with the actual URL

        const requestData = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `recommendation_option=${customRecommendation}`,
        };

        fetch(apiUrl, requestData)
          .then((response) => response.text())
          .then((data) => {
            console.log(data);
            if (data.trim() === 'success') {
                alert("Recommendation Option Created");
            } else {
              alert('Recommendation Option Already Exists');
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
                    <Text style={styles.label}>Date of Investigation</Text>
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
                    <Text style={styles.label}>Time of Investigation</Text>
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
                    <Text style={styles.label}>People Involved</Text>
                    <TextInput style={styles.input} placeholder="People Involved" onChangeText={(text)=>setpeopleInvolved(text)}/>
                </View>

                
                
                <View style={styles.containerinput}>
                    <Text style={styles.label}>Investigator Name</Text>
                    <TextInput style={styles.input} placeholder="Investigator Name" onChangeText={(text)=>setInvestigatorName(text)}/>
                </View>
                <View style={styles.containerinput}>
                <Text style={styles.label}>Position of Investigator</Text>
                    <View style={{borderWidth:0.3,borderColor:Colors.GrayBoder2}}>
                    <Picker
                    selectedValue={position}
                    onValueChange={(itemValue, itemIndex) =>
                    setPosition(itemValue)
                    }>
                        <Picker.Item label="Choose Investigator Position" value=""/>
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
                    <Text style={styles.label}>Investigation Details</Text>
                    <TextInput style={styles.input} placeholder="Investigation Details" onChangeText={(text)=>setincidentDetails(text)}/>
                </View>
                <View style={styles.containerinput}>
                <Text style={styles.label}>Result of Investigation</Text>
                <View style={{borderWidth:0.3,borderColor:Colors.GrayBoder2}}>
                    <Picker
                    selectedValue={result}
                    onValueChange={(itemValue, itemIndex) =>
                    setResult(itemValue)
                    }>
                        <Picker.Item label="Choose Result" value=""/>
                        {resultoptions.map((option) => (
                        <Picker.Item label={option.name} value={option.name} />
                        ))}
                    </Picker>
                    </View>
                </View>

                <View style={styles.containerinput}>
                <Text style={styles.label}>Recommendations</Text>
                <View style={{borderWidth:0.3,borderColor:Colors.GrayBoder2}}>
                    <Picker
                    selectedValue={recommendation}
                    onValueChange={(itemValue, itemIndex) =>
                    setRecommendation(itemValue)
                    }>
                        <Picker.Item label="Choose Recommendation" value=""/>
                        {recommendationOptions.map((option) => (
                        <Picker.Item label={option.name} value={option.id} />
                        ))}
                        <Picker.Item label="Others" value="Others"/>
                    </Picker>
                    </View>
                </View>
                {recommendation=="Others"&&(
                <View style={styles.containerinput}>
                    <Text style={styles.label}>Recommendation</Text>
                    <TextInput style={styles.input} placeholder="Recommendation" onChangeText={(text)=>setCustomRecommendation(text)} />
                    <Text style={styles.label}>Do you want to add this recommendation to the main dropdown menu?</Text>
                    <TouchableOpacity style={styles.btn} onPress={()=>CreateRecommendation()}>
                        <Text style={styles.btntext}>YES</Text>
                    </TouchableOpacity>
                </View>
                )}

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

                <TouchableOpacity style={styles.btn} onPress={()=>CreateIncidentInvestigation()}>
                    <Text style={styles.btntext}>Create Incident Investigation</Text>
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
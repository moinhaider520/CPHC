import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useEffect, useState } from "react";
import { BASIC_URL } from '../utils/constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RoutineByUser({route}){
    const [routine,setRoutine] = useState("");
    const { userId, userName } = route.params;
    const [time, setTime] = useState(new Date(1598051730000));
    const [mode2, setMode2] = useState('time');
    const [show2, setShow2] = useState(false);

    const [userdata,setUserData] = useState("");
    const formattedTime = time
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      .replace(/ /g, ''); // Get the selected time in "HH:mm" format

      useEffect(()=>{
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
      },[])

      const onChangeTime = (event, selectedTime) => {
        setShow2(false);
    
        if (event.type === 'set') {
          setTime(selectedTime);
        }
      };
    
      const showTimepicker = () => {
        setMode2('time'); // Set the mode to 'time'
        setShow2(true); // Show the time picker
      };
    

      function CreateRoutine(){
        const apiUrl = BASIC_URL+'createroutine.php';
        const requestData = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `clientid=${userId}&clientname=${userName}&authorid=${userdata.id}&authorname=${userdata.username}&routine=${routine}&time=${formattedTime}`,
        };
        fetch(apiUrl, requestData)
              .then((response) => response.text())
              .then((data) => {
                console.log(data);
                alert("Routine Created");
              })
              .catch((error) => {
                console.error('Error:', error);
              });
      }

      function getSelectedUserName(selectedUserId) {
        const selectedUser = options.find((option) => option.id === selectedUserId);
        return selectedUser ? selectedUser.firstname : '';
      }
      
    return(
        <ScrollView style={styles.container}>
            <View style={styles.formcontainer}>
                <View style={styles.containerinput}>
                    <Text style={styles.label}>Routine</Text>
                    <TextInput style={styles.input} placeholder="Write Routine"onChangeText={(text)=>setRoutine(text)}/>
                </View>

                <View style={styles.containerinput}>
                    <Text style={styles.label}>Time</Text>
                    <TouchableOpacity onPress={()=>showTimepicker()}>
                        <Text>Choose Time</Text>
                    </TouchableOpacity>
                    <Text>Selected Time: {formattedTime}</Text>
                </View>
                {show2 && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={time}
                    mode="time"
                    is24Hour={true}
                    onChange={onChangeTime}
                    />
                )}
            </View>
            <TouchableOpacity style={styles.btn} onPress={()=>CreateRoutine()}>
                    <Text style={styles.btntext}>Create Routine</Text>
                </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:"5%"
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
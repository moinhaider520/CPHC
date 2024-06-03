import React from "react";
import {ScrollView, StyleSheet,View,Text,TouchableOpacity, BackHandler, FlatList, Touchable, Alert} from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASIC_URL } from "../utils/constants";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import moment from "moment/moment";
import { Ionicons } from "@expo/vector-icons";

export default function RoasterManagement(){
    const [userData,setUserData] = useState("");
    const [userID,setUserID] = useState(0);
    const [duty,setDuty] = useState([]);
    const [allduty,setAllDuty] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

      useEffect(()=>{
        AsyncStorage.getItem('userData')
              .then((data) => {
                if(data){
                    const userData = JSON.parse(data); // Parse the JSON string to an object
                    setUserData(userData);
                    setUserID(userData.id);
                    if(userData.access_level==1 || userData.access_level==2){
                        FetchDuty(userData.id);
                    } else{
                        FetchAllDuty();
                    }
                }
              })
              .catch((error) => {
              console.error('Error saving data to AsyncStorage:', error);
              });
      },[])

      useFocusEffect(
        React.useCallback(() => {
          AsyncStorage.getItem('userData')
          .then((data) => {
            if(data){
                const userData = JSON.parse(data); // Parse the JSON string to an object
                setUserData(userData);
                if(userData.access_level==1 || userData.access_level==2){
                  FetchDuty(userData.id);
                } else{
                    FetchAllDuty();
                }
            }
          })
          .catch((error) => {
          console.error('Error saving data to AsyncStorage:', error);
          });
        }, [])
      );

  async function FetchAllDuty(){
    try {
      const response = await axios.get(BASIC_URL + 'fetch_all_events.php', {
        params: {
          date: formattedMonth, // Pass the selected date dynamically
        },
      });
      if(response.data.error=="No records found in routine"){
        setAllDuty([]);
      }else{
        const initialData = response.data;
        setAllDuty(response.data);
        const allDates = initialData.map((item) => item.date);
        setExpandedDates(allDates);
      }
    } catch (error) {
      console.error('Error fetching duty:', error);
    }
  };

  async function FetchDuty(staffid){
    try {
      const response = await axios.get(BASIC_URL + 'fetch_events_by_id.php', {
        params: {
          date: formattedMonth,
          id: staffid,
        },
      });
      if(response.data.error=="No records found in routine"){
        setDuty([]);
      }else{
        setDuty(response.data);
      }
    } catch (error) {
      console.error('Error fetching duty:', error);
    }
  }

      useEffect(() => {
        FetchAllDuty();
        FetchDuty(userID);
      }, [date]);

      const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios'); // Close the date picker on iOS
        const dateformat = moment(currentDate).format('YYYY-MM');
        setDate(currentDate);
      };

      const showDatePickerModal = () => {
        setShowDatePicker(true);
      };
    
      const formattedMonth = moment(date).format('YYYY-MM');
      const formattedDate = moment(date).format('MMM YYYY');

      const [expandedDates, setExpandedDates] = useState([]);

      const getCurrentMonthDates = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
    
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
    
        const datesArray = [];
        for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
          datesArray.push(new Date(day));
        }
    
        return datesArray;
      };

      const toggleDateExpansion = (date) => {
        setExpandedDates((prevDates) => {
          if (prevDates.includes(date)) {
            return prevDates.filter((d) => d !== date);
          } else {
            return [...prevDates, date];
          }
        });
      };

      const renderDateItem = ({ item }) => {
        const dayOfMonth = item.getDate() - 1;
        const monthName = item.toLocaleString('default', { month: 'short' });
        const fullDateString = item.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' });
        // Extract only the day of the week from the fullDateString
        const dayOfWeek = fullDateString.split(',')[0];

        const filteredShifts = allduty.filter((shift) => shift.date === item.toISOString().split('T')[0]);  
        const isExpanded = expandedDates.includes(item.toISOString().split('T')[0]); 
        const currentDate = new Date(); // Get the current date

        // Check if the item date matches the current date
        const isActiveDate = item.toDateString() === currentDate.toDateString();
        const showAlertIfNoData = () => {
          if (filteredShifts.length === 0) {
            Alert.alert('No Data Found', `No data found for ${item.toISOString().split('T')[0]}`);
          }
        };
        return (
          <View style={styles.datescontainer}>
            <TouchableOpacity style={styles.row} onPress={() => { toggleDateExpansion(item.toISOString().split('T')[0]); showAlertIfNoData(); }}>
              <View style={styles.width25}>
                <Text style={styles.textdates}>{dayOfMonth} {monthName}</Text>
              </View>
              <View style={styles.width50}>
                <Text style={styles.textdate}>{dayOfWeek}</Text>
              </View>
              <View style={styles.width25}>
                <Text style={{ textAlign: "right", paddingRight: 10 }}>+</Text>
              </View>
            </TouchableOpacity>

            {isExpanded && (
          <View>
            {filteredShifts.map((shift, index) => (
              <View key={index} style={styles.shiftContainer}>
                <View style={styles.row}>
                  <View style={[styles.containershift,{borderLeftWidth:6,borderLeftColor:shift.shiftcolor}]}>
                    <Text style={styles.staffusertext}>{shift.staffsurname} {shift.staffusername}</Text>
                    {shift.serviceuser_firstname && (
                    <Text style={{fontWeight:"normal",marginLeft:15}}>Service User: {shift.serviceuser_surname} {shift.serviceuser_firstname}</Text>
                    )}
                    {shift.shifttype !== null ? (
                      <Text style={{fontWeight:"normal",marginLeft:15}}>{shift.shifttype}</Text>
                    ):(
                      <Text style={styles.shifttext}> CAH</Text>
                    )}
                    
                  </View>
                  <View style={styles.width50}>
                  {isActiveDate&&(
                    <Ionicons name="today" style={{marginLeft:40,color:Colors.Primary,fontSize:22}}/>
                  )}
                    <Text>{shift.time} - {shift.time_end}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
          </View>
        );
      };

      const renderDateItemStaff = ({ item }) => {
        const dayOfMonth = item.getDate();
        const monthName = item.toLocaleString('default', { month: 'short' });
        const fullDateString = item.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' });

        // Extract only the day of the week from the fullDateString
        const dayOfWeek = fullDateString.split(',')[0];

        const filteredShifts = duty.filter((shift) => shift.date === item.toISOString().split('T')[0]);  
        const isExpanded = expandedDates.includes(item.toISOString().split('T')[0]); 

        const showAlertIfNoData = () => {
          if (filteredShifts.length === 0) {
            Alert.alert('No Data Found', `No data found for ${item.toISOString().split('T')[0]}`);
          }
        };

        const currentDate = new Date(); // Get the current date

    // Check if the item date matches the current date
    const isActiveDate = item.toDateString() === currentDate.toDateString();
        return (
          <View style={styles.datescontainer}>
            <TouchableOpacity style={styles.row} onPress={() => { toggleDateExpansion(item.toISOString().split('T')[0]); showAlertIfNoData(); }}>
              <View style={styles.width25}>
                <Text style={styles.textdates}>{dayOfMonth} {monthName}</Text>
              </View>
              <View style={styles.width50}>
                <Text style={styles.textdate}>{dayOfWeek}</Text>
              </View>
              <View style={styles.width25}>
                <Text style={{ textAlign: "right", paddingRight: 10 }}>+</Text>
              </View>
            </TouchableOpacity>

            {isExpanded && (
          <View>
            {filteredShifts.map((shift, index) => (
              <View key={index} style={styles.shiftContainer}>
                <View style={styles.row}>
                  <View style={[styles.containershift,{borderLeftWidth:6,borderLeftColor:shift.shiftcolor}]}>
                    {userData.access_level == "1" &&(
                    <Text style={styles.staffusertext}>{shift.staffusername}</Text>
                    )}
                                          <Text style={styles.shifttext}>{shift.shifttype}</Text>
                    <Text  style={styles.shifttext}>Service User: {shift.username}</Text>
                  </View>
                  <View style={styles.width50}>
                  {isActiveDate&&(
                    <Ionicons name="today" style={{marginLeft:40,color:Colors.Primary,fontSize:22}}/>
                  )}
                    <Text>{shift.time} - {shift.time_end}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
          </View>
        );
      };

    return(
    <ScrollView style={styles.container}>
    {(userData.access_level==1 || userData.access_level==2)  &&(
      <View>
      <View style={styles.topbar}>
        <View style={styles.row}>
            <View style={styles.width25}/>
            <View style={styles.width50}>
                <Text style={styles.textdate}>{formattedDate}</Text>
            </View>
            <View style={styles.width25}>
                <TouchableOpacity onPress={showDatePickerModal} style={{borderWidth:0.5,marginRight:5}}>
                  <Text style={{textAlign:"center"}}>{formattedDate}</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}
        {duty.length>0 ? (
          <FlatList
          data={getCurrentMonthDates()}
          keyExtractor={(item) => item.toString()}
          renderItem={renderDateItemStaff}
          />
        ):(
          <Text style={styles.norecords}>No Shifts Found For This Month.</Text>
        )}
        
      </View>
    )}

    {(userData.access_level === 3 || userData.access_level === 4) && (
    <View>
    <View style={styles.topbar}>
      <View style={styles.row}>
          <View style={styles.width25}/>
          <View style={styles.width50}>
              <Text style={styles.textdate}>{formattedDate}</Text>
          </View>
          <View style={styles.width25}>
              <TouchableOpacity onPress={showDatePickerModal} style={{borderWidth:0.5,marginRight:5}}>
                <Text style={{textAlign:"center"}}>{formattedDate}</Text>
              </TouchableOpacity>
          </View>
      </View>
    </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
      {allduty.length>0 ?(
        <FlatList
        data={getCurrentMonthDates()}
        keyExtractor={(item) => item.toString()}
        renderItem={renderDateItem}
        />
      ):(
        <Text style={styles.norecords}>No Shifts Found For This Month.</Text>
      )}
      
    </View>
    )}
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:25
    },
    noviewcontainer:{
        justifyContent:"center",
        alignItems:"center",
    },
    image:{
        width:150,
        height:150,
        marginTop:"40%"
    },
    textnoview:{
        fontFamily:fonts.mullishsemibold,
        fontSize:20,
        marginTop:15
    },
    taskcontainer:{
        marginTop:20
    },
    headingtask:{
        fontSize:20,
        fontFamily:fonts.mullishbold
    },
    bodytask:{
        fontFamily:fonts.mullishmedium
    },
    task:{
        borderWidth:0.3,
        paddingVertical:5,
        paddingHorizontal:10,
        marginTop:10,
        borderColor:Colors.Primary,
    },
    task2:{
        borderWidth:0.3,
        paddingVertical:5,
        paddingHorizontal:10,
        marginTop:10,
        borderColor:Colors.Primary,    },
    tasktext:{
        fontFamily:fonts.mullishbold,
        fontSize:17,
        color:Colors.Primary
    },
    tasktext2:{
      fontFamily:fonts.mullishbold,
      fontSize:17,
      color:Colors.Black
  },
    underline:{
        borderWidth:0.3,
        borderColor:Colors.GrayBoder2,
        marginBottom:5
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
  },
  topbar:{
    width:"100%",
    height:40,
    justifyContent:"center"
  },
  row:{
    flexDirection:"row"
  },
  width25:{
    width:"25%",
    justifyContent:"center"
  },
  width50:{
    width:"50%",
    justifyContent:"center"
  },
  textdate:{
    textAlign:"center",
    fontFamily:fonts.mullishbold
  },
  textdates:{
    fontFamily:fonts.mullishbold,
    paddingLeft:10
  },
  datescontainer:{
    backgroundColor:Colors.GrayBoder2,
    paddingVertical:10
  },
  shiftContainer:{
    backgroundColor:"#fff"
  },
  containershift:{
    width:"75%",
    height:70,
    justifyContent:"center"
  },
  staffusertext:{
    fontFamily:fonts.mullishbold,
    marginLeft:10,
    fontSize:18
  },
  shifttext:{
    fontFamily:fonts.mullishmedium,
    marginLeft:10,
    fontSize:14
  },
  norecords:{
    fontFamily:fonts.mullishbold,
    textAlign:"center",
    fontSize:22,
    textAlignVertical:"center",
    marginTop:250
  }
});
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { Colors, fonts } from '../utils/styles';
import { BASIC_URL } from "../utils/constants";
import moment from "moment/moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Payroll(){
    const [userdata,setUserData] = useState("");
    const [status,setStatus] = useState("pending");
    const [data, setData] = useState([]); // Store the filtered data
    const [date, setDate] = useState(new Date());

    useEffect(()=>{
        FetchPayRollStatus();
        FetchPayRoll();
        FetchAuthor();
    },[])

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

    function FetchPayRollStatus(){
      fetch(BASIC_URL + 'fetch-payroll.php?selectedMonth=' + formattedDate)
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.data[0].status);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }

    function FetchPayRoll(){
        fetch(BASIC_URL + 'fetch_payroll_details.php?date=' + formattedDate)
        .then((response) => response.json())
        .then((data) => {
            setData(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    function RunPayroll(){
        fetch(BASIC_URL + 'run_payroll.php?access_level_id=' + userdata.id)
        .then((response) => response.json())
        .then((data) => {
            if(data.status =="success"){
                FetchPayRollStatus();
            }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    function RedoPayroll(){
        fetch(BASIC_URL + 'redo_payroll.php')
        .then((response) => response.json())
        .then((data) => {
            if(data.status =="success"){
                FetchPayRollStatus();
            }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  
    const formattedDate = moment(date).format('YYYY-MM');
  
    const renderItem = ({ item }) => (
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
        <Text style={{fontWeight:"bold"}}>Staff Member: <Text style={{fontWeight:"normal"}}>{item.firstname} {item.surname}</Text></Text>
        <Text style={{fontWeight:"bold"}}>Working Hours: <Text style={{fontWeight:"normal"}}>{item.total_hours} Hours</Text></Text>
        <Text style={{fontWeight:"bold"}}>Current Pay: <Text style={{fontWeight:"normal"}}>{item.total_sum} GBP</Text></Text>
        <Text style={{fontWeight:"bold"}}>Month: <Text style={{fontWeight:"normal"}}>{formattedDate}</Text></Text>
      </View>
    );
  
    return (
      <View style={styles.container}>
        <View style={styles.containerinput}>
            {status=="pending" ? (
                <TouchableOpacity style={styles.btn} onPress={()=>RunPayroll()}>
                    <Text style={styles.btntext}>Run PayRoll</Text>
                </TouchableOpacity>
            ):(
                <TouchableOpacity style={styles.btn} onPress={()=>RedoPayroll()}>
                    <Text style={styles.btntext}>Redo PayRoll</Text>
                </TouchableOpacity>
            )}          
        </View>
        <View style={{marginBottom:60}}>
        {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
        ):(
          <Text style={{textAlign:"center",fontFamily:fonts.mullishmedium,fontSize:22,marginTop:10}}>No Record Found</Text>
        )}
        </View>
      </View>
      
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: '5%',
    },
    input: {
      borderWidth: 0.3,
      paddingVertical: 5,
      marginVertical: 5,
      paddingHorizontal: 10,
      fontFamily: fonts.mullishregular,
      borderRadius: 2,
      borderColor: Colors.GrayBoder1,
      fontSize: 16,
    },
    btn:{
        backgroundColor:Colors.Primary,
        borderRadius:10,
        paddingVertical:15,
        justifyContent:"center",
        marginBottom:15,
        marginTop:10
    },
    btntext:{
        textAlign:"center",
        color:"#fff",
        fontSize:18,
        fontFamily:fonts.mullishsemibold
    }
  });
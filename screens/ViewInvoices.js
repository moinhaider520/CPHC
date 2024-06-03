import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { Colors, fonts } from '../utils/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { BASIC_URL } from "../utils/constants";
import moment from "moment/moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ViewInvoices() {
  const [allData, setAllData] = useState([]); // Store all the data
  const [data, setData] = useState([]); // Store the filtered data
  const [searchQuery, setSearchQuery] = useState('');

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
   FetchInvoice();
  }, [date]);

  function FetchInvoice(){
    fetch(BASIC_URL + 'fetch-all-invoices.php?selectedMonth=' + formattedDate)
    .then((response) => response.json())
    .then((data) => {
      setAllData(data.totalSum); // Store all the data
      setData(data.data); // Initially, set data to all the data
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  const formattedDate = moment(date).format('YYYY-MM');

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
      <Text style={{fontWeight:"bold"}}>Team: <Text style={{fontWeight:"normal"}}>{item.team_name}</Text></Text>
      <Text style={{fontWeight:"bold"}}>Staff Member: <Text style={{fontWeight:"normal"}}>{item.firstname} {item.surname}</Text></Text>
      <Text style={{fontWeight:"bold"}}>Duty Date: <Text style={{fontWeight:"normal"}}>{item.duty_date_start}</Text></Text>
      <Text style={{fontWeight:"bold"}}>Shift Type: <Text style={{fontWeight:"normal"}}>{item.shift_type_name}</Text></Text>
      <Text style={{fontWeight:"bold"}}>Working Hours: <Text style={{fontWeight:"normal"}}>{item.hours} Hours</Text></Text>
      <Text style={{fontWeight:"bold"}}>PayRate: <Text style={{fontWeight:"normal"}}>{item.pay_rate} GBP</Text></Text>
      <Text style={{fontWeight:"bold"}}>TOTAL AMOUNT: <Text style={{fontWeight:"normal"}}>{item.hours * item.pay_rate} GBP</Text></Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerinput}>
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
      <View style={{marginBottom:60}}>
      <Text style={{textAlign:"center",fontFamily:fonts.mullishbold}}>TOTAL INVOICE FOR THE MONTH: {allData} GBP</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
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
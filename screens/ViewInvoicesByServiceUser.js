import React, { useEffect, useState } from 'react';
import {StyleSheet,FlatList, View, Text, TouchableOpacity,Platform } from 'react-native';
import { Colors, fonts } from '../utils/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { BASIC_URL } from "../utils/constants";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import moment from "moment/moment";
export default function ViewInvoicesByServiceUser() {
  const [allData, setAllData] = useState([]); // Store all the data
  const [data, setData] = useState([]); // Store the filtered data
  const [serviceuser,setServiceUser] = useState("");
  const [options,setOptions] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const showMode = (currentMode) => {
    setShow(true);
    // setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  function FetchServiceUsers(){
    fetch(BASIC_URL + 'fetchusers.php')
      .then((response) => response.json())
      .then((data) => {
        setOptions(data); // Store all the data
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
   FetchInvoice();
  }, [date,serviceuser]);
  

  useEffect(()=>{
    FetchServiceUsers();
  },[])

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date; 
    setShow(false);
    setDate(currentDate);
  };

  function FetchInvoice(){
    fetch(BASIC_URL + 'fetch-invoices-by-user.php?selectedMonth=' + formattedDate + '&user_id='+serviceuser)
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

  async function generatePDF() {
    const pdfContent = `
      <html>
        <body>
          <h1>Total Invoice for the Month: ${allData} GBP</h1>
          ${data.map(item => `
            <div>
              <p>Team: ${item.team_name}</p>
              <p>Staff Member: ${item.firstname} ${item.surname}</p>
              <p>Duty Date: ${item.duty_date_start}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `;
  
    const pdfUri = `${FileSystem.cacheDirectory}invoice.pdf`;

    await FileSystem.writeAsStringAsync(pdfUri, pdfContent, { encoding: FileSystem.EncodingType.UTF8 });

    return pdfUri;
  }

  async function handleDownloadPDF() {
    try {
      const pdfUri = await generatePDF();
      await Sharing.shareAsync(pdfUri, { mimeType: 'application/pdf', dialogTitle: 'Download PDF' });
    } catch (error) {
      console.error('Error generating or downloading PDF:', error);
    }
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.containerinput}>
        <TouchableOpacity style={styles.btn} onPress={handleDownloadPDF}>
          <Text style={styles.btntext}>Download PDF</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerinput}>
        <TouchableOpacity style={styles.input} onPress={()=>showDatepicker()}>
          <Text>{formattedDate}</Text>
        </TouchableOpacity>
      </View>
      {show && (
                    <DateTimePicker
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeDate}
                    />
                )}
      <View>
                  <View style={{borderWidth:0.3,borderColor:Colors.GrayBoder2}}>
                    <Picker
                    selectedValue={serviceuser}
                    onValueChange={(itemValue, itemIndex) =>
                    setServiceUser(itemValue)
                    }>
                        {options.map((option) => (
                        <Picker.Item label={option.firstname} value={option.id} />
                        ))}
                    </Picker>
                    </View>
      </View>

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
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { Colors, fonts } from '../utils/styles';
import { BASIC_URL } from '../utils/constants';
import { openURL } from 'expo-linking';

export default function LoginLogs() {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    FetchLoginLogs();
  }, []);

  function FetchLoginLogs(){
    fetch(BASIC_URL + 'fetchloginlogs.php')
      .then((response) => response.json())
      .then((data) => {
        setAllData(data);
        setData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
    });
  }
  

  const handleSearch = (text) => {
    const lowerText = text.toLowerCase(); 
    setSearchQuery(text);
    const filteredData = allData.filter((item) => {
      const lowerName = item.name_used.toLowerCase(); // Convert data to lowercase for comparison
      const lowerDate = item.date.toLowerCase();
      return (
        lowerName.includes(lowerText) || // Filter by firstname
        lowerDate.includes(lowerText) // Filter by position
      );
    });
    setData(filteredData); // Update the displayed data
  };

  const openMapInBrowser = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    openURL(url);
  };

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
      <Text style={{fontFamily:fonts.mullishbold}}>Username Used: <Text style={{fontWeight:"normal",fontFamily:fonts.mullishregular}}>{item.name_used}</Text></Text>
      <Text style={{fontFamily:fonts.mullishbold}}>Password Used: <Text style={{fontWeight:"normal",fontFamily:fonts.mullishregular}}>{item.password_used}</Text></Text>
      <Text style={{fontFamily:fonts.mullishbold}}>Time: <Text style={{fontWeight:"normal",fontFamily:fonts.mullishregular}}>{item.time}</Text></Text>
      <Text style={{fontFamily:fonts.mullishbold}}>Date: <Text style={{fontWeight:"normal",fontFamily:fonts.mullishregular}}>{item.date}</Text></Text>
      <TouchableOpacity style={styles.btn} onPress={() => openMapInBrowser(item.latitude, item.longitude)}>
        {item.type=="Login"?(
          <Text style={styles.btntext}>View Login Location</Text>
        ):(
          <Text style={styles.btntext}>View Logout Location</Text>
        )}
      </TouchableOpacity>
    </View>
  );  

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Search By Name"
        style={styles.input}
        onChangeText={(text) => handleSearch(text)}
        value={searchQuery}
      />
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </ScrollView>
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
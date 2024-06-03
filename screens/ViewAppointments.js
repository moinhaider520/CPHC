import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, FlatList, View, Text } from 'react-native';
import { Colors, fonts } from '../utils/styles';
import { BASIC_URL } from '../utils/constants';
import HTML from 'react-native-render-html';
export default function ViewAppointments() {
  const [allData, setAllData] = useState([]); // Store all the data
  const [data, setData] = useState([]); // Store the filtered data
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(BASIC_URL + 'fetch_appointments.php')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAllData(data); // Store all the data
        setData(data); // Initially, set data to all the data
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredData = allData.filter((item) => {
      const lowercaseText = text.toLowerCase();
      return (
        (item.date && item.date.toLowerCase().includes(lowercaseText))
      );
    });
    setData(filteredData); // Update the displayed data
  };
  
  

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
      <Text style={{fontFamily:fonts.mullishbold}}>Appointment: {item.date} - {item.time}</Text>
      <Text style={{fontFamily:fonts.mullishbold}}>Staff Members:</Text>
      <Text>{item.staff_user_firstnames}</Text>
      <Text style={{fontFamily:fonts.mullishbold}}>Service Users:</Text>
      <Text>{item.service_user_firstnames}</Text>
      <Text style={{fontFamily:fonts.mullishbold}}>Significant Others:</Text>
      <Text>{item.significant_user_firstnames}</Text>
    </View>
  );
  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Search By Appointment Date"
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
});
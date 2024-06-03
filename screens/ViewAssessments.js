import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, FlatList, View, Text } from 'react-native';
import { Colors, fonts } from '../utils/styles';
import { BASIC_URL } from '../utils/constants';
import HTML from 'react-native-render-html';
export default function ViewAssessments() {
  const [allData, setAllData] = useState([]); // Store all the data
  const [data, setData] = useState([]); // Store the filtered data
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(BASIC_URL + 'fetchassessments.php')
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
        (item.staff_member_name && item.staff_member_name.toLowerCase().includes(lowercaseText)) || 
        (item.service_user_name && item.service_user_name.toLowerCase().includes(lowercaseText)) || 
        (item.risk_name && item.risk_name.toLowerCase().includes(lowercaseText))
      );
    });
    setData(filteredData); // Update the displayed data
  };
  
  

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
      <Text>Risk Name: {item.risk_name}</Text>
      <Text>Service User: {item.service_user_name}</Text>
      <Text>Responsible Staff Member: {item.staff_member_name}</Text>
      <Text>Risk Level: {item.risk_level}</Text>
      <Text>Activity/Issue: {item.activity_issue}</Text>
      <Text>Hazards Identified:</Text>
      <HTML source={{ html: item.hazards_identified }} />
      <Text>Future Risk Control:</Text>
      <HTML source={{ html: item.future_risk_control }} />
    </View>
  );
  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Search By Member Name"
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
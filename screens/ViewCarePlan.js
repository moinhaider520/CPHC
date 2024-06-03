import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, FlatList, View, Text } from 'react-native';
import { Colors, fonts } from '../utils/styles';
import { BASIC_URL } from '../utils/constants';
import HTML from 'react-native-render-html';
export default function ViewCarePlan() {
  const [allData, setAllData] = useState([]); // Store all the data
  const [data, setData] = useState([]); // Store the filtered data
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(BASIC_URL + 'fetch_care_plan.php')
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
        (item.service_user_name && item.service_user_name.toLowerCase().includes(lowercaseText))
      );
    });
    setData(filteredData); // Update the displayed data
  };
  
  

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
      <Text>Service User: {item.service_user_name}</Text>
      <Text>Care & Support Needs:</Text>
      <HTML source={{ html: item.care_and_support_needs }} />
      <Text>Desired Outcome:</Text>
      <HTML source={{ html: item.desired_outcomes }} />
      <Text>Staff Support:</Text>
      <HTML source={{ html: item.staff_support }} />
    </View>
  );
  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Search By Service User Name"
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
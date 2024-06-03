import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { useFonts } from 'expo-font';
import { Colors, fonts } from './utils/styles';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import RoasterManagement from './screens/RoasterManagement';
import MyMenu from './screens/MyMenu';
import Settings from './screens/Settings';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { StatusBar, Text } from 'react-native';
import OnBoarding from './screens/OnBoarding';
import AddServiceUser from './screens/AddServiceUser';
import AddSignificantOther from './screens/AddSignificantOther';
import AddStaff from './screens/AddStaff';

import Notes from './screens/Notes';
import Messages from './screens/Messages';
import Policies from './screens/Policies';
import Help from './screens/Help';
import About from './screens/About';
import CarePlans from './screens/CarePlans';
import Profile from './screens/Profile';
import Staffmembers from './screens/StaffMembers';
import AddStaffManagement from './screens/AddStaffManagement';
import ServiceUsers from './screens/ServiceUsers';
import ManagementStaff from './screens/ManagementStaff';
import LoginLogs from './screens/LoginLogs';
import Routine from './screens/Routine';
import ViewNotes from './screens/ViewNotes';
import PendingNotes from './screens/PendingNotes';
import AddNotice from './screens/AddNotice';
import ViewNotice from './screens/ViewNotice';
import RoutineByUser from './screens/RoutineByUser';
import ViewAllRoutines from './screens/ViewAllRoutines';
import ViewClientRoutine from './screens/ViewClientRoutine';
import AddNotesForClient from './screens/AddNotesForClient';
import AddNotes from './screens/AddNotes';
import ViewAllNotes from './screens/ViewAllNotes';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';
import Incidents from './screens/Incidents';
import AddIncidentReport from './screens/AddIncidentReport';
import ViewIncidentReports from './screens/ViewIncidentReports';
import Invoices from './screens/Invoices';
import ViewInvoices from './screens/ViewInvoices';
import ViewInvoicesByServiceUser from './screens/ViewInvoicesByServiceUser';
import AddIncidentInvestigation from './screens/AddIncidentInvestigation';
import ViewIncidentInvestigations from './screens/ViewIncidentInvestigations';
import AddIncidentActionPlan from './screens/AddIncidentActionPlan';
import ViewIncidentActionPlans from './screens/ViewIncidentActionPlans';
import Payroll from './screens/PayRoll';
import Appointments from './screens/Appointments';
import Notices from './screens/Notices';
import ServiceUser from './screens/ServiceUser';
import Staff from './screens/Staff';
import SignificantOther from './screens/SignificantOther';
import SignificantOthers from './screens/SignificantOthers';
import Routines from './screens/Routines';
import AddPolicy from './screens/AddPolicy';
import ViewPolicies from './screens/ViewPolicies';
import Assessments from './screens/Assessments';
import AddAssessment from './screens/AddAssessment';
import ViewAssessments from './screens/ViewAssessments';
import AddCarePlan from './screens/AddCarePlan';
import ViewCarePlan from './screens/ViewCarePlan';
import AddAppointment from './screens/AddAppointment';
import ViewAppointments from './screens/ViewAppointments';
import ViewSignificantNotes from './screens/ViewSignificantNotes';
import NoteDetail from './screens/NoteDetail';
const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();


function MainNavigator(){
  const [userStatus,setUserStatus] = useState("");
  useEffect(()=>{
    AsyncStorage.getItem('userData')
          .then((data) => {
            if(data){
                const userData = JSON.parse(data); // Parse the JSON string to an object
              setUserStatus(userData.access_level);
            }
          })
          .catch((error) => {
          console.error('Error saving data to AsyncStorage:', error);
          });
  },[])
  return (
    <BottomTab.Navigator
    screenOptions={({ route }) => ({headerShown:false,
      tabBarStyle:{borderColor:"transparent",backgroundColor:'transparent',elevation:0},
      tabBarIcon: ({ focused }) => {
        let iconName;
        let iconColor = focused ? Colors.Primary : Colors.GrayBlue;
  
        if (route.name === 'Home') {
          iconName = 'home-outline'; // Use the icon name from your chosen icon library
        } else if (route.name === 'RoasterManagement') {
          iconName = 'book-outline'; // Use the icon name from your chosen icon library
        }
       else if (route.name === 'NoticeBoard') {
        iconName = 'notifications-outline'; // Use the icon name from your chosen icon library
        }
        else if (route.name === 'MyMenu') {
          iconName = 'clipboard-outline'; // Use the icon name from your chosen icon library
        } else if (route.name === 'Settings') {
          iconName = 'settings-outline'; // Use the icon name from your chosen icon library
        }
  
        return (
          <Ionicons
            name={iconName}
            size={26}
            color={iconColor}
            style={{ fontFamily: focused ? 'YourCustomFontNameBold' : 'YourCustomFontName' }}
          />
        );
      },
      tabBarLabel: ({ focused }) => (
       <></>
      ),
    })}
    >
      <BottomTab.Screen name="Home" component={Home} />
      {(userStatus != 0)&&(
      <BottomTab.Screen name="RoasterManagement" component={RoasterManagement} />
      )}
      <BottomTab.Screen name="MyMenu" component={MyMenu} />
      <BottomTab.Screen name="NoticeBoard" component={ViewNotice} />
      <BottomTab.Screen name="Settings" component={Settings} />
    </BottomTab.Navigator>
    )
}

export default function App() {

  const [fontsLoaded] = useFonts({
    [fonts.mullishregular]: require("./assets/fonts/Mulish-Regular.ttf"),
    [fonts.mullishmedium]: require("./assets/fonts/Mulish-Medium.ttf"),
    [fonts.mullishbold]: require("./assets/fonts/Mulish-Bold.ttf"),
    [fonts.mullishsemibold]: require("./assets/fonts/Mulish-SemiBold.ttf"),
    [fonts.oswaldbold]: require("./assets/fonts/Oswald-Bold.ttf"),
    [fonts.oswaldmedium]: require("./assets/fonts/Oswald-Medium.ttf"),
    [fonts.oswaldregular]: require("./assets/fonts/Oswald-Regular.ttf"),
    [fonts.oswaldsemibold]: require("./assets/fonts/Oswald-SemiBold.ttf"),
    [fonts.spacemonoregular]: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
      <>
      <StatusBar
        backgroundColor={Colors.Primary} // Set your desired background color
        barStyle="light-content" // Set to 'dark-content' for light status bar text
        hidden={false} // Set to true to hide the status bar
      />
        <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Dashboard" component={MainNavigator} />
          <Stack.Screen name="Appointments" component={Appointments} options={{headerShown:true,title:"Appointments"}} />
          <Stack.Screen name="AddServiceUser" component={AddServiceUser} options={{headerShown:true,title:"Add Service User"}} />
          <Stack.Screen name="AddSignificantOther" component={AddSignificantOther} options={{headerShown:true,title:"Add Significant Other"}} />
          <Stack.Screen name="AddStaff" component={AddStaff} options={{headerShown:true,title:"Add Staff"}} />
          <Stack.Screen name="AddStaffManagement" component={AddStaffManagement} options={{headerShown:true,title:"Add Management Staff"}} />
          <Stack.Screen name="Notes" component={Notes} options={{headerShown:true,title:"Notes"}} />
          <Stack.Screen name="Messages" component={Messages} options={{headerShown:true,title:"Messages"}} />
          <Stack.Screen name="Policies" component={Policies} options={{headerShown:true,title:"Policies"}} />
          <Stack.Screen name="Help" component={Help} options={{headerShown:true,title:"Help"}} />
          <Stack.Screen name="About" component={About} options={{headerShown:true,title:"About Care Partners"}} />
          <Stack.Screen name="CarePlans" component={CarePlans} options={{headerShown:true,title:"Care Plans"}} />
          <Stack.Screen name="Profile" component={Profile} options={{headerShown:true,title:"My Profile"}} />
          <Stack.Screen name="Staffmembers" component={Staffmembers} options={{headerShown:true,title:"Staff Users"}} />
          <Stack.Screen name="ServiceUsers" component={ServiceUsers} options={{headerShown:true,title:"Service Users"}} />
          <Stack.Screen name="ServiceUser" component={ServiceUser} options={{headerShown:true,title:"Service Users"}} />
          <Stack.Screen name="Staff" component={Staff} options={{headerShown:true,title:"Staff Members"}} />
          <Stack.Screen name="Routines" component={Routines} options={{headerShown:true,title:"Routines"}} />
          <Stack.Screen name="SignificantOther" component={SignificantOther} options={{headerShown:true,title:"Significant Other"}} />
          <Stack.Screen name="SignificantOthers" component={SignificantOthers} options={{headerShown:true,title:"Significant Others"}} />
          <Stack.Screen name="LoginLogs" component={LoginLogs} options={{headerShown:true,title:"Login Logs"}} />
          <Stack.Screen name="Notices" component={Notices} options={{headerShown:true,title:"Notices"}} />
          <Stack.Screen name="ManagementStaff" component={ManagementStaff} options={{headerShown:true,title:"Management Staff"}} />
          <Stack.Screen name="Routine" component={Routine} options={{headerShown:true,title:"Routine"}} />
          <Stack.Screen name="RoutineByUser" component={RoutineByUser} options={{headerShown:true,title:"Routine"}} />
          <Stack.Screen name="AddNotesForClient" component={AddNotesForClient} options={{headerShown:true,title:"Add Notes"}} />
          <Stack.Screen name="AddNotes" component={AddNotes} options={{headerShown:true,title:"Add Notes"}} />
          <Stack.Screen name="ViewNotes" component={ViewNotes} options={{headerShown:true,title:"View Notes"}} />
          <Stack.Screen name="PendingNotes" component={PendingNotes} options={{headerShown:true,title:"Pending Notes"}} />
          <Stack.Screen name="AddNotice" component={AddNotice} options={{headerShown:true,title:"Add Notice"}} />
          <Stack.Screen name="ViewNotice" component={ViewNotice} options={{headerShown:true,title:"View Notice"}} />
          <Stack.Screen name="ViewAllRoutines" component={ViewAllRoutines} options={{headerShown:true,title:"Routine"}} />
          <Stack.Screen name="ViewAllNotes" component={ViewAllNotes} options={{headerShown:true,title:"Notes"}} />
          <Stack.Screen name="NoteDetail" component={NoteDetail} options={{headerShown:true,title:"Note Detail"}} />
          <Stack.Screen name="ViewSignificantNotes" component={ViewSignificantNotes} options={{headerShown:true,title:"Notes"}} />
          <Stack.Screen name="ViewClientRoutine" component={ViewClientRoutine} options={{headerShown:true,title:"Routine"}} />
          <Stack.Screen name="Incidents" component={Incidents} options={{headerShown:true,title:"Incidents"}} />
          <Stack.Screen name="AddIncidentReport" component={AddIncidentReport} options={{headerShown:true,title:"Incidents"}} />
          <Stack.Screen name="ViewIncidentReports" component={ViewIncidentReports} options={{headerShown:true,title:"Incident Reports"}} />
          <Stack.Screen name="AddIncidentInvestigation" component={AddIncidentInvestigation} options={{headerShown:true,title:"Incidents"}} />
          <Stack.Screen name="ViewIncidentInvestigations" component={ViewIncidentInvestigations} options={{headerShown:true,title:"Incident Investigations"}} />
          <Stack.Screen name="AddIncidentActionPlan" component={AddIncidentActionPlan} options={{headerShown:true,title:"Incidents"}} />
          <Stack.Screen name="ViewIncidentActionPlans" component={ViewIncidentActionPlans} options={{headerShown:true,title:"Incident Action Plans"}} />
          <Stack.Screen name="Invoices" component={Invoices} options={{headerShown:true,title:"Invoices"}} />
          <Stack.Screen name="ViewInvoices" component={ViewInvoices} options={{headerShown:true,title:"Invoices"}} />
          <Stack.Screen name="ViewInvoicesByServiceUser" component={ViewInvoicesByServiceUser} options={{headerShown:true,title:"Invoices"}} />
          <Stack.Screen name="Payroll" component={Payroll} options={{headerShown:true,title:"Payroll"}} />
          <Stack.Screen name="AddPolicy" component={AddPolicy} options={{headerShown:true,title:"Add Policy"}} />
          <Stack.Screen name="ViewPolicies" component={ViewPolicies} options={{headerShown:true,title:"View Policies"}} />
          <Stack.Screen name="Assessments" component={Assessments} options={{headerShown:true,title:"Assessments"}} />
          <Stack.Screen name="AddAssessment" component={AddAssessment} options={{headerShown:true,title:"Add Assessment"}} />
          <Stack.Screen name="ViewAssessments" component={ViewAssessments} options={{headerShown:true,title:"View Assessments"}} />
          <Stack.Screen name="AddCarePlan" component={AddCarePlan} options={{headerShown:true,title:"Add Care Plan"}} />
          <Stack.Screen name="ViewCarePlan" component={ViewCarePlan} options={{headerShown:true,title:"View Care Plan"}} />
          <Stack.Screen name="AddAppointment" component={AddAppointment} options={{headerShown:true,title:"Add Appointment"}} />
          <Stack.Screen name="ViewAppointments" component={ViewAppointments} options={{headerShown:true,title:"View Appointments"}} />
        </Stack.Navigator>
      </NavigationContainer>
      </>
  );
}
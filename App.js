import React, {Fragment} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { fromRight } from 'react-navigation-transitions';
import Icon from 'react-native-vector-icons/Ionicons';
import { Content, Container, Header, Body, Radio, Title, Left,  Icon as Icn, Row, Col, Right, Button as Btn, Card, CardItem, List, ListItem, Thumbnail} from 'native-base';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { ScrollView, Text, View, Image } from 'react-native';
import * as colors from './src/assets/css/Colors';
import { img_url } from './src/config/Constants';

/* Screens */
import Splash from './src/views/Splash';
import LocationEnable from './src/views/LocationEnable';
import LoginHome from './src/views/LoginHome';
import Login from './src/views/Login';
import Password from './src/views/Password';
import Forgot from './src/views/Forgot';
import ForgotOtp from './src/views/ForgotOtp';
import Location from './src/views/Location';
import Otp from './src/views/Otp';
import ResetPassword from './src/views/ResetPassword';
import CreateName from './src/views/CreateName';
import CreateEmail from './src/views/CreateEmail';
import CreatePassword from './src/views/CreatePassword';
import Home from './src/views/Home';
import ConfirmBooking from './src/views/ConfirmBooking';
import Ride from './src/views/Ride';
import Promo from './src/views/Promo';
import Rating from './src/views/Rating';
import Rewards from './src/views/Rewards';
import MyRides from './src/views/MyRides';
import ComplaintCategory from './src/views/ComplaintCategory';
import ComplaintSubCategory from './src/views/ComplaintSubCategory';
import Complaint from './src/views/Complaint';
import RideDetails from './src/views/RideDetails';
import Profile from './src/views/Profile';
import EditFirstName from './src/views/EditFirstName';
import EditLastName from './src/views/EditLastName';
import EditPhoneNumber from './src/views/EditPhoneNumber';
import EditEmail from './src/views/EditEmail';
import EditPassword from './src/views/EditPassword';
import Wallet from './src/views/Wallet';
import Notifications from './src/views/Notifications';
import NotificationDetails from './src/views/NotificationDetails';
import Refer from './src/views/Refer';
import Faq from './src/views/Faq';
import FaqDetails from './src/views/FaqDetails';
import PrivacyPolicies from './src/views/PrivacyPolicies';
import AboutUs from './src/views/AboutUs';
import Logout from './src/views/Logout';
import SosSettings from './src/views/SosSettings';
import AddSosSettings from './src/views/AddSosSettings';
import EditGender from './src/views/EditGender';
import VehicleCategories from './src/views/VehicleCategories';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

Icon.loadFont()


function CustomDrawerContent(props) {

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding:10, flexDirection:'column', alignItems:'flex-start' }}>
        <Image style={{ width: 80, height: 80, borderRadius: 60 / 2, overflow: "hidden",alignSelf:'center', }} source={{ uri : img_url + global.profile_picture}} />
        <View style={{ margin: 5 }} />
        <View style={{alignSelf:'center'}} >
          <Text style={{ color:colors.theme_fg, fontWeight:'bold', fontSize:16 }} >{global.first_name}</Text>
        </View>
      </View>
      {/*<View style={{backgroundColor:colors.theme_fg_three,padding:10}}>
          <Row>
            <Col style={{height:"100%",width:"85%",alignSelf:'center'}}>  
              <Text style={{color:colors.theme_fg,fontWeight:'bold', fontSize:16}}>
                ${global.wallet}
              </Text>
              <Text style={{color:colors.theme_fg_two,fontWeight:'bold', fontSize:10}}>
                Balance
              </Text>
            </Col>
            <Col style={{height:"100%",width:"15%",alignSelf:'center'}}>  
              <Icon style={{color:colors.theme_fg,fontSize:40,marginLeft:5}} name='add-circle-outline'/>  
            </Col>
          </Row>
      </View>*/}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
function MyDrawer() {
  return (
    <Drawer.Navigator 
      drawerContent={props => <CustomDrawerContent {...props} />} 
      initialRouteName="Home"
      drawerStyle={{ width: '80%', backgroundColor:colors.theme_fg_three }}
      drawerContentOptions={{
        activeTintColor: colors.theme_fg, 
        inactiveTintColor: colors.theme_fg_two,
        labelStyle: { fontSize: 15, fontFamily:'GoogleSans-Bold' },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='home-outline' color={colors.theme_fg} size={25} />
          ),
        }} 
      />
      <Drawer.Screen
        name="My Rides"
        component={MyRides}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='car-outline' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile Settings"
        component={Profile}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='person-outline' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name="Wallet"
        component={Wallet}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='wallet-outline' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='ios-notifications-outline' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name="Rewards"
        component={Rewards}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='ios-bookmark-outline' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name="Refer & Earn"
        component={Refer}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='md-share-outline' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name="SOS Settings"
        component={SosSettings}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='md-call-outline' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name="FAQ"
        component={Faq}
        initialParams={{
           data: 'Faq Details'
        }}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='ios-help-circle-outline' color={colors.theme_fg} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Privacy Policies"
        component={PrivacyPolicies}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='ios-list-outline' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={AboutUs}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='information-circle-outline' color={colors.theme_fg} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon name='ios-exit-outline' color={colors.theme_fg} size={28} />
          ),
        }}
      />

    </Drawer.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="Splash" >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="LocationEnable" component={LocationEnable} />
        <Stack.Screen name="LoginHome" component={LoginHome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Location" component={Location} />
        <Stack.Screen name="Password" component={Password} />
        <Stack.Screen name="Forgot" component={Forgot} />
        <Stack.Screen name="VehicleCategories" component={VehicleCategories} />
        <Stack.Screen name="ForgotOtp" component={ForgotOtp} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="CreateName" component={CreateName} />
        <Stack.Screen name="CreateEmail" component={CreateEmail} />
        <Stack.Screen name="CreatePassword" component={CreatePassword} />
        <Stack.Screen name="Home" component={MyDrawer} />
        <Stack.Screen name="ConfirmBooking" component={ConfirmBooking} />
        <Stack.Screen name="Ride" component={Ride} />
        <Stack.Screen name="Promo" component={Promo} />
        <Stack.Screen name="Rating" component={Rating} />
        <Stack.Screen name="RideDetails" component={RideDetails} />
        <Stack.Screen name="ComplaintCategory" component={ComplaintCategory} />
        <Stack.Screen name="ComplaintSubCategory" component={ComplaintSubCategory} />
        <Stack.Screen name="Complaint" component={Complaint} />
        <Stack.Screen name="EditFirstName" component={EditFirstName} />
        <Stack.Screen name="EditLastName" component={EditLastName} />
        <Stack.Screen name="EditPhoneNumber" component={EditPhoneNumber} />
        <Stack.Screen name="EditEmail" component={EditEmail} />
        <Stack.Screen name="EditPassword" component={EditPassword} />
        <Stack.Screen name="NotificationDetails" component={NotificationDetails} />
        <Stack.Screen name="FaqDetails" component={FaqDetails} />
        <Stack.Screen name="SosSettings" component={SosSettings} />
        <Stack.Screen name="AddSosSettings" component={AddSosSettings} />
        <Stack.Screen name="EditGender" component={EditGender} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
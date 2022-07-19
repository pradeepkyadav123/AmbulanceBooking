import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import GlobalFont from 'react-native-global-font'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { Container, Content } from 'native-base';
import { logo, font_title, font_description, api_url, settings, splash,splashScreen } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';
import { notifications } from "react-native-firebase-push-notifications";
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/SplashActions';
import axios from 'axios';
import { connect } from 'react-redux';
import { refer_lottie } from '../config/Constants';
import LottieView from 'lottie-react-native';
import { StatusBar } from '../components/GeneralComponents';

class Splash extends Component<Props>{

  async componentDidMount() {
    // this.login();
    await this.getToken();
    await this.settings();
  }
 
  getToken = async () => {

    //get the messeging token
    let fcmToken = await AsyncStorage.getItem("fcmToken");
console.log('fcm token ashish',fcmToken);
    if (!fcmToken) {
      let fcmToken = await notifications.getToken();
      if (fcmToken) {
        try {
          AsyncStorage.setItem("fcmToken", fcmToken);
          global.fcm_token = fcmToken;
        } catch (e) {}
      }
    } else {
      global.fcm_token = fcmToken;
    }
  };

  getInitialNotification = async () => {
    //get the initial token (triggered when app opens from a closed state)
    const notification = await notifications.getInitialNotification();
    console.log("getInitialNotification", notification);
    return notification;
  };

  onNotificationOpenedListener = () => {
    //remember to remove the listener on un mount
    //this gets triggered when the application is in the background
    this.removeOnNotificationOpened = notifications.onNotificationOpened(
      (notification) => {
        console.log("onNotificationOpened", notification);
        //do something with the notification
      }
    );
  };

  onNotificationListener = () => {
    //remember to remove the listener on un mount
    //this gets triggered when the application is in the forground/runnning
    //for android make sure you manifest is setup - else this wont work
    //Android will not have any info set on the notification properties (title, subtitle, etc..), but _data will still contain information
    this.removeOnNotification = notifications.onNotification((notification) => {
      //do something with the notification
      console.log("onNotification", notification);
    });
  };

  onTokenRefreshListener = () => {
    //remember to remove the listener on un mount
    //this gets triggered when a new token is generated for the user
    this.removeonTokenRefresh = messages.onTokenRefresh((token) => {
      //do something with the new token
    });
  };

  setBadge = async (number) => {
    //only works on iOS for now
    return await notifications.setBadge(number);
  };

  getBadge = async () => {
    //only works on iOS for now
    return await notifications.getBadge();
  };

  hasPermission = async () => {
    //only works on iOS
    return await notifications.hasPermission();
    //or     return await messages.hasPermission()
  };

  requestPermission = async () => {
    //only works on iOS
    return await notifications.requestPermission();
    //or     return await messages.requestPermission()
  };

  componentWillUnmount() {
    //remove the listener on unmount
    if (this.removeOnNotificationOpened) {
      this.removeOnNotificationOpened();
    }
    if (this.removeOnNotification) {
      this.removeOnNotification();
    }

    if (this.removeonTokenRefresh) {
      this.removeonTokenRefresh();
    }
  }

  async login(){
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
    .then(data => {
      this.props.navigation.dispatch(
           CommonActions.reset({
              index: 0,
              routes: [{ name: "LoginHome" }],
          })
      );
    }).catch(err => {
      this.props.navigation.dispatch(
           CommonActions.reset({
              index: 0,
              routes: [{ name: "LocationEnable" }],
          })
      );
    });
  }

  settings = async () => {
    console.log(api_url + settings)
    await axios({
      method: 'get', 
      url: api_url + settings
    })
    .then(async response => {
      console.log(response,"response")
      this.home(response.data.result);
    })
    .catch(error => {
      alert('Sorry, something went wrong');
    });
  }

  home = async (data) => {
   const id = await AsyncStorage.getItem('id');
   const first_name = await AsyncStorage.getItem('first_name');
   const profile_picture = await AsyncStorage.getItem('profile_picture');
   const phone_with_code = await AsyncStorage.getItem('phone_with_code');
   const email = await AsyncStorage.getItem('email');
   const country_id = await AsyncStorage.getItem('country_id');
   const currency = await AsyncStorage.getItem('currency');
   const wallet = await AsyncStorage.getItem('wallet');
   const currency_short_code = await AsyncStorage.getItem('currency_short_code');
   global.stripe_key = data.stripe_key;
   global.razorpay_key = data.razorpay_key;
   global.app_name = data.app_name;
   if(id !== null){
      global.id = id;
      global.first_name = first_name;
      global.profile_picture = profile_picture;
      global.phone_with_code = phone_with_code;
      global.email = email;
      global.country_id = country_id;
      global.currency = currency;
      global.currency_short_code = currency_short_code;
      global.wallet = wallet;
      this.navigate_home();
   }else{
      global.id = '';
      this.login();
   }
  }
  
  navigate_home = () => {
    this.props.navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }
 
  render() {
    return (
      <View style={{ backgroundColor:colors.theme_bg_three, height:'100%', width:'100%'}}>
           <StatusBar/>
          <Image  style={styles.image} source={splashScreen}/>
        {/* <View style={{ alignItems:'center', justifyContent:'flex-end', height:'50%'}}>
          <StatusBar/>
          <Image style={styles.logo} source={logo}/>
        </View> */}
        {/* <View style={{ alignItems:'center', justifyContent:'flex-end', height:'50%'}}>
          <LottieView source={splash} autoPlay loop />
        </View>  */}
      </View>
    )
  }

}

export default Splash;

const styles = StyleSheet.create({
  image:{ 
    height:'100%',
    width:'100%' 
  },
 
});



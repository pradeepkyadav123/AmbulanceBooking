import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { alert_close_timing, otp_validation_error, avatar_icon, font_title, font_description } from '../config/Constants';

export default class ProfileSetting extends Component<Props>{

  constructor(props) {
      super(props)
  }

  open = () =>{
    this.props.navigation.toggleDrawer();
  }

  render() {
    return (
      <View>
        <Text onPress={this.open} >ProfileSetting</Text>
      </View>
    )
  }

}
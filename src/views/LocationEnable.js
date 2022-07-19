import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Content, Container, Title, Footer} from 'native-base';
import * as colors from '../assets/css/Colors';
import LottieView from 'lottie-react-native';
import { location_lottie, app_name, font_title, font_description } from '../config/Constants';
import { Button } from 'react-native-elements';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default class LocationEnable extends Component<Props> {

  constructor(props) {
    super(props)
  }

  enable_gps(){
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
    .then(data => {
      this.props.navigation.navigate('Splash');
    }).catch(err => {
       
    });
  }

  render() {
    return (
      <Container>
        <Content style={{backgroundColor:colors.theme_fg_three}}>
          <View style={{ alignItems:'center', marginTop:'40%', padding:20}}>
            <LottieView style={{ height:200, width:200 }}source={location_lottie} autoPlay loop />
            <View style={{ margin:10}} />
            <Title style={styles.title} >Enable your GPS location</Title>
            <View style={{ margin:10}} />
            <Text style={styles.description}>Please allow {app_name} to enable your phone GPS for accurate pickup.</Text>
          </View>
        </Content>
        <Footer style={styles.footer} >
          <View style={styles.footer_content}>
            <Button
              onPress={this.enable_gps.bind(this)}
              title="Enable GPS"
              buttonStyle={styles.footer_btn}
               titleStyle={{ fontFamily:font_description,color:colors.theme_fg_three }}
            />
          </View>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    alignSelf:'center', 
    fontSize:20, 
    fontFamily:font_title
  },
  description:{
    color:colors.theme_fg_four, 
    fontSize:14,
    textAlign:'center',
    fontFamily:font_description
  },
  footer:{
    backgroundColor:colors.theme_bg_three
  },
  footer_content:{
    width:'90%'
  },
  footer_btn:{
    backgroundColor:colors.theme_bg
  }
});

import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import { Container, Content, Right } from 'native-base';
import * as colors from '../assets/css/Colors';
import { height_60, app_name, font_title } from '../config/Constants';
import PhoneInput from 'react-native-phone-input'
import { StatusBar } from '../components/GeneralComponents';
class LoginHome extends Component<Props> {

  constructor(props) {
      super(props)
  }

  move_login(){
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <Container>
        <View>
          <StatusBar/>
        </View>
        <Content style={{backgroundColor:colors.theme_fg_three}}>
          <View style={styles.image_container} >
            {/* <Image style={styles.image} source={ require('.././assets/img/signup_img.png') } /> */}
            <Image style={styles.image} source={ require('.././assets/img/AmbulanceLogo.png') } />
            
          </View>
          <View style={styles.padding_20}>
            <Text style={styles.title}>Riding with {app_name}</Text>
            <View style={styles.margin_20} />
            <TouchableOpacity onPress={this.move_login.bind(this)} activeOpacity={1}>
              <PhoneInput style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style} disabled={true} initialCountry="in" offset={10} textStyle={styles.country_text} value="Phone Number" />
            </TouchableOpacity>
            <View style={{ margin:10 }} />
          </View>
        </Content>
      </Container>
    );
  }
}

export default LoginHome;

const styles = StyleSheet.create({
  image_container:{
    height:height_60, 
    width:'100%',
    justifyContent : 'center',
    position : 'relative'
    
  },
  image:{
    //flex:1 , 
    // maxWidth: undefined, 
    // maxHeight: undefined,
    // backgroundColor: colors.theme_fg_three,
    justifyContent : 'center',
    textAlign : 'center',
    position: 'absolute',
    left : '10%'
  },
  padding_20:{
    padding:20
  },
  title:{
    fontSize:20, 
    fontFamily:font_title, 
    letterSpacing:2,
    color:colors.theme_fg_two,
    fontFamily:font_title
  },
  margin_20:{
    margin:20
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  country_text:{
    fontSize:18, 
    borderBottomWidth:1, 
    paddingBottom:8, 
    height:35,
    color:colors.theme_fg_two
  }
});

import React, {Component} from 'react';
import { StyleSheet, Text, View,  TouchableOpacity, Image } from 'react-native';
import { Header, Body, Title, Left, Icon, Right, Button as Btn } from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, api_url, forgot, font_description, font_title, height_40, go_icon } from '../config/Constants';
import PhoneInput from 'react-native-phone-input';
import DropdownAlert from 'react-native-dropdownalert';
import axios from 'axios';
import { connect } from 'react-redux';
import { checkPhonePending, checkPhoneError, checkPhoneSuccess } from '../actions/CheckPhoneActions';
import { createForgotPhoneWithCode } from '../actions/ForgotActions';


class Forgot extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        phone_number: '',
        validation:false
      }
  }

  componentDidMount() {
    setTimeout(() => {
      this.phone.focus();
    }, 200);
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  async check_phone_number(){
    await this.check_validate();
    if(this.state.validation){
      await this.check_phone(this.phone.getValue());
    }
  }

  async check_validate(){
    if('+'+this.phone.getCountryCode() == this.phone.getValue()){
      await this.setState({ validation:false });
      await this.show_alert(strings.please_enter_phone_number);
    }else if(!this.phone.isValidNumber()){
      await this.setState({ validation:false });
      await this.show_alert(strings.please_enter_valid_phone_number);
    }else{
      await this.setState({ validation:true });
    }
  }

  async check_phone(phone_with_code){
    await axios({
      method: 'post', 
      url: api_url + forgot,
      data:{ phone_with_code : phone_with_code}
    })
    .then(async response => {
      if(response.data.status == 1){
        await this.props.navigation.navigate('ForgotOtp', { otp : response.data.result});
        }else{
        this.show_alert(strings.please_enter_your_registered_mobile_number);
        }
    })
    .catch(error => {
      alert(JSON.stringify(response.data));
    });
  }


  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  render() {
    return (
      <View style={{backgroundColor:colors.theme_fg_three,height:"100%",width:"100%" }}>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <Btn onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Forgot password</Title>
          </Body>
          <Right />
        </Header>
        <View style={{backgroundColor:colors.theme_fg_three}}>
          <View style={{ padding:20, height:height_40 }}>
            <Title style={styles.phone_title}>Please enter your phone number</Title>
            <View style={styles.margin_20} />
            <PhoneInput style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style} ref={(ref) => { this.phone = ref; }} initialCountry="in" offset={10} textStyle={styles.country_text} textProps={{ placeholder: 'Phone number', placeholderTextColor : colors.theme_fg_four }} autoFormat={true} />
            <View>
              <View style={styles.margin_10} />
              <Text style={styles.description}>You need to enter your phone number for reset the password</Text>
            </View>
          <View style={styles.margin_50} />
            <TouchableOpacity onPress={this.check_phone_number.bind(this)}>
              <Image style={{ alignSelf: 'flex-end', height:70, width:65 }} source={go_icon}/>
            </TouchableOpacity>
          </View>           
        </View>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
    checkPhonePending: () => dispatch(checkPhonePending()),
    checkPhoneError: (error) => dispatch(checkPhoneError(error)),
    checkPhoneSuccess: (data) => dispatch(checkPhoneSuccess(data)),
    createForgotPhoneWithCode: (data) => dispatch(createForgotPhoneWithCode(data)),
});
export default connect(mapDispatchToProps)(Forgot);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg_three
  },
  icon:{
    color:colors.theme_fg_two
  },
  flex_1:{
    flex: 1
  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    alignSelf:'center', 
    fontSize:20, 
    fontFamily:font_title
  },
  phone_title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    alignSelf:'flex-start', 
    fontSize:20,
    letterSpacing:0.5,
    fontFamily:font_description
  },
  margin_10:{
    margin:10
  },
  margin_20:{
    margin:20
  },
  margin_50:{
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
    fontFamily:font_description,
    color:colors.theme_fg_two
  },
  padding_20:{
    padding:20
  },
  description:{
    color:colors.theme_fg_four, 
    fontSize:14,
    fontFamily:font_description
  }
});

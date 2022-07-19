import React, {Component} from 'react';
import { StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import { Title, Left, Icon, Button as Btn} from 'native-base';
import * as colors from '../assets/css/Colors';
import { api_url, check_phone, font_title, font_description, height_40, go_icon,alert_close_timing } from '../config/Constants';
import PhoneInput from 'react-native-phone-input';
import axios from 'axios';
import { connect } from 'react-redux';
import { checkPhonePending, checkPhoneError, checkPhoneSuccess } from '../actions/CheckPhoneActions';
import { createCountryCode, createPhoneNumber, createPhoneWithCode } from '../actions/RegisterActions'; 
import { Loader } from '../components/GeneralComponents';
import DropdownAlert from 'react-native-dropdownalert';

class Login extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        phone_number: '', 
        validation:false,
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
      await this.navigate();
    }
  }

  async navigate(){
    console.log(this.props,"this.props")
    if(this.props.data.is_available == 1){
      this.props.navigation.navigate('Password',{ phone_number : this.phone.getValue()});
    }else{
      let phone_number = this.phone.getValue();
      phone_number = phone_number.replace("+"+this.phone.getCountryCode(), "");
      this.props.createCountryCode("+"+this.phone.getCountryCode());
      this.props.createPhoneNumber(phone_number);
      this.props.createPhoneWithCode(this.phone.getValue());
      this.props.navigation.navigate('Otp',{ otp : this.props.data.otp });
    }
  }

  async check_phone(phone_with_code){
    this.props.checkPhonePending();
    console.log(phone_with_code,"phone_with_code")
    console.log(api_url + check_phone,"api_url + check_phone")
    await axios({
      method: 'post', 
      url: api_url + check_phone,
      data:{ phone_with_code : phone_with_code}
    })
    .then(async response => {
      console.log(response,"response")
        await this.props.checkPhoneSuccess(response.data)
    })
    .catch(error => {
      alert(error);
        this.props.checkPhoneError(error);
    });
  }

  async check_validate(){
    if('+'+this.phone.getCountryCode() == this.phone.getValue()){
      await this.setState({ validation:false });
      await this.show_alert("Please enter phone number");
    }else if(!this.phone.isValidNumber()){
      await this.setState({ validation:false });
      await this.show_alert("Please enter valid phone number");
    }else{
      await this.setState({ validation:true });
    }
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

 
  render() {
     const { isLoding, error, data, message, status } = this.props
    return (
    <View style={{backgroundColor:colors.theme_fg_three,height:"100%",width:"100%" }}>
      <View>
        <Left style={styles.flex_1} >
          <Btn onPress={this.handleBackButtonClick} transparent>
            <Icon style={styles.icon} name='arrow-back' />
          </Btn>
        </Left>
      <View style={{margin:30}}/>
          <View style={{ padding:20, height:height_40 }}>
          <Loader visible={isLoding} />
            <Title style={styles.phone_title}> Enter your phone number</Title>
          <View style={styles.margin_20} />
          <PhoneInput style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style} ref={(ref) => { this.phone = ref; }} initialCountry="in" offset={10} textStyle={styles.country_text} textProps={{ placeholder: 'Phone number', placeholderTextColor : colors.theme_fg_four }} autoFormat={true} />
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

function mapStateToProps(state){
  return{
    isLoding : state.check_phone.isLoding,
    error : state.check_phone.error,
    data : state.check_phone.data,
    message : state.check_phone.message,
    status : state.check_phone.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    checkPhonePending: () => dispatch(checkPhonePending()),
    checkPhoneError: (error) => dispatch(checkPhoneError(error)),
    checkPhoneSuccess: (data) => dispatch(checkPhoneSuccess(data)),
    createCountryCode: (data) => dispatch(createCountryCode(data)),
    createPhoneNumber: (data) => dispatch(createPhoneNumber(data)),
    createPhoneWithCode: (data) => dispatch(createPhoneWithCode(data)),
});


export default connect(mapStateToProps,mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg_three
  },
  icon:{
    color:colors.theme_fg_two
  },
  flex_1:{
    alignSelf:'flex-start',
    marginLeft:5,
    marginTop:15
    

  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  phone_title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    alignSelf:'flex-start', 
    fontSize:20,
    letterSpacing:0.5,
    fontFamily:font_title
  },
  margin_20:{
    margin:20
  },
  margin_50:{
    margin:25
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
  }
});

import React, {Component} from 'react';
import { StyleSheet, View } from 'react-native';
import { Header, Body, Title, Left, Icon, Right, Button as Btn } from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, profile_update, api_url, font_title, font_description, height_10, height_40 } from '../config/Constants';
import DropdownAlert from 'react-native-dropdownalert';
import { Button } from 'react-native-elements';
import PhoneInput from 'react-native-phone-input';
import axios from 'axios';
import { connect } from 'react-redux';
import { profilePending, profileError, profileSuccess } from '../actions/ProfileActions';

class EditPhoneNumber extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.check_phone_number = this.check_phone_number.bind(this);
      this.state = {
        phone: this.props.route.params.phone_number,
        validation:true
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
      await this.update_data();
    }
  }

  async check_validate(){
    
    if('+'+this.phone.getCountryCode() == this.phone.getValue()){
      await this.setState({ validation:false });
      await this.show_alert("Please enter phone number");
    }else if(!this.phone.isValidNumber()){
      await this.setState({ validation:false });
      await this.show_alert("Please enter valid phone number");
    }else{
      let phone_number = await this.phone.getValue();
      phone_number = await phone_number.replace("+"+this.phone.getCountryCode(), "");
      this.setState({ phone : phone_number });
      await this.setState({ validation:true });
    }
  }

 update_data = async () => {
  
  this.props.profilePending();
     await axios({
      method: 'post', 
      url: api_url + profile_update,
      data:{ id : global.id, phone_number : this.state.phone, country_code : '+'+this.phone.getCountryCode(), phone_with_code: '+'+this.phone.getCountryCode()+this.state.phone } 
    })
    .then(async response => {
      await this.props.profileSuccess(response.data);
      this.handleBackButtonClick();
    })
    .catch(error => {
        this.showSnackbar(strings.sorry_something_went_wrong);
        this.props.profileError(error);
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
      
          </Body>
          <Right />
        </Header>
        <View style={{backgroundColor:colors.theme_fg_three}}>
          <View style={{ padding:20, height:height_40 }}>
            <Title style={styles.name_title}>Edit your phone number</Title>
            <View style={styles.margin_10} />
            <PhoneInput style={{ borderColor:colors.theme_fg_two, borderBottomWidth:0.5 }} flagStyle={styles.flag_style} ref={(ref) => { this.phone = ref; }} value={this.state.phone} initialCountry="in" offset={10} textStyle={styles.country_text} textProps={{ placeholder: 'Phone number', placeholderTextColor : colors.theme_fg_four }} autoFormat={true} />
            <View style={styles.margin_20} />
            <Button
              title="Update"
              onPress={this.check_phone_number.bind(this)}
              buttonStyle={{ backgroundColor:colors.theme_bg }}
               titleStyle={{ fontFamily:font_description,color:colors.blackColor }}
            />
          </View>
        <View style={{ height:height_10 }} />    
        </View>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
      </View>
    );
  }
}
function mapStateToProps(state){
  return{
    isLoding : state.profile.isLoding,
    message : state.profile.message,
    status : state.profile.status,
    data : state.profile.data,
  };
}

const mapDispatchToProps = (dispatch) => ({
    profilePending: () => dispatch(profilePending()),
    profileError: (error) => dispatch(profileError(error)),
    profileSuccess: (data) => dispatch(profileSuccess(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(EditPhoneNumber);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
  },
  icon:{
    color:colors.blackColor
  },
  flex_1:{
    flex: 1
  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  name_title:{
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
  margin_10:{
    margin:10
  },
  margin_50:{
    margin:50
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  textinput:{
    borderBottomWidth : 1, 
    fontSize:18,
    color:colors.theme_fg_four,
    fontFamily:font_description
  },
  padding_20:{
    padding:20
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
    color:colors.theme_fg_four,
    fontFamily:font_description
  },
});

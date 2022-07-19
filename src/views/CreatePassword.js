import React, {Component} from 'react';
import { StyleSheet, View, TextInput,  TouchableOpacity, Image } from 'react-native';
import { Header, Body, Title, Left, Icon, Right, Button as Btn } from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, api_url, register, font_title, font_description, height_40, go_icon } from '../config/Constants';
import DropdownAlert from 'react-native-dropdownalert';
import axios from 'axios';
import { connect } from 'react-redux';
import { createLoginPassword, registerPending, registerError, registerSuccess } from '../actions/RegisterActions'; 
import { Loader } from '../components/GeneralComponents';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';

class CreatePassword extends Component<Props> {

  constructor(props) { 
    super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        password: '',
        referral_code:'',
        validation:false  
      }
  }

  componentDidMount() {
    setTimeout(() => {
      this.password.focus();
    }, 200);
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  async check_password(){
    console.log('ll')
    await this.check_validate();
    if(this.state.validation){
      this.props.createLoginPassword(this.state.password);
      this.register();
    }
  }

  async register(){
    this.props.registerPending();
    await axios({
      method: 'post',  
      url: api_url + register,
      data:{ country_code : this.props.country_code, phone_number : this.props.phone_number, phone_with_code : this.props.phone_with_code, first_name : this.props.first_name, last_name : this.props.last_name, email : this.props.email, password : this.props.password, fcm_token:global.fcm_token, referral_code:this.state.referral_code}
    })
    .then(async response => {
      console.log(response)
        await this.props.registerSuccess(response.data)
        await this.saveData();
    })
    .catch(error => {
        alert(error);
        this.props.registerError(error);
    });
  }

  saveData = async () =>{
    if(this.props.status == 1){
      try {
        await AsyncStorage.setItem('id', this.props.data.id.toString());
        await AsyncStorage.setItem('first_name', this.props.data.first_name.toString());
        await AsyncStorage.setItem('profile_picture', this.props.data.profile_picture.toString());
        await AsyncStorage.setItem('phone_with_code', this.props.data.phone_with_code.toString());
        await AsyncStorage.setItem('email', this.props.data.email.toString());
        await AsyncStorage.setItem('country_id', this.props.data.country_id.toString());
        await AsyncStorage.setItem('currency', this.props.data.currency.toString());
        await AsyncStorage.setItem('currency_short_code', this.props.data.currency_short_code.toString());

        global.id = await this.props.data.id;
        global.first_name = await this.props.data.first_name;
        global.profile_picture = await this.props.data.profile_picture;
        global.phone_with_code = await this.props.data.phone_with_code;
        global.email = await this.props.data.email;
        global.country_id = await this.props.data.country_id;
        global.currency = await this.props.data.currency;
        global.currency_short_code = await this.props.data.currency_short_code;

        await this.home();
      } catch (e) {
        alert(e);
        //alert(JSON.stringify(e));
      }
    }else{
      this.dropDownAlertRef.alertWithType('error', 'Error',this.props.message);
    }
  } 

  home = () => {
    this.props.navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }


  async check_validate(){
    if(this.state.password == ""){
      await this.setState({ validation:false });
      await this.show_alert("Please enter password");
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
          <Loader visible={isLoding} />
          <View style={{ padding:20, height:height_40 }}>
            <Title style={styles.password_title}>Enter your password</Title>
            
            <TextInput
              ref={ref => this.password = ref}
              secureTextEntry={true}
              placeholderTextColor = {colors.theme_fg_four}
              placeholder="******"
              style = {styles.textinput}
              onChangeText={ TextInputValue =>
                  this.setState({password : TextInputValue }) }
            />
            <Title style={styles.password_title}>Enter Referral Code(Optional)</Title>
            
            <TextInput
              ref={ref => this.referral_code = ref}  
              placeholderTextColor = {colors.theme_fg_four}
              placeholder="******"
              style = {styles.textinput}
              onChangeText={ TextInputValue => 
                  this.setState({referral_code : TextInputValue }) }
            />   
            <View style={{margin:50}} />
            
            {/* <TouchableOpacity style={{alignSelf: 'flex-end', height:100, width:100}} onPress={this.check_password.bind(this)}> */}
            {/* <TouchableOpacity style={{alignSelf: 'flex-end', height:100, width:100,backgroundColor:'yellow'}} onPress={()=> {alert('hhhh')}}>
              <Image style={{ alignSelf: 'flex-end', height:70, width:65, margin:15, }} source={go_icon}/>
            </TouchableOpacity> */}
        </View>
        <TouchableOpacity style={{alignSelf: 'flex-end', height:100, width:100}} onPress={this.check_password.bind(this)}>
              <Image style={{ alignSelf: 'flex-end', height:70, width:65, margin:15, }} source={go_icon}/>
            </TouchableOpacity>
        </View> 
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
      </View>
    );
  }
}

function mapStateToProps(state){
  return{
    first_name : state.register.first_name,
    last_name : state.register.last_name,
    email : state.register.email,
    password : state.register.password,
    country_code : state.register.country_code,
    phone_number : state.register.phone_number,
    phone_with_code : state.register.phone_with_code,
    isLoding : state.register.isLoding,
    error : state.register.error,
    data : state.register.data,
    message : state.register.message,
    status : state.register.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    registerPending: () => dispatch(registerPending()),
    registerError: (error) => dispatch(registerError(error)),
    registerSuccess: (data) => dispatch(registerSuccess(data)),
    createLoginPassword: (data) => dispatch(createLoginPassword(data))
});

export default connect(mapStateToProps,mapDispatchToProps)(CreatePassword);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
  },
  icon:{
    color:colors.theme_fg_three
  },
  flex_1:{
    flex: 1
  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  password_title:{
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
  textinput:{
    borderBottomWidth : 1, 
    fontSize:18,
    color:colors.theme_fg_four,
    fontFamily:font_description
  },
  padding_20:{
    padding:20
  }
});

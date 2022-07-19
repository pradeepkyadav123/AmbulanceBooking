import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TextInput,ImageBackground,TouchableOpacity } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Col, Icon, Right, Button as Btn} from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, font_title, font_description, api_url, login,height_40,height_45, height_10, bg_img, go_icon,height_50 } from '../config/Constants';
import { StatusBar, Loader } from '../components/GeneralComponents';
import ActionButton from 'react-native-action-button';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import { CommonActions } from '@react-navigation/native';
import { loginPending, loginError, loginSuccess } from '../actions/LoginActions'; 
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
class Password extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        phone_number:this.props.route.params.phone_number,
        password: '',
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

  async forgot(){
    this.props.navigation.navigate('Forgot');
  }

  async login(){
    await this.check_validate();
    if(this.state.validation){
      this.props.loginPending();
      await axios({
        method: 'post', 
        url: api_url + login,
        data:{ phone_with_code: this.state.phone_number, password: this.state.password, fcm_token:global.fcm_token}
      })
      .then(async response => {
          await this.props.loginSuccess(response.data)
          await this.saveData();
      })
      .catch(error => {
          this.props.loginError(error);
      });
    }
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
        await AsyncStorage.setItem('wallet', this.props.data.wallet.toString());
        await AsyncStorage.setItem('currency_short_code', this.props.data.currency_short_code.toString());
        global.id = await this.props.data.id;
        global.first_name = await this.props.data.first_name;
        global.profile_picture = await this.props.data.profile_picture;
        global.phone_with_code = await this.props.data.phone_with_code;
        global.email = await this.props.data.email;
        global.country_id = await this.props.data.country_id;
        global.currency = await this.props.data.currency;
        global.wallet = await this.props.data.wallet;
        global.currency_short_code = await this.props.data.currency_short_code;
        await this.home();
      } catch (e) {

      }
    }else{
      this.dropDownAlertRef.alertWithType('error', 'Error',this.props.message);
    }
  }

  async check_validate(){
    if(this.state.password == ""){
      await this.setState({ validation:false });
      await this.show_alert("Please enter password");
    }else{
      await this.setState({ validation:true });
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
        <View style={{backgroundColor:colors.theme_bg_three}}>
          <Loader visible={isLoding} />
          <View style={styles.padding_20}>
            <Title style={styles.password_title}>Enter your password</Title>
            <View style={styles.margin_10} />
            <TextInput
              ref={ref => this.password = ref}
              secureTextEntry={true}
              placeholderTextColor={colors.theme_fg_two}
              placeholder="******"
              style = {styles.textinput}
              onChangeText={ TextInputValue =>
                  this.setState({password : TextInputValue }) }
            />
            
            <View>
              <View style={styles.margin_10} />
                <Text onPress={this.forgot.bind(this)} style={styles.forgot_text}>Forgot my password</Text>
              </View>
            <View style={styles.margin_10} />
            
            <TouchableOpacity  onPress={this.login.bind(this)}>
              <Image style={{ alignSelf: 'flex-end', height:70, width:65 }} source={go_icon}/>
            </TouchableOpacity>
           
          </View>
        </View>
         <View style={{margin:20}}/>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
      </View>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.login.isLoding,
    error : state.login.error,
    data : state.login.data,
    message : state.login.message,
    status : state.login.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    loginPending: () => dispatch(loginPending()),
    loginError: (error) => dispatch(loginError(error)),
    loginSuccess: (data) => dispatch(loginSuccess(data))
});

export default connect(mapStateToProps,mapDispatchToProps)(Password);

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
  margin_10:{
    margin:10
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  textinput:{
    borderBottomWidth : 1, 
    fontSize:18,
    color:colors.theme_fg_two
  },
  padding_20:{
    padding:20
  },
  forgot_text:{
    color:colors.theme_fg_two, 
    fontSize:14,
    fontFamily:font_description
  }
});

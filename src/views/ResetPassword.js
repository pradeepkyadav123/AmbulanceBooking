import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity,ImageBackground } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Col, Icon, Right, Button as Btn} from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, reset_password_required_validation_message, reset_password_missmatch_validation_message, font_title, font_description, height_10, height_40,height_50, bg_img, go_icon, reset_password, api_url } from '../config/Constants';
import { StatusBar, Loader } from '../components/GeneralComponents';
import ActionButton from 'react-native-action-button';
import DropdownAlert from 'react-native-dropdownalert';
import axios from 'axios';

class CreatePassword extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        password: '',
        confirm_password:'',
        validation:false,
        isLoading: false
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
    await this.check_validate();
    if(this.state.validation){
      this.reset_password();
    }
  }

  async check_validate(){
    if(this.state.password == "" || this.state.confirm_password == ""){
      await this.setState({ validation:false });
      await this.show_alert(reset_password_required_validation_message);
    }else if(this.state.password != this.state.confirm_password ){
      await this.setState({ validation:false });
      await this.show_alert(reset_password_missmatch_validation_message);
    }else{
      await this.setState({ validation:true });
    }
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  reset_password = async () => {
    this.setState({isLoading:true});
    await axios({
      method: 'post', 
      url: api_url + reset_password,
      data: {id :  global.id, password: this.state.password }
    })
    .then(async response => {
      this.setState({isLoading:false});
      //alert(JSON.stringify(response.data));
      this.props.navigation.navigate('LoginHome');
    })
    .catch(error => {
      alert('Sorry something went wrong');
      this.setState({isLoading:false});
    });
  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <Btn onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Reset password</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:colors.theme_fg_three}}>
        <Loader visible={this.state.isLoading} />
          <View style={{ padding:20, height:height_50 }}>
            <Title style={styles.password_title}>Enter your new password</Title>
            <View style={styles.margin_10} />
            <Row>
            <Col>
              <TextInput
                ref={ref => this.password = ref}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor = {colors.theme_fg_four}
                style = {styles.textinput}
                onChangeText={ TextInputValue =>
                    this.setState({password : TextInputValue }) }
              />
            </Col>
            <Col style={{ width:10 }} />
            <Col>
              <TextInput
                ref={ref => this.confirm_password = ref}
                secureTextEntry={true}
                placeholder="Confirm Password"
                placeholderTextColor = {colors.theme_fg_four}
                style = {styles.textinput}
                onChangeText={ TextInputValue =>
                    this.setState({confirm_password : TextInputValue }) }
              />
            </Col> 
            </Row>
            <TouchableOpacity onPress={this.check_password.bind(this)}>
            <View style={{marginBottom:'35%'}}>
              <Image style={{ alignSelf: 'flex-end', height:70, width:65 }} source={go_icon}/>
              </View>
            </TouchableOpacity>
          </View> 
        </Content>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
      </Container>
    );
  }
}

export default CreatePassword;

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
    letterSpacing:0.5
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    alignSelf:'center', 
    fontSize:20, 
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

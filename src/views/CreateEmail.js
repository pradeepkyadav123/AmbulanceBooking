import React, {Component} from 'react';
import { StyleSheet, View, TextInput,  TouchableOpacity, Image} from 'react-native';
import { Header, Body, Title, Left,Icon, Right, Button as Btn } from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, font_title, font_description, height_40, go_icon } from '../config/Constants';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { createEmailAddress } from '../actions/RegisterActions';

class CreateEmail extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        email: '',
        validation:false
      }
  }

  componentDidMount() {
    setTimeout(() => {
      this.email.focus();
    }, 200);
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  async check_email(){
    await this.check_validate();
    if(this.state.validation){
      await this.props.createEmailAddress(this.state.email);
      await this.props.navigation.navigate('CreatePassword');
    }
  }

  async check_validate(){
    if(this.state.email == ""){
      await this.setState({ validation:false });
      await this.show_alert("Please enter email address");
    }else{
      await this.setState({ validation:true });
    }
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
            <Title style={styles.email_title}>Enter your email</Title>
            <View style={styles.margin_10} />
            <TextInput
              ref={ref => this.email = ref}
              placeholder="john@gmail.com"
              placeholderTextColor = {colors.theme_fg_four}
              keyboardType="email-address"
              style = {styles.textinput}
              onChangeText={ TextInputValue =>
                this.setState({email : TextInputValue }) }
            />
            <View style={styles.margin_50} />
          
            <TouchableOpacity onPress={this.check_email.bind(this)}>
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
    createEmailAddress: (data) => dispatch(createEmailAddress(data))
});

export default connect(null,mapDispatchToProps)(CreateEmail);

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
  email_title:{
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
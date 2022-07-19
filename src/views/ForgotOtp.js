import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Content, Container, Header, Body, Title, Left, Icon, Right, Button as Btn} from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, otp_validation_error, font_title, font_description, height_10 } from '../config/Constants';
import DropdownAlert from 'react-native-dropdownalert';
import CodeInput from 'react-native-confirmation-code-input';

class ForgotOtp extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state={
        otp:this.props.route.params.otp
      }
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  async check_otp(code) {
    if (code != this.state.otp) {
      await this.show_alert(otp_validation_error);
    } else {
      this.props.navigation.navigate('ResetPassword');
    }
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
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
      
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:colors.theme_fg_three}}>
          <View style={styles.padding_20}>
            <Title style={styles.otp_title}>Please enter OTP</Title>
            <View style={styles.margin_10} />
            <View style={styles.code}>
              <CodeInput
                ref="codeInputRef2"
                keyboardType="numeric"
                codeLength={4}
                className='border-circle'
                autoFocus={false}
                codeInputStyle={{ fontWeight: '800' }}
                activeColor={colors.theme_bg}
                inactiveColor={colors.theme_bg}
                onFulfill={(isValid) => this.check_otp(isValid)}
              />
            </View>
            <View style={styles.margin_10} />
            <Text style={styles.description} >Enter the code you have received by SMS for reset your password.</Text>
          </View>
          <View style={{ height:height_10 }} />
          <View style={{margin:50}} />
        </Content>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
      </Container>
    );
  }
}

export default ForgotOtp;

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
  otp_title:{
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
  padding_20:{
    padding:20
  },
  description:{
    color:colors.theme_fg_four,
    fontFamily:font_description
  }
});

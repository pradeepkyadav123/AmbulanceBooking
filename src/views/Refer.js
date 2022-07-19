import React, {Component} from 'react';
import { Share, StyleSheet, Text, Image, View, TextInput, TouchableOpacity, Linking, BackHandler } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Col, Icon, Right, Button as Btn, Card, CardItem, List, ListItem, Thumbnail, Footer, Fab } from 'native-base';
import * as colors from '../assets/css/Colors';
import { refer_lottie } from '../config/Constants';
import { StatusBar } from '../components/GeneralComponents';
import DropdownAlert from 'react-native-dropdownalert';
import { Button, Divider } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import { alert_close_timing, otp_validation_error, logo, avatar_icon, font_title, font_description , api_url, get_referral_message} from '../config/Constants';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/ReferralActions';
import { CommonActions } from '@react-navigation/native';
 
class Refer extends Component<Props> {

  constructor(props) {
      super(props)
      this.drawer = this.drawer.bind(this); 
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = { 
        msg:'Your refferal code from 911Ambulance app is  '
      } 
      this.referral();
      /*alert(this.referral_code);*/
  } 

  drawer = () =>{
    this.props.navigation.toggleDrawer();
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
      this.props.navigation.dispatch(
           CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
          })
      );
      return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  referral = async () => {
    await axios({
      method: 'post', 
      url: api_url + get_referral_message,  
       data:{ customer_id:global.id }
    })
    .then(async response => {
        await this.setState({ referral_code:response.data.code })
        await this.props.serviceActionSuccess(response.data);
    })
    .catch(error => {
        this.props.serviceActionError(error);
    });
  } 
 
  open_sms = async()=>{
    try {
      const result = await Share.share({
       title: 'Share your referral',
        message: this.state.msg+this.state.referral_code, 
        url: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en'
      });
    } catch (error) {
      alert(error.message);
    }
  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <Btn onPress={this.drawer} transparent>
              <Icon style={styles.icon} name='menu' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Refer & Earn</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor:colors.theme_fg_three}}>
          <View style={{ alignItems:'center', padding:20}}>
            <LottieView style={{ height:200, width:200 }}source={refer_lottie} autoPlay loop />
          </View>
          <View style={{ margin:10}} />
          <Row> 
            <Body>
              <Text style={styles.refering}>Refer your friends and get ₹50 each</Text>
            </Body>
          </Row>
          <View style={{ margin:10}} />
          <Row>
            <Body>
              <Text style={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
            </Body>
          </Row>
        </Content>
        <Footer style={styles.footer} >
          <View style={styles.footer_content}> 

            <Button
              title="Refer friends"
              onPress={this.open_sms}
              buttonStyle={{ backgroundColor:colors.theme_bg }}
              titleStyle={{ fontFamily:font_description,color:colors.blackColor }}
            />

          </View>
        </Footer>
      </Container>
    );
  }
}

export default Refer;

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
  title:{
    alignSelf:'center', 
    color:colors.blackColor,
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
  padding_20:{
    padding:20
  },
  profile:{
    height:100, 
    width:100
  },
  default_divider:{ 
    marginTop:20, 
    marginBottom:20 
  },
  footer:{
    backgroundColor:colors.theme_bg_three
  },
  footer_content:{
    width:'90%'
  },
  refering:{ fontSize:20, fontFamily:font_title, color:colors.theme_fg_two },
  description:{ color:colors.theme_fg_four, fontFamily:font_description},


});

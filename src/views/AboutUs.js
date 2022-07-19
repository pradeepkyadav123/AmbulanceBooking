import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, BackHandler } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Icon, Right, Button as Btn} from 'native-base';
import * as colors from '../assets/css/Colors';
import { logo, font_title, font_description, about_us, api_url } from '../config/Constants';
import { Divider } from 'react-native-elements';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

class Abouts extends Component<Props> {

  constructor(props) {
      super(props)
      this.drawer = this.drawer.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.about_us();
      this.state={
        about_us:[],
      }
  }

  drawer = () =>{
    this.props.navigation.toggleDrawer();
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

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  about_us= async () => {
     await axios({
      method: 'get', 
      url: api_url + about_us,
    })
    .then(async response => {
        await this.setState({  about_us:response.data.result});
    })
    .catch(error => {
        this.showSnackbar(strings.sorry_something_went_wrong);
    });
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
            <Title style={styles.title} >About Us</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={styles.content_padder}>
          <View style={styles.margin_10} />
          <Row>
            <Body>
                <View style={styles.logo}>
                  <Image
                    style= {styles.image_style}
                    source={logo}
                  />
                </View>
                <View style={styles.margin_10} />
              <Text style={styles.version}>Version 1.0</Text>
            </Body>
          </Row>
          <Divider style={styles.default_divider} />
          <Row>
            <Text style={styles.description_title}>Who we are</Text>
          </Row>
          <View style={styles.margin_10} />
          <Text style={styles.description}>{this.state.about_us.about_us}</Text>
          <View style={styles.margin_10} />
          <Row>
            <Text style={styles.contact_details}>Contact details</Text>
          </Row>
          <View style={styles.margin_10} />
          <Row>
            <Icon style={styles.icon_style} name='call' /><Text style={styles.phone_no}>{this.state.about_us.phone_number}</Text>
          </Row>
          <View style={styles.margin_10} />
          <Row>
            <Icon style={styles.icon_style} name='mail' /><Text style={styles.email}>{this.state.about_us.email}</Text>
          </Row>
          <View style={styles.margin_10} />
          <Row>
            <Icon style={styles.icon_style} name='pin' /><Text style={styles.address}>{this.state.about_us.address}</Text>
          </Row>
        </Content>
      </Container>
    );
  }
}

export default Abouts;

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
  margin_10:{
    margin:10
  },
  logo:{
    height:350, 
    width:320
  },
  default_divider:{ 
    marginTop:20, 
    marginBottom:20 
  },
  version:{ 
    fontSize:15, 
    fontFamily:font_title 
  },
  description_title:{ 
    fontSize:18, 
    fontFamily:font_title, 
    color:colors.theme_fg_two 
  },
  description:{ 
    color:colors.theme_fg_four, 
    fontFamily:font_description
  },
  contact_details:{ 
    fontSize:18, 
    fontFamily:font_title, 
    color:colors.theme_fg_two 
  },
  phone_no:{ 
    fontSize:14, 
    color:colors.theme_fg_four, 
    fontFamily:font_description
  },
  email:{ 
    fontSize:14, 
    color:colors.theme_fg_four, 
    fontFamily:font_description 
  },
  address:{ 
    fontSize:14, 
    color:colors.theme_fg_four, 
    fontFamily:font_description 
  },
  content_padder:{ 
    backgroundColor:colors.theme_bg_three
  },
  icon_style:{ 
    fontSize:18, marginRight:10,color:colors.theme_fg
  },
  image_style:{ 
    flex:1 , width: undefined, height: undefined
  },
});

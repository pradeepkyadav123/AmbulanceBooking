import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TextInput } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Col, Icon, Right, Button as Btn, Card, CardItem, List, ListItem, Thumbnail, Footer} from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, otp_validation_error, wallet_icon, taxi_icon, avatar_icon, car_icon_small, meter_icon, font_title, font_description,send_invoice, api_url, sos_sms, label, img_url } from '../config/Constants';
import { StatusBar, Loader } from '../components/GeneralComponents';
import DropdownAlert from 'react-native-dropdownalert';
import { Button, Badge, Divider } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import axios from 'axios';
import Moment from 'moment';
 
class RideDetails extends Component<Props> { 

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        data:this.props.route.params.data,
        isLoading:false
      }
  }

  handleBackButtonClick= () => { 
    this.props.navigation.goBack(null);
  }
 
  send_invoice = async () => {
    this.setState({ isLoading: true });
    await axios({
      method: 'post',  
      url: api_url + send_invoice,
      data:{ id: this.state.data.id, country_code : global.country_id }
    })
    .then(async response => {
      //alert(JSON.stringify(response));
      this.setState({ isLoading: false });
      if(response.data.status == 1){
        alert('Your invoices successfully processes');
      }
    })
    .catch(error => {
      this.setState({ isLoading: false });
      //alert(error)
      alert('Sorry, something went wrong');
    });
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  support(item){
    this.props.navigation.navigate('ComplaintCategory');
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
            <Text style={styles.date_time}>{Moment(this.state.data.pickup_date).format('MMM DD, YYYY hh:mm A')}</Text>
            <Text style={styles.cab}>{this.state.data.vehicle_type}. #{this.state.data.trip_id}</Text>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:colors.theme_bg_three}}>
        <Loader visible={this.state.isLoading} />
          {/*<View style={styles.image_container} >
            <Image style={styles.image} source={require('.././assets/img/mapzone.png')} />
          </View>*/}
          <View style={{ padding:20 }}>
            <Row>
              <Col style={{ width:'25%'}}>
                <Thumbnail source={{ uri:img_url+this.state.data.profile_picture}} style={{ height:50, width:50 }} />
              </Col>
              <Col style={{ justifyContent:'center' }}>
                  <Text style={styles.cab_driver}>{this.state.data.driver_name}</Text>
                  <View style={{ margin:3 }} />
                  <View style={{ flexDirection:'row', alignItems:'center'}} >
                    <StarRating
                      disabled={true}
                      maxStars={5}
                      starSize={10}
                      rating={this.state.data.ratings}
                      starStyle={{ paddingRight:5, color:colors.star_rating }}
                    /> 
                    <Text style={styles.rate}> (You Rated)</Text>
                  </View>
              </Col>
            </Row>
            <Divider style={styles.default_divider} />
            <Row>
              <Col style={{ width:'25%', paddingBottom:10}}>
                <Thumbnail square source={car_icon_small} style={{ height:50, width:50}} />
              </Col>
              <Col style={{ justifyContent:'center' }}>
                  <Text style={styles.cab_details}>{this.state.data.vehicle_type} - {this.state.data.color} {this.state.data.vehicle_name}</Text>
              </Col>
            </Row>
            <Divider style={styles.default_divider} />
            <Row>
              <Col style={{ width:'25%'}}>
                <Thumbnail square source={label} style={{ height:50, width:50}} />
              </Col>
              <Col style={{ justifyContent:'center' }}>
                  <Text style={styles.cab_details}>Trip Type - {this.state.data.trip_type}</Text>
              </Col>
            </Row>
            <Divider style={styles.default_divider} />
            <Row>
              <Col style={{ width:'25%'}}>
                <Thumbnail square source={meter_icon} style={{ height:50, width:50 }} />
              </Col>
              <Col style={{ justifyContent:'center' }}>
                  <Row>
                      <Col style={{ justifyContent:'center' }}>
                        <Text style={styles.cab_details}>{global.currency}{this.state.data.total}</Text>
                      </Col>
                      <Col style={{ justifyContent:'center' }}>
                        <Text style={styles.cab_details}>{this.state.data.distance} km</Text>
                      </Col>
                      {/*<Col style={{ justifyContent:'center' }}>
                        <Text style={styles.cab_details}>{this.state.data.duration} min</Text>
                      </Col>*/}
                  </Row>
              </Col>
            </Row>
            <Divider style={styles.default_divider} />
            <Row>
              <Col style={{ width:'25%', justifyContent:'center'}}>
                <Text style={styles.time}>{Moment(this.state.data.start_time).format('hh:mm A')}</Text>
              </Col>
              <Col style={{ justifyContent:'center' }}>
                 <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
                  <Badge status="success" />
                  <View style={{ marginLeft : 10}} />
                  <Text style={styles.address}>{this.state.data.actual_pickup_address}</Text>
                </View>
              </Col>
            </Row>
            <View style={{ margin:10 }} />
            <Row>
              <Col style={{ width:'25%', justifyContent:'center'}}>
                <Text style={styles.time}>{Moment(this.state.data.end_time).format('hh:mm A')}</Text>
              </Col>
              <Col style={{ justifyContent:'center' }}>
                 <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
                  <Badge status="error" />
                  <View style={{ marginLeft : 10}} />
                  <Text style={styles.address}>{this.state.data.actual_drop_address}</Text>
                </View>
              </Col>
            </Row>
            <Divider style={styles.default_divider} />
            <Text style={styles.billing}>Bill details</Text>
            <View style={{ margin:10 }} />
            <Row>
              <Left style={{ width:'25%', justifyContent:'center'}}>
                <Text style={styles.trip}>Fare</Text>
              </Left>
              <Right style={{ justifyContent:'center', width:'20%' }}>
                  <Text style={styles.trip_amt}>{global.currency}{this.state.data.sub_total}</Text>
              </Right>
            </Row>
            <View style={{ margin:5 }} />
            <Row>
              <Left style={{ width:'25%', justifyContent:'center'}}>
                <Text style={styles.trip}>Taxes</Text>
              </Left>
              <Right style={{ justifyContent:'center', width:'20%' }}>
                  <Text style={styles.trip_amt}>{global.currency}{this.state.data.tax}</Text>
              </Right>
            </Row>
            <View style={{ margin:5 }} />
            <Row>
              <Left style={{ width:'25%', justifyContent:'center'}}>
                <Text style={styles.trip}>Discount</Text>
              </Left>
              <Right style={{ justifyContent:'center', width:'20%' }}>
                  <Text style={styles.trip_amt}>{global.currency}{this.state.data.discount}</Text>
              </Right>
            </Row>
            <View style={{ margin:10 }} />
            <Row>
              <Left style={{ width:'25%', justifyContent:'center'}}>
                <Text style={styles.bill_amt}>Total bill</Text>
              </Left>
              <Right style={{ justifyContent:'center', width:'20%' }}>
                  <Text style={styles.bill_amt}>{global.currency}{this.state.data.total}</Text>
              </Right>
            </Row>
            <Divider style={styles.default_divider} />
            <Text style={styles.payment}>Payment Mode</Text>
            <View style={{ margin:10 }} />
            <Row>
              <Left style={{ width:'25%', justifyContent:'center'}}>
                <Text style={styles.cash}>{this.state.data.payment}</Text>
              </Left>
              <Right style={{ justifyContent:'center', width:'20%' }}>
                  <Text style={styles.cash_amt}>{global.currency}{this.state.data.total}</Text>
              </Right>
            </Row>
          </View>
        </Content>
        <Footer style={styles.footer} >
          <View style={styles.footer_content}>
            <Row>
              <Col onPress={this.send_invoice} activeOpacity={1} style={{ alignItems:'flex-start', justifyContent:'center' }}>
                <View style={{ alignItems:'center' }} >
                  <Icon style={styles.icon_footer} name='mail-outline' />
                  <Text style={styles.font}>Invoice</Text>
                </View>
              </Col>
              <Col onPress={this.support.bind(this)} activeOpacity={1} style={{ alignItems:'flex-end', justifyContent:'center' }}>
                <View style={{ alignItems:'center' }} >
                  <Icon style={styles.icon_footer} name='chatbubbles-outline' />
                  <Text style={styles.font}>Support</Text>
                </View>
              </Col>
            </Row>
          </View>
        </Footer>
      </Container>
    );
  }
}

export default RideDetails;

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
  },
  icon:{
    color:colors.blackColor
  },
  icon_footer:{
    color:colors.theme_fg,
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
    fontFamily:'font_title',
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
    color:colors.theme_fg_four
  },
  image_container:{
    height:170, 
    width:'100%'
  },
  image:{
    flex:1 , 
    width: undefined, 
    height: undefined
  },
  default_divider:{ 
    marginTop:10, 
    marginBottom:10 
  },
  footer:{
    backgroundColor:colors.theme_bg_three
  },
  footer_content:{
    width:'90%'
  },
  date_time:
  { fontSize:15, 
    fontFamily:font_title, 
    color:colors.blackColor, 
    letterSpacing:1 
  },
  cab:
  { 
    fontSize:12, 
    color:colors.blackColor, 
    fontFamily:font_description 
  },
  cab_driver:
  { 
    fontSize:14, 
    fontFamily:font_title, 
    color:colors.theme_fg_two 
  },
  rate:
  { 
    fontSize:12, 
    color:colors.theme_fg_four, 
    fontFamily:font_description 
  },
  cab_details:
  { 
    fontSize:14, 
    fontFamily:font_title, 
    color:colors.theme_fg_four, 
    letterSpacing:0.5 
  },
  time:
  { 
    fontSize:14, 
    color:colors.theme_fg_two, 
    fontFamily:font_description 
  },
  address:
  { fontSize:14, 
    color:colors.theme_fg_two, 
    fontFamily:font_description 
  },
  billing:
  { 
    fontSize:14, 
    color:colors.theme_fg_two, 
    fontFamily:font_description 
  },
  trip:
  { 
    fontSize:15, 
    color:colors.theme_fg_four, 
    fontFamily:font_description 
  },
  trip_amt:
  { 
    fontSize:15, 
    color:colors.theme_fg_four, 
    fontFamily:font_description 
  },
  bill_amt:
  { fontSize:14, 
    fontFamily:font_title, 
    color:colors.theme_fg_four  
  },
  payment:
  { 
    fontSize:15, 
    fontFamily:font_title, 
    color:colors.theme_fg_two, 
    letterSpacing:1 
  },
  cash:{ 
    fontSize:15, 
    color:colors.theme_fg_four, 
    fontFamily:font_description
  },
  cash_amt:
  { 
    fontSize:15, 
    color:colors.theme_fg_four, 
    fontFamily:font_description 
  },
  font:
  { 
    fontFamily:font_description,
    color:colors.theme_fg_two 
  },

});

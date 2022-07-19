import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Col, Icon, Right, Button as Btn, Card, CardItem, List, ListItem, Thumbnail, Footer} from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, otp_validation_error, logo, avatar_icon, font_title, img_url, font_description, api_url, submit_rating } from '../config/Constants';
import { StatusBar } from '../components/GeneralComponents';
import DropdownAlert from 'react-native-dropdownalert';
import { Button, Divider, Badge } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Loader } from '../components/GeneralComponents';
import { CommonActions } from '@react-navigation/native';
import Moment from 'moment';
class Rating extends Component<Props> {

  constructor(props) {
      super(props)
      this.home = this.home.bind(this);
      this.state = {
        data:this.props.route.params.data,
        isLoading:false
      }
      console.log(this.state.data);
  }

  home = () => {
    this.props.navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }

  onStarRatingPress(rating){
    this.setState({ rating: rating});
  }

  async submit_rating(){
    this.setState({ isLoading : true });
    await axios({
      method: 'post', 
      url: api_url + submit_rating,
      data:{ trip_id : this.state.data.id, ratings : this.state.rating }
    })
    .then(async response => {
      this.setState({ isLoading : false });
      this.home();
    })
    .catch(error => {
      this.setState({ isLoading : false });
    });
  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <Btn onPress={this.home} transparent>
              <Icon style={styles.icon} name='close' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Your need to pay</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor:colors.theme_fg_three}}>
          <Row>
            <Body>
              <Text style={styles.price} >{global.currency}{this.state.data.collection_amount}</Text>
              <Text style={styles.date_time}>{Moment(this.state.data.pickup_date).format('MMM DD, YYYY hh:mm A')}</Text>
              <Text style={styles.date_time}>Your bill : {global.currency}{this.state.data.total}</Text>
            </Body>
          </Row>
          <Divider style={styles.default_divider} />
          <Divider style={styles.default_divider} />
          <Row>
              <Col style={{ justifyContent:'center' }}>
                 <View style={{ flexDirection:'row', alignItems:'center', width:'90%', marginLeft:'5%' }}>
                  <Badge status="success" />
                  <View style={{ marginLeft : 10}} />
                  <Text style={styles.address}>{this.state.data.actual_pickup_address}</Text>
                </View>
              </Col>
            </Row>
            <View style={{ margin:10 }} />
            <Row>
              <Col style={{ justifyContent:'center' }}>
                 <View style={{ flexDirection:'row', alignItems:'center',  width:'90%', marginLeft:'5%' }}>
                  <Badge status="error" />
                  <View style={{ marginLeft : 10}} />
                  <Text style={styles.address}>{this.state.data.actual_drop_address}</Text>
                </View>
              </Col>
            </Row>
            <Divider style={styles.default_divider} />
            <Row>
              <Body>
                <Thumbnail square source={{ uri : img_url + this.state.data.driver_profile_picture}} style={{ height:80, width:80, borderRadius:40 }} />
              </Body>
            </Row>
            <View style={{ margin:5 }} />
            <Row>
              <Body>
                <Text style={styles.driver_name}>{this.state.data.driver_name}</Text>
              </Body>
            </Row>
            <View style={{ margin:10 }} />
            <Row>
              <Body>
                <StarRating
                  disabled={false}
                  emptyStar={'star-border'}
                  fullStar={'star'}
                  halfStar={'star-half'}
                  iconSet={'MaterialIcons'}
                  maxStars={5}
                  rating={this.state.rating}
                  selectedStar={(rating) => this.onStarRatingPress(rating)}
                  fullStarColor={colors.star_rating}
                  starStyle={{ padding:2 ,color:colors.theme_fg_two}}
                />
              </Body>
            </Row>
        </Content>
        <Footer style={styles.footer}>
            <TouchableOpacity activeOpacity={1} onPress={this.submit_rating.bind(this)} style={styles.cnf_button_style}>
            <Text style={styles.title_style}>SUBMIT</Text>
            </TouchableOpacity>
        </Footer>
        <Loader visible={this.state.isLoading} />
      </Container>
    );
  }
}

export default Rating;

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
  default_divider:{ 
    marginTop:20, 
    marginBottom:20 
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg_three,
    alignSelf:'center', 
    fontSize:20, 
    fontFamily:font_title
  },
  price:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    alignSelf:'center', 
    fontSize:40, 
    fontFamily:font_description 
  },
  footer:{
    alignItems:'center',
    width:'100%',
    backgroundColor: colors.theme_bg
  },
  cnf_button_style:{ 
    backgroundColor:colors.theme_bg,
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  title_style:{ 
    fontFamily:font_description,
    color:colors.theme_fg_three,
    fontSize:18
  },
  footer_content:{
    width:'100%',
  },
  date_time:{ color:colors.theme_fg_two, fontSize:12, fontFamily:font_description },
  address:{ fontSize:14, color:colors.theme_fg_two, fontFamily:font_description  },
  driver_name:{ color:colors.theme_fg_two, fontSize:18, letterSpacing:1, fontFamily:font_description }

});

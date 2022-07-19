import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, BackHandler } from 'react-native';
import { Content, Container, Header, Body, Title, Left, Col, Icon, Right, Button as Btn, List, ListItem, Thumbnail} from 'native-base';
import * as colors from '../assets/css/Colors';
import { car_icon_small, font_title, font_description, my_bookings, api_url, img_url } from '../config/Constants';
import { Badge } from 'react-native-elements';
import axios from 'axios';
import Moment from 'moment';
import { CommonActions } from '@react-navigation/native';

class MyRides extends Component<Props> {

  constructor(props) {
      super(props)
      this.drawer = this.drawer.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        isLoading:true,
        data:[]
      }
      /*alert(this.state.data.length);*/
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.get_bookings();
    });
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
    this._unsubscribe();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  async get_bookings(){
    this.setState({ isLoading : true });
    await axios({
      method: 'post', 
      url: api_url + my_bookings,
      data:{ customer_id : global.id }
    })
    .then(async response => {
      this.setState({ isLoading : false });
      if(response.data.count > 0){
        this.setState({ data : response.data.result });
      }
    })
    .catch(error => {
      this.setState({ isLoading : false });
    });
  }

  drawer = () =>{
    this.props.navigation.toggleDrawer();
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  ride_details(data){
    this.props.navigation.navigate('RideDetails',{data:data});
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
            <Title style={styles.title} >My Rides</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:colors.theme_fg_three}}>
          <List>
            <FlatList
              data={this.state.data}
              renderItem={({ item,index }) => (
                  <ListItem onPress={this.ride_details.bind(this, item)}>
                    <Col style={{ width:'10%' }}>
                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Thumbnail square source={car_icon_small} style={{ height:25, width:25 }} />
                      </View>
                    </Col>
                    <Col>
                      <Text style={styles.date_time}>{Moment(item.pickup_date).format('MMM DD, YYYY hh:mm A')}</Text>
                      <Text style={styles.mini}>{item.vehicle_type}. #{item.trip_id}</Text>
                      <View style={{ margin:5 }} />
                      <View style={{ flexDirection:'row', alignItems:'center' }}>
                        <Badge status="success" />
                        <View style={{ marginLeft : 5}} />
                        <Text style={styles.address}>{item.actual_pickup_address}</Text>
                      </View>
                      <View style={{ borderLeftWidth:1, height:10, marginLeft:3 }} />
                      <View style={{ flexDirection:'row', alignItems:'center' }}>
                        <Badge status="error" />
                        <View style={{ marginLeft : 5}} />
                        <Text style={styles.address}>{item.actual_drop_address}</Text>
                      </View>
                    </Col>
                    <Col style={{ width:'15%' }}>
                      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={styles.amt}>{global.currency}{item.total}</Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', marginBottom:5 }}>
                        <Thumbnail source={{ uri : img_url + item.profile_picture }} style={{ height:30, width:30 }} />
                      </View>
                    </Col>
                    
                  </ListItem>
              )}
              keyExtractor={item => item.id}
            />
            <View style={{ alignItems:'center', marginTop:'60%'}}>
              {/*{this.state.data.length == 0 &&  
                  <LottieView style={{ height:150, width:150 }} source={my_ride} autoPlay loop />
               }*/}
             
              {this.state.data.length == 0 && 
              <Text style={styles.amt}>No Rides Found</Text>
              }
           </View>
          </List>
        </Content>
      </Container>
    );
  }
}

export default MyRides;

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
  description:{
    color:colors.theme_fg_four
  },
  date_time:{ 
    fontSize:14, 
    fontFamily:font_title, 
    color:colors.theme_fg_two,  
  },
  mini:{ 
    fontSize:12, 
    color:colors.theme_fg_two,  
    fontFamily:font_description 
  },
  address:{ fontSize:11, color:colors.theme_fg_four,  fontFamily:font_description },
  amt:{ fontSize:16, fontFamily:font_title, color:colors.theme_fg_two },
  

});

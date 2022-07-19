import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TextInput, Linking, TouchableOpacity, style, FlatList, PermissionsAndroid, Platform, BackHandler, Alert } from 'react-native';
import { Content, Container, Header, Body, Radio, Title, Left,  Icon, Row, Col, Right, Button as Btn, Card, CardItem, List, ListItem, Thumbnail} from 'native-base';
import * as colors from '../assets/css/Colors';
import { DEFAULT_PADDING, avatar_icon, GOOGLE_KEY, font_title, font_description, api_url, ride_list, cancel_ride, sos_sms, LATITUDE_DELTA, LONGITUDE_DELTA, img_url, trip_cancel, sos } from '../config/Constants';
import { StatusBar } from '../components/GeneralComponents';
import DropdownAlert from 'react-native-dropdownalert';
import MapView, { PROVIDER_GOOGLE, Polyline, AnimatedRegion, Marker } from 'react-native-maps';
import { Button, Badge, Divider } from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";
import PolylineDirection from '@react-native-maps/polyline-direction';
import Dialog, { DialogTitle, SlideAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import axios from 'axios';
import { fb } from '../config/firebaseConfig';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/RideActions';
import { Loader } from '../components/GeneralComponents';
import { pickupAddress, pickupLat, pickupLng, dropAddress, dropLat, dropLng, km } from '../actions/BookingActions';
import { CommonActions } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
 
class Ride extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.trip_cancel = this.trip_cancel.bind(this);
      this.state = {
        coords:[],
        isDialogVisible:false,
        trip_id:this.props.route.params.trip_id,
        booking_id:'',
        markers:[],
        coordinate: new AnimatedRegion({
          latitude: 9.914372,
          longitude: 78.155033,
        }),
        marker: {
          latitude: 0,
          longitude: 0,
        },
        home_marker:{
          latitude:0,
          longitude:0
        },
        destination_marker:{
          latitude:0,
          longitude:0
        },
        status:0,
        bearing:0,
        sync:undefined,
        isLoading:false
      }
      this.booking_sync();
      this.ride_list();
      this.cancel_ride();
  }

  send_sos = async() => {
    Alert.alert(
      "Please Confirm",
      "Are you in emergency?",
      [
        {
          text: "Okay",
          onPress: () => this.get_location()
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  get_location = async() =>{
    if(Platform.OS == "android"){
      await this.requestCameraPermission();
    }else{
      await this.getInitialLocation();
    }
  }

  async requestCameraPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': 'Mr.Pharman needs to Access your location for tracking'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await this.getInitialLocation();
        }else {
            alert('Sorry, cannot fetch your location');
        }
    } catch (err) {
        alert('Sorry, cannot fetch your location');
    }
  }

  send_sos_alert = async(lat,lng) =>{
    this.setState({ isLoading:true }); 
    await axios({
      method: 'post', 
      url: api_url + sos_sms,  
      data: {customer_id :  global.id, booking_id : this.state.trip_id, latitude: lat, longitude:lng }  
    })
    .then(async response => {   
      this.setState({ isLoading:false });
      /*alert(JSON.stringify(response));*/
      if(response.data.status == 1){
        alert(response.data.message);
      }
      else{
      Alert.alert(
      "Alert",
       response.data.message, 
      [
        {
          text: "Okay", 
          onPress: () => this.add_sos()
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
    }
    })
    .catch(error => {   
      alert('Sorry. something went wrong');
      this.setState({ isLoading:false });
    });
  }

  async getInitialLocation(){
    await Geolocation.getCurrentPosition( async(position) => {
      let region = {
        latitude:       await position.coords.latitude,
        longitude:      await position.coords.longitude
      }
      this.send_sos_alert(position.coords.latitude, position.coords.longitude);
      
    }, error => console.log(error) , 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  booking_sync = () =>{

    fb.ref('/trips/'+this.state.trip_id).on('value', snapshot => {

      this.setState({ sync : snapshot.val() });
      //console.log(snapshot.val());
      let marker = {
        latitude:       parseFloat(snapshot.val().driver_lat),
        longitude:      parseFloat(snapshot.val().driver_lng)
      }

      this.animate(marker);

      let markers = [];

      this.setState({ status: snapshot.val().status, home_marker : this.createMarker(parseFloat(snapshot.val().pickup_lat),parseFloat(snapshot.val().pickup_lng)), destination_marker : this.createMarker(parseFloat(snapshot.val().drop_lat),parseFloat(snapshot.val().drop_lng)), bearing:snapshot.val().bearing })
      
      if(snapshot.val().status == 4){
        this.props.navigation.navigate('Rating',{ data : snapshot.val() });
      }
    });
  }

  createMarker(lat,lng) {
    return {
      latitude: lat, 
      longitude: lng
    };
  }

  ride_list = async () => {
    this.props.serviceActionPending(); 
    await axios({
      method: 'post', 
      url: api_url + ride_list,
      data: {country_id :  global.country_id, customer_id : global.id}
    })
    .then(async response => { 
     /* alert(JSON.stringify(response)); */
        await this.props.serviceActionSuccess(response.data)
    })
    .catch(error => {
        this.props.serviceActionError(error);
    });
  }

  trip_cancel = async (reason_id) => {
    this.setState({ isDialogVisible: false, isLoading:true });
    await axios({
      method: 'post', 
      url: api_url + trip_cancel,
      data: {reason_id :  reason_id, trip_id : this.state.trip_id, status : 6}
    }) 
    .then(async response => {
      this.setState({ isLoading:false });
      if(response.data.status == 1){
        this.home();
      }    
    })
    .catch(error => {
      this.setState({ isLoading:false });
        alert('Sorry something went wrong');
    });
  }

  home = () => {
    this.props.navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }


  /*async getDirections(startLoc, destinationLoc) {

   try {
       let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=9.921939,78.090231&destination=9.924475, 78.093535&&key=AIzaSyBfXYNzzZpWHuWXqAwmFEhwdoc_S86bM5E&mode=${'travel'}`)
       let respJson = await resp.json();
       let points = Polyline.decode(respJson.routes[0].overview_polyline.points);

       let coords = points.map((point, index) => {
           return  {
               latitude : point[0],
               longitude : point[1]
           }
       })


       this.setState({coords: coords})
       return coords
   } catch(error) {
       alert(error)
       return error
   }
}*/

  componentDidMount(){
    setTimeout(() => {
      //this.mapRef.fitToElements(true,{});
    }, 200);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick= () => {
    return true;
  }

  cancel_ride = async () => {
    await axios({
      method: 'get', 
      url: api_url + cancel_ride,
    })
    .then(async response => {
      this.setState({data: response.data.result});
    })
    .catch(error => {
      alert('Something went wrong!'); 
    });
  }

   
   /*send_sos_sms = async () => {
    await axios({
      method: 'post', 
      url: api_url + sos_sms,  
      data: {customer_id :  global.id, booking_id : this.state.trip_id, latitude: 12.0000, longitude:13.0000 }  
    })
    .then(async response => {   
      //alert(JSON.stringify(response));
    })
    .catch(error => {   
      alert('Something went wrong!');
    });
  } */


  cancel_update = () =>{
    this.setState({ isDialogVisible: false })
  }

  rating(){
    this.props.navigation.navigate('Rating',{ data :this.state.sync });
  }

  open_dialog(){
    this.setState({ isDialogVisible: true })
  }

  getCoordinates(region) {
      return [{
        longitude: region.longitude,
        latitude: region.latitude,
      }];
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

   add_sos(){
    this.props.navigation.navigate('AddSosSettings');
  }

  animate(nextProps) {
    const duration = 500

    if (this.state.marker !== nextProps) {
      if (Platform.OS === 'android') {
        if (this.marker) {
          this.marker.animateMarkerToCoordinate(
            nextProps,
            duration
          );
        }
      } else {
        this.state.coordinate.timing({
          ...nextProps,
          duration
        }).start();
      }
    }
  }

  call_driver = () =>{
    Linking.openURL(`tel:${this.state.sync.driver_phone_number}`)
  }
  render() {

    const { isLoding, error, data, message, status } = this.props
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            {/*<Btn onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Btn>*/}
          </Left>
          <Body style={styles.header_body} >
          {this.state.sync && 
            <Title style={styles.title} >{this.state.sync.customer_status_name}</Title>
          }
          </Body>
          <Right />
        </Header>
        {this.state.sync && 
        <View style={styles.container}>
           
          <MapView
           provider={PROVIDER_GOOGLE}
           ref={ref => this.mapRef = ref}
           style={styles.map}
           initialRegion={{
             latitude: parseFloat(this.state.sync.pickup_lat),
             longitude: parseFloat(this.state.sync.pickup_lng),
             latitudeDelta: LATITUDE_DELTA,
             longitudeDelta: LONGITUDE_DELTA,
           }}

          >
          {this.state.status <= 2 &&
            <MapView.Marker coordinate={this.state.home_marker}>
              <Image 
                style= {{flex:1 ,height:30, width:25 }}
                source={require('.././assets/img/from_location_pin.png')}
              />
            </MapView.Marker>
          }

          {this.state.status >= 2 &&
            <MapView.Marker coordinate={this.state.destination_marker}>
              <Image 
                style= {{flex:1 ,height:30, width:25 }}
                source={require('.././assets/img/to_location_pin.png')}
              />
            </MapView.Marker>
          }

          <MapView.Marker.Animated
            ref={marker => { this.marker = marker }}
            rotation={this.state.bearing}
            coordinate= {Platform.OS === "ios" ? this.state.coordinate : this.state.marker}
            identifier={'mk1'}
          >
            <Thumbnail square style={{ width:40, height:40 }} source={require('.././assets/img/car.png')} ></Thumbnail>
          </MapView.Marker.Animated>
            {/*<PolylineDirection
              origin={this.state.markers[0]}
              destination={this.state.markers[1]}
              apiKey={GOOGLE_KEY}
              strokeWidth={2}
              strokeColor={colors.theme_fg}
            />*/}
          </MapView>
          <View style={styles.address}>
            <View style={{flex: 1, flexDirection: 'column', padding:10}} >
              <Row>
                <View style={{ flexDirection:'row', alignItems:'center', paddingLeft:10, width:'80%' }}>
                  <Badge status="success" />
                  <View style={{ marginLeft : 10}} />
                  <Text style={styles.location} note numberOfLines={1}>{this.state.sync.pickup_address}</Text>
                </View>
              </Row>
              <View style={{ margin:5 }} />
              <Row>
                <View style={{ flexDirection:'row', alignItems:'center', paddingLeft:10, width:'80%' }}>
                  <Badge status="error" />
                  <View style={{ marginLeft : 10}} />
                  <Text style={styles.location} note numberOfLines={1}>{this.state.sync.drop_address}</Text>
                </View>
              </Row>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={{flex: 1, flexDirection: 'column', padding:10}} >
              {this.state.sync.status < 3 &&
              <Row>
                <Body>
                  <Text style={styles.booking}>OTP : {this.state.sync.otp}</Text>
                </Body>
              </Row>
              }
              {this.state.sync.status < 3 &&
               <Divider style={styles.default_divider} />
              }

              <Row>
                <Col style={{ alignItems:'center', justifyContent:'center', width:'49%', padding:10}}>
                  <Row>
                    <Col style={{ alignItems:'center', justifyContent:'center'}}>
                      <Thumbnail style={{ width:50, height:50 }} source={{ uri : img_url + this.state.sync.vehicle_image}} ></Thumbnail>
                    </Col>
                    <Col style={{ alignItems:'flex-start', justifyContent:'center'}}>
                      <Text style={styles.cab_no}>{this.state.sync.vehicle_color} {this.state.sync.vehicle_name}</Text>
                      <Text style={styles.cab_no}>{this.state.sync.vehicle_number}</Text>
                    </Col>
                  </Row>
                </Col>

                <Col style={{ alignItems:'center', justifyContent:'center', width:'49%', padding:10}}>
                  <Row>
                    <Col style={{ alignItems:'flex-end', justifyContent:'center'}}>
                      <Text style={styles.cab_no}>{this.state.sync.driver_name}</Text>
                      <Text style={styles.cab_no}>#{this.state.sync.trip_id}</Text>
                    </Col>
                    <Col style={{ alignItems:'flex-end', justifyContent:'center'}}>
                      <Thumbnail style={{ width:50, height:50 }} source={{ uri : img_url + this.state.sync.driver_profile_picture}} ></Thumbnail>
                    </Col>
                  </Row>
                </Col>

                {/*<Col style={{ alignItems:'center', justifyContent:'center', width:'49%', padding:10}}>
                  <Row>
                    <Col style={{ alignItems:'center', justifyContent:'center'}}>
                      <Text style={styles.font}>{this.state.sync.driver_name}</Text>
                    </Col>
                    <Col style={{ alignItems:'center', justifyContent:'center'}}>
                      <View style={{ width:40, height:40 }}>
                        <Image
                          style= {{flex:1 , width: undefined, height: undefined, borderRadius:20}}
                          source={avatar_icon}
                        />
                      </View> 
                    </Col>
                  </Row> 
                  <View style={{ margin:5 }} />
                </Col>*/}
              </Row>

              

              {this.state.sync.status >= 3 &&
                <TouchableOpacity style={{ borderRadius:10, backgroundColor:colors.theme_fg, alignItems:'center', justifyContent:'center', padding:10}} activeOpacity={1} onPress={ this.send_sos.bind(this) }>
                  <Text style={{ color:colors.theme_fg_three, fontFamily:font_title}}>SOS</Text>
                </TouchableOpacity>
              }

              {this.state.sync.status < 3 &&
                <Divider style={styles.default_divider} />
              }
              {this.state.sync.status < 3 &&
              <Row>
                <Left style={{ alignItems:'flex-start'}}>
                  <Row onPress={ this.open_dialog.bind(this) } activeOpacity={1} style={{ paddingLeft:5, paddingRight:5, justifyContent:'center' }}>
                    <Col style={{ width:'20%', marginRight:5 }}>
                      <Icon style={{ color:colors.theme_fg, fontSize:22 }} name='close' />
                    </Col>
                    <Col>
                      <Text style={styles.cancel}>Cancel</Text>
                    </Col>
                  </Row>
                </Left>
                <Body>
                  <View style={{ borderLeftWidth:1, height:20, borderColor:colors.theme_fg_four }} />
                </Body>
                <Right>
                  <Row onPress={ this.call_driver.bind(this) } activeOpacity={1} style={{ paddingLeft:5, paddingRight:5, justifyContent:'center' }}>
                    <Col style={{ width:'20%'}}>
                    <Icon style={{ color:colors.theme_fg, fontSize:20 }} name='call' />
                    </Col>
                    <Col>
                      <Text style={styles.call_driver}>Call driver</Text>
                    </Col>
                  </Row>
                </Right>
              </Row>
              }
            </View>
          </View>
        </View>
        }
        <Dialog
          visible={this.state.isDialogVisible}
          width="90%"
          animationDuration={100}
          dialogTitle={<DialogTitle title="Please select reason" />}
          dialogAnimation={new SlideAnimation({
            slideFrom: 'bottom',
          })}
          footer={
            <DialogFooter>
              <DialogButton
                text="CLOSE"
                textStyle={{ fontSize:16, color:colors.theme_fg_two }}
                onPress={() => { this.setState({ isDialogVisible: false })}}
              />
            </DialogFooter>
          }
          onTouchOutside={() => {
            this.setState({ isDialogVisible: false });
          }}
        >
          <DialogContent>
            <List>
              <FlatList
              data={this.state.data}
              renderItem={({ item,index }) => (
              <ListItem onPress={this.trip_cancel.bind(this,item.id)} > 
                <Col>
                  <Text style={styles.font}>{item.reason}</Text>
                </Col>
              </ListItem>
             )}
              keyExtractor={item => item.id}
            />
            </List>
          </DialogContent>
        </Dialog>
        <Loader visible={this.state.isLoading} />
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.ride.isLoding,
    error : state.ride.error,
    data : state.ride.data,
    message : state.ride.message,
    status : state.ride.status
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
    pickupAddress: (data) => dispatch(pickupAddress(data)),
    pickupLat: (data) => dispatch(pickupLat(data)),
    pickupLng: (data) => dispatch(pickupLng(data)),
    dropAddress: (data) => dispatch(dropAddress(data)),
    dropLat: (data) => dispatch(dropLat(data)),
    dropLng: (data) => dispatch(dropLng(data)),
    km: (data) => dispatch(km(data)),
});


export default connect(mapStateToProps,mapDispatchToProps)(Ride);

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
  title:{
    color:colors.theme_fg_three,
    alignSelf:'center', 
    fontSize:20, 
    fontFamily:font_title
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width:'100%',
    height:'100%'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width:'100%',
    backgroundColor: colors.theme_bg_three
  },
  address: {
    position: 'absolute',
    top: 0,
    width:'100%',
    backgroundColor:colors.theme_bg_three
  },
  default_divider:{ 
    marginTop:10, 
    marginBottom:10 
  },
  price:{
    color:colors.theme_fg_two,
    alignSelf:'center', 
    fontSize:18, 
    fontWeight:'bold'
  },
  location:{ fontSize:14, color:colors.theme_fg_two, fontFamily:font_description },
  booking:{ fontSize:14, color:colors.theme_fg_two, fontFamily:font_description},
  font:{ fontFamily:font_description,color:colors.theme_fg_four},
  cancel:{ color:colors.theme_fg_two , fontFamily:font_description},
  call_driver:{ color:colors.theme_fg_two, marginLeft:5, fontFamily:font_description},
  cab_no:{ fontSize:12, color:colors.theme_fg_four, fontFamily:font_title}
});

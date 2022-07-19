import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { Container, Row, Col, Fab, Icon } from 'native-base';
import * as colors from '../assets/css/Colors';
import { img_url, font_description,location, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, api_url, get_vehicles, get_gender } from '../config/Constants';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-elements';
import Dash from 'react-native-dash';
import axios from 'axios';
import { connect } from 'react-redux';
import { pickupAddress, pickupLat, pickupLng, dropAddress, dropLat, dropLng, km } from '../actions/BookingActions';
import Geolocation from '@react-native-community/geolocation';
import { fb } from '../config/firebaseConfig';
import { Loader } from '../components/GeneralComponents';

class Home extends Component<Props> {

  constructor(props) {
      super(props)
      this.drawer = this.drawer.bind(this);
      this.get_vehicles = this.get_vehicles.bind(this);
      this.state = {
        active_location:'FROM_LOCATION',
        markers:[],
        fab_active: false,
        region:undefined,
        active_vehicle:1,
        isLoading:false,
        vehicles:[],
        filter:0,
        active_icon:'people'

      }
      this.mapRef = null;
      this.requestCameraPermission();
      this.get_vehicle_categories();
      this.get_vehicles();
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.set_location();
      this.booking_sync();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  booking_sync = () =>{
    fb.ref('/customers/'+global.id).on('value', snapshot => {
      if(snapshot.val().booking_status == 2 && snapshot.val().booking_id != 0){
        this.props.navigation.navigate('Ride',{ trip_id : snapshot.val().booking_id });
      }
    });
  }

  async get_vehicle_categories(){

    this.setState({ isLoading : true });
    await axios({
      method: 'post', 
      url: api_url + get_vehicles,
      data:{ country_id : global.country_id }
    })
    .then(async response => {
      this.setState({ isLoading : false, vehicles : response.data.result, active_vehicle:response.data.result[0].id  });
    })
    .catch(error => {
      this.setState({ isLoading : false });
    });
  }

  get_vehicles = async() =>{
    
    await fb.ref('/vehicles/'+this.state.active_vehicle).on('value', snapshot => {
      let vehicles = [];
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.val().booking_status == 0 && childSnapshot.val().online_status == 1){
          vehicles.push({ latitude : childSnapshot.val().lat, longitude: childSnapshot.val().lng, gender:childSnapshot.val().gender }); 
        }
      });
      this.setState({ markers : vehicles});
    });
    
  }

  set_location(){

    if(this.props.pickup_address == undefined && this.state.active_location == 'FROM_LOCATION'){
      //this.requestCameraPermission();
    }else if(this.props.pickup_address != undefined && this.state.active_location == 'FROM_LOCATION'){
      this.mapRef.animateToCoordinate({
        latitude: this.props.pickup_lat,
        longitude: this.props.pickup_lng,
      }, 1000);
    }

    if(this.props.drop_address == undefined && this.state.active_location == 'TO_LOCATION'){
      //this.requestCameraPermission();
    }else if(this.props.drop_address != undefined && this.state.active_location == 'TO_LOCATION'){
      this.mapRef.animateToCoordinate({
        latitude: this.props.drop_lat,
        longitude: this.props.drop_lng,
      }, 1000);
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

  async getInitialLocation(){
    await Geolocation.getCurrentPosition( async(position) => {
      let region = {
        latitude:       await position.coords.latitude,
        longitude:      await position.coords.longitude,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }

      this.setState({ region: region });
      this.onRegionChange(region);
      
    }, error => console.log(error) , 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  createMarker(lat,lng) {
    return {
      latitude: lat,
      longitude: lng,
    };
  }

  drawer = () =>{
    this.props.navigation.toggleDrawer();
  }

  active_location_changing = (active_location) =>{
    this.setState({ active_location : active_location });

    if(active_location == 'FROM_LOCATION' && this.props.pickup_address){
      this.mapRef.animateToCoordinate({
        latitude: this.props.pickup_lat,
        longitude: this.props.pickup_lng,
      }, 1000);
    }

    if(active_location == 'TO_LOCATION' && this.props.drop_address){
      this.mapRef.animateToCoordinate({
        latitude: this.props.drop_lat,
        longitude: this.props.drop_lng,
      }, 1000);
    }

    if(this.state.active_location == 'FROM_LOCATION' && active_location == 'FROM_LOCATION'){
      this.props.navigation.navigate('Location',{ header_name:'Pickup Location', mode:'pickup' });
    }else if(this.state.active_location == 'TO_LOCATION' && active_location == 'TO_LOCATION'){
      this.props.navigation.navigate('Location',{ header_name:'Drop Location', mode:'drop' });
    }


  }

  pick_now = () =>{
    if(this.props.pickup_address != undefined && this.props.drop_address != undefined && this.props.km != 0){
      this.props.navigation.navigate('ConfirmBooking',{ vehicle_type : this.state.active_vehicle, filter:this.state.filter });
    }else{
      alert('Please select valid pickup and drop location');
    }
  }

  async change_vehicle(id){
    await this.setState({ active_vehicle : id});
    await this.get_vehicles();
  }

  onRegionChange = async(value) => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
           if(responseJson.results[0].formatted_address != undefined){
              if(this.state.active_location == 'FROM_LOCATION'){
                this.props.pickupAddress(responseJson.results[0].formatted_address);
                this.props.pickupLat(value.latitude);
                this.props.pickupLng(value.longitude);
              }else{
                this.props.dropAddress(responseJson.results[0].formatted_address);
                this.props.dropLat(value.latitude);
                this.props.dropLng(value.longitude);
              }
              this.get_distance();
           }
    }) 
  }

  getCoordinates(region) {
      return [{
        longitude: region.longitude,
        latitude: region.latitude,
      }];
  }

  get_distance = async() =>{

    if(this.props.pickup_address && this.props.drop_address){
      this.setState({ isLoading : true });
      await axios({
        method: 'get', 
        url: 'https://maps.googleapis.com/maps/api/directions/json?origin='+this.props.pickup_lat+','+this.props.pickup_lng+'&destination='+this.props.drop_lat+','+this.props.drop_lng+'&key='+GOOGLE_KEY
      })
      .then(async response => {
        this.setState({ isLoading : false });
        if(response.data.routes){
          this.props.km(response.data.routes[0].legs[0].distance.text);
        }
      })
      .catch(error => {
        this.setState({ isLoading : false });
        alert('Sorry something went wrong');
      });
    }
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  region_change(region){
    this.setState({ region : region });
    this.onRegionChange(region);
  }

  async change_filter(active_icon,filter){
    this.setState({ isLoading : true });
      await axios({
        method: 'post', 
        url: api_url + get_gender,
        data:{ customer_id : global.id }
      })
      .then(async response => {
        this.setState({ isLoading : false });
        if(response.data.result == 1){
          if(filter != 2){
            this.setState({ filter : filter, active_icon : active_icon, fab_active : false });
            this.get_vehicles();
          }else{
            alert('Sorry, you are not applicable for female driver filter')
          }
        }else if(response.data.result == 2){
          this.setState({ filter : filter, active_icon : active_icon, fab_active : false });
          this.get_vehicles();
        }else if(response.data.result == 0){
          alert('Please update your gender in profile settings page');
        }
      })
      .catch(error => {
        this.setState({ isLoading : false });
        alert('Sorry something went wrong');
      });
  }

  renderMarker() {
      return this.state.markers.map((marker) => {
        
        if(this.state.filter == marker.gender || this.state.filter == 0){
          return (
              <MapView.Marker coordinate={marker}>
                <Image 
                  style= {{flex:1 ,height:40, width:32 }}
                  source={require('.././assets/img/car.png')}
                />
              </MapView.Marker>
          );
         }
      });
  }

  render() {
    const { filter } = this.state

    return (

      <Container>
      <View style={styles.header} >
      <Icon onPress={() => this.props.navigation.toggleDrawer()} style={styles.icon} name='menu' />
      <View style={{padding:10,marginLeft:20}}>
        <View style={{ alignItems:'center', width:50}}>
         <Text style={{color:colors.theme_fg_two,fontSize:24,fontWeight:'bold'}}>
          {this.props.kms}
         </Text>
        </View>
      </View>
        <View style={{position:'absolute',top:'8%',alignSelf:'center',width:'55%'}}>
            <Row activeOpacity={1} onPress={() =>this.active_location_changing(   'FROM_LOCATION')} style={{alignSelf:'center',marginTop:5}} >
              <Col style={{ width:25, alignItems:'center', justifyContent:'center' }} >
            <TouchableOpacity >
              <Image style={{ alignSelf: 'flex-end', height:30, width:30 }} source={location}/>
            </TouchableOpacity>
              </Col>
              <Col>
                <Text style={styles.pickup_location}>Pickup Location</Text>
                <Text style={styles.address} note numberOfLines={1} >{this.props.pickup_address}</Text>
              </Col>
            </Row>
            <Row>
              <Col style={{height:"100%",width:"5%",alignSelf:'center'}}> 
                <Dash style={{width:1, height:40, flexDirection:'column',backgroundColor:colors.theme_fg_two, borderStyle:'dotted',marginLeft:13}}/>
              </Col>
              <Col style={{height:"100%",width:"95%",alignSelf:'center'}}> 
                <View style={{ flexDirection:'row', borderBottomWidth:1, padding:10, width:'100%',alignSelf:'center',borderColor:"#1B1B1B",marginLeft:40}}/>
              </Col>
            </Row>
            <Row activeOpacity={1} onPress={() =>this.active_location_changing('TO_LOCATION')}>
              <Col style={{ width:30, alignItems:'center', justifyContent:'center' }} >
            <TouchableOpacity  activeOpacity={1}>
              <Image style={{ alignSelf: 'flex-end', height:30, width:30 }} source={location}/>
            </TouchableOpacity>
              </Col>
              <Col>
                <Text style={styles.drop_location}>Drop Location</Text>
                {this.props.drop_address != undefined ?
                  <Text style={styles.address} note numberOfLines={1} >{this.props.drop_address}</Text>
                  :
                  <Text style={styles.address} note numberOfLines={1} >Destination......</Text>
                }
              </Col>
            </Row> 
         </View>
         </View>
        <View style={styles.container}>
          <MapView
           ref={(ref) => { this.mapRef = ref }}
           provider={PROVIDER_GOOGLE} // remove if not using Google Maps
           style={styles.map}
           onRegionChangeComplete={(region) => {
              this.region_change(region); 
           }}
           initialRegion={this.state.region}
          >

          {this.renderMarker()}
         
          </MapView>
          <View style={styles.location_markers}>
            <View style={{ height:30, width:25, marginTop:-30 }} >
              {this.state.active_location == 'FROM_LOCATION' ?
                <Image
                  style= {{flex:1 , width: undefined, height: undefined}}
                  source={require('.././assets/img/from_location_pin.png')}
                /> :
                <Image
                  style= {{flex:1 , width: undefined, height: undefined}}
                  source={require('.././assets/img/to_location_pin.png')}
                />
              } 
            </View>
          </View>
          <View style={styles.footer}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'center', alignItems:'center'}} >
              {this.state.vehicles.map(item => (
                  <TouchableOpacity activeOpacity={1} onPress={this.change_vehicle.bind(this,item.id)} style={{flex: 1, flexDirection: 'column', width:50, height:50, alignItems:'center', justifyContent:'center'}} >
                    <View style={this.state.active_vehicle == item.id ? styles.active_vehicle : styles.inactive_vehicle } >
                      <Image
                        style= {{flex:1 , width: undefined, height: undefined}}
                        source={this.state.active_vehicle == item.id ? { uri : img_url + item.active_icon } : { uri : img_url + item.inactive_icon } }
                      />
                    </View>
                    <View><Text style={styles.description} >{item.vehicle_type}</Text></View>
                  </TouchableOpacity>
              ))}

            </View>
            <View style={{ width:'95%',alignSelf:'center' }} >
                <Button
                  title="RIDE NOW"
                  onPress={this.pick_now}
                  buttonStyle={{ backgroundColor:'#fcdb00',height:45 }}
                  titleStyle={{ fontFamily:font_description,color:colors.theme_fg_three }}
                />
                <View style={{margin:5}}/>
            </View>
          </View>
        </View>
        <View>
          <Fab
            active={this.state.fab_active}
            direction="left"
            containerStyle={{ marginBottom:135 }}
            style={{ backgroundColor: colors.theme_bg_three }}
            position="bottomRight"
            onPress={() => this.setState({ fab_active: !this.state.fab_active })}>
            <Icon name={this.state.active_icon} style={{ color:colors.theme_fg }}/>
            <Button onPress={this.change_filter.bind(this,"people",0)} style={{ backgroundColor: colors.theme_bg }}>
              <Icon name="people" style={{ color:colors.theme_fg_three }}/>
            </Button>
            <Button onPress={this.change_filter.bind(this,"man",1)} style={{ backgroundColor: colors.theme_bg }}>
              <Icon name="man" style={{ color:colors.theme_fg_three }}/>
            </Button>
            <Button onPress={this.change_filter.bind(this,"woman",2)} style={{ backgroundColor: colors.theme_bg }}>
              <Icon name="woman" style={{ color:colors.theme_fg_three }}/>
            </Button>
          </Fab>
        </View>
        <Loader visible={this.state.isLoading} />
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    pickup_address : state.booking.pickup_address,
    pickup_lat : state.booking.pickup_lat,
    pickup_lng : state.booking.pickup_lng,
    drop_address : state.booking.drop_address,
    drop_lat : state.booking.drop_lat,
    drop_lng : state.booking.drop_lng,
    kms : state.booking.km,
  };
}

const mapDispatchToProps = (dispatch) => ({
    pickupAddress: (data) => dispatch(pickupAddress(data)),
    pickupLat: (data) => dispatch(pickupLat(data)),
    pickupLng: (data) => dispatch(pickupLng(data)),
    dropAddress: (data) => dispatch(dropAddress(data)),
    dropLat: (data) => dispatch(dropLat(data)),
    dropLng: (data) => dispatch(dropLng(data)),
    km: (data) => dispatch(km(data)),
});


export default connect(mapStateToProps,mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:-30
  },
  map: {
    width:'100%',
    height:'100%'
  },
  icon:{
    color:colors.theme_fg_two,
    marginLeft:10,
    marginTop:10 
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width:'100%',
    height:125,
    backgroundColor: colors.theme_bg_three,
  },
  location_markers: {
    position: 'absolute',
  },
  from_location_active: {
    position: 'absolute',
    top: 60,
    height:50,
    width:'84%',
    borderRadius:5,
    padding:5,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  from_location_inactive: {
    position: 'absolute',
    top: 60,
    height:50,
    width:'80%',
    borderRadius:5,
    padding:5,
    backgroundColor: '#f2f2f2',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2
  },
  to_location_active: {
    position: 'absolute',
    top: 108,
    height:50,
    width:'84%',
    borderRadius:5,
    padding:5,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  to_location_inactive: {
    position: 'absolute',
    top: 108,
    height:50,
    width:'80%',
    borderRadius:5,
    padding:5,
    backgroundColor: '#f2f2f2',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2
  },
  active_vehicle:{
    height:40,
    width:40
  },
  inactive_vehicle:{
    height:40,
    width:40
  },
  pickup_location:{ 
    fontSize:12, 
    color:'#52C41B', 
    fontFamily:font_description,
    marginLeft:5 
  },
  address:{
    color:colors.theme_fg_two, 
    fontSize:14, 
    fontFamily:font_description,
    marginLeft:5  
  },
  drop_location:{ 
    fontSize:12, 
    color:'#FF180C', 
    fontFamily:font_description,
    marginLeft:5  
  },
  description:{ 
    fontSize:11, 
    color:colors.theme_fg_two, 
    fontFamily:font_description,
    marginLeft:5  
  },
   header_card:{
    alignItems:'center',
    borderRadius:15,
    justifyContent:'center'
  },
  header_card_item:{ borderTopLeftRadius: 15, borderTopRightRadius: 15,borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
        shadowOffset: {width: 0, height: 15 }, 
        shadowColor: colors.theme_bg,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10
  },
  header:{ justifyContent: 'flex-start',height:'22%', backgroundColor: colors.theme_bg_three, borderBottomLeftRadius:20 , borderBottomRightRadius: 20,
        shadowOffset: {width: 0, height: 20}, 
        shadowColor: colors.theme_bg,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10 },

});

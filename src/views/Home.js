import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, PermissionsAndroid, ScrollView } from 'react-native';
import { Container, Icon, Card, Footer } from 'native-base';
import * as colors from '../assets/css/Colors';
import { img_url, font_description,location, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, api_url, get_vehicles, get_packages, get_gender, get_trip_type, font_title } from '../config/Constants';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-elements';
import Dash from 'react-native-dash';
import axios from 'axios';
import { connect } from 'react-redux';
import { pickupAddress, pickupLat, pickupLng, dropAddress, dropLat, dropLng, km, package_id } from '../actions/BookingActions';
import Geolocation from '@react-native-community/geolocation';
import { fb } from '../config/firebaseConfig';
import { Loader, StatusBar } from '../components/GeneralComponents';
import { color } from 'react-native-reanimated';

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
        active_vehicle:0,
        isLoading:false,
        vehicles:[],
        filter:0,
        active_icon:'people',
        trip_types:[],
        vehicle_open_status:0,
        active_trip_type:1,
        from_city:'',
        to_city:'',
        packages:[],
        package_id:0

      }
      this.mapRef = null;
      this.get_trip_type();
      this.get_packages();
      this.requestCameraPermission();
      this.get_vehicle_categories();
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.set_location();
      this.find_active_vehicle();
      this.booking_sync();
    });
  }

  find_active_vehicle = async() =>{
    if(this.props.active_vehicle != this.state.active_vehicle && this.props.active_vehicle != 0){
      await this.setState({ active_vehicle : this.props.active_vehicle, active_vehicle_details : this.props.active_vehicle_details });
      await this.get_vehicles();
    }else{

    }
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  booking_sync = () =>{
    console.log(fb,'lll')
    console.log(fb.ref,'ref')
    fb.ref('/customers/'+global.id).on('value', snapshot => {
      console.log(snapshot,"snapshot")
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
      console.log(response);
      await this.setState({ isLoading : false, vehicles : response.data.result, active_vehicle:response.data.result[0].id, active_vehicle_details:response.data.result[0], vehicle_open_status:1  });
      console.log('details of vechile', response.data.result)
      await this.get_vehicles();
    })
    .catch(error => {
      this.setState({ isLoading : false });
    });
  }

  async get_packages(){
    await axios({
      method: 'get', 
      url: api_url + get_packages
    })
    .then(async response => {
      this.setState({ packages : response.data.result, package_id:  response.data.result[0].id });
    })
    .catch(error => {
      alert('Sorry something went wrong')
    });
  }

  async get_trip_type(){
    await axios({
      method: 'get', 
      url: api_url + get_trip_type
    })
    .then(async response => {
      this.setState({ trip_types : response.data.result });
    })
    .catch(error => {
      alert('Sorry something went wrong')
    });
  }

  get_vehicles = async() =>{
    console.log('vechile details')
    // console.log('active vechile details',this.state.active_vehicle);
    // vehicles.push({ latitude : 28.5355, longitude: 77.3910, gender:'m' }); 
    await fb.ref('/vehicles/'+this.state.active_vehicle).on('value', snapshot => {
      let vehicles = [];
      console.log('vechile details fb',snapshot)
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.val().booking_status == 0 && childSnapshot.val().online_status == 1){
          vehicles.push({ latitude : childSnapshot.val().lat, longitude: childSnapshot.val().lng, gender:childSnapshot.val().gender }); 
          console.log('active vechile details',vehicles); }
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
  ride_confirm = async () => {
  
console.log('ashish calling ')
// console.log(api_url + ride_confirm,"url")
    await axios({
      method: 'post', 
      url: 'http://15.206.122.199/api/customer/ride_confirm',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data: {"country_id": "1",
       "customer_id": "2",
      "drop_address": "84, Block A, Sector 64, Noida, Uttar Pradesh 201307, India",
        "drop_lat": 28.611891635931933, 
       "drop_lng": 77.37622601911426, 
       "filter": 0, 
       "km": "1.4 ", 
       "package_id": 0, 
       "payment_method": 1, 
       "pickup_address": "Unnamed Road, A Block, Sector 63, Noida, Uttar Pradesh 201307, India", 
       "pickup_date": "11-01-2022 22:54:16", 
       "pickup_lat": 28.620967603172332, 
       "pickup_lng": 77.38117000088096, 
       "promo": 0, 
       "trip_type": 3, 
       "vehicle_type": 1
      }
    })
    .then(async response => {
console.log('ride confirm ashish ',response)
     
    })
    .catch(error => {
      console.log(error)
    });
 
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

  pick_now = async() =>{
    if(this.state.active_trip_type == 2 && this.props.pickup_address != undefined){
      await this.props.km("0 km");
      await this.props.navigation.navigate('ConfirmBooking',{ vehicle_type : this.state.active_vehicle, filter:this.state.filter, trip_type : this.state.active_trip_type });
  // }else if(this.state.active_trip_type != 2 && this.props.pickup_address != undefined && this.props.drop_address != undefined && this.props.km != 0){
    }else if(this.state.active_trip_type != 2 &&   this.props.pickup_address != undefined && this.props.km != 0){
      if(this.state.active_trip_type == 1){
        if(this.state.from_city == this.state.to_city){
          this.props.navigation.navigate('ConfirmBooking',{ vehicle_type : this.state.active_vehicle, filter:this.state.filter, trip_type : this.state.active_trip_type });
        }else{
          
           this.props.navigation.navigate('ConfirmBooking',{ vehicle_type : this.state.active_vehicle, filter:this.state.filter, trip_type : this.state.active_trip_type });
          alert(this.state.to_city+' is outside city limits.You can continue to book an outstation ride instead.');
        }
      }else if(this.state.active_trip_type == 2){
        this.props.navigation.navigate('ConfirmBooking',{ vehicle_type : this.state.active_vehicle, filter:this.state.filter, trip_type : this.state.active_trip_type });
      }else if(this.state.active_trip_type == 3){
        if(this.state.from_city != this.state.to_city){
          this.props.navigation.navigate('ConfirmBooking',{ vehicle_type : this.state.active_vehicle, filter:this.state.filter, trip_type : this.state.active_trip_type });
        }else{
          alert('Destination city cannot be same as Pick up city for Outstation rides.Please change the destination to procees further.');
        }
      }
      
    }else{
      alert('Please select valid pickup and drop location');
    }
  }

  async change_vehicle(){
    this.props.navigation.navigate('VehicleCategories',{ vehicle_categories: this.state.vehicles });
  }

  onRegionChange = async(value) => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
          console.log(responseJson,"formatted_address")
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
              this.find_city(responseJson.results[0]);
           }
    }) 
  }

  find_city = async(item)=>{

    var arrAddress = await item.address_components;
    for (var i = 0; i < arrAddress.length; i++){
      if (arrAddress[i].types[0] == "administrative_area_level_2"){
            if(this.state.active_location == 'FROM_LOCATION'){
              this.setState({ from_city : arrAddress[i].long_name });
            }else{
              this.setState({ to_city : arrAddress[i].long_name });
            }
        }
    }
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
        
        if(this.state.filter == marker.gender || this.state.filter == 0)
        {
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

  getstyle(val) {
    if(val == this.state.package_id) {
      return { borderColor: colors.theme_fg, borderWidth:1.2};
    }else {
        return { borderColor: colors.theme_fg_two, borderWidth:1.2 };
    }
  }

  change_trip_type = (type) =>{
    this.setState({ active_trip_type : type });
    if(type == 2){
      this.props.package_id(this.state.package_id);
    }
  }

  select_package = (val) =>{
    this.setState({ package_id : val });
    this.props.package_id(val);
  }

  render() {
    const { filter } = this.state

    return (

      <Container>
      <View>
          <StatusBar/>
        </View>
        <View style={styles.map_container}>
          <Loader visible={this.state.isLoading} />
          <MapView
           ref={(ref) => { this.mapRef = ref }}
           provider={PROVIDER_GOOGLE} // remove if not using Google Maps
           style={styles.map}
           onRegionChangeComplete={(region) => {
              this.region_change(region); 
           }}
           zoomEnabled={true}
           zoomControlEnabled={true}
           initialRegion={this.state.region}
           showsUserLocation={true}
          >

          {this.renderMarker()}
         
          </MapView>
          <View style={styles.menu_markers}>
           <View style={{flexDirection:'row',justifyContent:'space-between',width:'75%'}}>
              <Icon onPress={() => this.props.navigation.toggleDrawer()} style={styles.drawer_icon} name='menu' />
           <Icon onPress={() => this.props.navigation.toggleDrawer()} style={[styles.drawer_icon,{marginLeft:20}]} name='menu' />
           </View>
            {this.state.active_trip_type != 2 &&
          <View>
          <View style={{width:'75%',height:50,backgroundColor:'white',borderRadius:10,margin:5}}>
          <TouchableOpacity activeOpacity={1} onPress={() =>this.active_location_changing('FROM_LOCATION')} style={{ flexDirection:'row',alignSelf:'center',marginLeft:20,width:'100%'}}>
                <View style={{ width:25, alignItems:'center', justifyContent:'center' }}>
                  <Image style={{ alignSelf: 'flex-end', height:30, width:30 }} source={location}/>
                </View>
                <View>
                  <Text style={styles.pickup_location}>Pickupas Location</Text>
                  <Text style={styles.address} note numberOfLines={1} >{this.props.pickup_address}</Text>
                </View>
            </TouchableOpacity>
          </View>
          <View style={{width:'75%',height:50,backgroundColor:'white',borderRadius:10,margin:5}}>
          <TouchableOpacity activeOpacity={1} onPress={() =>this.active_location_changing('TO_LOCATION')} style={{ flexDirection:'row',marginLeft:8, marginTop:3,width:'100%'}}>
               <View style={{justifyContent:'space-between',flexDirection:'row',width:'90%',alignItems:'center'}}>
                 <View style={{flexDirection:'row'}}>
                 <View style={{ width:25 }}>
                  <Image style={{ alignSelf: 'flex-end', height:30, width:30 }} source={location}/>
                </View>
                <View>
                  <Text style={styles.drop_location}>Drop Location</Text>
                  {this.props.drop_address != undefined ?
                    <Text style={styles.address} note numberOfLines={1} >{this.props.drop_address}</Text>
                    :
                    <Text style={styles.address} note numberOfLines={1} >Destination......</Text>
                  }
                </View>
                 </View>

                 <View style={{flexDirection:'row',backgroundColor:colors.theme_bg,padding:10,borderRadius:5}}>
                   {/* <Image source={require('.././assets/img/from_location_pin.png')} resizeMode={'cover'}/> */}
                   <Text>Now</Text>
                 </View>
               </View>
            </TouchableOpacity>
          </View>
          </View>
          } 
         
          </View>
          <View style={styles.location_markers}>
            <View style={{ height:30, width:25 }} >
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
        </View>
        <View style={styles.vehicle_container}>
          {/* <ScrollView>
          <View style={{ flexDirection:'row'}}>
            {this.state.trip_types.map((row, index) => (
              <TouchableOpacity activeOpacity={1} onPress={ () => this.change_trip_type(row.id) }style={{ width:'33%', alignItems:'center'}}>
                {row.id == this.state.active_trip_type ? 
                  <Image style={{ alignSelf: 'center', height:50, width:70 }} source={{ uri : img_url+row.active_icon}}/>
                  :
                  <Image style={{ alignSelf: 'center', height:50, width:70 }} source={{ uri : img_url+row.Inactive_icon}}/>
                }
                
                <Text style={styles.trip_type_name} note numberOfLines={1} >{row.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ margin:10 }} />
          {this.state.active_trip_type != 2 &&
          <View>
            <TouchableOpacity activeOpacity={1} onPress={() =>this.active_location_changing('FROM_LOCATION')} style={{ flexDirection:'row',alignSelf:'center',marginLeft:20}}>
                <View style={{ width:25, alignItems:'center', justifyContent:'center' }}>
                  <Image style={{ alignSelf: 'flex-end', height:30, width:30 }} source={location}/>
                </View>
                <View>
                  <Text style={styles.pickup_location}>Pickup Location</Text>
                  <Text style={styles.address} note numberOfLines={1} >{this.props.pickup_address}</Text>
                </View>
            </TouchableOpacity>
            <View>  
              <Dash style={{width:1, height:20, flexDirection:'column',backgroundColor:colors.theme_fg_two, borderStyle:'dotted',marginLeft:16}}/>
            </View>
            <TouchableOpacity activeOpacity={1} onPress={() =>this.active_location_changing('TO_LOCATION')} style={{ flexDirection:'row',marginLeft:8, marginTop:3}}>
                <View style={{ width:25 }}>
                  <Image style={{ alignSelf: 'flex-end', height:30, width:30 }} source={location}/>
                </View>
                <View>
                  <Text style={styles.drop_location}>Drop Location</Text>
                  {this.props.drop_address != undefined ?
                    <Text style={styles.address} note numberOfLines={1} >{this.props.drop_address}</Text>
                    :
                    <Text style={styles.address} note numberOfLines={1} >Destination......</Text>
                  }
                </View>
            </TouchableOpacity>
          </View>
          } 
          {this.state.active_trip_type == 2 &&
            <View>
              <TouchableOpacity activeOpacity={1} onPress={() =>this.active_location_changing('FROM_LOCATION')} style={{ flexDirection:'row',alignSelf:'center',marginLeft:20}}>
                    <View style={{ width:25, alignItems:'center', justifyContent:'center' }}>
                      <Image style={{ alignSelf: 'flex-end', height:30, width:30 }} source={location}/>
                    </View>
                    <View>
                      <Text style={styles.pickup_location}>Pickup Location</Text>
                      <Text style={styles.address} note numberOfLines={1} >{this.props.pickup_address}</Text>
                    </View>
              </TouchableOpacity>
              <View style={{ margin:5 }} />
              <View style={{ justifyContent:'center', marginLeft:20 }}>
                <Text style={{color:colors.theme_fg_two, fontFamily:font_title}}>Select Package</Text>
              </View>
              <View style={{ flexDirection:'row', marginLeft:20, marginTop:5}}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                {this.state.packages.map((row, index) => (
                  <TouchableOpacity activeOpacity={1} onPress={ () => this.select_package(row.id)}style={[styles.package_container, this.getstyle(row.id)]}>
                    <Text style={{color:colors.theme_fg_two, fontFamily:font_title}}>{row.hours} hr</Text>
                    <Text style={{color:colors.theme_fg_two, fontFamily:font_description}}>{row.kilometers} km</Text>
                  </TouchableOpacity>
                ))}
                </ScrollView>
              </View>
            </View>
          }
          <View style={{ margin:10 }} />
          {this.state.vehicle_open_status == 1 &&
          <Card style={{ width:'94%', marginLeft:'3%', borderRadius:10 }}>
          <View style={{ flexDirection:'row', borderRadius:10, backgroundColor: colors.theme_fg_three, margin:5 }}>
            <View style={{ width:'30%', alignItems:'center', justifyContent:'center'}}>
              <Image style={{ alignSelf: 'center', height:60, width:60 }} source={{ uri : img_url+this.state.active_vehicle_details.active_icon}}/>
            </View>
            <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{color:colors.theme_fg_two, fontFamily:font_title}}>{this.state.active_vehicle_details.vehicle_type}</Text>
            </View>
            <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
              <Button
                  title="CHANGE VEHICLE"
                  // onPress={this.ride_confirm.bind(this)}
                  onPress={this.change_vehicle.bind(this)}
                  buttonStyle={styles.button_style}
                  titleStyle={styles.vehicle_title_style}
                />
            </View>
          </View>
          </Card>
          }
          </ScrollView> */}
          <Footer style={styles.footer}>
            <TouchableOpacity activeOpacity={1} onPress={this.pick_now.bind(this)} style={styles.cnf_button_style}>
            <Text style={[styles.title_style,{color:'white',fontWeight:'bold',fontSize:25}]}>BOOK NOW</Text>
            </TouchableOpacity>
          </Footer>
       
       
        </View>
        <View style={{position:'absolute',bottom:'10%',alignItems:'center',width:'100%',flexDirection:'row'}}>
       <ScrollView horizontal={true}> 
     {
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item,index)=>{
         return (
           <View style={{alignContent:'center',alignItems:'center',justifyContent:'center'}}>
               <Image
                  style={{height:100,width:100}}
                  source={require('.././assets/img/New_icon/ambulance_transparent_icon512.png')}
                />
                <Text>ALS</Text>
           </View>
         )
       })
     }
       </ScrollView>
        </View>
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
    active_vehicle : state.booking.active_vehicle,
    active_vehicle_details : state.booking.active_vehicle_details,
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
    package_id: (data) => dispatch(package_id(data)),
});


export default connect(mapStateToProps,mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  map_container: {
    // flex:1,
    height:'93%'
  },
  footer: {
    alignItems:'center',
    width:'100%',
    backgroundColor: colors.theme_bg
  },
  vehicle_container: {
    height:'50%',
    backgroundColor: colors.theme_bg_three,
  },
  map: {
    width:'100%',
    height:'100%'
  },
  icon:{
    color:colors.theme_fg_three,
  },
  drawer_icon:{
    color:colors.theme_fg_two,
  },
  location_markers: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  menu_markers: {
    position: 'absolute',
    marginLeft:10,
    marginTop:10
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
  button_style:{ 
    backgroundColor:colors.theme_bg,
    borderColor: colors.theme_bg,
    borderWidth:1,
    height:30
  },
  cnf_button_style:{ 
    backgroundColor:'red',
    // backgroundColor:colors.theme_bg,
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  title_style:{ 
    fontFamily:font_description,
    color:colors.blackColor,
    fontSize:18
  },
  vehicle_title_style:{ 
    fontFamily:font_description,
    color:colors.theme_fg_three
  },
  trip_type_name:{
    color:colors.theme_fg_two, 
    fontSize:14, 
    fontFamily:font_description 
  },
  package_container:{
    marginRight:10, 
    borderWidth:1, 
    padding:10, 
    borderRadius:5,  
    backgroundColor:colors.blackColor, 
    alignItems:'center'
  }
});

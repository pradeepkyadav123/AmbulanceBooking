import React, {Component} from 'react';
import { StyleSheet, Text, Image, View , FlatList, TouchableOpacity, Alert} from 'react-native';
import { Container, Header, Body, Title, Left,  Icon, Row, Col, Right, Button as Btn, List, ListItem, Footer } from 'native-base';
import * as colors from '../assets/css/Colors';
import { font_title, font_description, payment_methods, api_url, get_fare, ride_confirm, img_url, LATITUDE_DELTA, LONGITUDE_DELTA, search_lottie  } from '../config/Constants';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Badge, Divider } from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";
import axios from 'axios';
import Dialog, { DialogTitle, SlideAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { pickupAddress, pickupLat, pickupLng, dropAddress, dropLat, dropLng, km, reset } from '../actions/BookingActions';
import { connect } from 'react-redux';
import { Loader } from '../components/GeneralComponents';
import { fb } from '../config/firebaseConfig';
import LottieView from 'lottie-react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import Apicalling from '../common/apicalling'

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

class ConfirmBooking extends Component<Props> {
   Common = new Apicalling();
  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        isDialogVisible:false,
        markers:[ this.createMarker(this.props.pickup_lat,this.props.pickup_lng), this.createMarker(this.props.drop_lat,this.props.drop_lng)],
        payment_methods:[],
        vehicle_type:this.props.route.params.vehicle_type,
        filter:this.props.route.params.filter,
        trip_type:this.props.route.params.trip_type,
        total_fare:0,
        discount:0,
        tax:0,
        base_fare:0,
        payment_method:0,
        payment_name:"Setup Payment",
        isLoading:false,
        confirm_status:0,
        payment_type:1,
        isLoaderVisible:false,
        show_time:"",
        deliveryDatePickerVisible : false,
      }
      this.get_payment_methods();
      this.booking_sync();
      this.default_date(new Date());
  }

  default_date = async(currentdate) =>{
    var datetime = await ((currentdate.getDate() < 10)?"0":"") + currentdate.getDate() + "-"
                + (((currentdate.getMonth()+1) < 10)?"0":"") + (currentdate.getMonth()+1) + "-"
                + currentdate.getFullYear() + " "  
                + ((currentdate.getHours() < 10)?"0":"") + currentdate.getHours() + ":" 
                + ((currentdate.getMinutes() < 10)?"0":"") + currentdate.getMinutes() + ":" 
                + ((currentdate.getSeconds() < 10)?"0":"") + currentdate.getSeconds() 
    var show_time = await ((currentdate.getDate() < 10)?"0":"") 
                    +currentdate.getDate()+" "+monthNames[currentdate.getMonth()]
                    +", "+this.formatAMPM(currentdate)

    this.setState({ pickup_date : datetime, show_time : show_time });
  }

  showDeliveryDatePicker = () => {
    this.setState({ deliveryDatePickerVisible: true });
  };
 
  hideDeliveryDatePicker = () => {
    this.setState({ deliveryDatePickerVisible: false });
  };
 
  handleDeliveryDatePicked = async(date) => {
    this.setState({ deliveryDatePickerVisible: false })
    this.default_date(new Date(date));
  };

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  booking_sync = () =>{
    fb.ref('/customers/'+global.id).on('value', snapshot => {
      if(snapshot.val().booking_status == 1 && this.state.confirm_status == 1){
        this.setState({ isLoaderVisible: true });
      }else if(snapshot.val().booking_status == 0 && this.state.confirm_status == 1){
        this.setState({ confirm_status : 0, isLoaderVisible: false });
        alert('Sorry drivers not available right now, please try again.');
      }else if(snapshot.val().booking_status == 2 && this.state.confirm_status == 1){
        this.setState({ confirm_status : 0, isLoaderVisible: false });
        this.props.reset();
        this.props.navigation.navigate('Ride',{ trip_id : snapshot.val().booking_id });
      }
    });
  }

  get_fare = async () => {
    await axios({
      method: 'post', 
      url: api_url + get_fare,
      data: {country_id :  global.country_id, km: this.props.kms.slice(0,(this.props.kms.length-2)), promo:this.props.promo, vehicle_type : this.state.vehicle_type, trip_type:this.state.trip_type, days:1, package_id:this.props.package_id }
    })
    .then(async response => {

      if(response.data.status == 1){
        this.setState({ base_fare : response.data.result.fare, discount : response.data.result.discount, tax : response.data.result.tax, total_fare : response.data.result.total_fare })
      }
    })
    .catch(error => {
      alert('Sorry something went wrong');
    });
  }

  get_payment_methods = async () => {
    await axios({
      method: 'post', 
      url: api_url + payment_methods,
      data: { country_id :  global.country_id }
    })
    .then(async response => {
      //this.setState({ payment_methods : response.data.result })
      this.select_payment(response.data.result[0]);
    })
    .catch(error => {
      
    });
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
              this.find_city(responseJson.results[0]);
           }
    }) 
  }

  ride_confirm = async () => {
      this.setState({ isLoading : true });
      // Apicalling.post
     // var postman = 
      //  {"country_id": "1", "customer_id": "2", "drop_address": "84, Block A, Sector 64, Noida, Uttar Pradesh 201307, India", "drop_lat": 28.611891635931933, "drop_lng": 77.37622601911426, "filter": 0, "km": "1.4 ", "package_id": 0, "payment_method": 1, "pickup_address": "Unnamed Road, A Block, Sector 63, Noida, Uttar Pradesh 201307, India", "pickup_date": "11-01-2022 22:54:16", "pickup_lat": 28.620967603172332, "pickup_lng": 77.38117000088096, "promo": 0, "trip_type": 3, "vehicle_type": 1}
     // country_id :  global.country_id, 
      //           km: this.props.kms.slice(0,(this.props.kms.length-2)), 
      //           promo:this.props.promo, 
      //           vehicle_type : this.state.vehicle_type, 
      //           payment_method :  this.state.payment_method,
      //           customer_id :  global.id,
      //           trip_type :  this.state.trip_type,
      //           pickup_address:this.props.pickup_address,
      //           pickup_date:this.state.pickup_date,
      //           pickup_lat:this.props.pickup_lat,
      //           pickup_lng:this.props.pickup_lng,
      //           drop_address:this.props.drop_address,
      //           drop_lat:this.props.drop_lat,
      //           drop_lng:this.props.drop_lng,
      //           filter:this.state.filter,
      //           package_id:this.props.package_id
      this.Common.postresponse({"country_id":global.country_id, 
      "customer_id": global.id, 
      "drop_address":this.props.drop_address,// "84, Block A, Sector 64, Noida, Uttar Pradesh 201307, India", 
     "drop_lat":this.props.drop_lat,
       "drop_lng":this.props.drop_lng,
      "filter": this.state.filter, 
      "km": this.props.kms.slice(0,(this.props.kms.length-2)), 
      "package_id": this.props.package_id, 
      "payment_method": this.state.payment_method, 
      "pickup_address": this.props.pickup_address, 
      "pickup_date": this.state.pickup_date.toString(), 
      "pickup_lat": this.props.pickup_lat, 
      "pickup_lng": this.props.drop_lng, 
      "promo": this.props.promo, 
      "trip_type": this.state.trip_type, 
      "vehicle_type": this.state.vehicle_type
    },api_url + ride_confirm).then((response)=>{
        this.setState({ isLoading : false });
        if(response.data.status == 1){
          if(response.data.booking_type == 1){
            this.setState({ confirm_status : 1 });
            this.booking_sync();
          }else{
            Alert.alert(
              "Success!",
              "Your scheduled booking is registered, please wait our driver will contact you soon!",
              [
                { text: "OK", onPress: () => this.home() }
              ],
              { cancelable: false }
            );
          }
          
        }else{
          alert(response.data.message);
          this.setState({ confirm_status : 0 });
        }
      });
// const request ={
//   country_id :  global.country_id, 
//           km: this.props.kms.slice(0,(this.props.kms.length-2)), 
//           promo:this.props.promo, 
//           vehicle_type : this.state.vehicle_type, 
//           payment_method :  this.state.payment_method,
//           customer_id :  global.id,
//           trip_type :  this.state.trip_type,
//           pickup_address:this.props.pickup_address,
//           pickup_date:this.state.pickup_date,
//           pickup_lat:this.props.pickup_lat,
//           pickup_lng:this.props.pickup_lng,
//           drop_address:this.props.drop_address,
//           drop_lat:this.props.drop_lat,
//           drop_lng:this.props.drop_lng,
//           filter:this.state.filter,
//           package_id:this.props.package_id
// }

// console.log(request,"request")

// console.log(api_url + ride_confirm,"url")
//       await axios({
//         method: 'post', 
//         url: api_url + ride_confirm,
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         },
//         data: {country_id :  global.country_id, 
//           km: this.props.kms.slice(0,(this.props.kms.length-2)), 
//           promo:this.props.promo, 
//           vehicle_type : this.state.vehicle_type, 
//           payment_method :  this.state.payment_method,
//           customer_id :  global.id,
//           trip_type :  this.state.trip_type,
//           pickup_address:this.props.pickup_address,
//           pickup_date:this.state.pickup_date,
//           pickup_lat:this.props.pickup_lat,
//           pickup_lng:this.props.pickup_lng,
//           drop_address:this.props.drop_address,
//           drop_lat:this.props.drop_lat,
//           drop_lng:this.props.drop_lng,
//           filter:this.state.filter,
//           package_id:this.props.package_id
//         }
//       })
//       .then(async response => {

//         this.setState({ isLoading : false });
//         if(response.data.status == 1){
//           if(response.data.booking_type == 1){
//             this.setState({ confirm_status : 1 });
//             this.booking_sync();
//           }else{
//             Alert.alert(
//               "Success!",
//               "Your scheduled booking is registered, please wait our driver will contact you soon!",
//               [
//                 { text: "OK", onPress: () => this.home() }
//               ],
//               { cancelable: false }
//             );
//           }
          
//         }else{
//           alert(response.data.message);
//           this.setState({ confirm_status : 0 });
//         }
//       })
//       .catch(error => {
//         console.log(error)
//         this.setState({ isLoading : false });
//       });
   
  }

  async home(){
    this.props.navigation.goBack(null);
  }

  createMarker(lat,lng) {
    return {
      latitude: lat,
      longitude: lng,
    };
  }

  componentDidMount(){
    setTimeout(() => {
      this.mapRef.fitToElements(true,{});
    }, 200);
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  booking_request = () =>{
    this.props.navigation.navigate('Ride');
  }

  choose_payment = () =>{
    this.RBSheet.open();
  }

  open_dialog(){
    this.setState({ isDialogVisible: true })
  }

  change_vehicle(id){
    this.setState({ active_vehicle : id});
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.get_fare();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
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

  apply_promo(){
    this.props.navigation.navigate('Promo');
  }

  select_payment = (item) =>{
    this.setState({ payment_method : item.id, payment_name : item.payment, payment_type:item.payment_type });
    //this.RBSheet.close();
  }

  payment_done = async() =>{
    console.log(this.state.payment_method,"this.state.payment_method")
    if(this.state.payment_method != 0){
      if(this.state.payment_type == 1){
        this.ride_confirm();
      }else if(this.state.payment_type == 2){
        await this.stripe_card();
      }else if(this.state.payment_type == 3){
        await this.razorpay();
      }
    }else{
      alert('Please select payment method');
    }
  }

  razorpay = async() =>{
    var options = {
      currency: global.currency_short_code,
      key: global.razorpay_key,
      amount: this.state.total_fare * 100,
      name: global.app_name,
      prefill: {
        email: global.email,
        contact: global.phone_with_code,
        name: global.first_name
      },
      theme: {color: colors.theme_fg}
    }
    RazorpayCheckout.open(options).then((data) => {
      this.ride_confirm();
    }).catch((error) => {
      alert('Your transaction is declined.');
    });
  }

  stripe_card = async() =>{

    stripe.setOptions({
      publishableKey: global.stripe_key,
      merchantId: 'MERCHANT_ID', // Optional
      androidPayMode: 'test', // Android only
    })
    

   const response = await stripe.paymentRequestWithCardForm({
      requiredBillingAddressFields: 'full',
      prefilledInformation: {
        billingAddress: {
           name: global.first_name,
        },
      },
    });

    if(response.tokenId){
      this.stripe_payment(response.tokenId);
    }else{
      alert('Sorry something went wrong');
    }
  }

  stripe_payment = async (token) => {
    this.setState({ isLoading : true });
    await axios({
      method: 'post', 
      url: api_url + stripe_payment,
      data:{ customer_id : global.id, amount:this.state.total_fare, token: token}
    })
    .then(async response => {
      this.setState({ isLoading : false });
      this.ride_confirm();
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
            <Btn onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Confirm booking</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          
          <MapView
           provider={PROVIDER_GOOGLE}
           ref={ref => this.mapRef = ref}
           style={styles.map}
           initialRegion={{
             latitude: this.props.pickup_lat,
             longitude: this.props.pickup_lng,
             latitudeDelta: LATITUDE_DELTA,
             longitudeDelta: LONGITUDE_DELTA,
           }}
          >
            <MapView.Marker coordinate={this.state.markers[0]}>
              <Image 
                style= {styles.image_style}
                source={require('.././assets/img/from_location_pin.png')}
              />
            </MapView.Marker>
            {this.state.trip_type != 2 &&
              <MapView.Marker coordinate={this.state.markers[1]}>
                  <Image 
                      style= {styles.image_style}
                      source={require('.././assets/img/to_location_pin.png')}
                  />
              </MapView.Marker>
            }

          </MapView>
          <View style={styles.address}>
            <View style={styles.address_view_style} >
              <Row>
                <View style={{ flexDirection:'row', alignItems:'center', paddingLeft:10, width:'80%' }}>
                  <Badge status="success" />
                  <View style={{ marginLeft : 10}} />
                  <Text style={styles.pickup_address} note numberOfLines={1}>{this.props.pickup_address}</Text>
                </View>
              </Row>
              <View style={{ margin:5 }} />
              {this.state.trip_type != 2 &&
                <Row>
                  <View style={{ flexDirection:'row', alignItems:'center', paddingLeft:10, width:'80%' }}>
                    <Badge status="error" />
                    <View style={{ marginLeft : 10}} />
                    <Text style={styles.drop_address} note numberOfLines={1}>{this.props.drop_address}</Text>
                  </View>
                </Row>
              }
            </View>
          </View>

          <View style={styles.footer_style}>
            <View style={{flex: 1, flexDirection: 'column', padding:10}} >
              <Row onPress={ this.open_dialog.bind(this) }>
                <Body>
                  <Text style={styles.price}>{global.currency}{this.state.total_fare}</Text>
                  <Text style={styles.total}>Total Fare</Text>
                </Body>
              </Row>
              <Divider style={styles.default_divider} />
              <Row onPress={ this.showDeliveryDatePicker.bind(this) }>
                <Body>
                  <Text style={styles.date}>Booking for <Text style={{ color:'#3498DB' }}>{this.state.show_time}</Text></Text>
                </Body>
                <DateTimePicker
                  isVisible={this.state.deliveryDatePickerVisible}
                  onConfirm={this.handleDeliveryDatePicked}
                  onCancel={this.hideDeliveryDatePicker}
                  mode="datetime"
                  date={new Date()}
                  minimumDate={new Date(Date.now()+(10 * 60 * 1000))} 
                  is24Hour={false}
                />
              </Row>
              <Divider style={styles.default_divider} />
              <Row>
                <Col style={{ alignItems:'center'}}>
                  <Row onPress={this.apply_promo.bind(this)} activeOpacity={1} style={{ paddingLeft:5, paddingRight:5, justifyContent:'center' }}>
                    <Col style={{ width:'20%'}}>
                    <Icon style={styles.price_icon_style} name='pricetag' />
                    </Col>
                    <Col>
                      <Text style={styles.coupon}>Apply Coupon</Text>
                    </Col>
                  </Row>
                </Col>
                <Col style={{ width:'2%', borderLeftWidth:1, borderColor:colors.theme_fg_four }}>

                </Col>
                <Col style={{ alignItems:'center'}}>
                  <Row style={{ paddingLeft:5, paddingRight:5, justifyContent:'center' }}>
                    <Col style={{ width:'20%'}}>
                      <Icon style={styles.card_icon_style} name='card' />
                    </Col>
                    <Col>
                      <Text style={styles.payment}>{this.state.payment_name}</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </View>
          </View>
        </View>
        <Footer style={styles.footer}>
              <TouchableOpacity activeOpacity={1} onPress={this.payment_done.bind(this)} style={styles.button_style}>
                <Text style={styles.title_style}>CONFIRM BOOKING</Text>
              </TouchableOpacity>
            </Footer>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={250}
          animationType="fade"
          duration={250}
        >
        <Row>
          <Body>
            <Text style={styles.payment_option}>Select a payment option</Text>
          </Body>
        </Row>
        <List>
          <FlatList
            data={this.state.payment_methods}
            renderItem={({ item }) => (
              <ListItem onPress={this.select_payment.bind(this,item)}>
                <Col style={{ width:'15%'}}>
                  <Image 
                    style= {styles.image_style_two}
                    source={{ uri : img_url + item.icon }}
                  />
                </Col>
                <Col>
                  <Text style={styles.font}>{item.payment}</Text>
                </Col>
              </ListItem>
            )}
            keyExtractor={item => item.id}
          />
        </List>
        </RBSheet>
        <Dialog
          visible={this.state.isDialogVisible}
          width="90%"
          animationDuration={100}
          dialogTitle={<DialogTitle title="Fare details" />}
          dialogAnimation={new SlideAnimation({
            slideFrom: 'bottom',
          })}
          footer={
            <DialogFooter>
              <DialogButton
                text="OK"
                textStyle={{ fontSize:16, fontFamily:font_description, color:colors.theme_fg_three }}
                onPress={() => { this.setState({ isDialogVisible: false })}}
              />
            </DialogFooter>
          }
          onTouchOutside={() => {
            this.setState({ isDialogVisible: false });
          }}
        >
          <DialogContent>
            <View style={{ padding:10, flexDirection:'column' }}>
              <View style={{ flexDirection:'row', margin:5 }}>
                <View style={{ width:'70%'}}>
                  <Text style={styles.font}>Base fare</Text>
                </View>
                <View style={{ width:'30%'}}>
                  <Text style={styles.font}>{global.currency}{this.state.base_fare}</Text>
                </View>
              </View>
              <View style={{ flexDirection:'row', margin:5 }}>
                <View style={{ width:'70%'}}>
                  <Text style={styles.font}>Tax</Text>
                </View>
                <View style={{ width:'30%'}}>
                  <Text style={styles.font}>{global.currency}{this.state.tax}</Text>
                </View>
              </View>
              <View style={{ flexDirection:'row', margin:5 }}>
                <View style={{ width:'70%'}}>
                  <Text style={styles.font}>Discount</Text>
                </View>
                <View style={{ width:'30%'}}>
                  <Text style={styles.font}>{global.currency}{this.state.discount}</Text>
                </View>
              </View>
              <Divider style={styles.default_divider} />
              <View style={{ flexDirection:'row', margin:5 }}>
                <View style={{ width:'70%'}}>
                  <Text style={styles.tot}>Total</Text>
                </View>
                <View style={{ width:'30%'}}>
                  <Text style={styles.tot}>{global.currency}{this.state.total_fare}</Text>
                </View>
              </View>
              <View style={{ margin:10 }}/>
              <Text style={styles.note_describ}>Note: This fare may be different from your actual fare</Text>
            </View>
          </DialogContent>
          </Dialog>
          <Dialog
              visible={this.state.isLoaderVisible}
              width="90%"
              animationDuration={100}
              
              dialogAnimation={new SlideAnimation({
                slideFrom: 'bottom',
              })}
              
              onTouchOutside={() => {
                this.setState({ isLoaderVisible: false });
              }}
            >
            <DialogContent>
              <View style={{ padding:10, flexDirection:'column' }}>
                <View style={{ alignItems:'center', padding:20}}>
                  <LottieView style={{ height:100, width:100 }} source={search_lottie} autoPlay loop />
                </View>
                <Text style={{ fontSize:15, fontFamily:font_title}}>Please wait while searching the driver...</Text>  
              </View>
            </DialogContent>
          </Dialog>
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
    package_id : state.booking.package_id,
    promo : state.booking.promo,
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
    reset: () => dispatch(reset()),
});


export default connect(mapStateToProps,mapDispatchToProps)(ConfirmBooking);

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
    justifyContent: 'center',

  },
  title:{
    color:colors.blackColor,
    alignSelf:'center', 
    fontSize:20, 
    fontFamily:font_title
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:colors.theme_bg_three
  },
  map: {
    width:'100%',
    height:'100%'
  },
  footer_style: {
    position: 'absolute',
    bottom: 0,
    width:'100%',
    backgroundColor:colors.theme_bg_three
  },
  footer: {
    alignItems:'center',
    width:'100%',
    backgroundColor: colors.theme_bg
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
    fontFamily:font_title
  },
  pickup_address:{ 
    fontSize:14, 
    color:colors.theme_fg_two, 
    fontFamily:font_description 
  },
  drop_address:{ 
    fontSize:14, 
    color:colors.theme_fg_two, 
    fontFamily:font_description 
  },
  total:{ 
    fontSize:12, 
    color:colors.theme_fg_two, 
    fontFamily:font_description
  },
  date:{ 
    fontSize:14, 
    color:colors.theme_fg_two, 
    fontFamily:font_title
  },
  coupon:{ 
    color:colors.theme_fg_two, 
    fontFamily:font_description
  },
  payment:{ 
    color:colors.theme_fg_two, 
    fontFamily:font_description
  },
  font:{
    fontFamily:font_description
  },
  payment_option:{ 
    fontSize:18, 
    color:colors.theme_fg_three,  
    fontFamily:font_title 
  },
  tot:{ 
    fontFamily:font_title, 
    fontSize:15 
  },
  note_describ:{ 
    fontSize:12, 
    color:colors.theme_fg_four, 
    fontFamily:font_description 
  },
  image_style:{ 
    flex:1,
    height:30, 
    width:25
  },
  image_style_two:{ 
    flex:1,
    height:30, 
    width:30
  },
  button_style:{ 
    backgroundColor:colors.theme_bg,
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
  price_icon_style:{ 
    color:colors.theme_fg, 
    fontSize:22
  },
  card_icon_style:{ 
    color:colors.theme_fg, 
    fontSize:20
  },
  address_view_style:{ 
    flex: 1, 
    flexDirection: 'column', 
    padding:10
  },
});

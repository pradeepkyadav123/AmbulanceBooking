import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import { Content, Container, Header, Body, Title, Left, Icon, Right, Button as Btn } from 'native-base';
import * as colors from '../assets/css/Colors';
import { font_title, GOOGLE_KEY } from '../config/Constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { pickupAddress, pickupLat, pickupLng, dropAddress, dropLat, dropLng } from '../actions/BookingActions';
import { connect } from 'react-redux';
import axios from 'axios';

class Location extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        mode:this.props.route.params.mode,
        header_name:this.props.route.params.header_name
      }
      //this.get_lat_lng();
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  getLocations = (data, details) =>{
    this.get_lat_lng(details.place_id);
  }

  get_lat_lng = async(place_id) =>{
    await axios({
      method: 'get', 
      url: 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+place_id+'&key='+GOOGLE_KEY
    })
    .then(async response => {
       if(this.state.mode == "pickup"){
        await this.props.pickupAddress(response.data.result.formatted_address);
        await this.props.pickupLat(response.data.result.geometry.location.lat);
        await this.props.pickupLng(response.data.result.geometry.location.lng);
        await this.handleBackButtonClick();
       }else{
        await this.props.dropAddress(response.data.result.formatted_address);
        await this.props.dropLat(response.data.result.geometry.location.lat);
        await this.props.dropLng(response.data.result.geometry.location.lng);
        await this.handleBackButtonClick();
       }
       
    })
    .catch(error => {
      
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
            <Title style={styles.title} >{this.state.header_name}</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor:colors.theme_fg_three}}>
          <GooglePlacesAutocomplete
            placeholder='Search'
            styles={{ textInputContainer: { borderColor:colors.theme_bg, borderWidth:1, } }}
            currentLocation={true}
            enableHighAccuracyLocation={true}
            onPress={(data, details = null) => {
              this.getLocations(data,details);
            }}
            GooglePlacesDetailsQuery={{ fields: 'geometry' }}
            query={{
              key: GOOGLE_KEY,
              language: 'en'
            }}
          />
        </Content>
      </Container>
    );
  }
}



const mapDispatchToProps = (dispatch) => ({
    pickupAddress: (data) => dispatch(pickupAddress(data)),
    pickupLat: (data) => dispatch(pickupLat(data)),
    pickupLng: (data) => dispatch(pickupLng(data)),
    dropAddress: (data) => dispatch(dropAddress(data)),
    dropLat: (data) => dispatch(dropLat(data)),
    dropLng: (data) => dispatch(dropLng(data)),
});


export default connect(null,mapDispatchToProps)(Location);

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
    color:colors.blackColor,
    fontSize:20,
    fontFamily:font_title,
  },
});

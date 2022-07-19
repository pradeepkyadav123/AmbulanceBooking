import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, BackHandler } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Col, Icon, Right, Button as Btn, Card, CardItem, List, ListItem, Thumbnail} from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, api_url, profile, profile_picture, otp_validation_error, avatar_icon, font_title, font_description } from '../config/Constants';
import { StatusBar, Loader } from '../components/GeneralComponents';
import DropdownAlert from 'react-native-dropdownalert';
import { Button, Divider } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
 import axios from 'axios';
import { connect } from 'react-redux';
import { profilePending, profileError, profileSuccess, updateProfilePicture } from '../actions/ProfileActions';
import { CommonActions } from '@react-navigation/native';
//Image upload options
const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery'
};



class Profile extends Component<Props> {

  constructor(props) {
      super(props)
      this.drawer = this.drawer.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        profile_picture : '', 
        first_name:'',
        last_name:'',
        phone_number:'',
        email: '',
        password: '',
        validation:true,        
        data:'',
        data_img:'',
        gender:'',
        gender_name:''
      }
  }

  async componentDidMount(){
    this._unsubscribe=this.props.navigation.addListener('focus',async ()=>{
      await this.get_profile();
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

  componentWillUnmount(){
    this._unsubscribe();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  get_profile = async () => {
    this.props.profilePending();
     await axios({
      method: 'post', 
      url: api_url + profile,
      data:{ customer_id : global.id}
    })
    .then(async response => {
      //alert(JSON.stringify(response));
        await this.props.profileSuccess(response.data);
        await this.setState({ first_name:this.props.data.first_name, last_name:this.props.data.last_name, email:this.props.data.email, phone_number:this.props.data.phone_with_code, profile_picture:this.props.profile_picture, gender:this.props.data.gender, gender_name:this.props.data.gender_name })
    })
    .catch(error => {
      alert(error)
        this.props.profileError(error);
    });

  }

  select_photo = async () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        alert(response.error);
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        this.setState({
          data_img:response.data
        });
        this.props.updateProfilePicture(source);
        this.profileimageupdate();
      }
    });
  }

  profileimageupdate() {
    RNFetchBlob.fetch('POST', api_url + profile_picture, {
      'Content-Type' : 'multipart/form-data',
    }, [
      {  
        name : 'profile_picture',
        filename : 'image.png', 
        type:'image/png', 
        data: this.state.data_img
      },
      {  
        name : 'customer_id',
        data: global.id.toString()
      }
    ]).then((resp) => { 
      let data = JSON.parse(resp.data);
      global.profile_picture = data.result.profile_picture;
      alert("Updated Successfully");
    }).catch((err) => {
      alert("Error on while uploading,Try again");
    })
  }

  drawer = () =>{
    this.props.navigation.toggleDrawer();
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  edit_first_name(id){
    this.props.navigation.navigate('EditFirstName',{first_name:this.props.data.first_name});
  }

  edit_last_name(id){
    this.props.navigation.navigate('EditLastName',{last_name:this.props.data.last_name});
  }

  edit_phone_number(id){
    this.props.navigation.navigate('EditPhoneNumber',{phone_number:this.props.data.phone_number});
  }

  edit_email(id){
    this.props.navigation.navigate('EditEmail',{email:this.props.data.email});
  }

  edit_gender(id){
    if(this.props.data.gender == 0){
      this.props.navigation.navigate('EditGender',{gender:1});
    }else{
      this.props.navigation.navigate('EditGender',{gender:this.props.data.gender});
    }
    
  }

  edit_password(id){
    this.props.navigation.navigate('EditPassword',{password:this.props.data.password});
  }

  render() {
    const { isLoding, error, data, profile_picture, message, status } = this.props

    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <Btn onPress={this.drawer} transparent>
              <Icon style={styles.icon} name='menu' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Profile</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor:colors.theme_fg_three}}>
          <Loader visible={isLoding} />
          <View style={{ margin:10 }} />
          <Row>
            <Body>
            <TouchableOpacity onPress={this.select_photo.bind(this)}>
                <View style={styles.profile}>
                  <Image
                    style= {{flex:1 , width: undefined, height: undefined, borderRadius:50, borderColor:colors.theme_fg}}
                    source={profile_picture}
                  />
                </View>
                <View style={{ margin:10 }} />
              </TouchableOpacity>
            </Body>
          </Row>
          <Divider style={styles.default_divider} />
          <Row>
            <Col onPress={this.edit_first_name.bind(this,1)} activeOpacity={1}>
              <Text style={styles.label}>First name</Text>
              <View style={{ margin:3 }} />
              <Text style={styles.value}>{this.state.first_name}</Text>
            </Col>
          </Row>
          <Divider style={styles.default_divider} />
          <Row>
            <Col onPress={this.edit_last_name.bind(this,1)} activeOpacity={1}>
              <Text style={styles.label}>Last name</Text>
              <View style={{ margin:3 }} />
              <Text style={styles.value}>{this.state.last_name}</Text>
            </Col>
          </Row>
          <Divider style={styles.default_divider} />
          <Row>
            <Col onPress={this.edit_phone_number.bind(this,1)} activeOpacity={1}>
              <Text style={styles.label}>Phone number</Text>
              <View style={{ margin:3 }} />
              <Text style={styles.value}>{this.state.phone_number}</Text>
            </Col>
          </Row>
          <Divider style={styles.default_divider} />
          <Row>
            <Col onPress={this.edit_email.bind(this,1)} activeOpacity={1}>
               <Text style={styles.label}>Email</Text>
              <View style={{ margin:3 }} />
              <Text style={styles.value}>{this.state.email}</Text>
            </Col>
          </Row>
          <Divider style={styles.default_divider} />
          <Row>
            <Col onPress={this.edit_gender.bind(this,1)} activeOpacity={1}>
               <Text style={styles.label}>Gender</Text>
              <View style={{ margin:3 }} />
                <Text style={styles.value}>{this.state.gender_name}</Text>
            </Col>
          </Row>
          <Divider style={styles.default_divider} />
          <Row>
            <Col onPress={this.edit_password.bind(this,1)} activeOpacity={1}>
              <Text style={styles.label}>Password</Text>
              <View style={{ margin:3 }} />
              <Text style={styles.value}>******</Text>
            </Col>
          </Row>
          <Divider style={styles.default_divider} />
        <Loader visible={isLoding} />

        </Content>

      </Container>
    );
  }
}


function mapStateToProps(state){
  return{
    isLoding : state.profile.isLoding,
    message : state.profile.message,
    status : state.profile.status,
    data : state.profile.data,
    profile_picture : state.profile.profile_picture
  };
}

const mapDispatchToProps = (dispatch) => ({
    profilePending: () => dispatch(profilePending()),
    profileError: (error) => dispatch(profileError(error)),
    profileSuccess: (data) => dispatch(profileSuccess(data)),
    updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),

});

export default connect(mapStateToProps,mapDispatchToProps)(Profile);


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
    width:100,
    borderColor:colors.theme_fg,
    borderWidth:1,
    borderRadius:50
  },
  default_divider:{ 
    marginTop:20, 
    marginBottom:20 
  },
  label:{ 
    fontSize:15, 
    color:colors.theme_fg_two,
    fontFamily:font_description 
  },
  value:{ 
    fontSize:18, 
    color:colors.theme_fg_two,
    fontFamily:font_description 
  }
});

import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, FlatList, Modal, BackHandler } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Col, Icon, Right, Button as Btn, Card, CardItem, List, ListItem, Thumbnail, Footer} from 'native-base';
import * as colors from '../assets/css/Colors';
import { refer_lottie } from '../config/Constants';
import { StatusBar } from '../components/GeneralComponents';
import DropdownAlert from 'react-native-dropdownalert';
import { Button, Divider } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import { alert_close_timing, otp_validation_error, logo, avatar_icon, font_title, font_description , api_url, get_referral_message, customer_offers, scratch, img_url , scratch_img_url, update_view_status, surprise, my_rewards } from '../config/Constants';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/ReferralActions';
import ScratchView from 'react-native-scratch'
import { CommonActions } from '@react-navigation/native';

class Rewards extends Component<Props> {

  constructor(props) {
      super(props)
      this.drawer = this.drawer.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        show_scratch: 0, 
        offers:[],
        modalVisible:false,
        current_card:undefined
      }
      /*alert(this.state.offers.length);*/  
    }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.customer_offers();
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

  customer_offers = async () => {
    await axios({
      method: 'post', 
      url: api_url + customer_offers,
      data:{ customer_id : global.id }
    })
    .then(async response => {
      this.setState({ offers : response.data.result });
    })
    .catch(error => {
      alert('Sorry, something went wrong');
    });
  }

  drawer = () =>{
    this.props.navigation.toggleDrawer();
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  onImageLoadFinished = ({ id, success }) => {
      //alert('Loaded')
  }

  onScratchProgressChanged = ({ value, id }) => {
      //alert(value)
  }

  onScratchDone = ({ isScratchDone, id }) => {
    this.setState({ show_scratch : 1 });
    this.scrath_update();
  }

  onScratchTouchStateChanged = ({ id, touchState }) => {
      // Example: change a state value to stop a containing
      // FlatList from scrolling while scratching
      this.setState({ scrollEnabled: !touchState });
  }

  select_card = (current_card) =>{
    if(current_card.view_status == 1){
      this.setState({ show_scratch : 1, current_card:current_card, modalVisible : true });
    }else{
      this.setState({ current_card:current_card, modalVisible : true });
    }
    
  }

  close_modal = (id) =>{
    this.setState({ modalVisible : false, show_scratch:0 });
    
  }

  scrath_update = async() =>{
    await axios({
      method: 'post', 
      url: api_url + update_view_status,
      data:{ customer_id : global.id, offer_id:this.state.current_card.id, status:1 }
    })
    .then(async response => {
      this.customer_offers();
    })
    .catch(error => {
      alert('Sorry, something went wrong');
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
            <Title style={styles.title} >My Rewards</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor:colors.theme_fg_three}}>
        <List>
          <FlatList
            data={this.state.offers}
            renderItem={({ item,index }) => (

              <View style={{ width:'50%', marginBottom:25, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={ ()=> this.select_card(item) } activeOpacity={1} style={{ backgroundColor:'#FFFFFF' }}>
                  {item.view_status == 0 &&
                    <Thumbnail square style={{ width:160, height:160 }} source={scratch} />
                  }
                  {item.view_status == 1 &&
                    <Card style={{ width:160, height:160, alignItems:'center', justifyContent:'center'}}>
                      <Thumbnail square style={{ width:40, height:40 }} source={{ uri: img_url + item.image }} />
                      <Text style={{ color:'#000000'}}>{item.title}</Text>
                    </Card>
                  }
                </TouchableOpacity>
              </View>
            )}
            numColumns={2}
            keyExtractor={item => item.id}
          />
           <View style={{ alignItems:'center', marginTop:'40%'}}>
              {this.state.offers.length == 0 &&  
                <LottieView style={{ height:200, width:200 }} source={my_rewards} autoPlay loop />
               }
              {this.state.offers.length == 0 && 
              <Text style={styles.amt}>No Rewards Found.</Text>
              }
           </View>
        </List>
        </Content>
        <Modal
              animationType={'fade'} 
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setState({ modalVisible: false });
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  padding: 20,
                }}
              >
                <View>
                  <Icon style={{ alignSelf:'flex-end', color:'#FFFFFF'}} onPress={ ()=> this.close_modal() } name='close-circle' />
                </View>
                <View style={{ alignItems:'center', justifyContent:'center', marginTop:'30%'}}>
                  <View style={{ width: 200, height: 200, alignItems:'center', justifyContent:'center', backgroundColor:'#FFFFFF' }}>
                      {this.state.show_scratch == 0 &&
                      <ScratchView
                        id={1} 
                        brushSize={40} 
                        threshold={30} 
                        fadeOut={true} 
                        style={{ color:colors.theme_fg_two }}
                        placeholderColor={colors.theme_fg_two}
                        imageUrl={img_url + scratch_img_url} 
                        resourceName="your_image" 
                        resizeMode="cover|contain|stretch" 
                        onImageLoadFinished={this.onImageLoadFinished} 
                        onTouchStateChanged={this.onTouchStateChangedMethod} 
                        onScratchProgressChanged={this.onScratchProgressChanged} 
                        onScratchDone={this.onScratchDone} 
                      />
                      }
                      {this.state.show_scratch == 1 &&
                        <View>
                          <Thumbnail square style={{ width:100, height:100, alignSelf:'center' }} source={{ uri: img_url + this.state.current_card.image }} />
                          <Text style={{ color:colors.theme_fg_two, alignSelf:'center'}}>{this.state.current_card.title}</Text>
                        </View>
                      }
                  </View>
                </View>
                {this.state.show_scratch == 1 &&
                  <View style={{ alignItems:'center', marginTop:20 }}>
                    <Text style={{ color:'#FFFFFF'}}>{this.state.current_card.description}</Text>
                  </View>
                }
              </View>
        </Modal>
      </Container>
    );
  }
}

export default Rewards;

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
    width:100
  },
  default_divider:{ 
    marginTop:20, 
    marginBottom:20 
  },
  footer:{
    backgroundColor:colors.theme_bg_three
  },
  footer_content:{
    width:'90%'
  },
  refering:{ 
    fontSize:20, 
    fontFamily:font_title, 
    color:colors.theme_fg_two 
  },
  description:{ 
    color:colors.theme_fg_four, 
    fontFamily:font_description
  },
  amt:
  { 
    fontSize:16, 
    fontFamily:font_title, 
    color:colors.theme_fg_two 
  }
});

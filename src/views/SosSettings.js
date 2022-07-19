import React, {Component} from 'react';
import { StyleSheet, View, TextInput, Image,ImageBackground, TouchableOpacity, Text, FlatList, Alert, BackHandler } from 'react-native';
import { Content, Container, Header, Body, Title, Icon, Button as Btn, Footer,List,ListItem,Row,Col,Left,Right} from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing,  api_url, font_title, font_description, height_40, height_30, height_45, height_10, bg_img, go_icon, sos_contact_list, delete_sos_contact, sos_img } from '../config/Constants';
import DropdownAlert from 'react-native-dropdownalert';
import { Button } from 'react-native-elements'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import axios from 'axios';
import { connect } from 'react-redux';
import { profilePending, profileError, profileSuccess } from '../actions/ProfileActions';
import { Loader } from '../components/GeneralComponents';
import { CommonActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { color } from 'react-native-reanimated';

class SosSettings extends Component<Props> {
  constructor(props) { 
      super(props) 
      this.drawer = this.drawer.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        result:[],
        contact_id:'', 
        validation:true,
        isLoding:false  
      }     
      /*alert(this.state.result.length);*/
  }  

  drawer = () =>{
    this.props.navigation.toggleDrawer();
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.sos_list();
    });
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

  sos_list = async () => {
    await this.setState({isLoding : true});
     await axios({
      method: 'post', 
      url: api_url + sos_contact_list,
      data:{ customer_id: global.id }
    })
    .then(async response => {
      await this.setState({ isLoding: false });
      await this.setState({ result:response.data.result }); 
    })
    .catch(error => {
     this.setState({isLoding : false});
     alert('Sorry something went wrong');  
    });
  }

  delete_sos = async (id) => {
    await this.setState({isLoding : true});
     await axios({ 
      method: 'post',  
      url: api_url + delete_sos_contact,
      data:{ 
             customer_id: global.id,
             contact_id: id,
           }
    })
    .then(async response => {
      await this.setState({isLoding : false});
      Alert.alert(
      "Success",
      "Deleted Successfully",
      [
        { text: "OK", onPress: () => this.sos_list() }
      ],
      { cancelable: false } 
    );
    })
    .catch(error => { 
     this.setState({isLoding : false}); 
     alert('Sorry something went wrong'); 
    });
  }

  add_sos_settings = () => {
    this.props.navigation.navigate('AddSosSettings');
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  render() {
    return (
    <Container>
      <View style={{backgroundColor:colors.theme_fg_three,height:"100%",width:"100%" }}>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <Btn onPress={this.drawer} transparent>
              <Icon style={styles.icon} name='menu' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >SOS Contacts</Title>
          </Body>
          <Right />
        </Header>
        <Loader visible={this.state.isLoding} />
    <Content> 

    <View style={{backgroundColor:colors.theme_fg_three}}>   
      
      <View style={{ padding:15, height:height_40 }}>
        <FlatList
          data={this.state.result} 
          renderItem={({ item,index }) => (
         <List>
            <ListItem>
              <Row>
              <Col style={{height:"100%",width:"90%",alignSelf:'center'}}>  
                <Text style={styles.faq_title} >{item.phone_number}</Text>
                <Text style={styles.faq_title_small} >{item.name}</Text> 
               </Col> 
              <Col style={{height:"100%",width:"10%",alignSelf:'center'}}>   
                <FontAwesome onPress={this.handleBackButtonClick} name='trash-o' 
                size={25}
                color='black'
                onPress={()=>this.delete_sos(item.id)}
                style={ styles.icon_image}
              />
              </Col>
              </Row>

            </ListItem>
           
            </List>
             )}
              keyExtractor={item => item.id}
            />  
             <View style={{ alignItems:'center', marginTop:'30%'}}>
              {this.state.result.length == 0 &&  
                <LottieView style={{ height:150, width:150 }} source={sos_img} autoPlay loop />
               }
              {this.state.result.length == 0 && 
              <Text style={styles.amt}>No Contacts Found</Text>
              }
           </View>
            </View>
          </View>
          
          </Content>   
          <Footer style={styles.footer}>
            <TouchableOpacity activeOpacity={1} onPress={() => this.add_sos_settings()} style={styles.cnf_button_style}>
            <Text style={styles.title_style}>ADD</Text>
            </TouchableOpacity>
          </Footer>
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
          
        </View>  
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
  };
}

const mapDispatchToProps = (dispatch) => ({
    profilePending: () => dispatch(profilePending()),
    profileError: (error) => dispatch(profileError(error)),
    profileSuccess: (data) => dispatch(profileSuccess(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(SosSettings); 

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
    justifyContent: 'center',
    flex:2,
    marginLeft:30
  },
  name_title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    alignSelf:'flex-start', 
    fontSize:18,
    letterSpacing:0.5,
    fontFamily:font_title,
    marginLeft:5
  },
  margin_20:{
    margin:20
  },
  margin_10:{
    margin:10
  },
  margin_50:{
    margin:20
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  textinput:{
    borderBottomWidth : 1, 
    fontSize:18,
    color:colors.theme_fg_four,
    fontFamily:font_description,
    width:'95%',
    marginLeft:15
  },
  padding_20:{
    padding:20
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
    fontSize:18,
    color : color.blackColor
  },
  footer_content:{
    width:'90%'
  },
  image:{
    alignSelf: 'flex-end',
    height:70,
    width:65 
   },
  image_back_ground:{
   flex:1,
   height:height_40,
   width:"90%",
   alignSelf:'center',
   marginLeft:20 
  },
  icon_img:{
    color:colors.theme_fg
  },
  faq_title:{
    color:colors.theme_fg_four,
    fontSize:15,
    
  },
   icon_image:{
    color:colors.theme_fg
  },
  title:{
    alignSelf:'center',
    color : color.blackColor

  },
   faq_title_small:{
    color:colors.theme_fg_four,
    fontSize:12, 
  },
  amt:{ 
    fontSize:16, 
    fontFamily:font_title, 
    color:colors.theme_fg_two 
  },
});

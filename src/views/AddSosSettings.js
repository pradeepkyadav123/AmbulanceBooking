import React, {Component} from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Content, Container, Header, Body, Title, Footer, Left, Right } from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, api_url, font_title, font_description, height_40, add_sos_contact } from '../config/Constants';
import DropdownAlert from 'react-native-dropdownalert';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { connect } from 'react-redux';
import { profilePending, profileError, profileSuccess } from '../actions/ProfileActions';
import { Loader } from '../components/GeneralComponents';
import { color } from 'react-native-reanimated';
 
 class AddSosSettings extends Component<Props> {
   
  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        name:'',
        phone_number:'', 
        validation:true, 
        isLoding:false
      }
  } 

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  sos_settings = () => {
    this.props.navigation.navigate('SosSettings');
  }

  add_sos = async () => { 
    await this.setState({isLoding : true});
     await axios({ 
      method: 'post',  
      url: api_url + add_sos_contact,
      data:{ name:this.state.name,
             phone_number:this.state.phone_number,
             customer_id:global.id
           }
    })
    .then(async response => {
      await this.setState({isLoding : false});
      if(response.data.status == 0){
        alert(response.data.message);
      }
      else{
        await this.handleBackButtonClick();
      }   
    })
    .catch(error => { 
     alert('Sorry something went wrong'); 
     this.setState({isLoding : false});   
    });
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }
 
  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  }

  render() {
    return (
    <Container>
      <View style={styles.main_view_style}>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <FontAwesome onPress={this.handleBackButtonClick} name='angle-left' 
              size={35}
              color='black'
              style={ styles.icon }
            />
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Add SOS Contact</Title>
          </Body>
          <Right />
        </Header>
      <Content>
        <View style={styles.main_view_two}>
          <Loader visible={this.state.isLoding} />
            <View style={styles.view_padding}>
            <Title style={styles.name_title}>Phone Number</Title>
               <TextInput
                  ref={ref => this.name = ref}
                  placeholder="Phone Number"
                  placeholderTextColor = {colors.theme_fg_four}
                  style = {styles.textinput}
                  onChangeText={ TextInputValue =>
                    this.setState({phone_number : TextInputValue }) }
                />
            <View style={styles.margin_10}/>
               <Title style={styles.name_title}>Name</Title>
                <TextInput
                  ref={ref => this.name = ref}
                  placeholder="John"
                  placeholderTextColor = {colors.theme_fg_four}
                  style = {styles.textinput}
                  value = {this.state.first_name} 
                  onChangeText={ TextInputValue =>
                    this.setState({name : TextInputValue }) }
                />
                </View>
              </View> 
              <View style={styles.margin_5}/>  
            </Content>
              <Footer style={styles.footer}>
                <TouchableOpacity activeOpacity={1} onPress={this.add_sos} style={styles.cnf_button_style}>
                <Text style={styles.title_style}>SUBMIT</Text>
                </TouchableOpacity>
              </Footer>
              <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
              <Loader visible={this.state.isLoding} />
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

export default connect(mapStateToProps,mapDispatchToProps)(AddSosSettings); 

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
    marginLeft:10
  },
  margin_10:{
    margin:10
  },
  margin_5:{
    margin:5
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
    marginLeft:5
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
    color:colors.blackColor,
    fontSize:18
  },
  footer_style:{
    backgroundColor:colors.the,borderBottomWidth: 0, 
    shadowOffset: {height: 0, width: 0},shadowOpacity: 0, elevation: 0,
  },
  footer_content:{
    width:'90%'
  },
  button_style:{
    backgroundColor:colors.theme_bg,
    alignSelf:"center",
    width:330
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
  title:{
    alignSelf:'center',
    color : color.blackColor
  },
  main_view_style:{
    backgroundColor:colors.theme_fg_three,height:"100%",width:"100%"
  },
  main_view_two:{
    backgroundColor:colors.theme_fg_three
  },
  view_padding:{
    padding:15, height:height_40
  },
});
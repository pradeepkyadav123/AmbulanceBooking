import React, {Component} from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Header, Body, Title, Left,  Row, Col, Icon, Right, Button as Btn } from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, font_title, font_description, height_40, height_45, go_icon } from '../config/Constants';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { createFirstName, createLastName } from '../actions/RegisterActions';

class CreateName extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        first_name: '',
        last_name:'',
        validation:true
      }
  }

  componentDidMount() {
    setTimeout(() => {
      this.first_name.focus();
    }, 200);
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  async check_name(){
    await this.check_validate();
    if(this.state.validation){
      await this.props.createFirstName(this.state.first_name);
      await this.props.createLastName(this.state.last_name);
      await this.props.navigation.navigate('CreateEmail');
    }
  }

  async check_validate(){
    if(this.state.first_name == "" || this.state.last_name == ""){
      await this.setState({ validation:false });
      await this.show_alert("Please enter first name and last name");
    }else{
      await this.setState({ validation:true });
    }
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  render() {
    return (
      <View style={styles.header_content}>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <Btn onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
      
          </Body>
          <Right />
        </Header>
        <View style={styles.content}>
          <View style={styles.view_title}>
            <Title style={styles.name_title}>Enter your name</Title>
            <View style={styles.margin_10} />
            <Row>
            <Col>
              <TextInput
                ref={ref => this.first_name = ref}
                placeholder="John"
                placeholderTextColor = {colors.theme_fg_four}
                style = {styles.textinput}
                onChangeText={ TextInputValue =>
                  this.setState({first_name : TextInputValue }) }
              />
            </Col>
            <Col style={{ width:10 }} />
            <Col>
              <TextInput
                ref={ref => this.last_name = ref}
                placeholder="Willams"
                placeholderTextColor = {colors.theme_fg_four}
                style = {styles.textinput}
                onChangeText={ TextInputValue =>
                  this.setState({last_name : TextInputValue }) }
              />
            </Col>
            </Row>
            <View style={styles.margin_50} />
            <TouchableOpacity onPress={this.check_name.bind(this)}>
              <Image style={styles.image} source={go_icon}/>
            </TouchableOpacity>
        </View>
        </View> 
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
    createFirstName: (data) => dispatch(createFirstName(data)),
    createLastName: (data) => dispatch(createLastName(data)),
});

export default connect(null,mapDispatchToProps)(CreateName);

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
  name_title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    alignSelf:'flex-start', 
    fontSize:20,
    letterSpacing:0.5,
    fontFamily:font_title
  },
  margin_20:{
    margin:20
  },
  margin_10:{
    margin:10
  },
  margin_50:{
    margin:40
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  textinput:{
    borderBottomWidth : 1, 
    fontSize:18,
    color:colors.theme_fg_four,
    fontFamily:font_description
  },
  padding_20:{
    padding:20
  },
  header_content:{
    backgroundColor:colors.theme_fg_three,
    height:"100%",
    width:"100%"
  },
  connect:{
    backgroundColor:colors.theme_fg_three,
    height:"100%",
    width:"100%" 
  },
  view_title:{
    margin:20,
    height:height_40
  }, 
  image:{
    alignSelf: 'flex-end',
    height:70,
    width:65 
   },
   image_back_ground:{
     flex:1,
     height:height_45,
     width:"95%",
     alignSelf:'center',
     marginLeft:20 
   },
});
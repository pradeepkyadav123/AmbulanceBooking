import React, {Component} from 'react';
import { StyleSheet, View, TextInput  } from 'react-native';
import { Header, Body, Title, Left, Icon, Right, Button as Btn } from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, profile_update, api_url, create_name_required_validation_message, font_title, font_description, height_10, height_40 } from '../config/Constants';
import DropdownAlert from 'react-native-dropdownalert';
import { Button } from 'react-native-elements';
 import axios from 'axios';
import { connect } from 'react-redux';
import { profilePending, profileError, profileSuccess } from '../actions/ProfileActions';

class EditLastName extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        last_name: this.props.route.params.last_name,
        validation:true
      }
  }

  componentDidMount = async() => {
    setTimeout(() => {
      this.last_name.focus();
    }, 200);

  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  async check_name(){
    await this.check_validate();
    if(this.state.validation){
      this.handleBackButtonClick();
    }
  }

  async check_validate(){
    if(this.state.last_name == ""){
      await this.setState({ validation:false });
      await this.show_alert(create_name_required_validation_message);
    }else{
      await this.setState({ validation:true });

    }
  }

 update_data = async () => {
    this.props.profilePending();
     await axios({
      method: 'post', 
      url: api_url + profile_update,
      data:{ id : global.id, last_name : this.state.last_name}
    })
    .then(async response => {
        await this.props.profileSuccess(response.data);
      this.handleBackButtonClick();
    })
    .catch(error => {
        this.showSnackbar(strings.sorry_something_went_wrong);
        this.props.profileError(error);
    });
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  render() {
    return (
      <View style={{backgroundColor:colors.theme_fg_three,height:"100%",width:"100%" }}>
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
        <View style={{backgroundColor:colors.theme_fg_three}}>
          <View style={{ padding:20, height:height_40 }}>
            <Title style={styles.name_title}>Edit your last name</Title>
            <View style={styles.margin_10} />
            <TextInput
              ref={ref => this.last_name = ref}
              placeholder="Williams"
              placeholderTextColor = {colors.theme_fg_four}
              style = {styles.textinput}
              value = {this.state.last_name}
              onChangeText={ TextInputValue =>
                this.setState({last_name : TextInputValue }) }
            />
            <View style={styles.margin_20} />
            <Button
              title="Update"
              onPress={this.update_data}
              buttonStyle={{ backgroundColor:colors.theme_bg }}
               titleStyle={{ fontFamily:font_description,color:colors.blackColor }}
            />
          </View>
          <View style={{ height:height_10 }} />
    
        </View>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
      </View>
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

export default connect(mapStateToProps,mapDispatchToProps)(EditLastName);

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
    margin:50
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
  footer:{
    backgroundColor:'transparent'
  },
  footer_content:{
    width:'90%'
  },
});

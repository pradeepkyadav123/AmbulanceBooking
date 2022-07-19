import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Col, Icon, Right, Button as Btn, Card, CardItem, List, ListItem, Thumbnail} from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, otp_validation_error, logo , font_title, font_description, api_url, privacy} from '../config/Constants';
import { StatusBar, HeaderWithContentLoader } from '../components/GeneralComponents';
import DropdownAlert from 'react-native-dropdownalert';
import { Button, Divider } from 'react-native-elements';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/PrivacyActions';
import { CommonActions } from '@react-navigation/native';
class PrivacyPolicies extends Component<Props> {

  constructor(props) {
      super(props)
      this.drawer = this.drawer.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.privacy_policies();
  }

  drawer = () =>{
    this.props.navigation.toggleDrawer();
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
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  
  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  privacy_policies = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post', 
      url: api_url + privacy,
      data:{country_id: global.country_id},
    })
    .then(async response => {
        await this.props.serviceActionSuccess(response.data)
    })
    .catch(error => {
      //alert(error);
        this.props.serviceActionError(error);
    });
  }

  render() {

    const { isLoding, error, data, message, status } = this.props
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <Btn onPress={this.drawer} transparent>
              <Icon style={styles.icon} name='menu' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Privacy Policies</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor:colors.theme_fg_three}}>
          <HeaderWithContentLoader visible={isLoding}/>
          <FlatList
            data={data}
            renderItem={({ item,index }) => (
              <View style={styles.margin_10}>
                <Text style={styles.policy_title}>{item.title}</Text>
                <View style={styles.margin_10} />
                <Text style={styles.description}>{item.description}</Text>
              </View>
            )}
            keyExtractor={item => item.question}
          />
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.privacy.isLoding,
    error : state.privacy.error,
    data : state.privacy.data,
    message : state.privacy.message,
    status : state.privacy.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(PrivacyPolicies);

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
  policy_title:{ 
    color:colors.theme_fg_two,
    fontSize:20,
    fontFamily:font_title
  },
  description:{ 
    color:colors.theme_fg_two, 
    fontFamily:font_description 
  }
});

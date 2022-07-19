import React, {Component} from 'react';
import { StyleSheet, Text, FlatList, BackHandler } from 'react-native';
import { Content, Container, Header, Body, Title, Left, Col, Icon, Right, Button as Btn, List, ListItem, Thumbnail} from 'native-base';
import * as colors from '../assets/css/Colors';
import { bell_icon, font_title, font_description, api_url, get_notification_messages } from '../config/Constants';
import { SingleListLoader} from '../components/GeneralComponents';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/NotificationActions';
import { CommonActions } from '@react-navigation/native';
class Notifications extends Component<Props> {

  constructor(props) {
      super(props)
      this.drawer = this.drawer.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.notification();
      this.state={
        result: [],
      }
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

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  
  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  notification_details(item){
    this.props.navigation.navigate('NotificationDetails',{data:item});
  }

  notification = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post', 
      url: api_url + get_notification_messages,
      data: {country_id :  global.country_id, customer_id: global.id}
    })
    .then(async response => {
      //alert(JSON.stringify(response.data));
        await this.props.serviceActionSuccess(response.data)
        this.setState({ result: response.data.result });
    })
    .catch(error => {
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
            <Title style={styles  .title} >Notifications</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{ backgroundColor:colors.theme_fg_three }}> 
           <SingleListLoader visible={isLoding} />
          <List>
            <FlatList
              data={data}
              renderItem={({ item,index }) => (
            <ListItem onPress={() => this.notification_details(item)}>
              <Col style={{ width:'18%' }}>
                <Thumbnail square style={{ height:40, width:40 }} source={bell_icon} />
              </Col>
              <Col>
                <Text style={styles.coupon_title}>{item.title}</Text>
                <Text style={styles.coupon_description} note numberOfLines={1}>{item.message}</Text>
                <Text style={styles.justnow}>Justnow</Text>
              </Col>
            </ListItem>
             )}
              keyExtractor={item => item.id}
            />
          </List>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.notification.isLoding,
    error : state.notification.error,
    data : state.notification.data,
    message : state.notification.message,
    status : state.notification.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(Notifications);

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
  description:{
    color:colors.theme_fg_four,
    fontFamily:font_description
  },
  coupon_title:{ fontSize:14, fontFamily:font_description, color:colors.theme_fg_two },
  coupon_description:{ color:colors.theme_fg_four, fontSize:12, fontFamily:font_description },
  justnow:{ color:colors.theme_fg_four, fontSize:11, fontFamily:font_description },
});

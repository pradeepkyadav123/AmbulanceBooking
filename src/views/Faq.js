import React, {Component} from 'react';
import { StyleSheet, Text, FlatList, BackHandler } from 'react-native';
import { Content, Container, Header, Body, Title, Left, Icon, Right, Button as Btn, List, ListItem } from 'native-base';
import * as colors from '../assets/css/Colors';
import { font_title, font_description, api_url, faq } from '../config/Constants';
import axios from 'axios';
import { connect } from 'react-redux'; 
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/FaqActions';
import { SingleListLoader } from '../components/GeneralComponents';
import { CommonActions } from '@react-navigation/native';
class Faq extends Component<Props> {

  constructor(props) { 
      super(props) 
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.drawer = this.drawer.bind(this);
      this.faq();
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

  faq_details(item){
    this.props.navigation.navigate('FaqDetails',{ data: item });
  }

  faq = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post', 
      url: api_url + faq,
      data: {country_id :  global.country_id}
    })
    .then(async response => {
        await this.props.serviceActionSuccess(response.data)
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
            <Title style={styles.title} >Faq</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:colors.theme_fg_three}}>
          <SingleListLoader visible={isLoding} />
          <List>
            <FlatList
              data={data}
              renderItem={({ item,index }) => (
                <ListItem onPress={() => this.faq_details(item)} >
                  <Left>
                    <Text style={styles.faq_title} >{item.question}</Text>
                  </Left>
                  <Right>
                    <Icon style={styles.text_icon} name="ios-arrow-forward" />
                  </Right>
                </ListItem>
              )}
              keyExtractor={item => item.question}
            />
          </List>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.faq.isLoding,
    error : state.faq.error,
    data : state.faq.data,
    message : state.faq.message,
    status : state.faq.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(Faq);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
  },
  icon:{
    color:colors.blackColor
  },
  text_icon:{
    color:colors.theme_fg_two
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
  default_divider:{ 
    marginTop:20, 
    marginBottom:20 
  },
  faq_title:{
    color:colors.theme_fg_two,
    fontSize:15,
    fontFamily:font_description
  }
});

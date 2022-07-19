import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Col, Icon, Right, Button as Btn, Card, CardItem, List, ListItem, Thumbnail} from 'native-base';
import * as colors from '../assets/css/Colors';
import { alert_close_timing, otp_validation_error, logo, font_title, font_description, promo_code, api_url } from '../config/Constants';
import { StatusBar } from '../components/GeneralComponents';
import DropdownAlert from 'react-native-dropdownalert';
import { Button, Divider } from 'react-native-elements';
import axios from 'axios';
import { update_promo } from '../actions/BookingActions';
import { connect } from 'react-redux';
class Promo extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.promo_code();
      this.state={
        data:[],
      }
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  select_promo = async(promo) =>{
    await this.props.update_promo(promo);
    await this.handleBackButtonClick();
  }

  promo_code = async () => {
    await axios({
      method: 'post', 
      url: api_url + promo_code,
      data: {country_id :  global.country_id, customer_id:global.id}
    })
    .then(async response => {
        this.setState({ data : response.data.result });
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
            <Title style={styles.title} >Promo codes</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:colors.theme_fg_three}}>

        <List>
            <FlatList
              data={this.state.data}
              renderItem={({ item,index }) => (
                <ListItem onPress={() => this.handleBackButtonClick()}>
              <View style={styles.promo_block} >
                <View style={{ flexDirection:'row' }} >
                  <Left>
                    <Text style={styles.promo_code} >{item.promo_code}</Text>
                  </Left>
                  <Right>
                    <Button
                      title="Apply"
                      buttonStyle={styles.apply_btn}
                      onPress={this.select_promo.bind(this,item.id)}
                      titleStyle={{ fontFamily:font_description,color:colors.blackColor,fontSize:14 }}
                    />
                  </Right>
                </View>
                <View style={{ flexDirection:'row' }} >
                  <Left>
                    <Text style={styles.promo_name} >{item.promo_name}</Text>
                  </Left>
                </View>
                <View style={{ flexDirection:'row' }} >
                  <Left>
                    <Text style={styles.description} >
                      {item.description}
                    </Text>
                  </Left>
                </View>
              </View>
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
    promo : state.booking.promo,
  };
}

const mapDispatchToProps = (dispatch) => ({
    update_promo: (data) => dispatch(update_promo(data)),
});


export default connect(mapStateToProps,mapDispatchToProps)(Promo);

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
  promo_block:{
    width:'100%', 
    backgroundColor:colors.theme_bg_three, 
    marginTop:10,

  },
  promo_code:{
    borderWidth:1, 
    borderColor:colors.theme_fg_two, 
    color:colors.theme_fg_two, 
    paddingTop:5, 
    paddingRight:10, 
    paddingBottom:5, 
    paddingLeft:10,
    fontFamily:font_description,
    borderRadius:5
  },
  apply_btn:{
    fontSize:14, 
    fontFamily:font_title, 
    color:colors.blackColor,
    backgroundColor:colors.theme_fg,
    width:75,
    height:30,

  
    
  },
  promo_name:{
    fontSize:15, 
    fontFamily:font_title, 
    color:colors.theme_fg_two, 
    marginTop:10
  },
  description:{
    fontSize:12,
    marginTop:5,
    fontFamily:font_description,
    color:colors.theme_fg_four 
  }
});

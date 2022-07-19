import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Content, Container, Header, Body, Left,  Row, Icon, Right, Button as Btn, Title } from 'native-base';
import * as colors from '../assets/css/Colors';
import { font_title, font_description , img_url} from '../config/Constants';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { change_active_vehicle, change_active_vehicle_details } from '../actions/BookingActions';

class VehicleCategories extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.change_vehicle = this.change_vehicle.bind(this);
      this.state = {
        vehicle_categories:this.props.route.params.vehicle_categories
      }
      console.log(this.state.vehicle_categories);
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  async change_vehicle(id,details){
    await this.props.change_active_vehicle(id);
    await this.props.change_active_vehicle_details(details);
    await this.handleBackButtonClick();
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
            <Title style={styles.title} >Vehicle Categories</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor:colors.theme_fg_three}}>
          {this.state.vehicle_categories.map((row, index) => (
            <TouchableOpacity onPress={ () => this.change_vehicle(row.id,row) } style={{ flexDirection:'row', borderWidth:1, borderColor:colors.theme_fg_two, borderRadius:5, width:'100%', backgroundColor:colors.theme_fg_three, marginTop:10 }}>
              <View style={{ width:'30%', alignItems:'center', justifyContent:'center'}}>
                <Image style={{ alignSelf: 'center', height:60, width:60 }} source={{ uri : img_url+row.active_icon}}/>
              </View>
              <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center'}}>
                <Text style={{color:colors.theme_fg_two, fontFamily:font_title}}>{row.vehicle_type}</Text>
                <Text style={{color:colors.theme_fg_two, fontSize:12, fontFamily:font_description}}>{row.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    active_vehicle : state.booking.active_vehicle,
 };
}

const mapDispatchToProps = (dispatch) => ({
    change_active_vehicle: (data) => dispatch(change_active_vehicle(data)),
    change_active_vehicle_details: (data) => dispatch(change_active_vehicle_details(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(VehicleCategories);


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
    alignSelf:'center', 
    color:colors.theme_fg_two,
    fontSize:20,
    fontFamily:font_title,
  },
  title:{
    alignSelf:'center', 
    color:colors.blackColor,
    alignSelf:'center', 
    fontSize:20, 
    fontFamily:font_title
  },
  button_style:{ 
    backgroundColor:'#fcdb00',
    height:30
  },
  title_style:{ 
    fontFamily:font_description,
    color:colors.theme_fg_three
  },
});

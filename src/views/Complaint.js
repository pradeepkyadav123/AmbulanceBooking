import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { Content, Container, Header, Body, Title, Left, Footer, Icon, Right, Button as Btn } from 'native-base';
import * as colors from '../assets/css/Colors';
import { font_title, font_description, api_url, add_complaint } from '../config/Constants';
import { Divider } from 'react-native-elements';
 import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/ComplaintActions';
import { Loader } from '../components/GeneralComponents';

class Complaint extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        description: '',
        category_id: this.props.route.params.data.complaint_category,
        category_name: this.props.route.params.category_name,
        sub_category_id: this.props.route.params.data.id,
        complaint_sub_category_name: this.props.route.params.data.complaint_sub_category_name,
      }
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  make_complaint = async(item) =>{
    this.props.serviceActionPending();
     await axios({
      method: 'post', 
      url: api_url + add_complaint,
      data:{ trip_id : 1, customer_id: global.id, driver_id: 1, complaint_category : this.state.category_id , complaint_sub_category : this.state.sub_category_id, description : this.state.description }
    })
    .then(async response => {
        alert('Your complaint registered successfully !');
        await this.props.serviceActionSuccess(response.data);
        await this.props.navigation.navigate('RideDetails');
    })
    .catch(error => {
        this.showSnackbar(strings.sorry_something_went_wrong);
        this.props.serviceActionError(error);
    });
  }
  

  render() {
    const { isLoding } = this.props
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <Btn onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Tell us about it</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={styles.content_style}>
        <Loader visible={isLoding} />
          <View style={styles.margin_10} />
          <Text style={styles.category_title}>{this.state.category_name}</Text>
          <View style={styles.margin_5} />
          <Text style={styles.description}>{this.state.complaint_sub_category_name}</Text>
          <Divider style={styles.default_divider} />
          <Text style={styles.category_title}>Enter your command</Text>
          <View style={styles.margin_5} />
          <View style={styles.text_area_container} >
            <TextInput
              style={styles.text_area}
              underlineColorAndroid="transparent"
              numberOfLines={10}
              multiline={true}
              value = {this.state.description}
              onChangeText={ TextInputValue =>
                this.setState({description : TextInputValue }) }
            />
          </View>
        </Content>
        {/*<Footer style={styles.footer} >
                  <View style={styles.footer_content}>
                    <Button
                      onPress={this.make_complaint.bind(this,1)}
                      title="Submit"
                      buttonStyle={styles.footer_btn}
                      titleStyle={styles.btn_title_style}
                    />
                  </View>
                </Footer>*/}
        <Footer style={styles.footer}>
          <TouchableOpacity activeOpacity={1} onPress={this.make_complaint.bind(this,1)} style={styles.cnf_button_style}>
          <Text style={styles.title_style}>SUBMIT</Text>
          </TouchableOpacity>
        </Footer>
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.complaint.isLoding,
    error : state.complaint.error,
    data : state.complaint.data,
    message : state.complaint.message,
    status : state.complaint.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});

export default connect(mapStateToProps,mapDispatchToProps)(Complaint);

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
  btn_title_style:{
    fontFamily:font_description,
    color:colors.blackColor
  },
  margin_10:{
    margin:10
  },
  margin_5:{
    margin:5
  },
  default_divider:{ 
    marginTop:20, 
    marginBottom:20 
  },
  category_title:{ 
    color:colors.theme_fg_two,
    fontSize:18,
    fontFamily:font_description
  },
  text_area_container:{
    borderColor: colors.theme_fg_four,
    borderWidth: 1,
    padding: 5,
    borderRadius:10,
    width:'100%',
    alignSelf:'center'
  },
  text_area:{
    height: 150,
    alignItems:"flex-start",
    color:colors.theme_fg_four
  },
  footer_content:{
    width:'90%'
  },
  footer_btn:{
    backgroundColor:colors.theme_bg
  },
  footer:{
    alignItems:'center',
    width:'100%',
    backgroundColor: colors.theme_bg
  },
  content_style:{
    backgroundColor:colors.theme_fg_three
  },
  description:{ 
    color:colors.theme_fg_four, 
    fontSize:16, 
    fontFamily:font_description 
  },
  title_style:{ 
    fontFamily:font_description,
    color:colors.blackColor,
    fontSize:18
  },
});

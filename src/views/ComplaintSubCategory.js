import React, {Component} from 'react';
import { StyleSheet, Text, FlatList } from 'react-native';
import { Content, Container, Header, Body, Title, Left, Icon, Right, Button as Btn, List, ListItem } from 'native-base';
import * as colors from '../assets/css/Colors';
import { font_title, font_description, api_url, complaint_sub_category } from '../config/Constants';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/ComplaintActions';
import { SingleListLoader } from '../components/GeneralComponents';

class ComplaintSubCategory extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        category_id: this.props.route.params.data.id,
        category_name: this.props.route.params.data.complaint_category_name,
      }
      this.complaint_sub_category();
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  move_complaint(item){
    this.props.navigation.navigate('Complaint',{data: item, category_name : this.state.category_name});
  }

  complaint_sub_category = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post', 
      url: api_url + complaint_sub_category,
      data: {country_id :  global.country_id, complaint_category_id : this.state.category_id}
    })
    .then(async response => {
        await this.props.serviceActionSuccess(response.data)
    })
    .catch(error => {
        this.props.serviceActionError(error);
    });
  }

  render() {
    const { isLoding, data } = this.props
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.flex_1} >
            <Btn onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Btn> 
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Billing Related</Title>
          </Body>
          <Right />
        </Header>
        <Content style={styles.content_style}>
          <SingleListLoader visible={isLoding} />
          <List>
           <FlatList
              data={data}
              renderItem={({ item }) => (
            <ListItem onPress={() => this.move_complaint(item)} >
              <Left>
                <Text style={styles.sub_category_title} >{item.complaint_sub_category_name}</Text>
              </Left>
              <Right>
                <Icon style={styles.text_icon} name="ios-arrow-forward" />
              </Right>
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


export default connect(mapStateToProps,mapDispatchToProps)(ComplaintSubCategory);

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
  default_divider:{ 
    marginTop:20, 
    marginBottom:20 
  },
  sub_category_title:{
    color:colors.theme_fg_two,
    fontSize:15,
    fontFamily:font_description
  },
  content_style:{
    backgroundColor:colors.theme_fg_three
  }
});

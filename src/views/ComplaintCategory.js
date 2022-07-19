import React, {Component} from 'react';
import { StyleSheet, Text, FlatList } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Icon, Right, Button as Btn, List, ListItem } from 'native-base';
import * as colors from '../assets/css/Colors';
import { font_description, font_title , api_url, complaint_category} from '../config/Constants';
 import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/ComplaintActions';
import { SingleListLoader } from '../components/GeneralComponents';

class ComplaintCategory extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        data:[]
      }
      this.complaint_category();
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  sub_category(item){
    this.props.navigation.navigate('ComplaintSubCategory',{ data: item });
  }

   complaint_category = async () => { 
    this.props.serviceActionPending();
    await axios({
      method: 'post', 
      url: api_url + complaint_category,
      data: {country_id :  global.country_id}
    })
    .then(async response => {
        this.setState({ data : response.data.result });
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
            <Btn onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Btn>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Choose an issue</Title>
          </Body>
          <Right />
        </Header>
        <Content style={styles.content_style}>
          <SingleListLoader visible={isLoding} />
          <List>
           <FlatList
              data={this.state.data}
              renderItem={({ item }) => (
            <ListItem onPress={() => this.sub_category(item)} >
              <Left>
                <Text style={styles.category_title} >{item.complaint_category_name}</Text>
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


export default connect(mapStateToProps,mapDispatchToProps)(ComplaintCategory);

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
  content_style:{ 
    backgroundColor:colors.theme_fg_three
  },
  category_title:{
    color:colors.theme_fg_two,
    fontSize:15,
    fontFamily:font_description
  }
});
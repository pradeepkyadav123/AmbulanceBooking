import React, {Component} from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';
import { Content, Container, Header, Body, Title, Left,  Row, Icon, Right, Button as Btn} from 'native-base';
import * as colors from '../assets/css/Colors';
import { font_title, font_description , img_url} from '../config/Constants';

class NotificationDetails extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        data:this.props.route.params.data
      }
  }

  drawer = () =>{
    this.props.navigation.toggleDrawer();
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
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
            
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor:colors.theme_fg_three}}>
          <Row>
            <Body>
                <View style={styles.notification_img}>
                  <Image
                    style= {{flex:1 , width: undefined, height: undefined}}
                    source={{uri: img_url + this.state.data.image}}
                  />
                </View>
                <View style={{ margin:10 }} />
            </Body>
          </Row>
          <View style={{ padding:10 }}>
            <Row>
              <Body><Title style={styles.notification_title}>{this.state.data.title}</Title></Body>
            </Row>
            <View style={styles.margin_10} />
            <Text style={styles.description}>{this.state.data.message}</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

export default NotificationDetails;

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
  notification_title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    fontSize:20,
    fontFamily:font_title
  },
  notification_img:{
    height:200, 
    width:'100%'
  },
  description:{ color:colors.theme_fg_four, alignSelf:'center', fontFamily:font_description}
});

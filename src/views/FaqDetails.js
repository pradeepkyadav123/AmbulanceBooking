import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Content, Container, Header, Body, Left,  Row, Icon, Right, Button as Btn } from 'native-base';
import * as colors from '../assets/css/Colors';
import { font_title, font_description } from '../config/Constants';

class FaqDetails extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        data:this.props.route.params.data
      }
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
        <Content padder style={{backgroundColor:colors.theme_fg_three}}>
          <Row>
            <Body><Text style={styles.faq_title}>{this.state.data.question}</Text></Body>
          </Row>
          <View style={styles.margin_10} />
          <Text style={{ color:colors.theme_fg_four, fontFamily:font_description }}>{this.state.data.answer}</Text>
        </Content>
      </Container>
    );
  }
}

export default FaqDetails;

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
});

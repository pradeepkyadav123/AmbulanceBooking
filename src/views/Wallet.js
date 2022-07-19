import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, Image, BackHandler } from 'react-native';
import { Content, Container, Header, Body, Title, Left, Icon, Right, Button as Btn, Card, CardItem, List, ListItem, Thumbnail, Row, Col} from 'native-base';
import * as colors from '../assets/css/Colors';
import { stripe_payment, alert_close_timing, api_url, add_wallet, get_wallet, wallet_icon, taxi_icon, font_title, font_description, wallet_payment_methods, img_url, empty_wallet } from '../config/Constants';
import DropdownAlert from 'react-native-dropdownalert';
import { Button } from 'react-native-elements';
import DialogInput from 'react-native-dialog-input';
 import axios from 'axios';
import { connect } from 'react-redux';
import { addWalletPending, addWalletError, addWalletSuccess ,walletPending, walletError, walletSuccess } from '../actions/WalletActions';
import { SingleListLoader, Loader } from '../components/GeneralComponents';
import RBSheet from "react-native-raw-bottom-sheet";
import RazorpayCheckout from 'react-native-razorpay';
import stripe from 'tipsi-stripe';
import { CommonActions } from '@react-navigation/native';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
class Wallet extends Component<Props> {

  constructor(props) {
      super(props)
      this.drawer = this.drawer.bind(this);
      this.open_dialog = this.open_dialog.bind(this);
      this.get_wallet = this.get_wallet.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        isDialogVisible:false,
        wallet_amount:0,
        wallet_history:'',
        payment_methods:[],
        amount:0,
        isLoading:false
      }
      this.get_payment_methods();

  }

  async componentDidMount() {
    await this.get_wallet();
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

  drawer = () =>{
    this.props.navigation.toggleDrawer();
  }

  open_dialog(){
    this.setState({ isDialogVisible: true });
  }


  get_wallet= async () => {
    await axios({
      method: 'post', 
      url: api_url + get_wallet,
      data:{ id : global.id}
    })
    .then(async response => {
        await this.setState({  wallet_amount:response.data.result.wallet, wallet_history : response.data.result.wallet_histories});
        global.wallet = response.data.result.wallet;

    })
    .catch(error => {
        this.showSnackbar(strings.sorry_something_went_wrong);
    });
  }

  add_wallet= async () => {
    this.props.addWalletPending();
     await axios({
      method: 'post', 
      url: api_url + add_wallet,
      data:{ id : global.id, country_id: global.country_id, amount: this.state.amount}
    })
    .then(async response => {
        await this.props.addWalletSuccess(response.data);
        await this.get_wallet();
    })
    .catch(error => {
        alert('Sorry something went wrong');
        this.props.addWalletError(error);
    });
  }

  show_alert(message){
    this.dropDownAlertRef.alertWithType('error', 'Error',message);
  }

  choose_payment = (total_fare) =>{
    this.setState({isDialogVisible: false, amount : total_fare})   
    this.RBSheet.open();
  }

  get_payment_methods = async () => {
    await axios({
      method: 'post', 
      url: api_url + wallet_payment_methods,
      data: {country_id :  global.country_id}
    })
    .then(async response => {
      this.setState({ payment_methods : response.data.result })
    })
    .catch(error => {
      
    });
  }

  select_payment = (item) =>{
    this.payment_done(item.payment_type);
    this.RBSheet.close();
  }

  payment_done = async(payment_type) =>{
    if(payment_type != 0){
      if(payment_type == 4){
        await this.stripe_card();
      }else if(payment_type == 5){
        await this.razorpay();
      }
    }else{
      alert('Please select payment method');
    }
  }

  razorpay = async() =>{
    var options = {
      currency: global.currency_short_code,
      key: global.razorpay_key,
      amount: this.state.amount * 100,
      name: global.app_name,
      prefill:{
        email: global.email,
        contact: global.phone_with_code,
        name: global.first_name
      },
      theme: {color: colors.theme_fg}
    }
    RazorpayCheckout.open(options).then((data) => {
      this.add_wallet();
    }).catch((error) => {
      alert('Sorry something went wrong');
    });
  }

  stripe_card = async() =>{

    stripe.setOptions({
      publishableKey: global.stripe_key,
      merchantId: 'MERCHANT_ID', // Optional
      androidPayMode: 'test', // Android only
    })
    

   const response = await stripe.paymentRequestWithCardForm({
      requiredBillingAddressFields: 'full',
      prefilledInformation: {
        billingAddress: {
           name: global.first_name,
        },
      },
    });

    if(response.tokenId){
      this.stripe_payment(response.tokenId);
    }else{
      alert('Sorry something went wrong');
    }
  }

  stripe_payment = async (token) => {
    this.setState({ isLoading : true });
    await axios({
      method: 'post', 
      url: api_url + stripe_payment,
      data:{ customer_id : global.id, amount:this.state.amount, token: token}
    })
    .then(async response => {
      this.setState({ isLoading : false });
      this.add_wallet();
    })
    .catch(error => {
      this.setState({ isLoading : false });
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
            <Title style={styles.title} >Wallet</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{ backgroundColor:colors.theme_bg_three }} padder>
        <Loader visible={isLoding} />
        <Loader visible={this.state.isLoading} />
          <Card style={{ borderRadius: 8 }}>
            <CardItem header bordered style={{ borderRadius: 8, backgroundColor:colors.theme_bg_three }}>
              <Left>
                <View>
                 <Icon style={{ fontSize:30, color:colors.theme_fg }} name='ios-wallet' />
                </View>
                <View style={{ margin:5 }} />
                <View>
                  <Text style={styles.bal_amt}>₹{this.state.wallet_amount}</Text>
                  <Text style={styles.bal} >Your balance</Text>
                </View>
              </Left>
              <Right>
                 <Button
                  title="+ Add Money"
                  onPress={this.open_dialog}
                  type="outline"
                  buttonStyle={{ borderColor:colors.theme_fg_two }}
                  titleStyle={{ color:colors.theme_fg_two }}
                />
              </Right>
            </CardItem>
          </Card>
          <View style={styles.margin_10} />
          <Text style={styles.wal_trans}>Wallet transactions</Text>
          <List>
          <FlatList
              data={this.state.wallet_history}
              renderItem={({ item,index }) => (
                <ListItem avatar>
                  <Left>
                    <Thumbnail square source={wallet_icon} style={{ height:35, width:35 }} />
                  </Left>
                  <Body>
                    <Text style={styles.paid_wal}>{item.message}</Text> 
                    <Text style={styles.date_time}>{Moment(item.created_at).format('MMM DD, YYYY hh:mm A')}</Text>
                  </Body>
                  <Right>
                    <Text style={styles.amt}>${item.amount}</Text>
                  </Right>
                </ListItem>
             )} 
              keyExtractor={item => item.id}
            />
             
          </List>
          
        <Loader visible={isLoding} />
        </Content>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={250}
          animationType="fade"
          duration={250}
        >
        <Row>
          <Body>
            <Text style={styles.payment_option}>Select a payment option</Text>
          </Body>
        </Row>
        <List>
          <FlatList
            data={this.state.payment_methods}
            renderItem={({ item,index }) => (
              item.payment_type != 1 &&
              <ListItem onPress={this.select_payment.bind(this,item)}>
                <Col style={{ width:'20%'}}>
                  <Image 
                    style= {{flex:1 ,height:50, width:50 }}
                    source={{ uri : img_url + item.icon }}
                  />
                </Col>
                <Col>
                  <Text style={styles.font}>{item.payment}</Text>
                </Col>
              </ListItem>
              
            )}
            keyExtractor={item => item.id}
          />
          
        </List>
        </RBSheet>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
          title={"Add Wallet"}
          message={"Please enter your amount here"}
          hintInput ={"Enter amount"}
          keyboardType="numeric"
          submitInput={ (inputText) => {this.choose_payment (inputText)} }
          closeDialog={ () => {this.setState({ isDialogVisible : false })}}>
        </DialogInput>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} closeInterval={alert_close_timing} />
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.wallet.isLoding,
    message : state.wallet.message,
    status : state.wallet.status,
    data : state.wallet.data,
  };
}

const mapDispatchToProps = (dispatch) => ({
    addWalletPending: () => dispatch(addWalletPending()),
    addWalletError: (error) => dispatch(addWalletError(error)),
    addWalletSuccess: (data) => dispatch(addWalletSuccess(data)),
    walletPending: () => dispatch(walletPending()),
    walletError: (error) => dispatch(walletError(error)),
    walletSuccess: (data) => dispatch(walletSuccess(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Wallet);

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
    color:colors.theme_fg_four
  },
  bal_amt:
  { 
    fontFamily:font_title, 
    fontSize:18,
    color:colors.theme_fg
  },
  bal:
  { 
    fontSize:13, 
    color:colors.theme_fg_four,
    fontFamily:font_description 
  },
  wal_trans:
  { 
    fontSize:16, 
    fontFamily:font_title,
    color:colors.theme_fg_two, 
  },
  paid_wal:
  { 
    fontSize:14, 
    fontFamily:font_title, 
    color:colors.theme_fg_two,
  },
  date_time:
  { fontSize:12, 
    color:colors.theme_fg_two,
    fontFamily:font_description
  },
  amt:
  { 
    fontSize:16, 
    fontFamily:font_title, 
    color:colors.theme_fg_two 
  }

});

import { Dimensions } from 'react-native';


export const app_name = "911Ambulance";  
// export const base_url = "http://15.206.122.199/";
// export const api_url = "http://15.206.122.199/api/";
// export const img_url = "http://15.206.122.199/public/uploads/";

// export const base_url = "http://911ambulance.com/";
// export const api_url = "http://911ambulance.com/api/";
// export const img_url = "http://911ambulance.com/public/uploads/";
export const base_url = "http://15.206.122.199/";
export const api_url = "http://15.206.122.199/api/";
export const img_url = "http://15.206.122.199/public/uploads/";
export const scratch_img_url = "static_images/scratch.png";
export const settings = "app_setting";
 
export const check_phone = "customer/check_phone";
export const login = "customer/login";  
export const faq = "customer/faq";
export const privacy = "customer/policy";
export const register = "customer/register";
export const send_invoice = "send_invoice";
export const profile = "customer/profile"; 
export const profile_update = "customer/profile_update";
export const add_wallet = "customer/add_wallet";
export const get_wallet = "customer/get_wallet";
export const profile_picture = "customer/profile_picture";
export const complaint_category = "customer/get_complaint_category";
export const complaint_sub_category = "customer/get_complaint_sub_category";
export const add_complaint = "customer/add_complaint";
export const ride_list = "customer/ride_list";
export const ride_details = "customer/ride_details";
export const get_notification_messages = "customer/get_notification_messages";
export const get_referral_message = "customer/get_referral_message";
export const promo_code = "customer/get_promo_codes";          
export const cancel_ride = "customer/get_cancellation_reasons";  
export const forgot = "customer/forgot"; 
export const reset_password = "customer/reset_password"; 
export const about_us = "customer/get_about";
export const get_vehicles = "customer/get_categories";
export const my_bookings = "customer/my_bookings";
export const payment_methods = "customer/payment_method";
export const wallet_payment_methods = "customer/wallet_payment_methods";
export const get_fare = "customer/get_fare"; 
export const ride_confirm = "customer/ride_confirm";
export const submit_rating = "driver/rating_upload";
export const trip_cancel = "customer/trip_cancel";
export const stripe_payment = "stripe_payment";
export const customer_offers = "customer_offers";
export const update_view_status = "update_view_status";  
export const get_trip_type = "get_trip_type";  
export const get_packages = "get_package";
export const register_query = "driver/register_query";  
export const add_sos_contact = "add_sos_contact";
export const sos_contact_list = "sos_contact_list";
export const delete_sos_contact = "delete_sos_contact";  
export const sos_sms = "sos_sms";  
export const get_gender = "get_gender";   

//Size
export const screenHeight = Math.round(Dimensions.get('window').height);
export const screenWidth = Math.round(Dimensions.get('window').width);
export const height_40 = Math.round(40 / 100 * screenHeight);
export const height_45 = Math.round(45 / 100 * screenHeight);
export const height_50 = Math.round(50 / 100 * screenHeight);
export const height_60 = Math.round(60 / 100 * screenHeight);
export const height_70 = Math.round(70 / 100 * screenHeight);
export const height_35 = Math.round(35 / 100 * screenHeight);
export const height_20 = Math.round(20 / 100 * screenHeight);
export const height_30 = Math.round(30 / 100 * screenHeight);
export const width_80 = Math.round(80 / 100 * screenWidth);
export const width_40 = Math.round(40 / 100 * screenWidth);

//Path 
export const indica = require('.././assets/img/indica.png');
export const logo_image = require('.././assets/img/logo_image.png');
export const wallet_icon = require('.././assets/img/wallet.png');
export const taxi_icon = require('.././assets/img/taxi.png');
export const car_icon_small = require('.././assets/img/car_icon_small.png');
export const avatar_icon = require('.././assets/img/avatar.png');
export const meter_icon = require('.././assets/img/meter.png');
// export const logo = require('.././assets/img/logo.png');
export const logo = require('.././assets/img/AmbulanceLogo.png');
export const bell_icon = require('.././assets/img/bell.png');
export const location_lottie = require('.././assets/json/location_lottie.json');
export const refer_lottie = require('.././assets/json/refer.json');
export const search_lottie = require('.././assets/json/search.json');
export const my_ride = require('.././assets/json/my_ride.json');
export const empty_wallet = require('.././assets/json/empty_wallet.json');
export const sos_img = require('.././assets/json/sos_img.json');
export const my_rewards = require('.././assets/json/my_rewards.json');
export const bg_img =  require('.././assets/img/bg_img.png');  
export const go_icon =  require('.././assets/img/go_icon.png'); 
export const location =  require('.././assets/img/location.png');
export const signup_img =  require('.././assets/img/signup_img.png'); 
export const scratch =  require('.././assets/img/scratch.png');
export const surprise =  require('.././assets/img/surprise.png');
export const sos =  require('.././assets/img/sos.png');
export const my_ride_img =  require('.././assets/img/my_ride_img.png');
export const label =  require('.././assets/img/label.png');
export const splash = require('.././assets/json/splash.json');
export const splashScreen = require('.././assets/img/splashScreen.png');

//Map 
export const GOOGLE_KEY = "AIzaSyASaXtBoCgDZK_k9_E5fTL_WNVedgsK4cQ";
export const LATITUDE_DELTA = 0.0150;
export const LONGITUDE_DELTA =0.0152;
export const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

//Font Family
export const font_title = "TitilliumWeb-Bold";
export const font_description = "TitilliumWeb-Regular";

//Image upload options
const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery'
};

export const alert_close_timing = 2000;

//Messages
export const login_phone_validation_error = "Please enter valid phone number";
export const login_phone_required_validation_error = "Please enter phone number";
export const password_required_validation_message = "Please enter password";
export const create_name_required_validation_message = "Please enter first name and last name";
export const create_email_required_validation_message = "Please enter email address";
export const create_password_required_validation_message = "Please enter password";
export const otp_validation_error = "Please enter valid otp";
export const forgot_phone_required_validation_error = "Please enter phone number";
export const forgot_phone_validation_error = "Please enter valid phone number";
export const reset_password_required_validation_message = "Please enter password & confirm password";
export const reset_password_missmatch_validation_message = "Your password and confirm password missmatch";


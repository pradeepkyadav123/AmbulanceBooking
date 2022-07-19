import * as Actions from '../actions/ActionTypes'
const BookingReducer = (state = { package_id:0, active_vehicle_details:undefined, active_vehicle:0, km:0, promo:0, pickup_address:undefined, pickup_lat:undefined, pickup_lng:undefined, drop_address:undefined, drop_lat:undefined, drop_lng:undefined }, action) => {
    switch (action.type) {
        case Actions.PICKUP_ADDRESS:

            return Object.assign({}, state, {
               pickup_address: action.data
            });
        case Actions.PICKUP_LAT:
            return Object.assign({}, state, {
               pickup_lat: action.data
            });
        case Actions.PICKUP_LNG:
            return Object.assign({}, state, {
               pickup_lng: action.data
            });
        case Actions.DROP_ADDRESS:
            return Object.assign({}, state, {
               drop_address: action.data
            });
        case Actions.DROP_LAT:
            return Object.assign({}, state, {
               drop_lat: action.data
            });
        case Actions.DROP_LNG:
            return Object.assign({}, state, {
               drop_lng: action.data
            });
        case Actions.KM:
            return Object.assign({}, state, {
               km: action.data
            });
        case Actions.PROMO:
            return Object.assign({}, state, {
               promo: action.data
            });
        case Actions.ACTIVE_VEHICLE:
            return Object.assign({}, state, {
               active_vehicle: action.data
            });
        case Actions.PACKAGE_ID:
            return Object.assign({}, state, {
               package_id: action.data
            });
        case Actions.ACTIVE_VEHICLE_DETAILS:
            return Object.assign({}, state, {
               active_vehicle_details: action.data
            });
        case Actions.RESET:
            return Object.assign({}, state, {
               km: 0,
               promo: 0,
               pickup_address: undefined,
               pickup_lat: undefined,
               pickup_lng: undefined,
               drop_address: undefined,
               drop_lat: undefined,
               drop_lng: undefined,
            });
        default:
            return state;
    }
}

export default BookingReducer;
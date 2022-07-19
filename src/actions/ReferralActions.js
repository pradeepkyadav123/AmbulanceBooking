import * as ActionTypes from './ActionTypes';

export const serviceActionPending = () => ({
    type: ActionTypes.REFERRAL_PENDING
})

export const serviceActionError = (error) => ({
    type: ActionTypes.REFERRAL_ERROR,
    error: error
})

export const serviceActionSuccess = (data) => ({
    type: ActionTypes.REFERRAL_SUCCESS,
    data: data
})

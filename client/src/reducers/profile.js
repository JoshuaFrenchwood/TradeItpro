import {GET_PROFILE,PROFILE_ERROR,CLEAR_PROFILE, 
    EDIT_BALANCE, EDIT_BALANCE_ERROR,EDIT_BALANCE_COMPLETE,
    PURCHASE_STOCK,PURCHASE_ERROR,SELL_STOCK,SELL_ERROR} from '../actions/types';


const initialState={
    profile: null,
    loading: true,
    error: {}
}

export default function(state= initialState,action){
    
    const {type,payload}=action;

    switch(type){
        case GET_PROFILE:
        case PURCHASE_STOCK:
            return{
                ...state,
                profile:payload,
                loading:false
            };

        case CLEAR_PROFILE:
            return {
                ...state,
                profile:null,
            };

        case EDIT_BALANCE:
            return{
                ...state,
                profile:payload,
                loading:true
            };

        case EDIT_BALANCE_COMPLETE:
            return{
                ...state,
                loading:false
            }
        case SELL_STOCK:
            return{
                ...state,
                profile:payload,
                loading:false
            };

        case EDIT_BALANCE_ERROR:
        case PROFILE_ERROR:
        case PURCHASE_ERROR:
        case SELL_ERROR:
            return{
                ...state,
                error:payload,
                loading:false
            };

        default:
            return state;

    }
}
import axios from 'axios';
import {setAlert} from './alert';
import {GET_PROFILE,PROFILE_ERROR,EDIT_BALANCE,EDIT_BALANCE_ERROR,PURCHASE_STOCK,SELL_STOCK,PURCHASE_ERROR,SELL_ERROR,EDIT_BALANCE_COMPLETE} from './types';



export const getCurrentProfile=()=> async dispatch=>{
    try {
        const res=await axios.get('/api/profile/me');

        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
        
    } catch (err) {

        dispatch({
            type:PROFILE_ERROR,
            payload: { msg:err.response.statusText, status:err.response.status}

        });   
    }
}




//Edit the Users Balance
export const editBalance = (balance) => async dispatch=>{

    const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    
      const body = JSON.stringify({ balance });

    try {

        const res = await axios.post('/api/profile', body, config);
          
        dispatch({
            type: EDIT_BALANCE,
            payload: res.data
        });

        setTimeout(() => dispatch({ type: EDIT_BALANCE_COMPLETE}), 5000);

    } catch (err) {
        
        const errors = err.response.data;
        
        const userror=Object.values(errors);

        if (userror.length>0 && userror!=null) {
            userror.forEach(error => dispatch(setAlert(error, 'danger')));
        }

        dispatch({
        type: EDIT_BALANCE_ERROR
        });

    }
}

//Buy Stocks from the market
export const buyStock = (symbol,stockcount) => async dispatch=> {

    const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    
      const body = JSON.stringify({ symbol, stockcount });

    try {

        const res = await axios.post('/api/stockprice/updatestock', body, config);
          
        dispatch({
            type: PURCHASE_STOCK,
            payload: res.data
        });

    } catch (err) {
        
        const errors = err.response.data;
        
        const userror=Object.values(errors);

        if (userror.length>0 && userror!=null) {
            userror.forEach(error => dispatch(setAlert(error, 'danger')));
        }

        dispatch({
        type: PURCHASE_ERROR
        });

    }
}


//Buy Stocks from the market
export const sellStock = (symbol,stockcount) => async dispatch=> {

    const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    
      const body = JSON.stringify({ symbol, stockcount });

    try {

        const res = await axios.post('/api/stockprice/deletestock', body, config);
          
        dispatch({
            type: SELL_STOCK,
            payload: res.data
        });

    } catch (err) {
        
        const errors = err.response.data;
        
        const userror=Object.values(errors);

        if (userror.length>0 && userror!=null) {
            userror.forEach(error => dispatch(setAlert(error, 'danger')));
        }

        dispatch({
        type: SELL_ERROR
        });

    }
}
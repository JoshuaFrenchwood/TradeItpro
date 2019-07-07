import axios from 'axios';
import {REGISTER_SUCCESS,REGISTER_FAIL, USER_LOADED, AUTH_ERROR,LOGIN_FAIL,LOGIN_SUCCESS,LOGOUT,CLEAR_PROFILE} from './types';
import {setAlert} from './alert';
import setAuthToken from '../utilis/setAuthToken';

//Load User
export const loadUser=()=> async dispatch=>{

    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    try{
        const res= await axios.get('/api/users/current');
        dispatch({
            type:USER_LOADED,
            payload:res.data
        })

    }catch(err){

        dispatch({
            type:AUTH_ERROR
        })

    }

}

//Register
export const register = ({ name, password }) => async dispatch => {
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const body = JSON.stringify({ name,  password });
  
    try {
      const res = await axios.post('/api/users/register', body, config);
  
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      dispatch(loadUser());
     
    } catch (err) {

      const errors = err.response.data;
      
      const userror=Object.values(errors);

      if (userror.length>0 && userror!=null) {
        userror.forEach(error => dispatch(setAlert(error, 'danger')));
      }
  
      dispatch({
        type: REGISTER_FAIL
      });
    }
  };

  
 //Login User 
export const login = ( name, password ) => async dispatch => {

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name,  password });

  try {
    const res = await axios.post('/api/users/login', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
   
  } catch (err) {

    const errors = err.response.data;
    
    const userror=Object.values(errors);

    if (userror.length>0 && userror!=null) {
      userror.forEach(error => dispatch(setAlert(error, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const logout=()=>dispatch=>{
  
  dispatch({
    type:CLEAR_PROFILE
  });

  dispatch({
    type:LOGOUT
  });


};
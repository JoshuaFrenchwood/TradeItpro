import React, { Fragment,useState } from 'react';
import {Link,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import PropTypes from 'prop-types'
import {register} from '../../actions/auth';

//         props.setAlert destructuring
const Register = ({setAlert,register,isAuthenticated}) =>{

    const [formData,setFormData]=useState({
        name:'',
        password:'',
        password2:''
    });

    const {name,password,password2}=formData;

    const onChange=e=>setFormData({
        ...formData,
        [e.target.name]:e.target.value
    });

    const onSubmit= async e=>{
        e.preventDefault();
        const newUser={
            name,
            password
        }
        //Pulling these from formData

        if(password!==password2){
            setAlert('Passwords do not match','danger');
        }else{
        
        register(newUser);
        }
    };

    if(isAuthenticated){
        return <Redirect to="/dashboard"/>;
    }

    return( <Fragment>
        <h1 className="large text-primary">Create Your Account</h1>
        <p className="lead"><i className="fas fa-user"></i> Sign Up For An Account</p>
        <form className="form" onSubmit={e=>onSubmit(e)}>
            <div className="form-group">
                <input className='form-control' type="text" placeholder="Username" name="name" value={name} onChange={e=>onChange(e)} />
            </div>

            <div className="form-group">
                <input
                    className='form-control'
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password} 
                    onChange={e=>onChange(e)}
                />
            </div>

            <div className="form-group">
                <input
                    className='form-control'
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    value={password2} 
                    onChange={e=>onChange(e)}
                />
            </div>

                <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
            Already have an account? <Link to="/login">Sign In</Link>
        </p>
    </Fragment>
    )
}


Register.propTypes={
    setAlert:PropTypes.func.isRequired,
    register:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool
}

const mapStateToProps=state=>({
    isAuthenticated:state.auth.isAuthenticated
});

export default connect(mapStateToProps,{setAlert,register})(Register);


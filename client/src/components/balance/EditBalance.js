import React, {useState,Fragment} from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Link,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {editBalance} from '../../actions/profile';
import {setAlert} from '../../actions/alert';
import Alert from '../../components/layout/Alert';

const EditBalance = ({setAlert,editBalance,profile,alerts}) => {

    

    const [formData,setFormData]=useState({
        balance:'',
        modal:true,
        nextpage:false
    });

    const {balance,modal,nextpage} =formData;

    const onChange=e=>setFormData({
        ...formData,
        [e.target.name]:e.target.value
    });

    const onSubmit = async e=>{
        e.preventDefault();
        setAlert();

        if(alerts!==null && alerts.length>0){

        return <Redirect to='/edit-balance'/>;
        
        }else{

        editBalance(balance);
        
        setFormData({nextpage:true});
        }
    }
    

    if(nextpage===true){
     return <Redirect to='/dashboard'/>;
    }


    return (
        <Fragment>
        <Modal isOpen={modal}  className=''>
          <ModalHeader>
             Edit Balance
          </ModalHeader>

          <form className='form' onSubmit={e=>onSubmit(e)}>
          <ModalBody>
            <Alert/>
          <p>How much virtual money do you want?</p>
          
            <div className="form-group">
                <input className='form-control' type="text" placeholder="ex: 500.00" name="balance" value={balance} onChange={e=>onChange(e)}/>
            </div>
    
          </ModalBody>
          <ModalFooter>
            <Button color="primary" >Confirm</Button>{' '}
            <Link className='btn btn-secondary' to='/dashboard'>Cancel</Link>
          </ModalFooter>
          </form>
        </Modal>
     
        </Fragment>
    )
}

EditBalance.propTypes = {
    profile:PropTypes.object.isRequired,
    editBalance:PropTypes.func.isRequired,
    setAlert:PropTypes.func.isRequired,
    alerts: PropTypes.array.isRequired,
}

const mapStateToProps=state=>({
    profile:state.profile.profile,
    alerts:state.alert,
});

export default connect(mapStateToProps,{editBalance,setAlert})(EditBalance);
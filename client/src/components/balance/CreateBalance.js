import React, {useState,Fragment} from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Redirect,Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {editBalance} from '../../actions/profile';
import {setAlert} from '../../actions/alert';
import Alert from '../../components/layout/Alert';


const CreateBalance = ({setAlert,editBalance,profile}) => {

    var [modal,setModal]= useState(true);

    const [formData,setFormData]=useState({
        balance:''
    });

    const {balance} =formData;

    const onChange=e=>setFormData({
        ...formData,
        [e.target.name]:e.target.value
    });

    const onSubmit = async e=>{
        e.preventDefault();
        editBalance(balance);
    }

  

    if(profile!==null){
        return <Redirect to="/dashboard"/>;
    }

    return (
        <Fragment>
        <Modal isOpen={modal}  className=''>
          <ModalHeader>
             Create Balance
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

CreateBalance.propTypes = {
    profile:PropTypes.func.isRequired,
    editBalance:PropTypes.func.isRequired,
    setAlert:PropTypes.func.isRequired
}

const mapStateToProps=state=>({
    profile:state.profile.profile
});

export default connect(mapStateToProps,{editBalance,setAlert})(CreateBalance);
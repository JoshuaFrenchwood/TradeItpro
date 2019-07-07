import React, {useState,Fragment} from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Link,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {buyStock} from '../../actions/profile';
import {setAlert} from '../../actions/alert';
import Alert from '../../components/layout/Alert';
import {getCurrentProfile} from '../../actions/profile';

const PurchaseStock = ({setAlert,buyStock,profile,alerts,getCurrentProfile}) => {
    const [formData,setFormData]=useState({
        stockcount:'',
        symbol:'',
        modal:true,
        nextpage:false
    });

    const {symbol,stockcount,modal,nextpage} =formData;

    const onChange=e=>setFormData({
        ...formData,
        [e.target.name]:e.target.value
    });

    const onSubmit = async e=>{
        e.preventDefault();
        console.log(symbol);
        buyStock(symbol,stockcount);
        setFormData({nextpage:true});
        
    }
    

    if(nextpage===true){
    getCurrentProfile();
     return <Redirect to='/dashboard'/>;
    }


    return (
        <Fragment>
        <Modal isOpen={modal}  className=''>

          <ModalHeader className=''>
            Purchase Stock
          </ModalHeader>

          <form className='form' onSubmit={e=>onSubmit(e)}>
          <ModalBody>
            <Alert/>
          <p>Enter the Transaction information below</p>
          
            <div className="form-group">
            <label for="Stock Symbol">Stock Symbol</label>
                <input className='form-control' type="text" placeholder="Please enter the symbol of the stock: ex. MSFT" name="symbol" value={symbol} onChange={e=>onChange(e)}/>
            </div>
            <div className="form-group">
            <label for="Stock Count">Number of Stocks you want to purchase</label>
                <input className='form-control' type="text" placeholder="Please enter the number of stocks you are ordering: ex. 1" name="stockcount" value={stockcount} onChange={e=>onChange(e)}/>
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

PurchaseStock.propTypes = {
    profile:PropTypes.object.isRequired,
    buyStock:PropTypes.func.isRequired,
    setAlert:PropTypes.func.isRequired,
    alerts:PropTypes.array,
    getCurrentProfile:PropTypes.func.isRequired,
}

const mapStateToProps=state=>({
    profile:state.profile.profile,
    alerts:state.alert
});

export default connect(mapStateToProps,{setAlert,buyStock,getCurrentProfile})(PurchaseStock);
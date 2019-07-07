import React, {Fragment,useEffect} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getCurrentProfile} from '../../actions/profile';
import Spinner from '../layout/Spinner';


const Dashboard = ({getCurrentProfile,auth:{user},profile:{profile,loading}} )=> {

    useEffect(()=>{
        getCurrentProfile();
    },[]);

    return loading && profile===null ? (
    
        <Spinner/>
    
    ) : (
    
    <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i>{'  '}Welcome { user && user.name}
        </p>
        {profile!=null?(
        <Fragment>
            <div className='container'>
                <div className='row'>

                    <div className="list-group list-group-horizontal col">
                        <Link className="list-group-item" to="/purchase-stock" style={{ color: 'black' }}>Purchase Stock</Link>
                        <Link className="list-group-item" to="/sell-stock" style={{ color: 'black' }}>Sell Stock</Link>
                        <Link className="list-group-item" to='/edit-balance' style={{ color: 'black' }}>Change Balance</Link>
                    </div>
                
                    <div className='col'>
                        <h1>Current Balance: ${profile.balance.toFixed(2)}</h1>
                    </div>
                </div>
                <div className='row'>
                    <table className="table ">
                        <thead className='thread-dark'>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Stock Symbol</th>
                                <th scope = 'col'>Number of Stocks Owned</th>
                            </tr>
                        </thead>
                        <tbody>
                        {profile.stockinfo.map((curr,index)=>
                            
                            <tr>
                                <th scope='row'>{index+1}</th>
                                <td>{curr.stockname}</td>
                                <td>{curr.stockcount}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </Fragment>
        ) : (
        <Fragment>
            <p>Create your virtual balance! Click the button below</p>
            <Link to='/change-balance' className='btn btn-primary my-1'>
                Create Balance
            </Link>
        </Fragment>)}
    </Fragment>
    );
};


Dashboard.propTypes = {
    getCurrentProfile:PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
    profile:PropTypes.object.isRequired,
    alerts:PropTypes.object.isRequired,
}

const mapStateToProps=state=>({
    auth:state.auth,
    profile:state.profile
});

export default connect(mapStateToProps,{getCurrentProfile})(Dashboard);
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../../actions/auth';
import PropTypes from 'prop-types';




 const Navbar = ({auth:{isAuthenticated, loading},logout}) => {

    const authLinks=(
        <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                <i className="fas fa-user"/>{' '}
                <span className='hide-sm'></span>Dashboard</Link>
            </li>
            <li className="nav-item">     
                <Link onClick={logout} className="nav-link" to="/register">
                    <i className="fas fa-sign-out-alt"/>{' '}
                    <span className='hide-sm'></span>Logout</Link>
            </li>
        </ul>
    );

  const guestLinks=(
        <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link className="nav-link" to="/register">Create Acount</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
            </li>
        </ul>
  );
        return (
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
                <div className="container">
                    <Link className="navbar-brand" to="/">TradeIt</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mobile-nav">
                        {!loading ? (<Fragment>{isAuthenticated ? authLinks :guestLinks}</Fragment>) :null}
                    </div>
                </div>
            </nav>
        );
};


Navbar.propTypes={
    logout:PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};
 
const mapStateToProps=state=>({
    auth: state.auth
})

export default connect(mapStateToProps,{logout})(Navbar);
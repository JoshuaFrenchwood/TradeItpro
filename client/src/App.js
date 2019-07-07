import React,{useEffect} from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import DashBoard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';
import Alert from './components/layout/Alert';
import {loadUser} from './actions/auth';
import setAuthToken from './utilis/setAuthToken';
import CreateBalance from './components/balance/CreateBalance';
import EditBalance from './components/balance/EditBalance';
import PurchaseStock from './components/balance/PurchaseStock';
import SellStock from './components/balance/SellStock';



if(localStorage.token){
  setAuthToken(localStorage.token);
}


const App = ()=>{

  useEffect(()=>{
    store.dispatch(loadUser());
  },[]);


    return(
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar/>
            <Route exact path="/" component={Landing}/>
            <section className="container">
              <Alert/>
              <Switch>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/login" component={Login}/>
                <PrivateRoute exact path='/dashboard' component={DashBoard}/>
                <PrivateRoute exact path='/change-balance' component={CreateBalance}/>
                <PrivateRoute exact path='/edit-balance' component={EditBalance}/>
                <PrivateRoute exact path='/purchase-stock' component={PurchaseStock}/>
                <PrivateRoute exact path='/sell-stock' component={SellStock}/>
              </Switch>
            </section>
            <Footer/>
          </div>
        </Router>
      </Provider>
    );
  }


export default App;

const env=require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const express=require('express');
const router=express.Router();
const apikey=require('../../config/keys').apiKey;
const passport=require('passport');
const Profile=require('../../models/Profile');


router.get('/test', (req,res)=>{
    
    let errors={};
    
    const stockname=req.body.symbol;

    //Use API to gather current stock data

    let requestURL='https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+stockname+'&interval=5min&apikey='+apikey;

    let request=new XMLHttpRequest();

    request.open('GET',requestURL,true);

    request.onload=function(){

        let stockdata=JSON.parse(request.responseText);
       
        //API is called too much...only can make 5 calls per minute (free tier of API used)
        if(stockdata.Note!=undefined){
             errors.Note='Sorry I Have Limited API Calls For Stock Data...Click Again Soon';
             return res.status(404).json(errors);
        }
        //The symbol entered doesnt exsist
        if(stockdata['Error Message']!=undefined ){
            errors['Error Message']='This Stock Symbol Does Not Exsist';
            return res.status(404).json(errors);
        }

        //Obtain current stock closing price
        let stockobj=stockdata['Time Series (5min)'];
        let stockclose=stockobj[Object.keys(stockobj)[0]]['4. close'];
        
        //The Stock data is available
        res.json({
            stockprice:stockclose
        });

    };

        request.send();
        
});

// POST api/stockprice/updatestock
// Update Stock Information -- Buy A Stock
// @access Private

router.post('/updatestock',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    const errors={};
    //Bring in stock symbol for API Use
    const stocknm=req.body.symbol;
    const stockname=stocknm;

    //Use API to gather current stock data

    let requestURL='https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+stockname+'&interval=5min&apikey='+apikey;

    let request=new XMLHttpRequest();

    request.open('GET',requestURL,true);

    request.onload=function(){

        let stockdata=JSON.parse(request.responseText);
       
        //API is called too much...only can make 5 calls per minute
        if(stockdata.Note!=undefined){
            
             errors.Note='Sorry I Have Limited API Calls For Stock Data...Click Again Soon';
             return res.status(404).json(errors);
        }
        //The symbol entered doesnt exsist
        if(stockdata['Error Message']!=undefined ){
            errors['Error Message']='This Stock Symbol Does Not Exsist';
            return res.status(404).json(errors);
        }
        
        //Obtain closing price of the stock...
        let stockobj=stockdata['Time Series (5min)'];
        let stockclose=stockobj[Object.keys(stockobj)[0]]['4. close'];


    Profile.findOne({user:req.user.id})
    .then(profile=>{

        //Check Balance to ensure that purchase can be made
       if((profile.balance-stockclose*req.body.stockcount)<=0){
           errors.broke='Balance Too Low To Make Stock Purchase...';
           return res.status(400).json(errors);
       }
        
        
        //Determine if Stock Name is in the users account, if so identify where
        function findStock(array, key, value) {
            for (var i = 0; i < array.length; i++) {
                var old=array[i][key].toUpperCase();
                var newval=value.toUpperCase();
                if (old===newval) {
                    return i;
                }
            }
            return null;
        };

        let stocknamekey='stockname';

        const stocknm=req.body.symbol;
        const stockname=stocknm.toUpperCase();

        //found determines if and where the stock is inside the users account
        let found=findStock(profile.stockinfo,stocknamekey,stockname);
        
        //Profile Exsist and stock is not already in user's profile...Now make a new stock in account
        if(profile && found==null){
            //Update Profile Stock Information -- Place Newly Owned Stock 
            
            let newstock={"stockname":stockname,"stockcount":req.body.stockcount};

            if(isNaN(newstock.stockcount)===true){
                errors.stockCount='The Ammount Of Stock Needs To Be A Number';
                return res.status(400).json(errors);
            }

            Profile.findOneAndUpdate(
                {user:req.user.id},
                {$push:{stockinfo:newstock}},
                {new:true}
                ).then(profile=>{

                    Profile.findOneAndUpdate(
                        {user:req.user.id},
                        {$inc:{balance:-(stockclose*req.body.stockcount)}},
                        {new:true}
                    ).then(profile=>res.json(profile))
                    });
        }

        //profle exsist and stock is found in user's profile...Now add to stock count and subtract the cost from the balance
        if(profile && found!=null){
            //Update Profile Stock Count -- Bought Stock
           
           Profile.findOneAndUpdate(
            {user:req.user.id,
             "stockinfo.stockname":stockname
            },
            {$inc:{"stockinfo.$.stockcount":req.body.stockcount,balance:-(stockclose*req.body.stockcount)}},
            {new:true}
           ).then(profile=>res.json(profile));

        }

    });

    };

    request.send();

});

// POST api/stockprice/deletestock
// Update Stock Information -- Sell A Stock
// @access Private

router.post('/deletestock',passport.authenticate('jwt',{session:false}),(req,res)=>{

    let errors={};

    const stocknm=req.body.symbol;
    const stockname=stocknm.toUpperCase();

    //Use API to gather current stock data

    let requestURL='https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+stockname+'&interval=5min&apikey='+apikey;

    let request=new XMLHttpRequest();

    request.open('GET',requestURL,true);


    
    request.onload=function(){

        let stockdata=JSON.parse(request.responseText);
       

        //API is called too much...only can make 5 calls per minute
        if(stockdata.Note!=undefined){
            
             errors.Note='Sorry I Have Limited API Calls For Stock Data...Click Again Soon';
             return res.status(404).json(errors);
        }
        //The symbol entered doesnt exsist
        if(stockdata['Error Message']!=undefined ){
            errors['Error Message']='This Stock Symbol Does Not Exsist';
            return res.status(404).json(errors);
        }

        let stockobj=stockdata['Time Series (5min)'];
        let stockclose=stockobj[Object.keys(stockobj)[0]]['4. close'];


    Profile.findOne({user:req.user.id})
    .then(profile=>{

        
        let stockarr=profile.stockinfo;

        
        function findStock(array, key, value) {
            for (var i = 0; i < array.length; i++) {
                var old=array[i][key].toUpperCase();
                var newval=value.toUpperCase();
                if (old===newval) {
                    return i;
                }
            }
            return null;
        };

        let stocknamekey='stockname';
        const stocknm=req.body.symbol;
        const stockname=stocknm.toUpperCase();

        let found=findStock(profile.stockinfo,stocknamekey,stockname);
        
        if(profile && found==null){
            //Stock Not Found
           errors.notfound="You Don't Currently Own This Stock";
           return res.status(404).json(errors);
        }

        //User is trying to sell stock that they do not have
        if((profile.stockinfo[found].stockcount-req.body.stockcount)<0){
            errors.zero="You Dont Have this Much Stock ";
            return res.status(400).json(errors);
        }

        if(isNaN(req.body.stockcount)===true){
            errors.stockCount='The Ammount Of Stock Needs To Be A Number';
            return res.status(400).json(errors);
        }

        //profile found and stockname is also found...Subtract from users stock count and add to their balance
        if(profile && found!=null){
            //Update Profile Stock Count -- Sold the Stock
           Profile.findOneAndUpdate(
            {user:req.user.id,
             "stockinfo.stockname":stockname
            },
            {$inc:{"stockinfo.$.stockcount":-req.body.stockcount,balance:(stockclose*req.body.stockcount)}},
            {new:true}
           ).then(profile=>res.json(profile));

        }

    });

    };

    request.send();

});
module.exports=router;
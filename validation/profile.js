const Validator=require("validator");
const isEmpty=require('./isEmpty');


module.exports=function validateProfileInput(data){
    let errors={};
    let a=true;
    
    if(isNaN(data.balance)===true){
        errors.balance='Only Use Numbers For Your Balance';
        a=false;
    }
    
    if(data.balance<=0){
        errors.balance='Your Balance Needs To Be Above Zero';
        a=false;
    }

    return{
        errors,
        isValid: a
    }
}
const Validator=require("validator");
const isEmpty=require('./isEmpty');


module.exports=function validateLoginInput(data){
    let errors={};
    let a=true;

   
    if(isEmpty(data.name))
    {
        data.name='';
        a=false;
    }

   if(isEmpty(data.password)){
       data.password='';
       a=false;
   }

    if(Validator.isEmpty(data.name)){
        errors.name='Name Is Required';
        a=false;
    }



    if(Validator.isEmpty(data.password)){
        errors.password='Password is Required';
        a=false;
    }

    return{
        errors,
        isValid: a
    }
}
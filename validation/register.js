const Validator=require("validator");
const isEmpty=require('./isEmpty');


module.exports=function validateRegisterInput(data){
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


    if(!Validator.isLength(data.name,{min:5,max:30})){

        errors.name="Name Must Be Between 5 And 30 Characters";
        a=false;
    }

    if(Validator.isEmpty(data.name)){
        errors.name='Name Is Required';
        a=false;
    }
  


    if(Validator.isEmpty(data.password)){
        errors.password='Password Field Is Required';
        a=false;
    }

    if(!Validator.isLength(data.password,{min:6,max:30})){
        errors.password='Password Must Be At Least 6 Characters';
        a=false;
    }





    return{
        errors,
        isValid: a
    }
}
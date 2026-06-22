


const ValidationComponent = {

    validateEmail  (email)  {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    validateCharacters  (text)  {
      var re = /^[a-z A-Z]+$/;
        return re.test(text);
    },
   validatePhoneNumber(PhoneNumber){
     var phonenumber=/^[0-9]+$/;
     return phonenumber.test(PhoneNumber);
   },
   specialCharaters(specialCharater){
    var specialCharater=/[!@#$%^&*()<>?]/;
    return specialCharater.test(specialCharater);
  }
  };
 module.exports=ValidationComponent;


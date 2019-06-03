
sessionStorage.reg_enable=0;        // initialize, if 1: user can register, -1: already exist email;
sessionStorage.register=0;          // initialize, if 1: registed, -1; failed to register
sessionStorage.reg_AuthYN=0;            // initialize, if 1: registed, -1; failed to register

function check_email(){
    var re2 = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    var email = $("#r-email").val();
    if( email =="") {
        alert("input your email");
    }
    else if(email.match(re2) == null ) {
            alert("this is not email format.");
            //return false;
    } else {    
        Send2Server("EMAIL-CHECK");
        repeat = setInterval(function(){
            if( sessionStorage.reg_enable == -1 ||sessionStorage.reg_enable == 1){
              clearInterval(repeat);
                if (sessionStorage.reg_enable == -1)
                    alert("Email already exist. try again with other email");
                else
                    alert("you can register email");
            }
        },1000);
    }
}

function login_user(){
    if($('#email').val() == '') {
        alert("input email!!!");
        return false;
    }
    if($('#password').val() == '') {
        alert("input password!!!");
        return false;
    }
//    $('#password').val(encryptStr($('#password').val()));
    // if ($("#remember").prop("checked") == false) {
    //     //console.log("remember unchecked!!!");
    //     localStorage.removeItem('email');
    //     localStorage.removeItem('password');
    //     localStorage.removeItem('remember');
    // }
//     else {
//         //console.log("remember checked!!!");
//         localStorage.remember = true;
//         localStorage.email = $('#email').val();
//         localStorage.password = encryptStr($('#password').val());
// //        localStorage.password = $('#password').val();
//     }
//     alert(`remember: ${localStorage.remember }, email: ${localStorage.email}, password: ${localStorage.password}`)
    Send2Server("LOGIN-USER");
    //load user info;
    

//    location.href=sessionStorage.svcURL+"/main.html";
}
    
//custom function handler
function register_1step(){
    // check register form data;
    if(sessionStorage.reg_enable == -1){
        alert("Re-check mail or Try again with other email");
        return false;
    } else if(sessionStorage.reg_enable == 0){
        alert("you should check email!!!");
        return false;
    }

    $('#r2-email').val($('#r-email').val());
    if ( validate() == true) {
        // console.log("name: ", sessionStorage.reg_username);
        // console.log("email: ", sessionStorage.reg_email);
        // console.log("dialCode: ", sessionStorage.reg_dialCode);
        // console.log("phone: ", sessionStorage.reg_phone);
        // console.log("password: ", sessionStorage.reg_password);
        //alert("STEP 2: register PIN Number for trasfering token.");
        register_2step();
        //show_pinModal();
    }    
}
////////////////////////////////////////
function validate() {
    //var re = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;

    //var re = /^[a-zA-Z0-9]{6,20}$/; // 아이디와 패스워드가 적합한지 검사할 정규식
    var re2 = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    
    //var re2 =/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;    
    // 이메일이 적합한지 검사할 정규식
    var re3 = /^[0-9]*$/;       // 폰은 숫자만 입력


    var username = $('#username').val();
    var email = $('#r-email').val();
    var dialCode = sessionStorage.b_dialCode ;
    if( dialCode == undefined)
        dialCode = 82;
    
    var phone = $('#phone').val();
    var pw = $('#r-Password').val();
    var rpw = $('#confirm-password').val();

    if(username=="") {
        alert("Input your name.");
        $('#username').focus();
        return false;
    }

    if(email=="") {
        alert("Input your email.");
        $('#r-email').focus();
        return false;
    }
    
    if (email.match(re2) == null ) {
        alert("this is not email format.");
        return false;
    }

    if(phone=="") {
        alert("Input your phone number");
        $('#phone').focus();
        return false;
    }
    if (phone.match(re3) == null ) {
        alert("Input number only in your phone number.");
        return false;
    }

    if(pw=="") {
        alert("Input your password");
        $('#r-Password').focus();
        return false;
    }
    if(rpw=="") {
        alert("Input your confirm password");
        $('#confirm-password').focus();
        return false;
    }
    if(pw.length < 6) {
         alert("패스워드는 6자 이상입니다.");
         return false; 
    }
    // if(pw.match(re) == null ) {
    //     alert("패스워드는 6~20자의 영문 대소문자와 숫자로만 입력");
    //      return false;
    // }
    if(pw != rpw) {
        alert("비밀번호가 다릅니다. 다시 확인해 주세요.");
        return false;
    }

    sessionStorage.reg_username = username;
    sessionStorage.reg_email = email;
    sessionStorage.reg_dialCode = dialCode;
    sessionStorage.reg_phone = phone;
    sessionStorage.reg_password = pw;
    return true;
}
function register_2step(){
    //alert("name: "+sessionStorage.reg_username+"\n email: "+sessionStorage.reg_email+"\n dialCode: "+sessionStorage.reg_dialCode+"\n phone: "+sessionStorage.reg_phone+"\n password: "+sessionStorage.reg_password+"\n pin: "+sessionStorage.reg_pin);
//    $('#pinModal').modal('hide');
    Send2Server("REGISTER-USER");
    repeat = setInterval(function(){
        if( sessionStorage.register == 1) {
            clearInterval(repeat);
//            alert("success to register");
            sessionStorage.username = sessionStorage.reg_username;
            sessionStorage.email = sessionStorage.reg_email;
            sessionStorage.dialCode = sessionStorage.reg_dialCode;
            sessionStorage.phone = sessionStorage.reg_phone;
            //sessionStorage.password = encryptStr(sessionStorage.reg_password);
            //sessionStorage.pin = sessionStorage.reg_pin;
            show_pinModal();

//            show_AuthModal();
        }
        else if(sessionStorage.register == -1){
            clearInterval(repeat);
            alert("failed to register. try again");
        }
    },1000);
    
    // console.log("name: ", sessionStorage.reg_username);
    // console.log("email: ", sessionStorage.reg_email);
    // console.log("dialCode: ", sessionStorage.reg_dialCode);
    // console.log("phone: ", sessionStorage.reg_phone);
    // console.log("password: ", sessionStorage.reg_password);
    // console.log("pin: ", sessionStorage.reg_pin);
    // email authentication is needed.
    //alert("Registered...save data to db");
    
    //location.href=sessionStorage.svcURL+"/login.html";

}

////////////////////////////////////////

function show_pinModal(){
    // $('#pincode-input1').pincodeInput().data('plugin_pincodeInput').clear();
    // $('#pincode-input2').pincodeInput().data('plugin_pincodeInput').clear();
    $('#pinModal').modal({
        backdrop: 'static',
        keyboard: false,
        'show':true
    });
    $('#registerpin').focus(0);
}

function register_pin(){
    $('#pinModal').modal("hide");
    Send2Server('REGISTER-PIN');
    repeat = setInterval(function(){
        if( sessionStorage.reg_AuthYn == 1) {
            clearInterval(repeat);
//            alert("success to register");
            show_AuthModal();
        }
        else if(sessionStorage.reg_AuthYn == -1){
            clearInterval(repeat);
            alert("Try again after login.");
        }
    },1000);
}

function show_AuthModal(){
    $('#r2-email').val(sessionStorage.email);
    $('#pinModal').modal("hide");
    $('#AuthModal').modal({
        backdrop: 'static',
        keyboard: false,
        'show':true
    });
}

function email_auth_send(){
    //   var myStr = Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, 10); 
    //   var myStr2 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    //   console.log("RAND Str: ", myStr);
    //   console.log("RAND Str2: ", myStr2);
    sessionStorage.reg_eAuth = Math.random().toString().substr(2,5); 
    var to_user = sessionStorage.reg_email;
    var title = 'SECRET Wallet Authentication';
    var msg = `Put this code in SECRET Wallet. <br><br> <h1>${sessionStorage.reg_eAuth}</h1>`;

    data = {"to": to_user, "subject": title, "data": msg};

    Send2Server("EMAIL-AUTH", data);
    alert("check your KEY in your mail: "+sessionStorage.reg_eAuth);
}

function validated_auth_code(){
    if($('#r2-code').val() == sessionStorage.reg_eAuth) {
        alert("your code is validated...");
    } else {
        alert("your code is not validated...");
        return false;
    }
    Send2Server("EMAIL-AUTH-OK");
    // repeat = setInterval(function(){
    //     if( sessionStorage.authYN == 1) {
    //         clearInterval(repeat);
    //         alert("now you can use SECRET wallet");
    //         location.href=sessionStorage.svcURL+"/login.html";
    //     }
    //     else if(sessionStorage.authYN == -1){
    //         clearInterval(repeat);
    //         alert("failed to update. try again");
    //     }
    // },1000);
}

function forgot_password(){
    $('#reset-password-email').val(localStorage.email);
    $('#PasswordResetMail').modal({
        backdrop: 'static',
        keyboard: false,
        'show':true
    });
//    alert("show password resetting modal");
}

function email_password_reset(){
    sessionStorage.reg_resetPWD = Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, 6);
    sessionStorage.reg_email = $('#reset-password-email').val();
    var to_user = sessionStorage.reg_email ;
    var title = 'SECRET Wallet reset password';
    var msg = `This is temporary password. Put this code in SECRET Wallet. <br><br> <h1>${sessionStorage.reg_resetPWD}</h1>`;

    data = {"to": to_user, "subject": title, "data": msg};
    Send2Server("EMAIL-RESET-PWD", data);
    alert("check your KEY in your mail: "+sessionStorage.reg_resetPWD);

}

function check_temp_password(){
    if(sessionStorage.reg_resetPWD == $("#reset-temp-password").val() ) {
        alert("password matched!!!");
        sessionStorage.reg_temp_password=1;
    }
    else {
        alert("password is not matched, try again to get temp password!!!");
        sessionStorage.reg_temp_password=-1;
    }
}

function reset_password() {
    if (sessionStorage.reg_temp_password != 1) {
        alert("confirm temporary password first");
        return;
    }
    sessionStorage.reg_temp_password = 0;
    if( $("#reset-retype-password").val() == $("#reset-retype-password").val()){
        sessionStorage.reg_resetPWD =  $("#reset-retype-password").val();
        Send2Server("RESET-PASSWORD");
    }
    else {
        alert("password is not matched");
    }

}
$(function(){

    // ---- Single pincode input -----
    var loginpin = $('#loginpin').pinlogin({
        fields : 6,
        
        complete : function(pin){
            alert ('Awesome! You entered: ' + pin);
            
            // reset the inputs
            loginpin.reset();
            
            // disable the inputs
            //loginpin.disable();
            
            // further processing here
        },
        
        /* Additional callbacks */
        /*
        invalid : function (field, nr)
        {
            console.log (nr + ' is invalid');
        },
        
        keydown : function (e, field, nr)
        {
            console.log (nr + ' keydown');
        },	

        input : function (e, field, nr)
        {
            console.log (nr + ' input');
        }*/	
        
    });	

    // ---- Pincode input with retype functionality ----- 

    var pincode = '';
    var registerpin = $('#registerpin').pinlogin({
        fields : 6,
        placeholder : '*',
        reset : false,
        //hideinput: false,
        autofocus : true,
        complete : function(pin){

            pincode = pin;
            
            // focus repeat instance 
            registerpinretype.focus(0);
            
            // disable this instance
            //registerpin.disable();					
        }	
    });

    var registerpinretype = $('#registerpinretype').pinlogin({
        fields : 6,
        placeholder : '*',
        reset : false,
        //hideinput: false,
        autofocus : false,
        complete : function(pin){
            
            // compare entered pincodes
            if (pincode != pin)
            {
                pincode = '';

                // reset both instances
                registerpin.reset();
                registerpinretype.reset();
                
                // disable repeat instance
                //registerpinretype.disable(); 
                
                // set focus to first instance again
                registerpin.focus(0);
                
                alert ('PIN codes did not match, please try again');
            }
            else
            {
                sessionStorage.reg_pin = pin;
                //$('#pinModal').modal('hide');
                var ans = confirm (`Don't forget this PIN Number: ${pin}\nGo to next Step?`);
                if(ans) {
                    register_pin();
                }
                
                // reset both instances
                registerpin.reset();
                registerpinretype.reset(); 
                
                // disable both instances
                //registerpin.disable();
                //registerpinretype.disable(); 
                
                // further processing here
            }
        }
    });	
    registerpin.focus(0);
    // disable repeat instance at start
    //registerpinretype.disable();

    // ---- pincode End -----
});


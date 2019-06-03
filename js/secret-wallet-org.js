
sessionStorage.svcURL="http://192.168.2.34";
//sessionStorage.svcURL="http://172.30.1.52";

var TOKEN_BASE_URL = sessionStorage.svcURL+":9001/token";
var USER_BASE_URL = sessionStorage.svcURL+":9001/user";
var MAIL_BASE_URL = sessionStorage.svcURL+":9001/mail";

sessionStorage.reg_enable=0;        // initialize, if 1: user can register, -1: already exist email;
sessionStorage.register=0;          // initialize, if 1: registed, -1; failed to register
//sessionStorage.authYN=0;            // initialize, if 1: registed, -1; failed to register


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
            sessionStorage.password = encryptStr(sessionStorage.reg_password);
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
    $('#PasswordResetMail').modal({
        backdrop: 'static',
        keyboard: false,
        'show':true
    });
//    alert("show password resetting modal");
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


function Send2Server(TYPE, OPT) {
    //alert(TYPE);
    switch(TYPE){
        case "EMAIL-CHECK":
            TxtValue = $('#r-email').val();
            sub_url ="/email-check/"+TxtValue;
            params="";
            
            sendAjax_GET(USER_BASE_URL, sub_url, params,"GET");
            break;
        case "REGISTER-USER":     // Method: PUT
            sub_url = "/register";
            var shaPW = encryptStr(sessionStorage.reg_password);

            data = {name: sessionStorage.reg_username, email: sessionStorage.reg_email, dialCode: sessionStorage.reg_dialCode, phone: sessionStorage.reg_phone, password: shaPW, pin: ""};
            sendAjax_PUT(USER_BASE_URL, sub_url, data, "PUT");
            break;
        case "EMAIL-AUTH":     // Method: PUT
            sub_url = "/email-auth";
            sendAjax_PUT(MAIL_BASE_URL, sub_url, OPT, "PUT");
            break;
        case "EMAIL-AUTH-OK":     // Method: PUT
            sub_url = "/email-auth-ok";
            data = {email: sessionStorage.email};
            sendAjax_PUT(USER_BASE_URL, sub_url, data, "POST");
            break;
        case "REGISTER-PIN":     // Method: PUT
            sub_url = "/register-pin";
            var shaPIN = encryptStr(sessionStorage.reg_pin);
            data = {email: sessionStorage.email, pin: shaPIN};
            sendAjax_PUT(USER_BASE_URL, sub_url, data, "POST");
            break;
        case "LOGIN-USER":
            TxtValue = $('#email').val();
            sub_url ="/login/"+TxtValue;
            //alert(sub_url);
            params="";
            sendAjax_GET(USER_BASE_URL, sub_url, params, "GET");
            break;    
        case "BALANCE-CHECK":        // Method: GET
            TxtValue = sessionStorage.address;
            sub_url ="/balance-check/"+TxtValue;
            params="";
            sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
            //socket.emit('client2server', {TYPE: "ETHER-BALANCE", ADDRESS: TxtValue});
            break;

        case "SECRET-TRANSFER":     // Method: PUT
            selectValue = $('#ID-txType').val();
            TxtFrom = $('#ID-tx_from').val();
            TxtTo = $('#ID-tx_to').val();
            TxtValue = $('#ID-tx_value').val();
            //socket.emit('client2server', {TYPE: "SECRET-TRANSFER", SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue});
            sub_url = "/secret/transfer";
            data = {SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue};
            sendAjax(TOKEN_BASE_URL, sub_url, data, "PUT");
            break;
        case "SECRET-TOKEN-STATUS": // Method: GET
            // alert("SECRET-TOKEN-STATUS");
            sub_url ="/secret/status/";
            params= ""
            sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
            // selectValue =$('#ID-TokenLock').val();
            // socket.emit('client2server', {TYPE: selectValue});
            break;
        
        case "ETHER-TRANSFER":
            selectValue = $('#ID-ETHER_txType').val();
            TxtFrom = $('#ID-ETHER_tx_from').val();
            TxtTo = $('#ID-ETHER_tx_to').val();
            TxtValue = $('#ID-ETHER_tx_value').val();
            //socket.emit('client2server', {TYPE: "ETHER-TRANSFER", SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue});
            sub_url = "/ether/transfer";
            data = {SIGN: selectValue, PKEY: TxtFrom, TO:TxtTo, AMOUNT: TxtValue};
            sendAjax(TOKEN_BASE_URL, sub_url, data, "PUT");
            break;
            

        case "TX-RESULT":
            TxtValue = "txHash";
            sub_url ="/"+TxtValue+"/"+OPT;
            params="";
            //alert(sub_url);
            sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
            //socket.emit('client2server', {TYPE: "ETHER-BALANCE", ADDRESS: TxtValue});
            break;
    
        case "GET-TOKEN-HOLDER":
            sub_url = "/tokenholder";
            params="";
            if(TokenHolderList.length !== 0){
            console.log("Already got TokenHolder!!!, Length: ", TokenHolderList.length);
            } else
            sendAjax_GET(DB_BASE_URL, sub_url, params, "GET");
            break;
    
        case "USER-BALANCE-E":
            TxtValue = $('#ID-ETHER_tx_from').val();
            ret = TokenHolderList.find(c => c.Privatekey === TxtValue);
            //console.log("ret: ", ret);
            console.log("get Address for Ether balance : ", ret.Address);
            sub_url ="/"+ret.Address;
            params="?Token=E";
            sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
            break;
            
        case "USER-BALANCE-S":
            TxtValue = $('#ID-tx_from').val();
            ret = TokenHolderList.find(c => c.Privatekey === TxtValue);
            //console.log("ret: ", ret);
            console.log("get Address for Ether&SECRET balance", ret.Address);
            sub_url ="/"+ret.Address;
            params="?Token=S";
            sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
            break;
    
        case "USER-BALANCE-LIST":
            sub_url ="/HolderBalance";
            data=OPT;
            //alert(data);
            sendAjax(TOKEN_BASE_URL, sub_url, data, "PUT");
            break;
    }
  }
  
  function get_user_balance(){
    console.log("get user balance list!!!!!", TokenHolderList.length);
  
    $("#ID-GET-USER-LIST").val("Waiting for getting date from Ethereum...");
    var AddrList = [];
    for(var i = 0; i < TokenHolderList.length; i++){
      AddrList.push(TokenHolderList[i].Address);
    }
    Send2Server("USER-BALANCE-LIST", AddrList);
    var cnt = 0;
    repeat = setInterval(function(){
        if( $("#ID-GET-USER-LIST").val() == "get Balance List from Ethereum"){
          clearInterval(repeat);
        }
        else {
          cnt++;
          $("#ID-GET-USER-LIST").val(`[${cnt}] sec, waiting for date from Ethereum...`);
        }
    },1000);
  
  }
  
  function sendAjax_PUT(BASE_URL, sub_url, data, METHOD){
    str_data = JSON.stringify(data);
    url = BASE_URL+sub_url;
    var xhr = new XMLHttpRequest();
    //xhr.open(METHOD, url);
    xhr.open(METHOD, url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());

    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(str_data);
    xhr.onload = function(){
      var result = JSON.parse(xhr.responseText);
      dispatch(result); 
      // if (xhr.status >= 200 && xhr.status < 400) {
      //   var result = JSON.parse(xhr.responseText);
      //   dispatch(result);  
      // } else {
      //   console.log("Connected to the server, but it returned an error!!!", xhr.status);
      // }
    }
    xhr.onerror = function(){
      console.error("Cannot Connect to server!!!");
    }
  
  
    // xhr.addEventListener('load', function(){
    //   var result = JSON.parse(xhr.responseText);
    //   // console.log("===============================");
    //   // console.log("Received: ", xhr.responseText);
    //   // console.log("===============================");
    //   // console.log("Received2: ", result[0].Name);
    //   // console.log("Received3: ", result[1].value);
    //   // console.log("Received4: ", result[1].msg);
    //   dispatch(result);
    // });
  }
  
  function sendAjax_GET(BASE_URL, sub_url, params, METHOD)  {
    //console.log(sub_url);
    url = BASE_URL+sub_url+params;
    var xhr = new XMLHttpRequest();
    //xhr.open(METHOD, url);
    xhr.open(METHOD, url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.onload = function(){
      var result = JSON.parse(xhr.responseText);
      dispatch(result);  
  
      // if (xhr.status >= 200 && xhr.status < 400) {
      //   var result = JSON.parse(xhr.responseText);
      //   dispatch(result);  
      // } else {
      //   console.log("Connected to the server, but it returned an error!!!", xhr.status);
      // }
    }
    xhr.send();

    //  xhr.onreadystatechange = function(){
    //   if(xhr.readyState ===4 && xhr.status === 200){
    //     var result = JSON.parse(xhr.responseText);
    //     dispatch(result);
    //   }
    // }
    xhr.onerror = function(){
      console.error("Cannot Connect to server!!!");
    }
   
  }

  function dispatch(data) {
    //alert(data[0].Name);
    switch(data[0].Name){
        case "EMAIL-CHECK":
            if(data[1].value.length <= 2)
                sessionStorage.reg_enable=1;
                //alert("user is not exist"+data[1].value);
            else
                sessionStorage.reg_enable=-1;
                //alert("user exist"+data[1].value.length);
            break;
        case "REGISTER-USER":
            if(data[0].CODE == 200 && data[1].value !== ""){
                sessionStorage.register = 1;
            }
            else {
                sessionStorage.register = -1;
            }
            break;
        case "EMAIL-AUTH-OK":
            if(data[0].CODE == 200 && data[1].value !== ""){
                location.href=sessionStorage.svcURL+"/login.html";
            }
            else {
                alert("failed to update. try again");
            }
            break;
        case "LOGIN-USER":
            if(data[0].CODE == 200 && data[1].value !== ""){
                ret = JSON.parse(data[1].value);
                sessionStorage.username = ret[0].name;
                sessionStorage.email    = ret[0].email;
                sessionStorage.dialCode = ret[0].DialCode;
                sessionStorage.phone    = ret[0].phone;
                sessionStorage.password = ret[0].passwd;
                sessionStorage.pin      = ret[0].pin;
                sessionStorage.address  = ret[0].ethereumaddress;
                sessionStorage.privateKey = ret[0].privateKey;
                sessionStorage.txYN     = ret[0].tx_yn;
                sessionStorage.AuthYn   = ret[0].AuthYn;
               
                console.log("name: ",  sessionStorage.username);
                console.log("email: ", sessionStorage.email);
                console.log("DialCode: ", sessionStorage.dialCode);
                console.log("phone: ", sessionStorage.phone);
                console.log("passwd: ", sessionStorage.password);
                console.log("pin: ", sessionStorage.pin);
                console.log("ethereumaddress: ", sessionStorage.address);
                console.log("privateKey: ", sessionStorage.privateKey);
                console.log("tx_yn: ", sessionStorage.txYN);
                console.log("AuthYn: ", sessionStorage.AuthYn);
                ///////////////////////////
                console.log("type of localStorage.email: ", localStorage.email);
                console.log("password: ", $('#password').val());
                console.log("encrypted password: ",  encryptStr($('#password').val()));

                if( sessionStorage.password == encryptStr($('#password').val()) ) {
                    // if( sessionStorage.password == (typeof localStorage.username !== 'undefined' ? $('#password').val() : encryptStr($('#password').val())) ) {
                        //if(typeof localStorage.email == 'undefined' && $("#remember").prop("checked") == true) {  // it is first time connection     
                    if($("#remember").prop("checked") == true) {  // it is first time connection     
                        localStorage.remember = true;
                        localStorage.email = $('#email').val();
                        //localStorage.password = encryptStr($('#password').val());
                    }
                    if($("#remember").prop("checked") == false){
                        //console.log("remember unchecked!!!");
                        localStorage.removeItem('email');
                        localStorage.removeItem('remember');
                        // localStorage.removeItem('password');
                        console.log("localstorage is cleared!!!");
                    }
                    gotoMainPage();
                    console.log("goto mainpage");
                } 
                else {
                    alert("password is not matched. try again");
                    // localStorage.removeItem('password');
                }
            }
            else {
                alert("Syntax error or system error");
            }
            break;
        case "BALANCE-CHECK":
            if(data[0].CODE == 200 && data[1].value !== ""){
                ret = data[1].value;
                // console.log(data[1].value);
                sessionStorage.balance_ether = ret.ETHER;
                sessionStorage.balance_secret = ret.SECRET;
                // console.log(ret);
                // console.log(sessionStorage.balance_ether);
                // console.log(sessionStorage.balance_secret);
                $('#SECRET_Balance').val(toCommas(sessionStorage.balance_secret));
                $('#ETHER_Balance').val(toCommas(sessionStorage.balance_ether));
            }
            break;
        case "REGISTER-PIN":
            if(data[0].CODE == 200 && data[1].value !== ""){
                if(sessionStorage.AuthYn !== 'Y') {
                    show_AuthModal();
                }
            }
            break;
        default:
   //     alert(data[0].Name);
    }
  }

  $("#password").keyup(function(e){if(e.keyCode == 13)  login_user(); });


출처: https://cofs.tistory.com/12 [CofS]
  function encryptStr(rawStr){
      return CryptoJS.SHA256(rawStr).toString();
  }

  function gotoMainPage(){
       location.href=sessionStorage.svcURL+"/main.html";
  }

  
  function gotoLoginPage(){
    location.href=sessionStorage.svcURL+"/login.html";
}

function logout(){
    sessionStorage.removeItem('username');
    gotoLoginPage();
}

// utility
function toCommas(value) {
//    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
  
  
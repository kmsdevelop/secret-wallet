
sessionStorage.svcURL="http://192.168.2.34";
//sessionStorage.svcURL="http://172.30.1.52";
//sessionStorage.svcURL="http://192.168.1.102";
var TOKEN_BASE_URL = sessionStorage.svcURL+":9001/token";
var USER_BASE_URL = sessionStorage.svcURL+":9001/user";
var MAIL_BASE_URL = sessionStorage.svcURL+":9001/mail";

function encryptStr(rawStr){
    return CryptoJS.SHA256(rawStr).toString();
}

function gotoMainPage(){
    location.href=sessionStorage.svcURL+"/main.html";
}

function gotoLoginPage(){
location.href=sessionStorage.svcURL+"/login.html";
}

function gotoViewPage(Token){
    location.href=sessionStorage.svcURL+"/view.html?Token="+Token;
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
    xhr.send();
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
        case "EMAIL-RESET-PWD":
            sub_url = "/email-reset-pwd";
            sendAjax_PUT(MAIL_BASE_URL, sub_url, OPT, "PUT");
            break;
        case "RESET-PASSWORD":
            sub_url = "/reset-password";
            var shaPIN = encryptStr(sessionStorage.reg_resetPWD);
            data = {email: sessionStorage.reg_email, password: shaPIN};
            sendAjax_PUT(USER_BASE_URL, sub_url, data, "POST");
            break;
    
        case "LOGIN-USER":
            TxtValue = $('#email').val();
            sub_url ="/login/"+TxtValue;
            params="";
            sendAjax_GET(USER_BASE_URL, sub_url, params, "GET");
            break;    
        case "BALANCE-CHECK":        // Method: GET
            TxtValue = sessionStorage.address;
            sub_url ="/balance-check/"+TxtValue;
            params="";
            sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
            break;
        case "TOKEN-TX":
            sub_url = "/token-tx";
            sendAjax_PUT(TOKEN_BASE_URL, sub_url, OPT, "PUT");
            break;
        case "TX-LIST":
            sub_url ="/tx-list/"+sessionStorage.address;
            params=`?token=${sessionStorage.currentToken}&row=0`;
            // alert(sub_url+"?"+params);
            sendAjax_GET(TOKEN_BASE_URL, sub_url, params, "GET");
            break;
        /////////////////////////////////////////////
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
                gotoLoginPage();
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
                sessionStorage.balance_ether = parseFloat(ret.ETHER).toFixed(5);
                sessionStorage.balance_secret = parseFloat(ret.SECRET).toFixed(5);
                // console.log(ret);
                // console.log(sessionStorage.balance_ether);
                // console.log(sessionStorage.balance_secret);
                $('#SECRET_Balance').val(toCommas(sessionStorage.balance_secret));
                $('#ETHER_Balance').val(toCommas(sessionStorage.balance_ether));
            }
            break;
        case "REGISTER-PIN":
            if(data[0].CODE == 200 && data[1].value !== ""){
                sessionStorage.reg_AuthYn = 1;
            }
            else {
                sessionStorage.reg_AuthYn = -1;
            }
            break;
        case "RESET-PASSWORD":
            if(data[0].CODE == 200 && data[1].value !== ""){
                alert("password changed successfully");
                $('#PasswordResetMail').modal('hide');
            }
            else {
                alert("call to administrator");
            }
            break;
        case "TOKEN-TX":
            // console.log(data[1].value.transactionHash);
            // console.log(data[1].value.status);
            postTransactionProcess(data[1].value);
            if(data[0].CODE == 200 && data[1].value !== ""){
                //alert("Tx successfully: ");//+data[1].value.status+", ["+data[1].value[0].transactionHash+"]");
//                ret = JSON.parse(data[1].value);
            }
            else {
                //alert("call to administrator: ");
            }
            // $('#confirmSendPin').modal('hide');
            // gotoMainPage();
            break;
        case "TX-LIST":
            if(data[0].CODE == 200 && data[1].value !== ""){
                // aa = JSON.parse();
                showListTX(data[1].value);
            }

            break;
        default:
   //     alert(data[0].Name);
    }
}

function showListTX(TxList){
    console.log("Tx Length: ", TxList.length);
    console.log("TxList]: ", TxList);
    console.log("TxList[0].token: ", TxList[0].token);
    console.log("TxList[0].from: ", TxList[0].from_addr);
    console.log("TxList[0].to: ", TxList[0].to_addr);
    console.log("TxList[0].amount: ", TxList[0].amount);
    console.log("TxList[0].hash: ", TxList[0].hash);
    var d = new Date(TxList[0].date);
    d.toLocaleString();
    console.log("TxList[0].date: ", d.toLocaleString());
    // <thead><tr>
    // <th scope="cols" width=30%>Date</th>
    // <th scope="cols" width=50%>To</th>
    // <th scope="cols" width=20% >Amount</th>
    // </tr></thead>
    // <tbody id="ID-TxList-TBODY"></tbody>
    for(var i = 0; i < TxList.length; i++){
        var d = new Date(TxList[i].date);
        if(sessionStorage.address == TxList[i].to_addr) {
            amount = "+"+toCommas(TxList[i].amount);    // Coin In
            address = TxList[i].from_addr;
        }
        else {
            amount = "-"+toCommas(TxList[i].amount);        // Coin Out
            address = TxList[i].to_addr;
        }
        if(TxList[i].status!==true) {
            tColor="red";
            address = "[FAIL] "+address;
        }
        else
            tColor='black';
        $("#ID-TxList-TABLE > tbody:first").append(`<tr>
        <td style="padding-left:5px;word-break:break-all;font-size:10px;color:${tColor};text-align:left;padding:0;" ">${d.toLocaleString()}</td>
        <td class="text-truncate" style="word-break:break-all;font-size:10px;color:${tColor};text-align:left;padding:0;" >${address}</td>
        <td style="word-break:break-all;font-size:12px;color:${tColor};text-align:right;padding-right:10px;padding:0;">${amount}</td></tr>`);
    }    
}
function postTransactionProcess(tx_result_data){
    // console.log("hash: ", tx_result_data.transactionHash);
    // console.log("status: ", tx_result_data.status);
    $("#tx_hash").text(tx_result_data.transactionHash);
    if(tx_result_data.status == true || tx_result_data.status == 1)
        $("#tx_result").text("Success");
    else
        $("#tx_result").text("Fail");
    $("#before_tx_title").hide();
    $("#after_tx_title").show();
    $("#tokenSend_Cancel").hide();
    $("#tokenSend_Button").hide();
    $("#tokenSend_gotoMain").show();
    $("#tokenTx_button").show();
    // $('#confirmSendPin').modal('hide');
    // gotoMainPage();
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


function SecretTerms(){
    switch(sessionStorage.lang){
        case 'kor':
            file = "viewTermsInc_kor.html";
            break;
        case 'eng':
            file = "viewTermsInc_eng.html";
            break;
        default:
            file = "viewTermsInc.html";
    }
    location.href = "./file/"+file;
}

function MyLang(lang){
    sessionStorage.lang= lang;

}
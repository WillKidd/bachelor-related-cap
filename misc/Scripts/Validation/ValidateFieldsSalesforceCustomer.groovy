import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;
import groovy.json.JsonOutput

def Message processData(Message message) {
    def json = message.getBody(java.io.Reader);
    def data = new JsonSlurper().parse(json);
    def baseErrorMsg = ["Validation error: ", " is required but was not provided."];
    def errorMsg;
    if (!data.firstName || data.firstName.isEmpty()){
        errorMsg = "First Name";
    } else if (!data.lastName || data.lastName.isEmpty()){
        errorMsg = "Last Name";
    } else if (!data.email || data.email.isEmpty()){
        errorMsg = "Email";
    } else if (!data.phone){
        errorMsg = "Phone Number";
    } else if (!data.billingAddress && !data.billingAddress_ID){
        errorMsg = "Billing Address";
    }
    if (!!errorMsg){
        throw new Exception(baseErrorMsg[0] + errorMsg + baseErrorMsg[1]);
    }
    return message;
}
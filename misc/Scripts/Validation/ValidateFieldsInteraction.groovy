import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;
import groovy.json.JsonOutput

def Message processData(Message message) {
    def json = message.getBody(java.io.Reader);
    def data = new JsonSlurper().parse(json);
    def baseErrorMsg = ["Validation error: ", " is required but was not provided."];
    def validInteractionTypes = ['call', 'email', 'meeting', 'socialMedia', 'web'];
    def errorMsg;
    if (!data.customer_ID){
        errorMsg = "Customer ID";
    } else if (!data.date){
        errorMsg = "Date";
    } else if (!data.type || !validInteractionTypes.contains(data.type)){
        errorMsg = "Type (valid values: call, email, meeting, socialMedia, web)";
    } else if (!data.details || data.details.isEmpty()){
        errorMsg = "Details";
    }
    if (errorMsg){
        throw new Exception(baseErrorMsg[0] + errorMsg + baseErrorMsg[1]);
    }
    return message;
}
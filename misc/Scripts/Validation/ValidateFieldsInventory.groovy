import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;
import groovy.json.JsonOutput

def Message processData(Message message) {
    def json = message.getBody(java.io.Reader);
    def data = new JsonSlurper().parse(json);
    def baseErrorMsg = ["Validation error: ", " is required but was not provided."];
    def errorMsg;
    if (!data.product_ID){
        errorMsg = "Product ID";
    } else if (!data.location || data.location.isEmpty()){
        errorMsg = "Location";
    } else if (data.quantity == null){
        errorMsg = "Quantity";
    }
    if (errorMsg){
        throw new Exception(baseErrorMsg[0] + errorMsg + baseErrorMsg[1]);
    }
    return message;
}
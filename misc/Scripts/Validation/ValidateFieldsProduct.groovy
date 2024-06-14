import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;
import groovy.json.JsonOutput

def Message processData(Message message) {
    def json = message.getBody(java.io.Reader);
    def data = new JsonSlurper().parse(json);
    def baseErrorMsg = ["Validation error:", "is required but was not provided."];
    def errorMsg;
    if (!data.name || data.name.isEmpty()){
        errorMsg = baseErrorMsg[0] + " Product Name " + baseErrorMsg[1];
    } else if (!data.price){
        errorMsg = baseErrorMsg[0] + " Product Price " + baseErrorMsg[1];
    }
    if (!!errorMsg){
        throw new Exception(errorMsg);
    }
    return message;
}
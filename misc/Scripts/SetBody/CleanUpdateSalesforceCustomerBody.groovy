import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;
import groovy.json.JsonOutput;

def Message processData(Message message) {
    def json = message.getBody(java.io.Reader);
    def data = new JsonSlurper().parse(json);
    def map = [:];
    for ( field in data ) {
        if (!!field && !!field.value){
            if(field.key != "@odata.context" && field.key != "ID" && field.key != "salesforceCustomerID")
            map.put(field.key, field.value); 
        }
    }

    def customerJson = JsonOutput.toJson(map);
    message.setBody(customerJson);
    return message;
}
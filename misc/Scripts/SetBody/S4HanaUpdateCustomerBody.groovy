import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;
import groovy.json.JsonOutput;

def Message processData(Message message) {
    def json = message.getBody(java.io.Reader);
    def data = new JsonSlurper().parse(json);
    def hashmap = [
        salesforceCustomerID : data.ID,
        firstName            : data.firstName,
        lastName             : data.lastName,
        email                : data.email,
        phone                : data.phone,
        billingAddress       : data.billingAddress,
        billingAddress_ID: data.billingAddress_ID
    ];
    def submap = hashmap.findAll { 
        it.value == null 
    };
    submap.each{
        hashmap.remove(it.key);
    }
    def customerJson = JsonOutput.toJson(hashmap);
    
    message.setBody(customerJson);
    return message;
}
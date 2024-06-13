import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;
import groovy.json.JsonOutput;

def Message processData(Message message) {
    message.setHeader("Content-Type", "application/json");

    def jsonStr = message.getProperty("persistedMessageBody");
    def data = new JsonSlurper().parseText(jsonStr);
    def customerJson = JsonOutput.toJson([
        ID                   : data.ID,
        salesforceCustomerID : data.salesforceCustomerID,
        firstName            : data.firstName,
        lastName             : data.lastName,
        email                : data.email,
        phone                : data.phone,
        billingAddress       : data.billingAddress
    ])
    message.setBody(customerJson);
    return message;
}
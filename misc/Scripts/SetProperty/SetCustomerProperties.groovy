import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;

def Message processData(Message message) {
    def json = message.getBody(java.io.Reader);
    def data = new JsonSlurper().parse(json);
    message.setProperty("SalesforceCustomerID", data.salesforceCustomerID);
    message.setProperty("CustomerID", data.customerID)
   "firstName"
   "lastName"
   "email"
   "phone"
   "billingAddress"
   "billingAddress_ID"
    return message;
}
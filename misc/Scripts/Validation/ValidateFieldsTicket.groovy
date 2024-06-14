import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;
import groovy.json.JsonOutput

def Message processData(Message message) {
    def json = message.getBody(java.io.Reader);
    def data = new JsonSlurper().parse(json);
    def baseErrorMsg = ["Validation error: ", " is required but was not provided."];
    def validTicketStatuses = ['open', 'inProgress', 'resolved', 'closed'];
    def errorMsg;
    if (!data.customer_ID){
        errorMsg = "Customer ID";
    } else if (!data.type || !['question', 'issue', 'request'].contains(data.type)){
        errorMsg = "Type (valid values: question, issue, request)";
    } else if (!data.subject || data.subject.isEmpty()){
        errorMsg = "Subject";
    } else if (!data.description || data.description.isEmpty()){
        errorMsg = "Description";
    } else if (!data.status || !validTicketStatuses.contains(data.status)){
        errorMsg = "Status (valid values: open, inProgress, resolved, closed)";
    } else if (!data.priority || data.priority.isEmpty()){
        errorMsg = "Priority";
    } else if (data.status == "open" && !data.createdOn){
        errorMsg = "Created On";
    } else if (data.status == "resolved" && !data.resolvedOn){
        errorMsg = "Resolved On";
    }
    if (errorMsg){
        throw new Exception(baseErrorMsg[0] + errorMsg + baseErrorMsg[1]);
    }
    return message;
}
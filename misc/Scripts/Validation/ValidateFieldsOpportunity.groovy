import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;
import groovy.json.JsonOutput

def Message processData(Message message) {
    def json = message.getBody(java.io.Reader);
    def data = new JsonSlurper().parse(json);
    def baseErrorMsg = ["Validation error: ", " is required but was not provided."];
    def validOpportunityTypes = ['newBusiness', 'upsell', 'crossSell', 'renewal'];
    def validOpportunityStages = ['initialContact', 'needsAnalysis', 'proposal', 'negotiation', 'decision', 'closedWon', 'closedLost'];
    def errorMsg;
    if (!data.customer_ID){
        errorMsg = "Customer ID";
    } else if (!data.type || !validOpportunityTypes.contains(data.type)){
        errorMsg = "Type (valid values: newBusiness, upsell, crossSell, renewal)";
    } else if (!data.name || data.name.isEmpty()){
        errorMsg = "Name";
    } else if (!data.stageName || !validOpportunityStages.contains(data.stageName)){
        errorMsg = "Stage Name (valid values: initialContact, needsAnalysis, proposal, negotiation, decision, closedWon, closedLost)";
    } else if (!data.closeDate){
        errorMsg = "Close Date";
    } else if (data.potentialRevenue == null){
        errorMsg = "Potential Revenue";
    }
    if (errorMsg){
        throw new Exception(baseErrorMsg[0] + errorMsg + baseErrorMsg[1]);
    }
    return message;
}
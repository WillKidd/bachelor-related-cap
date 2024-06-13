import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;
import groovy.json.JsonOutput

def Message processData(Message message) {

    def messageLog = messageLogFactory.getMessageLog(message);
    Exception exception = message.getProperty("CamelExceptionCaught");
    
    if (!!exception){
        def errorMsg = "Error occured in Integration Flow: " + exception.message;
        messageLog.addAttachmentAsString("ErrorMsg", errorMsg, "text/plain");
    }
    
    return message;
}
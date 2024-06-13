import com.sap.gateway.ip.core.customdev.util.Message;
import java.util.HashMap;
import groovy.json.JsonSlurper;

def Message processData(Message message) {
    message.setProperty("persistedMessageBody", message.getBody(String));
    return message;
}
import com.sap.gateway.ip.core.customdev.util.Message

def Message processData(Message message) {
    message.setHeader("Content-Type", "application/json");
    return message;
}
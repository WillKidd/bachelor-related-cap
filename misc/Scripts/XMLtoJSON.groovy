import com.sap.gateway.ip.core.customdev.util.Message
import groovy.json.JsonOutput
import groovy.util.XmlSlurper

def Message processData(Message message) {
    def xmlPayload = message.getBody(String)
    
    def xmlParsed = new XmlSlurper().parseText(xmlPayload)
    
    def jsonContent = convertXmlToJson(xmlParsed)
    def jsonString = JsonOutput.toJson(jsonContent)
    
    message.setBody(jsonString)
    
    def headers = message.getHeaders()
    headers.put("Content-Type", "application/json")
    message.setHeaders(headers)
    
    return message
}

def convertXmlToJson(node) {
    def result = [:]
    node.children().each { child ->
        if (child.children().size() > 0) {
            result[child.name()] = convertXmlToJson(child)
        } else {
            result[child.name()] = child.text()
        }
    }
    return result
}
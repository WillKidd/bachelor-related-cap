import com.sap.gateway.ip.core.customdev.util.Message
import groovy.xml.*

def Message processData(Message message) {
  def sourceXmlStr = message.getBody(String);
  def rootNode = new XmlParser().parseText(sourceXmlStr);

  def payloadChildren = rootNode.payload[0].children()

  def newRoot = new Node(null, "root")

  payloadChildren.each { child ->
    newRoot.append(child)
  }

  def sw = new StringWriter()
  def printer = new XmlNodePrinter(new IndentPrinter(sw))
  printer.print(newRoot)
  def xmlString = sw.toString()

  message.setBody(xmlString);
  return message;
}
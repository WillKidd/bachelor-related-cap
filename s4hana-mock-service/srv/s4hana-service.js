const cds = require('@sap/cds')
module.exports = function (){

  this.on("submitOrder", async (req)=>{
    const {customerID, items} = req.data;

    const customer = await cds.run(SELECT.one.from('mock.test.s4hana.Customers').where({ID: customerID}));

    if(!customer){
      throw new Error('Customer not found!');
    }

    
    let totalAmount = 0;
    for (const item of items){
      const product = await cds.run(SELECT.one.from('mock.test.s4hana.Products').where({ID: item.product_ID}));
      const inventory = await cds.run(SELECT.one.from('mock.test.s4hana.Inventory').where({product_ID: product.ID}));
      
      if (item.quantity > inventory.quantity){
        throw new Error('Item quantity exceed inventory!');
      }
      else {
        const newQuantity = inventory.quantity - item.quantity;
        console.log(newQuantity);
        await cds.run(UPDATE.entity('mock.test.s4hana.Inventory').where({ID: inventory.ID}).with({quantity: newQuantity}));
      }

      totalAmount+= product.price * item.quantity;
    }


    const Order = {
      customer_ID: customerID,
      orderDate: new Date().toISOString(),
      totalAmount: totalAmount,
      status: 'Pending',
      items: items
    };

    const createOrder = await cds.run(INSERT.into('mock.test.s4hana.Orders').entries(Order));
    }
  ); // submitOrder

  this.on("cancelOrder", async (req)=>{
    const {orderID} = req.data;
    const order = await cds.run(SELECT.one.from('mock.test.s4hana.Orders').where({ID: orderID}));
    if (order.status !== "Pending"){
      throw new Error('Order can\'t be canceled!');
    }
    else{
      await cds.run(DELETE.from('mock.test.s4hana.Orders').where({ID: orderID}));
    }
  }); // cancelOrder
}
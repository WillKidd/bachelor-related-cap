const cds = require('@sap/cds')
module.exports = function (){

  this.on("submitOrder", async (req)=>{
    const {customerID, items} = req.data;
    console.log(items);

    const customer = await cds.run(SELECT.one.from('mock.test.s4hana.Customers').where({ID: customerID}));

    if(!customer){
      throw new Error('Customer not found!');
    }

    
    let totalAmount = 0;
    for (const item of items){
      const product = await cds.run(SELECT.one.from('mock.test.s4hana.Products').where({ID: item.product_ID}));
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
  )
}
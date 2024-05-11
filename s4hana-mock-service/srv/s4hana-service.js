const cds = require('@sap/cds')
module.exports = function (){
  this.on('submitOrder', async (req)=>{
    const {customerID, items} = req.data;
    
    const tx = cds.transaction(req);

    const customerEntity = await tx.run(SELECT.from('mock.test.s4hana.Customers').where({ID: customerID}));

    if (!customerEntity){
      throw new Error('Customer not found!');
    }

    let totalAmount = 0;
    for (const item of items){
      const productEntity = await tx.run(SELECT.from('mock.test.s4hana.Products').where({ID: item.productID}))

      if (!productEntity){
        throw new Error('Product not found!');
      }
      totalAmount+= productEntity.price * item.quantity;
    }

    const newOrder = {
      customerID: customerID,
      orderDate: new Date(),
      totalAmount: totalAmount,
      status: 'Pending',
      items:items
    };

    const createOrder = await tx.run(INSERT.into('mock.test.s4hana.Orders').entries(newOrder));
    await tx.commit();
    return createOrder;
  })
}
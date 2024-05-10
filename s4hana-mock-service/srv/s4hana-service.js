const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
  const { Products, Inventory, Orders, OrderItems, FinancialData, Customers } = this.entities;


// Custom request method to create an order with order items
this.on('POST', 'Orders', async req => {
    const { customerID, orderDate, totalAmount, status, items } = req.data;
    const order = await INSERT.into(Orders).entries({ customerID, orderDate, totalAmount, status });
  
    if (items && Array.isArray(items)) {
    console.log(Array.isArray(items))
      const orderItems = items.map(item => ({ ...item, orderId: order.ID }));
      await INSERT.into(OrderItems).entries(orderItems);
    }
  
    return order;
  });

  // Custom request method to get financial data for a specific period
  this.on('GET', 'FinancialData', async req => {
    const period = req.data.period;
    return await SELECT.from(FinancialData).where({ period });
  });

  // Business logic to update inventory when an order is placed
  this.after('CREATE', 'Orders', async (data, req) => {
    const { items } = data;
    for (const item of items) {
      const { productID, quantity } = item;
      await UPDATE(Inventory).where({ productID }).set({ quantity: { '-=': quantity } });
    }
  });
});
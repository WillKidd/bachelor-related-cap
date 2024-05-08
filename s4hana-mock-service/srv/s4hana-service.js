const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { Products, Inventory, Orders, FinancialData } = this.entities;

  // Abrufen von Produkten und deren Lagerbestand
  this.on('READ', Products, async (req, next) => {
    const results = await next();
    await Promise.all(results.map(async (product) => {
      const inventory = await SELECT.one.from(Inventory).where({ productID: product.ID });
      product.availability = inventory ? inventory.quantity > 0 : false;
    }));
    return results;
  });

  // Handler für das Erstellen einer Bestellung
  this.on('createOrder', async (req) => {
    const { items, customerID } = req.data;

    if (!items || items.length === 0) {
      return req.reject(400, 'No products specified in the order');
    }

    // Starten einer Transaktion
    const tx = cds.transaction(req);

    // Überprüfen der Lagerbestände und Reservieren der Produkte
    await Promise.all(items.map(async item => {
      const inventory = await tx.run(SELECT.one.from(Inventory).where({ productID: item.productID }));
      if (!inventory || inventory.quantity < item.quantity) {
        req.reject(409, `Insufficient stock for product ID: ${item.productID}`);
      }
      await tx.run(UPDATE(Inventory).set({ quantity: inventory.quantity - item.quantity }).where({ productID: item.productID }));
    }));

    // Erstellen der Bestellung
    const order = {
      customerID: customerID,
      orderDate: new Date(),
      totalAmount: items.reduce((acc, item) => acc + item.quantity * item.price, 0),
      status: 'in progress',
    };
    const createdOrder = await tx.run(INSERT.into(Orders).entries(order));

    // Erstellen der OrderItems
    const orderItems = items.map(item => ({
      orderId: createdOrder.ID,
      productID: item.productID,
      quantity: item.quantity,
      price: item.price,
    }));
    await tx.run(INSERT.into(OrderItems).entries(orderItems));

    /*// Aktualisieren der Finanzdaten
    const financialData = await tx.run(SELECT.one.from(FinancialData).where({ period: 'current' }));
    if (financialData) {
      const newRevenue = financialData.revenue + order.totalAmount;
      await tx.run(UPDATE(FinancialData).set({ revenue: newRevenue }).where({ period: 'current' }));
    }*/

    return `Order ${createdOrder.ID} has been successfully created.`;
  });

  // Abbrechen von Bestellungen im Status "in progress"
  this.on('cancelOrder', async (req) => {
    const { orderId } = req.data;
    const tx = cds.transaction(req);

    // Bestellung abfragen
    const order = await tx.run(SELECT.one.from(Orders).where({ ID: orderId }));
    if (!order) {
      req.reject(404, 'Order not found');
    } else if (order.status !== 'in progress') {
      req.reject(400, 'Order can only be cancelled if it is in progress');
    } else {
      // Abrufen der OrderItems für die zu stornierende Bestellung
      const items = await tx.run(SELECT.from(OrderItems).where({ orderId: orderId }));

      // Lagerbestand für jedes Produkt in den OrderItems aktualisieren
      await Promise.all(items.map(async (item) => {
        const inventory = await tx.run(SELECT.one.from(Inventory).where({ productID: item.productID }));
        if (inventory) {
          await tx.run(UPDATE(Inventory).set({ quantity: inventory.quantity + item.quantity }).where({ productID: item.productID }));
        }
      }));

      // Aktualisieren des Bestellstatus auf 'cancelled'
      await tx.run(UPDATE(Orders).set({ status: 'cancelled' }).where({ ID: orderId }));
      return `Order ${orderId} has been successfully cancelled.`;
    }
  });

 /* // Konsistenz zwischen Inventory und FinancialData sicherstellen
  this.after(['CREATE', 'UPDATE'], OrderItems, async (data, req) => {
    const orderItem = req.data;
    const inventory = await SELECT.one.from(Inventory).where({ productID: orderItem.productID });
    if (inventory && inventory.quantity >= orderItem.quantity) {
      // Aktualisieren Sie den Lagerbestand
      await UPDATE(Inventory).set({ quantity: inventory.quantity - orderItem.quantity }).where({ productID: orderItem.productID });
    } else {
      req.reject(409, 'Insufficient stock');
    }

    // Update FinancialData für Umsatz
    const financialData = await SELECT.one.from(FinancialData).where({ period: 'current' });
    if (financialData) {
      const newRevenue = financialData.revenue + (orderItem.quantity * orderItem.price);
      await UPDATE(FinancialData).set({ revenue: newRevenue }).where({ period: 'current' });
    }
  });*/
});
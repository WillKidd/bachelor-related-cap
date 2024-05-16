const cds = require("@sap/cds"); // Assuming you're using @sap/cds

const OrderStatus = {
  CREATED: 'Created',
  PENDING: 'In Process',
  SHIPPED: 'Shipped',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service
  const { Products, Inventory, Orders, OrderItems, FinancialData, Customers } =
    db.entities;
  console.log("test");
  async function checkInventory(productID, requiredQuantity, tx) {
    const inventory = await tx.run(
      SELECT.one.from(Inventory).where({ product_ID: productID })
    );

    if (!inventory || inventory.quantity < requiredQuantity) {
      throw new Error("Item quantity exceeds inventory!");
    }
    const newQuantity = inventory.quantity - requiredQuantity;
    return newQuantity;
  }

  async function updateInventory(productID, newQuantity, tx) {
    await tx.run(
      UPDATE.entity(Inventory)
        .where({ product_ID: productID })
        .with({ quantity: newQuantity })
    );
  }

  async function getProduct(productID, tx) {
    const product = await tx.run(SELECT.one.from(Products).where({ ID: productID }));
    if (!product){
      throw new Error("Product not found!");
    }
    return product;
  }

  async function getCustomer(customerID, tx) { 
    const customer = await tx.run(SELECT.one.from(Customers).where({ ID: customerID }));
    if (!customer) {
      throw new Error("Customer not found!");
    }
    return customer;
  }

  async function updateCustomer(customerID, data, tx) {
    await tx.run(UPDATE.entity(Customers).where({ ID: customerID }).data(data));
  }

  async function getOrder(orderID, tx) {
    const order = await tx.run(SELECT.one.from(Orders).where({ ID: orderID }));
    if (!order) {
      throw new Error("Order not found!");
    }
    return order;
  }

  async function addOrder(order, tx) {
    await tx.run(INSERT.into(Orders).entries(order));
  }

  async function deleteOrder(orderID, tx) {
    await tx.run(DELETE.from(Orders).where({ ID: orderID }));
  }

  async function updateOrder(orderID, data, tx) {
    await tx.run(UPDATE.entity(Orders).where({ ID: orderID }).data(data));
  }

  async function getOrderItems(orderID, tx) {
    const orderItems = await tx.run(SELECT.from(OrderItems).where({ order_ID: orderID }));
    if (!orderItems){
      throw new Error("No OrderItems found for Order: " + orderID );
    }
    return orderItems;
  }

  // Customer related actions and function
  this.on("updateCustomerData", async (req) => {
    const { customerID, data } = req.data;
    try {
      await cds.tx(async (tx) => {
        return await updateCustomer(customerID, data, tx);
      });
    } catch (error) {
      console.error(error.message);
    }
  });
  // FinancialData related actions and function
  // Inventory related actions and function
  // OrderItems related actions and function
  // Order related actions and function
  this.on("submitOrder", async (req) => {
    const { customerID, items } = req.data;
    await cds.tx(async (tx) => {
      const customer = await getCustomer(customerID, tx);

      let totalAmount = 0;
      for (const item of items) {
        const product = await getProduct(item.product_ID, tx);
        const newQuantity = await checkInventory(product.ID, item.quantity, tx);
        await updateInventory(product.ID, newQuantity, tx);
        totalAmount += product.price * item.quantity;
      }

      const Order = {
        customer_ID: customerID,
        orderDate: new Date().toISOString(),
        totalAmount: totalAmount,
        status: OrderStatus.PENDING,
        items: items,
      };

      await addOrder(Order, tx);
    }); // cds.tx
  }); // submitOrder

  this.on("fulfilOrder", async (req) => {
    const { orderID } = req.data;
    await cds.tx(async (tx) => {
      const order = await getOrder(orderID, tx);
      if (order.status !== OrderStatus.PENDING) {
        throw new Error(
          "Order with status: " + order.status + " can't be fulfiled"
        );
      }
      await updateOrder(orderID, { status: OrderStatus.COMPLETED}, tx);
    });
  }); // fulfilOrder

  this.on("cancelOrder", async (req) => {
    const { orderID } = req.data;
    await cds.tx(async (tx) => {
      const order = await getOrder(orderID, tx);
      if (order.status !== OrderStatus.PENDING) {
        throw new Error("Order can't be canceled!");
      } else {
        const items = await getOrderItems(orderID, tx);

        for (const item of items) {
          const newQuantity = await checkInventory(
            item.product_ID,
            -item.quantity,
            tx
          );
          await updateInventory(item.product_ID, newQuantity, tx);
        }
        await updateOrder(orderID, { status: OrderStatus.CANCELLED }, tx);
      }
    });
  }); // cancelOrder

  // Product related actions and function
};

const cds = require("@sap/cds");

async function checkInventory(productID, requiredQuantity, tx) {
  const inventory = await tx.run(
    SELECT.one
      .from("mock.test.s4hana.Inventory")
      .where({ product_ID: productID })
  );

  if (!inventory || inventory.quantity < requiredQuantity) {
    throw new Error("Item quantity exceeds inventory!");
  }
  const newQuantity = inventory.quantity - requiredQuantity;
  return newQuantity;
}

async function updateInventory(productID, newQuantity, tx) {
  await tx.run(
    UPDATE.entity("mock.test.s4hana.Inventory")
      .where({ product_ID: productID })
      .with({ quantity: newQuantity })
  );
}

async function getProduct(productID, tx) {
  return await tx.run(
    SELECT.one.from("mock.test.s4hana.Products").where({ ID: productID })
  );
}

async function getCustomer(customerID, tx) {
  return await tx.run(
    SELECT.one.from("mock.test.s4hana.Customers").where({ ID: customerID })
  );
}

async function updateCustomer(customerID, data, tx) {
  await tx.run(
    UPDATE.entity("mock.test.s4hana.Customers")
      .where({ ID: customerID })
      .data(data)
  );
}

async function getOrder(orderID, tx) {
  return await tx.run(
    SELECT.one.from("mock.test.s4hana.Orders").where({ ID: orderID })
  );
}

async function addOrder(order, tx) {
  await tx.run(INSERT.into("mock.test.s4hana.Orders").entries(order));
}

async function deleteOrder(orderID, tx) {
  await tx.run(DELETE.from("mock.test.s4hana.Orders").where({ ID: orderID }));
}

async function updateOrder(orderID, data, tx) {
  await tx.run(
    UPDATE.entity("mock.test.s4hana.Orders").where({ ID: orderID }).data(data)
  );
}

async function getOrderItems(orderID, tx) {
  return await tx.run(
    SELECT.from("mock.test.s4hana.OrderItems").where({ order_ID: orderID })
  );
}

module.exports = function () {
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

      if (!customer) {
        throw new Error("Customer not found!");
      }

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
        status: "Pending",
        items: items,
      };

      await addOrder(Order, tx);
    }); // cds.tx
  }); // submitOrder

  this.on("fulfilOrder", async (req) => {
    const { orderID } = req.data;
    await cds.tx(async (tx) => {
      const order = await getOrder(orderID, tx);
      if (order.status !== "Pending"){
        throw new Error("Order with status: " + order.status + " can't be fulfiled");
      }
      await updateOrder(orderID, { "status": "Delivered" }, tx);
    });
  }); // fulfilOrder

  this.on("cancelOrder", async (req) => {
    const { orderID } = req.data;
    await cds.tx(async (tx) => {
      const order = await getOrder(orderID, tx);
      if (!order) {
        throw new Error("Order doesn't exist!");
      }
      if (order.status !== "Pending") {
        throw new Error("Order can't be canceled!");
      } else {

        const items = await getOrderItems(orderID, tx);

        for (const item of items) {
          const newQuantity = await checkInventory(item.product_ID, -item.quantity, tx);
          await updateInventory(item.product_ID, newQuantity, tx);
        }
        await updateOrder(orderID, {"status": "Canceled"}, tx);
      }
    });
  }); // cancelOrder

  // Product related actions and function
};

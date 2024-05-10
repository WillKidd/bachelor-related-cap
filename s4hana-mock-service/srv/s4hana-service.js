const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { Orders, OrderItems, Inventory } = this.entities;

    this.before('CREATE', Orders, async (req) => {
        // Check if all necessary fields are provided and initialize order data
        const { items } = req.data;
        if (!items || items.length === 0) {
            req.error(400, "Order must include at least one item.");
        }

        // Set the order status and the order date
        req.data.status = 'in progress';
        req.data.orderDate = new Date();

        // Calculate the total amount of the order
        req.data.totalAmount = items.reduce((total, item) => total + (item.quantity * item.price), 0);
    });

    this.on('CREATE', Orders, async (order, req) => {
        // Start a transaction
        const tx = cds.transaction(req);

        try {
            // Insert the order
            const insertedOrder = await tx.run(INSERT.into(Orders).entries(order));

            // Insert order items and update inventory
            const operations = order.items.map(item =>
                INSERT.into(OrderItems).entries({
                    ...item,
                    orderId: order.ID // assuming ID is auto-generated and available
                })
            );

            // Update inventory for each item
            order.items.forEach(async item => {
                const affectedRows = await tx.run(
                    UPDATE(Inventory)
                        .set({ quantity: { '-=': item.quantity } })
                        .where({ productID: item.productID })
                );
                if (affectedRows === 0) {
                    req.error(400, `Inventory update failed for product ID: ${item.productID}`);
                }
            });

            // Execute all operations
            await tx.run(operations);
            return insertedOrder;
        } catch (error) {
            req.error(500, `Error creating order: ${error.message}`);
        }
    });
});
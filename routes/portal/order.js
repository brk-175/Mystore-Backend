const express = require("express");
const utils = require("../../utils");
const mysql2 = require("mysql2/promise");
const router = express.Router();

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "brk231",
  database: "mystore",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

router.post("/", (request, response) => {
  const { addressId } = request.body;

  (async () => {
    const sql1 = `SELECT * FROM cart WHERE userId = ${request.userId}`;
    const [cartProducts] = await pool.query(sql1);

    let totalAmount = 0;
    cartProducts.forEach((product) => {
      totalAmount += product.price * product.quantity;
    });

    const sql2 = `INSERT INTO user_order (userId, addressId, totalAmount) VALUES (${request.userId}, ${addressId}, ${totalAmount});`;
    const [result] = await pool.query(sql2);

    const orderId = result.insertId;
    cartProducts.forEach(async (product) => {
      const sql3 = `INSERT INTO user_order_details (orderId, productId, price, quantity, totalAmount) VALUES (${orderId},${
        product.productId
      },${product.price},${product.quantity},${
        product.price * product.quantity
      });`;
      await pool.query(sql3);
    });

    const sql4 = `DELETE FROM cart WHERE userId = ${request.userId}`;
    await pool.query(sql4);

    response.send({ status: "success" });
  })();
});

module.exports = router;

const express = require("express");
const db = require("../../db");
const utils = require("../../utils");

const router = express.Router();

router.get("/", (request, response) => {
  const sql = `SELECT * FROM product`;
  db.conn.execute(sql, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

router.post("/", (request, response) => {
  const { title, description, price, categoryId, brandId } = request.body;
  const sql = `INSERT INTO product (title, description, price, categoryId, brandId) VALUES ('${title}', '${description}', ${price}, ${categoryId}, ${brandId});`;
  db.conn.execute(sql, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

router.put("/:id", (request, response) => {
  const { id } = request.params;
  const { title, description, price, categoryId, brandId } = request.body;
  const sql = `UPDATE product SET title = '${title}', description = '${description}', price = ${price}, categoryId = ${categoryId}, brandId = ${brandId}'`;
  db.conn.execute(sql, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

router.delete("/:id", (request, response) => {
  const { id } = request.params;
  const sql = `DELETE FROM product WHERE id = ${id};`;
  db.conn.execute(sql, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

module.exports = router;

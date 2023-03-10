const express = require("express");
const db = require("../../db");
const utils = require("../../utils");

const router = express.Router();

router.get("/", (request, response) => {
  const sql = `SELECT * FROM user_order;`;
  db.conn.query(sql, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

router.put("/update-status/:id", (request, response) => {
  const { id } = request.params;
  const { orderStatus } = request.body;
  const sql = `UPDATE user_order SET orderStatus = ${orderStatus} WHERE id = ${id}`;
  db.conn.query(sql, (error, data) => {
    response.send(utils.createResult(error, data));
  });
});

module.exports = router;

const express = require("express");
const db = require("../../db");
const utils = require("../../utils");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const router = express.Router();

router.post("/login", (request, response) => {
  const { email, password } = request.body;
  const encrPassword = crypto.SHA256(password);
  const sql = `SELECT firstName, lastName FROM admin WHERE email = '${email}' AND password = '${encrPassword}'`;
  db.conn.execute(sql, (error, data) => {
    const result = {};
    if (error) {
      result.status = "error";
      result.error = error;
    } else if (data.length == 0) {
      result.status = "error";
      result.error = "Invalid Email or Password !";
    } else {
      const token = jwt.sign({ id: data[0].id }, config.secret);
      result.status = "success";
      result.data = {
        firstName: data[0].firstName,
        lastName: data[0].lastName,
        token: token,
      };
    }
    response.send(result);
  });
});

module.exports = router;

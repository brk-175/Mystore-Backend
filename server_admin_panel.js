const express = require("express");
const bodyParser = require("body-parser");
const utils = require("./utils");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const config = require("./config");

const adminRouter = require("./routes/admin/admin");
const userRouter = require("./routes/admin/user");
const productRouter = require("./routes/admin/product");
const orderRouter = require("./routes/admin/order");
const categoryRouter = require("./routes/admin/category");

function authorizeUser(request, response, next) {
  if (request.url == "/admin/login") next();
  else {
    const { token } = request.headers;
    if (!token) {
      response.status(401);
      response.send(utils.createResult("Token is missing !"));
    }
    try {
      const result = jwt.verify(token, config.secret);
      request.userId = result.id;
      next();
    } catch (ex) {
      response.status(401);
      response.send(utils.createResult("Invalid Token"));
    }
  }
}

const app = express();
app.use(authorizeUser);
app.use(bodyParser.json());
app.use(cors("*"));
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/category", categoryRouter);

app.listen(7000, "localhost", () => {
  console.log("Server started on port 7000");
});

const express = require("express");
const bodyParser = require("body-parser");
const utils = require("./utils");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const config = require("./config");
const morgan = require("morgan");

const userRouter = require("./routes/portal/user");

function authorizeUser(request, response, next) {
  if (
    request.url == "/user/signup" ||
    request.url == "/user/login" ||
    request.url.startsWith("/user/image")
  )
    next();
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
app.use(cors("*"));
app.use(authorizeUser);
app.use(bodyParser.json());
app.use("/user", userRouter);

app.listen(7100, "localhost", () => {
  console.log("Server started on port 7100");
});

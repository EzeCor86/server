const express = require("express");
require("dotenv").config();

const {
  getProducts,
  detailProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  toggleProduct,
} = require("./controllers/product.controller");
const {
  login,
  register,
  getUsers,
  updateUser,
  getUser,
  getUserWithJWT,
  deleteUser,
} = require("./controllers/user.controller");
const app = express();
const cors = require("cors");
const connectionMongo = require("./database/config.js");
const {
  addProduct,
  removeProduct,
  moreQuantityProduct,
  lessQuantityProduct,
  getOrders,
  getOrderFromUser,
  completedOrder,
  getQuantity,
} = require("./controllers/order.controllers");
const checkTokenAdmin = require("./middleware/checkTokenAdmin");
const checkTokenRegular = require("./middleware/checkTokenRegular");
connectionMongo();
app.use(cors());
app.use(express.json()); 


app.get("/products", getProducts); 
app.put("/products/toggle/:idProduct", checkTokenAdmin, toggleProduct); 
app.post("/products", checkTokenAdmin, createProduct);
app.get("/products/:idProduct", detailProduct);
app.delete("/products/:idProduct", checkTokenAdmin, deleteProduct);
app.put("/products/:idProduct", checkTokenAdmin, updateProduct);


app.post("/users", getUserWithJWT);
app.get("/users", checkTokenAdmin, getUsers);
app.post("/users/login", login);
app.post("/users/register", register);
app.put("/users/:idUser", checkTokenAdmin, updateUser);
app.get("/users/:idUser", getUser);
app.delete("/users/:idUser", checkTokenAdmin, deleteUser);

app.get("/orders", checkTokenAdmin, getOrders);

app.get("/order", checkTokenRegular, getOrderFromUser);
app.put("/order/complete", checkTokenAdmin, completedOrder);
app.put("/order/add", checkTokenRegular, addProduct);
app.put("/order/remove", checkTokenRegular, removeProduct);
app.put("/order/moreQuantity", checkTokenRegular, moreQuantityProduct);
app.put("/order/lessQuantity", checkTokenRegular, lessQuantityProduct);
app.post("/order/getQuantity", checkTokenRegular, getQuantity);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// àsd
const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
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
} = require("./controllers/user.controller");
const app = express();
const cors = require("cors");
const connectionMongo = require("./database/config.js");
connectionMongo();
app.use(cors());
app.use(express.json()); // middleware a nivel aplicación

const checkToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    const dataToken = jwt.verify(token, process.env.PASSWORD_SECRET);
    req.userToken = dataToken;
    if (dataToken.rol === "ADMIN") {
      return next();
    } else {
      return res.status(403).json({
        ok: false,
        message: "No se puede realizar esta acción",
      });
    }
  } catch (error) {
    res.status(403).json({
      ok: false,
      message: "Token invalido",
    });
  }
};

// Entidades: Productos
app.get("/products", getProducts); // <-- controlador
app.put("/products/toggle/:idProduct", checkToken, toggleProduct); // <-- controlador
app.post("/products", checkToken, createProduct);
app.get("/products/:idProduct", detailProduct);
app.delete("/products/:idProduct", checkToken, deleteProduct);
app.put("/products/:idProduct", checkToken, updateProduct);

// Entidades: Usuarios
app.post("/users", checkToken, getUserWithJWT);
app.get("/users", checkToken, getUsers);
app.post("/users/login", login);
app.post("/users/register", register);
app.put("/users/:idUser", checkToken, updateUser);
app.get("/users/:idUser", getUser);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

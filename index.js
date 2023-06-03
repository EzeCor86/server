const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  getProducts,
  detailProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  toggleProduct
} = require("./controllers/product.controller");
const { login, register,getUsers,updateUser } = require("./controllers/user.controller");
const app = express();
const cors = require("cors");
const connectionMongo = require("./database/config.js");
connectionMongo();
app.use(cors());
app.use(express.json()); // middleware a nivel aplicación

const checkToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const dataToken = jwt.verify(token, process.env.PASSWORD_SECRET);
    req.userToken = dataToken;
    
    if (dataToken.rol === "ADMIN") {
      next();
    } else {
      res.status(403).json({
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
app.get("/products/toggle/:idProduct", checkToken,toggleProduct); // <-- controlador
app.post("/products", checkToken, createProduct);
app.get("/products/:idProduct", detailProduct);
app.delete("/products/:idProduct", checkToken, deleteProduct);
app.put("/products/:idProduct", checkToken, updateProduct);

// Entidades: Usuarios
// app.post("/users",checkToken, postUser);
app.get("/users", getUsers);
app.post("/users/login", login);
app.post("/users/register", register);
app.put("/users/:idUser", checkToken, updateUser);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

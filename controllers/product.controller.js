const Product = require("../database/models/Product");

module.exports = {
  getProducts: async (req, res) => {
    try {
      const { q } = req.query;
      let options = {};

      if (q) {
        options = {
          $or: [
            {
              name: { $regex: q, $options: "i" },
            },
            {
              description: { $regex: q, $options: "i" },
            },
          ],
        }; //name --> Samsung A33  --> samsung A33
      } //cliente -->  q --> A33

      const products = await Product.find(options);
      res.status(200).json({
        ok: true,
        // quantity: products.length,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },
  detailProduct: async (req, res) => {
    try {
      const { idProduct } = req.params; // 6451a73c6c4ce11c7e55f05c
      const productFound = await Product.findById(idProduct);

      if (!productFound) {
        return res.status(404).json({
          ok: false,
          message: "El producto no existe",
        });
      }
      res.status(200).json({ ok: true, data: productFound });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },
  createProduct: async (req, res) => {
    // req.body es un objeto que trae info desde el cliente
    try {
      const { name, description, price, discount, images } = req.body;

      if (!name || !description || !price || !images) {
        return res.json({
          ok: false,
          message: "Todos los campos son requeridos",
        });
      }

      const product = await Product.create({
        name,
        description,
        price,
        discount,
        images,
      });

      res.status(201).json({
        ok: true,
        data: product,
        message: "Producto creado con éxito!!",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { idProduct } = req.params;
      const { deletedCount } = await Product.deleteOne({ _id: idProduct });

      if (deletedCount === 0) {
        return res.status(404).json({
          ok: false,
          message: "El producto no existe | ya fue eliminado",
        });
      }

      res.status(200).json({
        ok: true,
        message: "Producto eliminado con éxito",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { name, description, price, discount, images } = req.body;
      const { idProduct } = req.params;

      const product = await Product.findById(idProduct);

      if (!product) {
        return res.status(404).json({
          ok: false,
          message: "El producto no existe",
        });
      }

      product.name = name;
      product.description = description;
      product.price = price;
      product.discount = discount;
      product.images = images;
      await product.save();

      res.status(200).json({
        ok: true,
        message: "Producto actualizado",
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },
  toggleProduct: async (req, res) => {
    try {
      const { idProduct } = req.params;
      const product = await Product.findById(idProduct);
      if (!product) {
        return res.status(404).json({
          ok: false,
          message: "El producto no existe",
        });
      }

      product.available = !product.available;
      await product.save();
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },
};

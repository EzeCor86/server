const { Order } = require("../database/models");

const findOrCreate = async ({ model, where, defaults }) => {
  let order = await model.findOne(where);
  let isCreate = true;
  if (order) {
    isCreate = false;
  } else {
    order = await model.create(defaults);
  }

  return [order, isCreate];
};

module.exports = orderMethods = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate([
        "products.product",
        "userId",
      ]);
      res.status(200).json({
        ok: true, 
        data: orders,
      });
    } catch (error) {}
  },
  getOrderFromUser: async (req, res) => {},
  addProduct: async (req, res) => {
    try {
      const { userId, productId, comment } = req.body;
      const [order, isCreate] = await findOrCreate({
        model: Order,
        where: {
          $and: [{ userId }, { status: "Pending" }],
        },
        defaults: { userId },
      });

      const existProduct = order.products.some(
        
        ({ product }) => product.toString() === productId
      );

      if (!existProduct) {
        order.products.push({ product: productId, comment });
      }

      await (await order.save()).populate(["products.product", "userId"]); 

      res.status(200).json({
        ok: true,
        data: order,
      });
    } catch (error) {
      res.status(500).json({ ok: false, message: error.message });
    }
  },
  removeProduct: async (req, res) => {
    try {
      const { userId, productId } = req.body;
      let order = await Order.findOne({
      
        $and: [
          {
            userId,
          },
          {
            status: "Pending",
          },
        ],
      });

      if (order) {
        const existProduct = order.products.some(
      
          ({ product }) => product.toString() === productId
        );

        if (existProduct) {
        
          order.products = order.products.filter(
            ({ product }) => product.toString() !== productId
          );
        }

        
        await (await order.save()).populate("products.product");

        return res.status(200).json({
          ok: true,
          data: order.products, 
        });
      }
    } catch (error) {
      res.status(500).json({ ok: false, message: error.message });
    }
  },
  completedOrder: async (req, res) => {
    try {
      const { orderId } = req.body;
      let order = await Order.findOne({
        $and: [
          {
            _id: orderId,
          },
          {
            status: "Pending",
          },
        ],
      });

      if (!order) {
        return res.status(404).json({
          ok: false,
          message: "La orden no existe",
        });
      }

      order.status = "Completed";
      await order.save();

      res.status(200).json({
        ok: true,
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const { orderId } = req.body;
      let order = await Order.findOne({
        $and: [
          {
            _id: orderId,
          },
          {
            status: "Pending",
          },
        ],
      });

      if (!order) {
        return res.status(404).json({
          ok: false,
          message: "La orden no existe",
        });
      }

      order.status = "Cancel";
      order.save();

      res.status(200).json({
        ok: true,
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },
  moreQuantityProduct: async (req, res) => {
    const { userId, productId } = req.body;
    let order = await Order.findOne({
      $and: [
        {
          userId,
        },
        {
          status: "Pending",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "La orden no existe",
      });
    }

    const products = order.products;

    const product = products.find(
      ({ product }) => product.toString() === productId
    );

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "El producto no existe",
      });
    }

    product.quantity++;
    await order.save();
    res.status(200).json({
      ok: true,
      data: product,
    });
  },
  lessQuantityProduct: async (req, res) => {
    const { userId, productId } = req.body;
    const order = await Order.findOne({
      $and: [
        {
          userId,
        },
        {
          status: "Pending",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "La orden no existe",
      });
    }

    const products = order.products;

    const product = products.find(
      ({ product }) => product.toString() === productId
    );

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "El producto no existe",
      });
    }

    product.quantity--;
    await order.save();
    res.status(200).json({
      ok: true,
      data: product,
    });
  },
  getQuantity:async (req,res) => {
    const { userId, productId } = req.body;
    const order = await Order.findOne({
      $and: [
        {
          userId,
        },
        {
          status: "Pending",
        },
      ],
    });
    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "La orden no existe",
      });
    }

    const products = order.products;

    const product = products.find(
      ({ product }) => product.toString() === productId
    );

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "El producto no existe",
      });
    }
    res.status(200).json({
      ok: true,
      data: product.quantity,
    });
  }
};

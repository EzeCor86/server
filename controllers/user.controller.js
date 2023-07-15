const User = require("../database/models/User");
const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        $and: [
          {
            email,
          },
          {
            available: true,
          },
        ],
      });
      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "El usuario no existe o no esta disponible",
        });
      }

      const isPassValid = compare(password, user.password);

      if (!isPassValid) {
        return res.status(400).json({
          ok: false,
          message: "Credenciales invalidas",
        });
      }

     
      const token = jwt.sign(
        { rol: user.rol, email: user.email },
        process.env.PASSWORD_SECRET,
        {
          expiresIn: 60000,
        }
      );

      res.status(200).json({
        ok: true,
        token,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },
  register: async (req, res) => {
    try {
      const { email, password, username } = req.body;

      const user = await User.findOne({
        $or: [
          {
            email,
          },
          {
            username,
          },
        ],
      });

      if (user) {
        return res.status(400).json({
          ok: false,
          message: "El usuario ya existe en la base de datos",
        });
      }

      const newUser = await User.create({
        email,
        password: await hash(password, 12),
        username,
      });

     

      res.status(201).json({
        ok: true,
        message: "Usuario creado con éxito",
        message2: "Deben activar tu cuenta",
        data: newUser,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },

  getUsers: async (req, res) => {
    try {
      {
        const users = await User.find();

        if (!users.length) {
          return res.status(404).json({
            ok: false,
            message: "El usuario no existe",
          });
        }

        res.status(200).json({
          ok: true,
          data: users,
        });
      }
    } catch (error) {
      res.status(200).json({
        ok: true,
        message: "no hay usuarios",
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { username, password, email, rol, available, avatar } = req.body;
      const { idUser } = req.params;

      const user = await User.findById(idUser);

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "El usuario no existe",
        });
      }

      user.username = username;
      
      user.email = email;
      user.rol = rol;
      user.available = available;
      user.avatar = avatar;
      await user.save();

      res.status(200).json({
        ok: true,
        message: "Usuario actualizado",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { idUser } = req.params;
      const { deletedCount } = await User.deleteOne({ _id: idUser });

      if (deletedCount === 0) {
        return res.status(404).json({
          ok: false,
          message: "El usuario no existe | ya fue eliminado",
        });
      }

      res.status(200).json({
        ok: true,
        message: "Usuario eliminado con éxito",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  },
  getUser: async (req, res) => {
    try {
      const { idUser } = req.params;
      const user = await User.findById(idUser);

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "El usuario no existe",
        });
      }

      res.status(200).json({
        ok: true,
        data: user,
      });
    } catch (error) {
      res.status(200).json({
        ok: true,
        message: error.message || "SERVER ERROR",
      });
    }
  },
  getUserWithJWT: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.userToken?.email });

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "El usuario no existe",
        });
      }

      res.status(200).json({
        ok: true,
        data: user,
      });
    } catch (error) {
      res.status(200).json({
        ok: true,
        message: error.message || "SERVER ERROR",
      });
    }
  },
};
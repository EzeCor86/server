const User = require("../database/models/User");
const bcrypt = require("bcryptjs");
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

      const isPassValid = bcrypt.compareSync(password, user.password);
      if (!isPassValid) {
        return res.status(400).json({
          ok: false,
          message: "Credenciales invalidas",
        });
      }

      // JSON WEB TOKEN CREATE
      const token = jwt.sign(
        { rol: user.rol, email: user.email },
        process.env.PASSWORD_SECRET,
        {
          expiresIn: 500,
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
        password: bcrypt.hashSync(password, 12),
        username,
      });

      // TO DO  Send email

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
      user.password = /\$2a\$/.test(password)
        ? password
        : bcrypt.hashSync(password, 12);
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
      const { email } = req.userToken
      const user = await User.findOne({email});

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

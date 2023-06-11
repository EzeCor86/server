const jwt = require("jsonwebtoken");
const checkTokenRegular = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const dataToken = jwt.verify(token, process.env.PASSWORD_SECRET);
    req.userToken = dataToken;
    if (dataToken.rol === "REGULAR") {
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
      message: error.message,
    });
  }
};

module.exports = checkTokenRegular;

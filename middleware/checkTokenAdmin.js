
  const checkTokenAdmin = (req, res, next) => {
    try {
      const token = req.header("Authorization");
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


module.exports = checkTokenAdmin
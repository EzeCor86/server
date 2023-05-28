const mongoose = require("mongoose");
module.exports = async () => {
  try {
    // const {connection} = await mongoose.connect(process.env.MONGO_URL,{dbName:"FoodDev"});
    // const {port, host} = connection
    // console.log(`Conexión de mongoDB establecida -> ${host}:${port}`)
    const data= await mongoose.connect(process.env.MONGO_URL,{dbName:"FoodDev"});
    console.log(data)
  } catch (error) {
    console.log(error.message)
  }
};

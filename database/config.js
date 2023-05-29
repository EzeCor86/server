const mongoose = require("mongoose");
module.exports = async () => {
  try {
    const data= await mongoose.connect(process.env.MONGO_URL,{dbName:"FoodDev"});
  
  } catch (error) {
    console.log(error.message)
  }
};

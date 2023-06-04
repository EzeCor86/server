const mongoose = require("mongoose");
module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL,{dbName:"FoodDev"});
    console.log('Mongoose connected!!')
  } catch (error) {
    console.log(error.message)
  }
};

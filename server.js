const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3000;
const URL_DB = process.env.DB_URL;

mongoose
.connect(URL_DB)
.then(() =>{
  console.log("Serverul MongoDB ruleaza.");
  app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`);
  });
})
.catch((error)=> {
  console.log(`Serverul nu ruleaza. Eroare: ${error.message}`)
})



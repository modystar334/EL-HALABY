const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const filePath = path.join(process.cwd(), "data", "products.json");
  const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

  res.status(200).json(products);
};

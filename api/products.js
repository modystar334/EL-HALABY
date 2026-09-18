module.exports = async (req, res) => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/modystar334/EL-HALABY/main/data/products.json"
    );

    const products = await response.json();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: "Failed to load products"
    });
  }
};

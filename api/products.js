module.exports = async (req, res) => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/modystar334/EL-HALABY/main/products.json"
    );

    if (!response.ok) {
      throw new Error("products.json not found");
    }

    const products = await response.json();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

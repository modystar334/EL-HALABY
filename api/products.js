const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const OWNER = "modystar334";
const REPO = "EL-HALABY";
const FILE = "products.json";
const BRANCH = "main";

module.exports = async (req, res) => {
  try {
    // قراءة المنتجات
    if (req.method === "GET") {
      const response = await fetch(
        `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${FILE}`
      );

      if (!response.ok) {
        throw new Error("products.json not found");
      }

      const products = await response.json();

      return res.status(200).json(products);
    }

    // حفظ المنتجات
    if (req.method === "POST") {
      if (!GITHUB_TOKEN) {
        return res.status(500).json({
          error: "GITHUB_TOKEN is missing"
        });
      }

      const products = req.body;

      const fileResponse = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}?ref=${BRANCH}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json"
          }
        }
      );

      const fileData = await fileResponse.json();

      const content = Buffer.from(
        JSON.stringify(products, null, 2)
      ).toString("base64");

      const updateResponse = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: "Update products from admin panel",
            content: content,
            sha: fileData.sha,
            branch: BRANCH
          })
        }
      );

      const result = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(
          result.message || "Failed to update products.json"
        );
      }

      return res.status(200).json({
        success: true,
        message: "Products saved successfully"
      });
    }

    return res.status(405).json({
      error: "Method not allowed"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

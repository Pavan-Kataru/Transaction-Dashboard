const Products = require('./Products');

// Get Products with Pagination and Search
exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchQuery = req.query.search || '';

  try {
    // Define search filter if a search query is provided
    let searchFilter = {};
    if (searchQuery) {
      searchFilter = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { price: !isNaN(searchQuery) ? { $eq: parseFloat(searchQuery) } : null }
        ].filter(Boolean) // Remove null entries from the filter
      };
    }

    // Get total number of products matching the search
    const total = await Products.countDocuments(searchFilter);

    // Fetch products with pagination and search filter
    const products = await Products.find(searchFilter)
      .sort({ id: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      products,
      total
    });
  } catch (error) {
    console.error('Error in getProducts:', error); // Log the actual error
    res.status(500).json({
      message: 'Error fetching products',
      error: error.message || error,
    });
  }
};

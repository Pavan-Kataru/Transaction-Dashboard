const Products = require('./Products'); // Import the Products model

// Get Statistics for a Selected Month (Irrespective of Year)
exports.getStatisticsByMonth = async (req, res) => {
  const { month } = req.query;

  // Ensure the month is provided
  if (!month) {
    return res.status(400).json({
      message: 'Please provide the month for the statistics.',
    });
  }

  try {
    // Convert month to a number (if it's not already)
    const monthInt = parseInt(month);

    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).json({
        message: 'Please provide a valid month (1-12).',
      });
    }

    // Define price ranges
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity } // 901 and above
    ];

    // Aggregate statistics based on the month (ignoring year)
    const stats = await Products.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: { $toDate: '$dateOfSale' } }, monthInt], // Match by month
          },
        },
      },
      {
        $facet: {
          totalStats: [
            {
              $group: {
                _id: null,
                totalSaleAmount: { $sum: '$price' },
                totalSoldItems: { $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] } },
                totalNotSoldItems: { $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] } },
              },
            }
          ],
          priceDistribution: [
            {
              $bucket: {
                groupBy: "$price", // Field to group by
                boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity], // Define price boundaries
                default: "901-above", // Bucket for prices above 901
                output: {
                  count: { $sum: 1 }
                }
              }
            }
          ]
        }
      }
    ]);

    // Extract total stats and price distribution
    const totalStats = stats[0].totalStats[0] || { totalSaleAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 };
    const priceDistribution = stats[0].priceDistribution.map((bucket, index) => ({
      priceRange: index < priceRanges.length - 1 
        ? `${priceRanges[index].min}-${priceRanges[index].max}` 
        : "901-above",
      count: bucket.count
    }));

    // Return the statistics in the response
    res.status(200).json({
      totalSaleAmount: totalStats.totalSaleAmount,
      totalSoldItems: totalStats.totalSoldItems,
      totalNotSoldItems: totalStats.totalNotSoldItems,
      priceDistribution: priceDistribution,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching statistics.',
      error,
    });
  }
};

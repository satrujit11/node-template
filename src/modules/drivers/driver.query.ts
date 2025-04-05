export const driverQueries = ["state", "city"]

export const driverAggregates = {
  earningsSummary: [
    // {
    //   $lookup: {
    //     from: "orders",
    //     let: { driverId: "$_id" },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [
    //               { $eq: ["$driverId", "$$driverId"] },
    //               {
    //                 $gte: ["$createdAt", {
    //                   $subtract: ["$$NOW", 1000 * 60 * 60 * 24 * 7]
    //                 }]
    //               }
    //             ]
    //           }
    //         }
    //       }
    //     ],
    //     as: "orders"
    //   }
    // },
    // {
    //   $addFields: {
    //     totalEarnings: { $sum: "$orders.orderAmount" },
    //     totalOrders: { $size: "$orders" }
    //   }
    // },
    // {
    //   $project: {
    //     name: 1,
    //     mobileNumber: 1,
    //     totalEarnings: 1,
    //     totalOrders: 1
    //   }
    // }
  ]
};


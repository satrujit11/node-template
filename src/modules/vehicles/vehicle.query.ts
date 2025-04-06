export const vehicleQueries = []

export const vehicleAggregates = {
  withLatestDriver: [
    {
      $lookup: {
        from: "ridehistories",
        let: { vehicleId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$vehicleId", "$$vehicleId"] },
              endTime: { $exists: false }
            }
          },
          { $sort: { startTime: -1 } },
          { $limit: 1 },
          {
            $lookup: {
              from: "drivers",
              localField: "driverId",
              foreignField: "_id",
              as: "driver"
            }
          },
          { $unwind: { path: "$driver", preserveNullAndEmptyArrays: true } }
        ],
        as: "latestRide"
      }
    },
    { $unwind: { path: "$latestRide", preserveNullAndEmptyArrays: true } },
    { $addFields: { latestDriver: "$latestRide.driver" } },
    { $project: { latestRide: 0 } }
  ],

  withDowntimeStatus: [
    {
      $lookup: {
        from: "downtimes",
        let: { vehicleId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$vehicleId", "$$vehicleId"] },
              endTime: { $exists: false }
            }
          },
          { $sort: { startTime: -1 } },
          { $limit: 1 }
        ],
        as: "latestDowntime"
      }
    },
    {
      $unwind: {
        path: "$latestDowntime",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        isActive: {
          $cond: {
            if: { $not: ["$latestDowntime"] },
            then: true,
            else: false
          }
        }
      }
    }
  ]
};




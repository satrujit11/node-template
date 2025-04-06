export const driverQueries = ["state", "city"]

export const driverAggregates = {
  withActiveRide: [
    {
      $lookup: {
        from: "ridehistories",
        localField: "_id",
        foreignField: "driverId",
        as: "rideHistories"
      }
    },
    {
      $match: {
        "rideHistories.endTime": { $exists: false }
      }
    }
  ],
  withoutActiveRide: [
    {
      $lookup: {
        from: "ridehistories",
        localField: "_id",
        foreignField: "driverId",
        as: "rideHistories"
      }
    },
    {
      $match: {
        $or: [
          { "rideHistories": { $size: 0 } },
          {
            "rideHistories.endTime": { $exists: true }
          }
        ]
      }
    }
  ],
  withAllRides: [
    {
      $lookup: {
        from: "ridehistories",
        localField: "_id",
        foreignField: "driverId",
        as: "rideHistories"
      }
    }
  ]
};


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
      $addFields: {
        activeRides: {
          $filter: {
            input: "$rideHistories",
            as: "ride",
            cond: { $not: ["$$ride.endTime"] }
          }
        }
      }
    },
    {
      $match: {
        "activeRides.0": { $exists: true } // Means there is at least one active ride
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
      $addFields: {
        activeRides: {
          $filter: {
            input: "$rideHistories",
            as: "ride",
            cond: { $not: ["$$ride.endTime"] }
          }
        }
      }
    },
    {
      $match: {
        "activeRides": { $eq: [] } // No active rides
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


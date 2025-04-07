export function getDriverDowntimeAggregate(query: any): any[] {
  const { startTimeDriverDownTIme, endTimeDriverDowntime, driverId } = query;
  const match: any = {};

  if (startTimeDriverDownTIme) {
    const start = new Date(startTimeDriverDownTIme);
    if (!isNaN(start.getTime())) {
      match.startTime = { ...match.startTime, $gte: start };
    }
  }

  if (endTimeDriverDowntime) {
    const end = new Date(endTimeDriverDowntime);
    if (!isNaN(end.getTime())) {
      match.endTime = { ...match.endTime, $lte: end };
    }
  }

  const pipeline: any[] = [
    // Initial match on downtimes if time filters are provided
    ...(Object.keys(match).length > 0 ? [{ $match: match }] : []),

    // Lookup rides for each downtime's vehicle
    {
      $lookup: {
        from: "ridehistories",
        let: {
          vehicleId: "$vehicleId",
          downtimeStart: "$startTime",
          downtimeEnd: "$endTime"
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$vehicleId", "$$vehicleId"] },
                  // Only get rides that overlap with the downtime
                  {
                    $and: [
                      { $lt: ["$startTime", "$$downtimeEnd"] },
                      { $gt: ["$endTime", "$$downtimeStart"] }
                    ]
                  },
                  ...(driverId ? [{ $eq: ["$driverId", { $toObjectId: driverId }] }] : [])
                ]
              }
            }
          }
        ],
        as: "overlappingRides"
      }
    },

    // Only keep downtimes that have overlapping rides
    { $match: { "overlappingRides.0": { $exists: true } } },

    // Unwind the rides to process each overlap
    { $unwind: "$overlappingRides" },

    // Calculate the actual intersection duration for each ride-downtime pair
    {
      $addFields: {
        intersectionStart: {
          $max: ["$startTime", "$overlappingRides.startTime"]
        },
        intersectionEnd: {
          $min: ["$endTime", "$overlappingRides.endTime"]
        }
      }
    },

    // Calculate intersection duration in minutes
    {
      $addFields: {
        intersectionDuration: {
          $divide: [
            { $subtract: ["$intersectionEnd", "$intersectionStart"] },
            1000 * 60 // Convert to minutes
          ]
        }
      }
    },

    // Group by driver to get total downtime and details
    {
      $group: {
        _id: "$overlappingRides.driverId",
        totalDowntime: { $sum: "$intersectionDuration" },
        downtimes: {
          $push: {
            _id: "$_id",
            reason: "$reason",
            vehicleId: "$vehicleId",
            startTime: "$intersectionStart",
            endTime: "$intersectionEnd",
            duration: "$intersectionDuration",
            rideId: "$overlappingRides._id"
          }
        }
      }
    },

    // Lookup driver details
    {
      $lookup: {
        from: "drivers",
        localField: "_id",
        foreignField: "_id",
        as: "driverInfo"
      }
    },

    // Unwind driver info
    { $unwind: "$driverInfo" },

    // Final projection
    {
      $project: {
        driverId: "$_id",
        driverName: "$driverInfo.name",
        totalDowntime: { $round: ["$totalDowntime", 2] },
        downtimes: 1,
        _id: 0
      }
    }
  ];

  return pipeline;
}


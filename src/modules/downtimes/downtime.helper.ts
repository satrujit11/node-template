export function getDriverDowntimeAggregate(query: any): any[] {
  const { startTime, endTime, driverId } = query;
  const match: any = {};

  if (startTime) {
    const start = new Date(startTime);
    if (!isNaN(start.getTime())) {
      match.startTime = { ...match.startTime, $gte: start };
    }
  }

  if (endTime) {
    const end = new Date(endTime);
    if (!isNaN(end.getTime())) {
      match.endTime = { ...match.endTime, $lte: end };
    }
  }

  const pipeline: any[] = [];

  if (Object.keys(match).length > 0) {
    pipeline.push({ $match: match });
  }

  pipeline.push(
    {
      $lookup: {
        from: "ridehistories",
        localField: "vehicleId",
        foreignField: "vehicleId",
        as: "rides",
      },
    },
    { $unwind: "$rides" },
    {
      $match: {
        $expr: {
          $and: [
            { $lte: ["$startTime", "$rides.endTime"] },
            { $gte: ["$endTime", "$rides.startTime"] },
          ],
        },
        ...(driverId && { "rides.driverId": driverId }),
      },
    },
    {
      $group: {
        _id: "$rides.driverId",
        totalDowntime: {
          $sum: {
            $divide: [{ $subtract: ["$endTime", "$startTime"] }, 1000 * 60], // in minutes
          },
        },
        downtimes: {
          $push: {
            _id: "$_id",
            reason: "$reason",
            startTime: "$startTime",
            endTime: "$endTime",
            vehicleId: "$vehicleId",
          },
        },
      },
    },
    {
      $project: {
        driverId: "$_id",
        totalDowntime: 1,
        downtimes: 1,
        _id: 0,
      },
    }
  );

  return pipeline;
}


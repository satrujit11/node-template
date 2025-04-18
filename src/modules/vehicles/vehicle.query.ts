export const vehicleQueries = ["vendorId", "warehouseId", "vendorId._id", "warehouseId._id"];



const withDowntimeStatus = [
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
      },
    }
  }
]


const withLatestDriver = [
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
  { $project: { latestRide: 0, vendor: 0 } },
]

export const vehicleAggregates = {
  withVendor: [
    {
      $lookup: {
        from: "vendors", // Assuming the collection name is "vendors"
        localField: "vendorId",
        foreignField: "_id",
        as: "vendor"
      }
    },
    { $unwind: { path: "$vendorId", preserveNullAndEmptyArrays: true } },
    { $project: { vendorId: 0 } },
    { $addFields: { vendorId: { $arrayElemAt: ["$vendor", 0] } } },
    { $project: { vendor: 0 } },
  ],
  withWarehouse: [
    {
      $lookup: {
        from: "warehouses", // Assuming the collection name is "warehouses"
        localField: "warehouseId",
        foreignField: "_id",
        as: "warehouse"
      }
    },
    { $unwind: { path: "$warehouseId", preserveNullAndEmptyArrays: true } },
    { $project: { warehouseId: 0 } },
    { $addFields: { warehouseId: { $arrayElemAt: ["$warehouse", 0] } } },
    { $project: { warehouse: 0 } },
  ],
  withLatestDriver,

  withDowntimeStatus,

  onlyActive: [
    ...withDowntimeStatus,
    { $match: { isActive: true } }
  ],

  onlyInactive: [
    ...withDowntimeStatus,
    { $match: { isActive: false } }
  ],

  withDriver: [
    ...withLatestDriver,
    { $match: { latestDriver: { $ne: null } } }
  ],

  withoutDriver: [
    ...withLatestDriver,
    { $match: { latestDriver: null } }
  ]
};




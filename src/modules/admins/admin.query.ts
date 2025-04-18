export const adminQueries = ["state", "city"]

export const adminAggregates = {
  idAndTypeOnly: [
    {
      $project: {
        _id: 1,
        type: 1
      }
    }
  ]
};


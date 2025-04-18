import mongoose from "mongoose";

export const buildMatchStage = (key: string, id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }

  return {
    $match: {
      [key]: new mongoose.Types.ObjectId(id),
    },
  };
};


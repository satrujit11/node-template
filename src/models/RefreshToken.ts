import mongoose from 'mongoose';
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d', // Automatically remove tokens after 30 days
  },
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken


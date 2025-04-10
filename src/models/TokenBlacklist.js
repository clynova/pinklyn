import mongoose from 'mongoose';

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // Los tokens expirarán automáticamente después de 7 días
  }
});

const TokenBlacklist = mongoose.models.TokenBlacklist || mongoose.model('TokenBlacklist', tokenBlacklistSchema);

export default TokenBlacklist;
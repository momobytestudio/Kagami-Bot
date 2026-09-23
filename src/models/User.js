const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },

    wallet: {
      type: Number,
      default: 0
    },

    bank: {
      type: Number,
      default: 0
    },

    xp: {
      type: Number,
      default: 0
    },

    level: {
      type: Number,
      default: 1
    },

    inventory: {
      type: [String],
      default: []
    },

    daily: {
      lastClaim: {
        type: Date,
        default: null
      },

      streak: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },

    wallet: {
      type: String,
      default: "0"
    },

    bank: {
      type: String,
      default: "0"
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
    },

    work: {
      lastWork: {
        type: Date,
        default: null
      }
    },

    crime: {
      lastCrime: {
        type: Date,
        default: null
      }
    },

    rob: {
      lastRob: {
        type: Date,
        default: null
      }
    },

    beg: {
      lastBeg: {
        type: Date,
        default: null
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
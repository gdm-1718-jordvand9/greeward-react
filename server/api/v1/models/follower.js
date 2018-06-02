const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowerSchema = new Schema(
  {
    _uid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    _fid: [{ type: Schema.Types.ObjectId, ref: 'User', required: false}],
    created_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, required: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
module.exports = mongoose.model('Follower', FollowerSchema);
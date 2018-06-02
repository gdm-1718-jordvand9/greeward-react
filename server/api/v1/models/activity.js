const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema(
  {
    distance: { type: Number, required: false},
    start_lat: { type: Number, required: true },
    start_lng: { type: Number, required: true },
    stop_lat: { type: Number, required: true },
    stop_lng: { type: Number, required: true },
    moving_time: { type: Number, required: false },
    points: { type: Number, required: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, required: false },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: false }],
    likes: [{type: Schema.Types.ObjectId, ref:'User', required: false }],
    _user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ActivitySchema.virtual('id').get(() => this._id );
ActivitySchema.virtual('users', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'activities'
});

module.exports = mongoose.model('Activity', ActivitySchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, required: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

CommentSchema.virtual('id').get(() => this._id );
CommentSchema.virtual('activities', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'comments'
});

module.exports = mongoose.model('Comment', CommentSchema);
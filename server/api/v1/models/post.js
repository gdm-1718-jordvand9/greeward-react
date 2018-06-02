const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true, max: 128 },
    synopsis: { type: String, required: true, max: 256 },
    body: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, required: false },
    published_at: { type: Date, required: false },
    _blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: false },
    _category: { type: Schema.Types.ObjectId, ref: 'Category', required: false }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

PostSchema.virtual('id').get(() => this._id );
PostSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'posts'
});

module.exports = mongoose.model('Post', PostSchema);
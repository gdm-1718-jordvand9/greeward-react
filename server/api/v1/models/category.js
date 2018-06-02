const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, max: 128 },
    description: { type: String, required: true, max: 256 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, required: false },
    published_at: { type: Date, required: false },
    _parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', required: false}
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

CategorySchema.virtual('id').get(() => this._id );
CategorySchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: '_category',
  justOne: false
});
CategorySchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: '_category',
  justOne: false
});
CategorySchema.virtual('subCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: '_parentCategory',
  justOne: false
});

module.exports = mongoose.model('Category', CategorySchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema(
  {
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, required: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

RoleSchema.virtual('id').get(() => this._id );

module.exports = mongoose.model('Role', RoleSchema);
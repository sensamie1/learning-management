const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleProgressSchema = new Schema({
  module_id: {
    type: Schema.Types.ObjectId,
    ref: 'modules',
    required: true,
  },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

const ProgressSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  modules: [ModuleProgressSchema],
}, { timestamps: true });

const ProgressModel = mongoose.model('progress', ProgressSchema);
module.exports = ProgressModel;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LearningPathSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
}, { timestamps: true });

const LearningPathModel = mongoose.model('learning-paths', LearningPathSchema);
module.exports = LearningPathModel;

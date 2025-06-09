const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  contentUrl: { type: String, required: true },
  learning_path_id: {
    type: Schema.Types.ObjectId,
    ref: 'learning-paths',
    required: true,
  },
}, { timestamps: true });

const ModuleModel = mongoose.model('modules', ModuleSchema);
module.exports = ModuleModel;

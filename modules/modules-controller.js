const Module = require('../models/module-model');
const logger = require('../logger');
const LearningPath = require('../models/learning-path-model');
const mongoose = require('mongoose');

const createModule = async (req, res) => {
  try {
    logger.info('[CreateModule] => Create process started.');
    const { title, description, contentUrl, learning_path_id } = req.body;

    // Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(learning_path_id)) {
      return res.status(400).json({ message: 'Invalid learning_path_id' });
    }

    // Check if the learning path exists
    const learningPathExists = await LearningPath.findById(learning_path_id);
    if (!learningPathExists) {
      return res.status(404).json({ message: 'Learning path not found' });
    }

    // Check for duplicate title within the same learning path
    const existingModule = await Module.findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      learning_path_id
    });

    if (existingModule) {
      return res.status(409).json({
        message: 'A module with this title already exists in the selected learning path',
      });
    }

    // Create new module
    const newModule = await Module.create({
      title,
      description,
      contentUrl,
      learning_path_id,
    });

    logger.info('[CreateModule] => Create process done.');
    return res.status(201).json({
      message: 'Module created successfully',
      data: newModule,
    });
  } catch (err) {
    console.error('[CreateModule] => Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getModules = async (req, res) => {
  try {
    logger.info('[GetModules] => Get process started.');
    const modules = await Module.find().populate('learning_path_id', 'title');
    return res.status(200).json({
      message: 'Modules retrieved successfully',
      data: modules,
    });
  } catch (err) {
    console.error('[GetModules] => Error:', err);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};

const getModulesById = async (req, res) => {
  try {
    logger.info('[GetModulesById] => Get process started.');
    const { module_id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(module_id)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    // Use findById
    const module = await Module.findById(module_id);
    console.log(module_id);

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    logger.info('[GetModulesById] => Get process done.');
    return res.status(200).json({
      message: `Modules with ID: ${module_id} retrieved successfully`,
      data: module,
    });
  } catch (err) {
    console.error('[GetModulesById] => Error:', err);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};

const getModulesByPath = async (req, res) => {
  try {
    logger.info('[GetModulesByPath] => Get process started.');
    const { path_id } = req.params;

    const modules = await Module.find({ learning_path_id: path_id });

    if (!modules || modules.length === 0) {
      return res.status(404).json({ message: 'No modules found for this learning path' })
    }
    
    logger.info('[GetModulesByPath] => Get process done.');
    return res.status(200).json({
      message: `Modules for learning path with ID: ${path_id} retrieved successfully`,
      data: modules,
    });
  } catch (err) {
    console.error('[GetModulesByPath] => Error:', err);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};




module.exports = {
  createModule,
  getModules,
  getModulesById,
  getModulesByPath
}
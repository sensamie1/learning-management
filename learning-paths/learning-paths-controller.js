const LearningPath = require('../models/learning-path-model');
const logger = require('../logger');
const mongoose = require('mongoose');

const createLearningPath = async (req, res) => {
  try {
    logger.info('[CreatePath] => Create process started.');
    const { title, description } = req.body;

    // Check if title already exists (case-insensitive)
    const existingPath = await LearningPath.findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') },
    });

    if (existingPath) {
      return res.status(409).json({
        message: 'A learning path with this title already exists',
      });
    }

    const newPath = await LearningPath.create({ title, description });

    logger.info('[CreatePath] => Create process done.');
    return res.status(201).json({
      message: 'Learning path created successfully',
      data: newPath,
    });
  } catch (err) {
    console.error('[CreatePath] => Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getLearningPaths = async (req, res) => {
  try {
    logger.info('[GetPaths] => Get process started.');
    const paths = await LearningPath.find();
    return res.status(200).json({
      message: 'Learning paths retrieved successfully',
      data: paths,
    });
  } catch (err) {
    console.error('[Get Paths] => Error:', err);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};

const getPathById = async (req, res) => {
  try {
    logger.info('[GetPathById] => Get process started.');
    const { path_id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(path_id)) {
      return res.status(400).json({ message: 'Invalid learning path ID' });
    }

    // Use findById instead of find
    const path = await LearningPath.findById(path_id);
    console.log(path_id);

    if (!path) {
      return res.status(404).json({ message: 'Learning path not found' });
    }
    logger.info('[GetPathById] => Get process done.');
    return res.status(200).json({
      message: `Learning path with ID: ${path_id} retrieved successfully`,
      data: path,
    });
  } catch (err) {
    console.error('[GetPathById] => Error:', err);
    return res.status(500).json({
      message: 'Server Error',
      success: false,
    });
  }
};


module.exports = {
  createLearningPath,
  getLearningPaths,
  getPathById
}

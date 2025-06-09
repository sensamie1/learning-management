const logger = require('../logger');
const Progress = require('../models/progress-model');
const Module = require('../models/module-model');
const mongoose = require('mongoose');

const addModuleToProgress = async (req, res) => {
  try {
    logger.info('[addModuleToProgress] => Add module to progress started.');
    const user_id = req.user._id; // from auth middleware
    const { module_id } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(module_id)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    const module = await Module.findById(module_id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Find progress document by user only (no userModule_id)
    let progress = await Progress.findOne({ user_id });

    if (!progress) {
      // Create new progress document
      progress = await Progress.create({
        user_id,
        modules: [{ module_id }],
      });
    } else {
      // Avoid duplicates
      const alreadyExists = progress.modules.some(
        (m) => m.module_id.toString() === module_id
      );

      if (alreadyExists) {
        return res.status(400).json({
          message: 'You have already added this module to your progress',
        });
      }

      progress.modules.push({ module_id });
      await progress.save();
    }

    logger.info('[addModuleToProgress] => Add module to progress done.');
    return res.status(200).json({
      message: 'Module added to progress',
      data: progress,
    });
  } catch (error) {
    console.error('[addModuleToProgress] => Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const markModuleAsCompleted = async (req, res) => {
  try {
    logger.info('[markModuleAsCompleted] => Mark module as completed started.');
    const user_id = req.user._id;
    const { module_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(module_id)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    const moduleExists = await Module.exists({ _id: module_id });
    if (!moduleExists) {
      return res.status(404).json({ message: 'Module does not exist' });
    }

    const progress = await Progress.findOne({ user_id });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    const moduleProgress = progress.modules.find(
      (m) => m.module_id.toString() === module_id
    );

    if (!moduleProgress) {
      return res.status(404).json({ message: 'Module not found in progress' });
    }

    moduleProgress.isCompleted = true;
    moduleProgress.completedAt = new Date();
    
    await progress.save();

    logger.info('[markModuleAsCompleted] => Mark module as completed done.');
    return res.status(200).json({
      message: 'Module marked as completed',
      data: progress,
    });
  } catch (error) {
    console.error('[markModuleAsCompleted]', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const getUserProgressModules = async (req, res) => {
  try {
    logger.info('[getUserProgressModules] => Get progress modules started.');
    const user_id = req.user._id;

    const progress = await Progress.findOne({ user_id })
      .populate('modules.module_id');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    const modulesWithStatus = progress.modules.map(m => ({
      module: m.module_id,
      isCompleted: m.isCompleted,
      completedAt: m.completedAt,
    }));

    if (modulesWithStatus.length === 0) {
      return res.status(404).json({ message: `No modules found in progress for ${req.user.first_name} ${req.user.last_name}` });
    } 

    logger.info('[getUserProgressModules] => Get progress modules done.');
    return res.status(200).json({
      message: 'User progress modules retrieved',
      data: modulesWithStatus
    });
  } catch (error) {
    console.error('[getUserProgressModules] => Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const removeModuleFromProgress = async (req, res) => {
  try {
    logger.info('[removeModuleFromProgress] => Remove module process started.');
    const user_id = req.user._id;
    const { module_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(module_id)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    const progress = await Progress.findOne({ user_id });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    const initialCount = progress.modules.length;
    progress.modules = progress.modules.filter(
      (m) => m.module_id.toString() !== module_id
    );

    if (progress.modules.length === initialCount) {
      return res.status(404).json({ message: 'Module not found in progress' });
    }

    await progress.save();

    logger.info('[removeModuleFromProgress] => Remove module process done.');
    return res.status(200).json({
      message: 'Module removed from progress',
      data: progress,
    });
  } catch (error) {
    console.error('[removeModuleFromProgress] => Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};





module.exports = {
  addModuleToProgress,
  markModuleAsCompleted,
  getUserProgressModules,
  removeModuleFromProgress
};

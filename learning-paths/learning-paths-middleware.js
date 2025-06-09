const joi = require('joi');
const logger = require('../logger');

const ValidateLearningPathCreation = async (req, res, next) => {
  try {
    logger.info('[ValidateLearningPathCreation] => Validation started...');

    const schema = joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });

    logger.info('[ValidateLearningPathCreation] => Validation done.');
    next();
  } catch (error) {
    return res.status(422).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  ValidateLearningPathCreation
};

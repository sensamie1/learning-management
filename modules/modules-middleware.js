const joi = require('joi');
const logger = require('../logger');

const ValidateModuleCreation = async (req, res, next) => {
  try {
    logger.info('[ValidateModuleCreation] => Validation started...');

    const schema = joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      contentUrl: joi.string().uri().required(),
      learning_path_id: joi.string().required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });

    logger.info('[ValidateModuleCreation] => Validation done.');
    next();
  } catch (error) {
    return res.status(422).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  ValidateModuleCreation
};

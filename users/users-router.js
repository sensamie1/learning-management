const express = require('express');
const middleware = require('./users-middleware')
const controller = require('./users-controller')
const globalMiddleware = require('../middlewares/global-user-middlewares')
const pathController = require('../learning-paths/learning-paths-controller');
const moduleController = require('../modules/modules-controller');
const progressController = require('../progress/progress-controller');
const pathValidateCreation = require('../learning-paths/learning-paths-middleware');
const moduleValidateCreation = require('../modules/modules-middleware');

const router = express.Router();


// Create user
router.post('/signup', globalMiddleware.checkBody, middleware.ValidateUserCreation, controller.CreateUser)

// Signin user
router.post('/login', middleware.LoginValidation, controller.Login)

// Admin create learning path
router.post('/admin/learning-paths/create', 
  globalMiddleware.bearerTokenAuth, 
  globalMiddleware.isAdmin, 
  globalMiddleware.checkBody, 
  pathValidateCreation.ValidateLearningPathCreation,
  pathController.createLearningPath
);

// Admin create modules
router.post('/admin/modules/create', 
  globalMiddleware.bearerTokenAuth, 
  globalMiddleware.isAdmin, 
  globalMiddleware.checkBody, 
  moduleValidateCreation.ValidateModuleCreation, 
  moduleController.createModule
);

// User get all learning paths
router.get('/learning-paths', globalMiddleware.bearerTokenAuth, pathController.getLearningPaths);

// User get all modules
router.get('/modules', globalMiddleware.bearerTokenAuth, moduleController.getModules);

// User get learning path by ID
router.get('/learning-paths/:path_id', globalMiddleware.bearerTokenAuth, pathController.getPathById);

// User get modules by ID
router.get('/modules/:module_id', globalMiddleware.bearerTokenAuth, moduleController.getModulesById);

//User get modules by learning path
router.get('/learning-paths/:path_id/modules', globalMiddleware.bearerTokenAuth, moduleController.getModulesByPath);

// User add module to progress
router.post('/progress/add-module',
  globalMiddleware.bearerTokenAuth, 
  globalMiddleware.checkBody, 
  progressController.addModuleToProgress
)

// User mark module as completed
router.patch('/progress/mark-completed',
  globalMiddleware.bearerTokenAuth, 
  globalMiddleware.checkBody, 
  progressController.markModuleAsCompleted
)

// User get all modules in progress
router.get('/progress/modules',
  globalMiddleware.bearerTokenAuth, 
  progressController.getUserProgressModules
)

// User remove module from progress
router.delete('/progress/remove-module',
  globalMiddleware.bearerTokenAuth, 
  globalMiddleware.checkBody, 
  progressController.removeModuleFromProgress
)




module.exports = router

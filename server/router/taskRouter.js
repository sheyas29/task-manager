import express from 'express';
import {
  createTask,
  deleteTask,
  editTask,
  getTaskFile,
  getTasks,
  markTaskDone,
} from '../controller/taskController.js';
import upload from '../middleware/upload.js';
import validate from '../middleware/validate.js';
import {
  editSchema,
  schema,
  statusSchema,
} from '../validator/taskValidator.js';

const router = express.Router();

router.post('/', upload.array('pdf', 5), validate(schema), createTask);
router.patch('/:taskId/status', validate(statusSchema), markTaskDone);
router.get('/', getTasks);
router.patch('/:taskId', validate(editSchema), editTask);
router.delete('/:taskId', deleteTask);
router.get('/:taskId/files/:fileIndex/:action', getTaskFile);
export default router;

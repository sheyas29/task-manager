import mongoose from 'mongoose';

import {
  createTaskService,
  deleteTaskService,
  editTaskService,
  getTaskFileService,
  getTasksService,
  markTaskDoneService,
} from '../service/taskService.js';

async function createTask(req, res, next) {
  try {
    const { title, description, status, deadline } = req.body;

    const taskData = {
      title,
      description,
      status,
      deadline,
      linkedFiles: (req.files ?? []).map((file) => file.buffer),
    };

    const task = await createTaskService(taskData);

    return res.status(201).json({
      message: 'Task created successfully',
      task: {
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        deadline: task.deadline,
        createdOn: task.createdOn,
        completedOn: task.completedOn ?? null,
        linkedFilesCount: task.linkedFiles?.length ?? 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function markTaskDone(req, res, next) {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    const task = await markTaskDoneService(taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      message: 'Task marked as done',
      task: {
        _id: task._id,
        title: task.title,
        status: task.status,
        deadline: task.deadline,
        completedOn: task.completedOn,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(req, res, next) {
  try {
    const tasks = await getTasksService();

    return res.status(200).json({
      message: 'Tasks retrieved successfully',
      tasks,
    });
  } catch (error) {
    next(error);
  }
}

export async function editTask(req, res, next) {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    const updated = await editTaskService(taskId, req.body);

    return res.status(200).json({
      message: 'Updated successfully',
      task: {
        _id: updated._id,
        title: updated.title,
        description: updated.description,
        status: updated.status,
        deadline: updated.deadline,
        createdOn: updated.createdOn,
        completedOn: updated.completedOn ?? null,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    await deleteTaskService(taskId);

    return res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getTaskFile(req, res, next) {
  try {
    const { taskId, fileIndex, action } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    const index = Number(fileIndex);

    if (!Number.isInteger(index) || index < 0) {
      return res.status(400).json({
        message: 'Invalid file index',
      });
    }

    if (!['view', 'download'].includes(action)) {
      return res.status(400).json({
        message: 'Invalid file action',
      });
    }

    const file = await getTaskFileService(taskId, index);

    res.setHeader('Content-Type', 'application/pdf');

    if (action === 'download') {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="task-${taskId}-file-${index + 1}.pdf"`
      );
    } else {
      res.setHeader('Content-Disposition', 'inline');
    }

    return res.status(200).send(file);
  } catch (error) {
    next(error);
  }
}

export { createTask };

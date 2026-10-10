import Task from '../model/task.js';

export async function createTaskService(data) {
  const task = await Task.create(data);
  return task;
}

export async function markTaskDoneService(taskId) {
  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      status: 'DONE',
      completedOn: new Date(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return task;
}

export async function getTaskByIdService(taskId) {
  const task = await Task.findById(taskId);
  return task;
}

export async function getTasksService() {
  return await Task.aggregate([
    {
      $project: {
        title: 1,
        description: 1,
        status: 1,
        createdOn: 1,
        deadline: 1,
        completedOn: 1,
        linkedFilesCount: {
          $size: { $ifNull: ['$linkedFiles', []] },
        },
      },
    },
  ]);
}

export async function editTaskService(taskId, data) {
  const task = await Task.findByIdAndUpdate(taskId, data, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  return task;
}

export async function deleteTaskService(taskId) {
  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  return task;
}

export async function getTaskFileService(taskId, fileIndex) {
  const task = await Task.findById(taskId).select('linkedFiles');

  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  const file = task.linkedFiles[fileIndex];

  if (!file) {
    const err = new Error('File not found');
    err.status = 404;
    throw err;
  }

  return file;
}

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ['TODO', 'DONE'],
    default: 'TODO',
  },

  linkedFiles: [
    {
      type: Buffer,
    },
  ],

  createdOn: {
    type: Date,
    default: Date.now,
  },
  completedOn: {
    type: Date,
    default: null,
  },

  deadline: {
    type: Date,
    required: true,
  },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;

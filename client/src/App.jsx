import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import React, { useEffect, useState } from 'react';

import {
  deleteTask,
  getTaskFileUrl,
  getTasks,
  markTaskDone,
} from './api/taskApi';

import AddTaskDialog from './components/AddTaskDialog';
import EditTaskDialog from './components/EditTaskDialog';

function getDisplayStatus(task) {
  const now = new Date();
  const deadline = new Date(task.deadline);

  if (task.status === 'DONE') {
    if (!task.completedOn) {
      return 'Achieved'; // Fallback for tasks without a completion timestamp
    }

    const completedOn = new Date(task.completedOn);

    return completedOn <= deadline ? 'Achieved' : 'Failed';
  }

  return now >= deadline ? 'Failed' : 'In Progress';
}

function getStatusColor(status) {
  if (status === 'Achieved') return 'success';
  if (status === 'Failed') return 'error';
  return 'info';
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  async function loadTasks() {
    try {
      setError('');
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load tasks. Check whether the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleMarkDone(taskId) {
    try {
      await markTaskDone(taskId);
      await loadTasks();
      setNotice('Task marked as done');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task');
    }
  }

  async function handleDelete(taskId) {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      await loadTasks();
      setNotice('Task deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task');
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fb', py: 5 }}>
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} color="#172554">
              Task Manager
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Manage your tasks, deadlines and progress.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            Add Task
          </Button>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 3 }}
          useFlexGap
          flexWrap="wrap"
        >
          <Paper sx={{ p: 2.5, minWidth: 150, flex: 1 }} elevation={0}>
            <Typography color="text.secondary" variant="body2">
              Total tasks
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {tasks.length}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2.5, minWidth: 150, flex: 1 }} elevation={0}>
            <Typography color="text.secondary" variant="body2">
              In progress
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {
                tasks.filter((task) => getDisplayStatus(task) === 'In Progress')
                  .length
              }
            </Typography>
          </Paper>

          <Paper sx={{ p: 2.5, minWidth: 150, flex: 1 }} elevation={0}>
            <Typography color="text.secondary" variant="body2">
              Achieved
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {
                tasks.filter((task) => getDisplayStatus(task) === 'Achieved')
                  .length
              }
            </Typography>
          </Paper>

          <Paper sx={{ p: 2.5, minWidth: 150, flex: 1 }} elevation={0}>
            <Typography color="text.secondary" variant="body2">
              Failed
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {
                tasks.filter((task) => getDisplayStatus(task) === 'Failed')
                  .length
              }
            </Typography>
          </Paper>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 2.5 }}>
            <Typography variant="h6" fontWeight={700}>
              All Tasks
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {tasks.length} task{tasks.length === 1 ? '' : 's'} in your
              workspace
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Deadline</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography fontWeight={600}>No tasks yet</Typography>
                        <Typography color="text.secondary" variant="body2">
                          Create your first task to get started.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tasks.map((task) => {
                      const displayStatus = getDisplayStatus(task);
                      const fileCount = task.linkedFilesCount ?? 0;

                      return (
                        <TableRow key={task._id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {task.title}
                          </TableCell>

                          <TableCell sx={{ maxWidth: 280 }}>
                            {task.description}
                          </TableCell>

                          <TableCell>
                            {new Date(task.deadline).toLocaleDateString()}
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={displayStatus}
                              color={getStatusColor(displayStatus)}
                              size="small"
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Stack
                              direction="row"
                              spacing={0.5}
                              justifyContent="flex-end"
                            >
                              {task.status !== 'DONE' && (
                                <IconButton
                                  color="success"
                                  title="Mark as done"
                                  aria-label="Mark task as done"
                                  onClick={() => handleMarkDone(task._id)}
                                >
                                  <CheckCircleOutlinedIcon />
                                </IconButton>
                              )}

                              <IconButton
                                color="primary"
                                title="Edit task"
                                aria-label="Edit task"
                                onClick={() => handleEdit(task)}
                              >
                                <EditOutlinedIcon />
                              </IconButton>

                              {Array.from({ length: fileCount }, (_, index) => (
                                <React.Fragment key={index}>
                                  <IconButton
                                    color="primary"
                                    title={`View PDF ${index + 1}`}
                                    aria-label={`View PDF ${index + 1}`}
                                    onClick={() =>
                                      window.open(
                                        getTaskFileUrl(task._id, index, 'view'),
                                        '_blank',
                                        'noopener,noreferrer'
                                      )
                                    }
                                  >
                                    <VisibilityOutlinedIcon />
                                  </IconButton>

                                  <IconButton
                                    color="primary"
                                    title={`Download PDF ${index + 1}`}
                                    aria-label={`Download PDF ${index + 1}`}
                                    onClick={() =>
                                      window.open(
                                        getTaskFileUrl(
                                          task._id,
                                          index,
                                          'download'
                                        ),
                                        '_blank',
                                        'noopener,noreferrer'
                                      )
                                    }
                                  >
                                    <DownloadOutlinedIcon />
                                  </IconButton>
                                </React.Fragment>
                              ))}

                              <IconButton
                                color="error"
                                title="Delete task"
                                aria-label="Delete task"
                                onClick={() => handleDelete(task._id)}
                              >
                                <DeleteOutlinedIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      <AddTaskDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreated={loadTasks}
      />

      <EditTaskDialog
        open={Boolean(editingTask)}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdated={loadTasks}
      />

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={() => setNotice('')}
        message={notice}
      />
    </Box>
  );
}

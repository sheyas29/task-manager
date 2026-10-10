import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { editTask } from '../api/taskApi';

function EditTaskDialog({ open, task, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        deadline: task.deadline
          ? new Date(task.deadline).toISOString().slice(0, 10)
          : '',
      });

      setError('');
    }
  }, [open, task]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.deadline
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSaving(true);

      await editTask(task._id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        deadline: formData.deadline,
      });

      onUpdated();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.join(', ') ||
          'Could not update the task.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Task</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              slotProps={{ htmlInput: { maxLength: 30 } }}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              minRows={3}
              slotProps={{ htmlInput: { maxLength: 120 } }}
            />

            <TextField
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditTaskDialog;

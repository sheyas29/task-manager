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
import { useState } from 'react';

import { createTask } from '../api/taskApi';

export default function AddTaskDialog({ open, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setTitle('');
    setDescription('');
    setDeadline('');
    setFiles([]);
    setError('');
  }

  function handleClose() {
    if (saving) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('deadline', deadline);
    formData.append('status', 'TODO');

    for (const file of files) {
      formData.append('pdf', file);
    }

    try {
      setSaving(true);
      await createTask(formData);
      resetForm();
      onClose();
      await onCreated();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.join(', ') ||
          'Could not create the task.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Task</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              fullWidth
              inputProps={{ maxLength: 30 }}
            />

            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              fullWidth
              multiline
              minRows={3}
              inputProps={{ maxLength: 120 }}
            />

            <TextField
              label="Deadline"
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <Button variant="outlined" component="label">
              Choose PDF files
              <input
                hidden
                type="file"
                accept="application/pdf,.pdf"
                multiple
                onChange={(event) => {
                  const selected = Array.from(event.target.files || []);
                  setFiles(selected.slice(0, 5));
                  event.target.value = '';
                }}
              />
            </Button>

            {files.length > 0 && (
              <Stack spacing={0.5}>
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                ))}
              </Stack>
            )}

            <Alert severity="info">
              Attach up to 5 PDF files, each up to 10 MB.
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

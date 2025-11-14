import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Priority, TicketRequest, User } from '../../types';
import { ticketService } from '../../services/ticketService';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

const TicketEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isSupport } = useAuth();
  const [formData, setFormData] = useState<TicketRequest>({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      loadTicket();
    }
    if (isSupport) {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isSupport]);

  const loadTicket = async () => {
    try {
      const ticket = await ticketService.getTicketById(Number(id));
      setFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        assignedToId: ticket.assignedTo?.id,
      });
    } catch (err) {
      setError('Failed to load ticket');
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await userService.getAllUsers();
      const supportUsers = allUsers.filter(u => u.role === 'SUPPORT' || u.role === 'ADMIN');
      setUsers(supportUsers);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode) {
        await ticketService.updateTicket(Number(id), formData);
      } else {
        await ticketService.createTicket(formData);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Edit Ticket' : 'Create New Ticket'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priority"
              required
            >
              <MenuItem value={Priority.LOW}>Low</MenuItem>
              <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
              <MenuItem value={Priority.HIGH}>High</MenuItem>
              <MenuItem value={Priority.CRITICAL}>Critical</MenuItem>
            </Select>
          </FormControl>

          {isSupport && users.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Assign To</InputLabel>
              <Select
                name="assignedToId"
                value={formData.assignedToId || ''}
                onChange={handleChange}
                label="Assign To"
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName} ({user.username})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default TicketEditor;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Ticket, Comment, TicketStatus } from '../../types';
import { ticketService } from '../../services/ticketService';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../contexts/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isSupport } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTicket();
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTicket = async () => {
    try {
      const data = await ticketService.getTicketById(Number(id));
      setTicket(data);
    } catch (err) {
      setError('Failed to load ticket');
    }
  };

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(Number(id));
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await commentService.addComment(Number(id), { content: newComment });
      setNewComment('');
      loadComments();
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    try {
      await ticketService.updateTicketStatus(Number(id), status);
      loadTicket();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'info';
      case 'IN_PROGRESS': return 'warning';
      case 'RESOLVED': return 'success';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  };

  if (!ticket) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const canEdit = user?.id === ticket.createdBy.id || isSupport;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {ticket.title}
          </Typography>
          {canEdit && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/tickets/edit/${ticket.id}`)}
            >
              Edit
            </Button>
          )}
        </Box>

        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Chip 
            label={ticket.status} 
            color={getStatusColor(ticket.status) as any}
          />
          <Chip 
            label={ticket.priority} 
            color={getPriorityColor(ticket.priority) as any}
          />
        </Box>

        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
          {ticket.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Created by: {ticket.createdBy.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created at: {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
            {ticket.assignedTo && (
              <Typography variant="body2" color="text.secondary">
                Assigned to: {ticket.assignedTo.fullName}
              </Typography>
            )}
          </Box>

          {isSupport && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                label="Status"
              >
                <MenuItem value={TicketStatus.OPEN}>Open</MenuItem>
                <MenuItem value={TicketStatus.IN_PROGRESS}>In Progress</MenuItem>
                <MenuItem value={TicketStatus.RESOLVED}>Resolved</MenuItem>
                <MenuItem value={TicketStatus.CLOSED}>Closed</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Comments ({comments.length})
        </Typography>

        <Box component="form" onSubmit={handleAddComment} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newComment.trim()}
          >
            Add Comment
          </Button>
        </Box>

        <List>
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              {index > 0 && <Divider />}
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2">
                        {comment.user.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                      {comment.content}
                    </Typography>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>

        {comments.length === 0 && (
          <Typography color="text.secondary" align="center">
            No comments yet
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default TicketDetail;

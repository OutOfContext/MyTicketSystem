import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Ticket, TicketStatus, Priority } from '../../types';
import { ticketService } from '../../services/ticketService';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface TicketListProps {
  filterType?: 'my' | 'assigned' | 'all';
}

const TicketList: React.FC<TicketListProps> = ({ filterType = 'all' }) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      let data: Ticket[];
      if (filterType === 'my') {
        data = await ticketService.getMyTickets();
      } else if (filterType === 'assigned') {
        data = await ticketService.getAssignedTickets();
      } else {
        data = await ticketService.getAllTickets();
      }
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await ticketService.searchTickets(
        search || undefined,
        statusFilter || undefined,
        priorityFilter || undefined
      );
      setTickets(data);
    } catch (err) {
      console.error('Failed to search tickets', err);
    } finally {
      setLoading(false);
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

  const getTitle = () => {
    if (filterType === 'my') return 'My Tickets';
    if (filterType === 'assigned') return 'Assigned to Me';
    return 'All Tickets';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {getTitle()}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/tickets/new')}
        >
          Create Ticket
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | '')}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={TicketStatus.OPEN}>Open</MenuItem>
              <MenuItem value={TicketStatus.IN_PROGRESS}>In Progress</MenuItem>
              <MenuItem value={TicketStatus.RESOLVED}>Resolved</MenuItem>
              <MenuItem value={TicketStatus.CLOSED}>Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
              label="Priority"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={Priority.LOW}>Low</MenuItem>
              <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
              <MenuItem value={Priority.HIGH}>High</MenuItem>
              <MenuItem value={Priority.CRITICAL}>Critical</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} hover>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Chip 
                    label={ticket.status} 
                    color={getStatusColor(ticket.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={ticket.priority} 
                    color={getPriorityColor(ticket.priority) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{ticket.createdBy.fullName}</TableCell>
                <TableCell>{ticket.assignedTo?.fullName || '-'}</TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{ticket.commentCount}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {tickets.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {loading ? 'Loading...' : 'No tickets found'}
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Container>
  );
};

export default TicketList;

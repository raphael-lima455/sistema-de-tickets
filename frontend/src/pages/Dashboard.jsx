import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { API_URL } from '../config/api'

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ticketsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/api/tickets`),
        axios.get(`${API_URL}/api/users`)
      ]);
      setTickets(ticketsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar dados');
      setLoading(false);
    }
  };

  // Estatísticas
  const totalTickets = tickets.length;
  const ticketsAbertos = tickets.filter(t => t.status === 'aberto').length;
  const ticketsEmAndamento = tickets.filter(t => t.status === 'em_andamento').length;
  const ticketsFechados = tickets.filter(t => t.status === 'fechado').length;
  const ticketsAltaPrioridade = tickets.filter(t => t.prioridade === 'alta').length;
  const ticketsNaoAtribuidos = tickets.filter(t => !t.atribuidoPara).length;
  const totalUsuarios = users.length;

  // Tickets recentes (últimos 5)
  const ticketsRecentes = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Cores
  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'error';
      case 'media': return 'warning';
      case 'baixa': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aberto': return 'success';
      case 'em_andamento': return 'info';
      case 'fechado': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  // Organização: Total/Abertos/Andamento/Fechados na primeira linha, stats extras na segunda.
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Primeira linha de cartões: Total, Abertos, Em Andamento, Fechados */}
      <Grid container spacing={2} mb={2} sx={{ width: '100%', flexWrap: 'nowrap', overflowX: 'auto' }}>
        {/* Total de Tickets */}
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ minWidth: 180, flex: 1 }}>
          <Card sx={{ bgcolor: '#1976d2', color: 'white', width: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalTickets}
                  </Typography>
                  <Typography variant="body2">Total de Tickets</Typography>
                </Box>
                <ConfirmationNumberIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Tickets Abertos */}
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ minWidth: 180, flex: 1 }}>
          <Card sx={{ bgcolor: '#2e7d32', color: 'white', width: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {ticketsAbertos}
                  </Typography>
                  <Typography variant="body2">Abertos</Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Tickets em Andamento */}
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ minWidth: 180, flex: 1 }}>
          <Card sx={{ bgcolor: '#ed6c02', color: 'white', width: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {ticketsEmAndamento}
                  </Typography>
                  <Typography variant="body2">Em Andamento</Typography>
                </Box>
                <AssignmentIndIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Tickets Fechados */}
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ minWidth: 180, flex: 1 }}>
          <Card sx={{ bgcolor: '#757575', color: 'white', width: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {ticketsFechados}
                  </Typography>
                  <Typography variant="body2">Fechados</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Segunda linha de cartões: Alta Prioridade, Não Atribuídos, Total de Usuários */}
      <Grid container spacing={2} mb={4} sx={{ width: '100%', flexWrap: 'nowrap', overflowX: 'auto' }}>
        {/* Alta Prioridade */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4} sx={{ minWidth: 180, flex: 1 }}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="error">
                    {ticketsAltaPrioridade}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Alta Prioridade
                  </Typography>
                </Box>
                <PriorityHighIcon sx={{ fontSize: 48, color: 'error.main', opacity: 0.6 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Não Atribuídos */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4} sx={{ minWidth: 180, flex: 1 }}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {ticketsNaoAtribuidos}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Não Atribuídos
                  </Typography>
                </Box>
                <AssignmentIndIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.6 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Total de Usuários */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4} sx={{ minWidth: 180, flex: 1 }}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {totalUsuarios}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de Usuários
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.6 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Tickets Recentes */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Tickets Recentes
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Título</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Prioridade</strong></TableCell>
                <TableCell><strong>Criado por</strong></TableCell>
                <TableCell><strong>Criado em</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ticketsRecentes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" py={2}>
                      Nenhum ticket encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                ticketsRecentes.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.titulo}</TableCell>
                    <TableCell>
                      <Chip 
                        label={ticket.status.replace('_', ' ')} 
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={ticket.prioridade} 
                        color={getPrioridadeColor(ticket.prioridade)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{ticket.criadoPorNome}</TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Grid,
  TablePagination,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { API_URL } from '../config/api'

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [prioridadeFilter, setPrioridadeFilter] = useState('todos');
  const [atribuidoFilter, setAtribuidoFilter] = useState('todos');
  
  // Paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    status: 'aberto',
    atribuidoPara: null
  });

  const [validationErrors, setValidationErrors] = useState({
    titulo: '',
    descricao: ''
  });

  // Buscar tickets do backend
  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tickets`);
      setTickets(response.data);
    } catch (err) {
      setError('Erro ao carregar tickets');
    }
  };

  // Buscar usuários
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data);
    } catch (err) {
      console.error('Erro ao carregar usuários');
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  // Filtrar tickets (FRONTEND - filtra os dados que vieram do backend)
  const getFilteredTickets = () => {
    return tickets.filter(ticket => {
      // Filtro de busca
      const matchSearch = searchTerm === '' || 
        ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de status
      const matchStatus = statusFilter === 'todos' || ticket.status === statusFilter;
      
      // Filtro de prioridade
      const matchPrioridade = prioridadeFilter === 'todos' || ticket.prioridade === prioridadeFilter;
      
      // Filtro de atribuído
      const matchAtribuido = atribuidoFilter === 'todos' || 
        (atribuidoFilter === 'nao_atribuido' && !ticket.atribuidoParaNome) ||
        (atribuidoFilter === 'atribuido' && ticket.atribuidoParaNome);
      
      return matchSearch && matchStatus && matchPrioridade && matchAtribuido;
    });
  };

  const filteredTickets = getFilteredTickets();
  const paginatedTickets = filteredTickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handlers de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setPrioridadeFilter('todos');
    setAtribuidoFilter('todos');
    setPage(0);
  };

  // Validação
  const validateTitulo = (value) => {
    if (!value) return 'Título é obrigatório';
    if (value.length < 3) return 'Título deve ter no mínimo 3 caracteres';
    return '';
  };

  const validateDescricao = (value) => {
    if (!value) return 'Descrição é obrigatória';
    if (value.length < 10) return 'Descrição deve ter no mínimo 10 caracteres';
    return '';
  };

  const handleTituloChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, titulo: value });
    setValidationErrors({ ...validationErrors, titulo: validateTitulo(value) });
  };

  const handleDescricaoChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, descricao: value });
    setValidationErrors({ ...validationErrors, descricao: validateDescricao(value) });
  };

  const handleOpenCreate = () => {
    setEditingTicket(null);
    setViewMode(false);
    setFormData({ 
      titulo: '', 
      descricao: '', 
      prioridade: 'media',
      status: 'aberto',
      atribuidoPara: null
    });
    setValidationErrors({ titulo: '', descricao: '' });
    setOpenDialog(true);
  };

  const handleOpenView = (ticket) => {
    setEditingTicket(ticket);
    setViewMode(true);
    setFormData({
      titulo: ticket.titulo,
      descricao: ticket.descricao,
      prioridade: ticket.prioridade,
      status: ticket.status,
      atribuidoPara: ticket.atribuidoPara
    });
    setValidationErrors({ titulo: '', descricao: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (ticket) => {
    setEditingTicket(ticket);
    setViewMode(false);
    setFormData({
      titulo: ticket.titulo,
      descricao: ticket.descricao,
      prioridade: ticket.prioridade,
      status: ticket.status,
      atribuidoPara: ticket.atribuidoPara
    });
    setValidationErrors({ titulo: '', descricao: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ 
      titulo: '', 
      descricao: '', 
      prioridade: 'media',
      status: 'aberto',
      atribuidoPara: null
    });
    setValidationErrors({ titulo: '', descricao: '' });
    setError('');
  };

  const handleSubmit = async () => {
    const tituloError = validateTitulo(formData.titulo);
    const descricaoError = validateDescricao(formData.descricao);

    setValidationErrors({
      titulo: tituloError,
      descricao: descricaoError
    });

    if (tituloError || descricaoError) {
      setError('Por favor, corrija os erros antes de continuar');
      return;
    }

    setError('');
    setSuccess('');

    try {
      if (editingTicket) {
        await axios.put(`${API_URL}/api/tickets/${editingTicket.id}`, formData);
        setSuccess('Ticket atualizado com sucesso!');
      } else {
        await axios.post(`${API_URL}/api/tickets`, {
          ...formData,
          criadoPor: user.id
        });
        setSuccess('Ticket criado com sucesso!');
      }
      
      fetchTickets();
      handleCloseDialog();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar ticket');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este ticket?')) return;

    try {
      await axios.delete(`${API_URL}/api/tickets/${id}`);
      setSuccess('Ticket deletado com sucesso!');
      fetchTickets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao deletar ticket');
    }
  };

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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tickets</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Novo Ticket
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <FilterListIcon color="action" />
          <Typography variant="h6">Filtros</Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="aberto">Aberto</MenuItem>
                <MenuItem value="em_andamento">Em andamento</MenuItem>
                <MenuItem value="fechado">Fechado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={prioridadeFilter}
                label="Prioridade"
                onChange={(e) => setPrioridadeFilter(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="baixa">Baixa</MenuItem>
                <MenuItem value="media">Média</MenuItem>
                <MenuItem value="alta">Alta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Atribuição</InputLabel>
              <Select
                value={atribuidoFilter}
                label="Atribuição"
                onChange={(e) => setAtribuidoFilter(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="atribuido">Atribuídos</MenuItem>
                <MenuItem value="nao_atribuido">Não atribuídos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={handleClearFilters}
              sx={{ height: '56px' }}
            >
              Limpar Filtros
            </Button>
          </Grid>
        </Grid>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Mostrando {filteredTickets.length} de {tickets.length} tickets
        </Typography>
      </Paper>

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Título</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Prioridade</strong></TableCell>
              <TableCell><strong>Criado por</strong></TableCell>
              <TableCell><strong>Atribuído para</strong></TableCell>
              <TableCell><strong>Criado em</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary" py={3}>
                    Nenhum ticket encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedTickets.map((ticket) => (
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
                  <TableCell>{ticket.atribuidoParaNome || 'Não atribuído'}</TableCell>
                  <TableCell>
                    {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenView(ticket)}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {user?.role === 'admin' && (
                      <>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenEdit(ticket)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(ticket.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          component="div"
          count={filteredTickets.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>

      {/* Modal de Criar/Editar/Visualizar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode ? 'Detalhes do Ticket' : editingTicket ? 'Editar Ticket' : 'Novo Ticket'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Título"
              value={formData.titulo}
              onChange={handleTituloChange}
              fullWidth
              required
              disabled={viewMode}
              error={!!validationErrors.titulo}
              helperText={validationErrors.titulo || 'Mínimo 3 caracteres'}
            />
            <TextField
              label="Descrição"
              value={formData.descricao}
              onChange={handleDescricaoChange}
              fullWidth
              multiline
              rows={4}
              required
              disabled={viewMode}
              error={!!validationErrors.descricao}
              helperText={validationErrors.descricao || 'Mínimo 10 caracteres'}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Prioridade</InputLabel>
                  <Select
                    value={formData.prioridade}
                    label="Prioridade"
                    onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                    disabled={viewMode || (editingTicket && user?.role !== 'admin')}
                  >
                    <MenuItem value="baixa">Baixa</MenuItem>
                    <MenuItem value="media">Média</MenuItem>
                    <MenuItem value="alta">Alta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {editingTicket && user?.role === 'admin' && (
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      disabled={viewMode}
                    >
                      <MenuItem value="aberto">Aberto</MenuItem>
                      <MenuItem value="em_andamento">Em andamento</MenuItem>
                      <MenuItem value="fechado">Fechado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            {user?.role === 'admin' && editingTicket && (
              <FormControl fullWidth>
                <InputLabel>Atribuir para</InputLabel>
                <Select
                  value={formData.atribuidoPara || ''}
                  label="Atribuir para"
                  onChange={(e) => setFormData({ ...formData, atribuidoPara: e.target.value || null })}
                  disabled={viewMode}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>{u.login}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {editingTicket && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Criado por:</strong> {editingTicket.criadoPorNome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Criado em:</strong> {new Date(editingTicket.createdAt).toLocaleString('pt-BR')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Última atualização:</strong> {new Date(editingTicket.updatedAt).toLocaleString('pt-BR')}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {viewMode ? 'Fechar' : 'Cancelar'}
          </Button>
          {!viewMode && (
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingTicket ? 'Salvar' : 'Criar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tickets;
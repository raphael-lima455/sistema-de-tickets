import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { API_URL } from '../config/api'

const Users = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    login: '',
    senha: '',
    role: 'user'
  });

  // Buscar usuários
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Erro ao carregar usuários');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Abrir modal de criar
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ login: '', senha: '', role: 'user' });
    setOpenDialog(true);
  };

  // Abrir modal de editar
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({ login: user.login, senha: '', role: user.role });
    setOpenDialog(true);
  };

  // Fechar modal
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ login: '', senha: '', role: 'user' });
    setError('');
  };

  // Criar/Editar usuário
  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        // Editar usuário (você vai criar esse endpoint depois)
        await axios.put(`${API_URL}/api/users/${editingUser.id}`, formData);
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        // Criar usuário
        await axios.post(`${API_URL}/api/auth/register`, formData);
        setSuccess('Usuário criado com sucesso!');
      }
      
      fetchUsers();
      handleCloseDialog();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar usuário');
    }
  };

  // Deletar usuário
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      setSuccess('Usuário deletado com sucesso!');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao deletar usuário');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gerenciar Usuários</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Novo Usuário
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Login</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Criado em</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.login}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={user.role === 'admin' ? 'error' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpenEdit(user)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(user.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Criar/Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Login"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label={editingUser ? 'Nova Senha (opcional)' : 'Senha'}
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              fullWidth
              required={!editingUser}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingUser ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
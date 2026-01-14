import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Container, Box, TextField, Button, Typography, Paper, Alert } from '@mui/material'

const Login = () => {
  const [loginInput, setLoginInput] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login({ login: loginInput, senha });

    if (result.success) {
      navigate('/app/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" minHeight="100vh" alignItems="center" justifyContent="center">
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Entrar no Sistema
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Login"
              variant="outlined"
              fullWidth
              margin="normal"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              required
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
import { z } from 'zod';
import { readJson, writeJson } from '../utils/jsonDb.js';


// Schema para atualizar usuário
const updateUserSchema = z.object({
  login: z.string().min(3, 'Login deve ter no mínimo 3 caracteres').optional(),
  senha: z.string().min(3, 'Senha deve ter no mínimo 3 caracteres').optional(),
  role: z.enum(['admin', 'user']).optional()
});

// GET - Listar todos os usuários
export const getUsers = async (req, res) => {
  try {
    const users = await readJson('users.json');

    // Remove as senhas antes de retornar
    const usersWithoutPassword = users.map(({ senha, ...user }) => user);

    res.json(usersWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// PUT - Atualizar usuário
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = updateUserSchema.parse(req.body);

    const users = await readJson('users.json');

    // Encontra o índice do usuário
    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Se está tentando mudar o login, verifica se já existe
    if (updates.login && updates.login !== users[userIndex].login) {
      const loginExists = users.find(u => u.login === updates.login);
      if (loginExists) {
        return res.status(400).json({ error: 'Login já existe' });
      }
    }

    // Atualiza o usuário (mantém os campos não enviados)
    users[userIndex] = {
      ...users[userIndex],
      ...updates
    };

    // Salva no arquivo
    await writeJson('users.json', users)

    // Remove a senha antes de retornar
    const { senha, ...userWithoutPassword } = users[userIndex];

    res.json({
      message: 'Usuário atualizado com sucesso',
      user: userWithoutPassword
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(err => ({
        campo: err.path.join('.'),
        mensagem: err.message
      }));
      return res.status(400).json({
        error: 'Erro de validação',
        detalhes: formattedErrors
      });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// DELETE - Deletar usuário
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Lê os usuários
    const users = await readJson('users.json');

    // Encontra o usuário
    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Não permite deletar o admin principal (id 1)
    if (parseInt(id) === 1) {
      return res.status(403).json({ error: 'Não é possível deletar o admin principal' });
    }

    // Remove o usuário
    users.splice(userIndex, 1);

    // Salva no arquivo
    await writeJson('users.json', users)

    res.json({ message: 'Usuário deletado com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
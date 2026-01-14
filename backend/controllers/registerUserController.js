import { z } from 'zod';
import { readJson, writeJson } from '../utils/jsonDb.js';


const registerSchema = z.object({
  login: z.string().min(3, 'Login deve ter no mínimo 3 caracteres'),
  senha: z.string().min(3, 'Senha deve ter no mínimo 3 caracteres'),
  role: z.enum(['admin', 'user']).default('user').optional()
});

export const registerUser = async (req, res) => {
  try {
    // Valida os dados (role é opcional, padrão 'user')
    const { login, senha, role = 'user' } = registerSchema.parse(req.body);

    // Lê os usuários existentes
    const users = await readJson('users.json');


    // Verifica se o login já existe
    const userExists = users.find(u => u.login === login);
    if (userExists) {
      return res.status(400).json({ error: 'Login já existe' });
    }

    // Cria o novo usuário
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      login,
      senha,
      role,
      createdAt: new Date().toISOString()
    };

    // Adiciona o novo usuário ao array
    users.push(newUser);

    // Salva no arquivo
    await writeJson('users.json', users);

    // Remove a senha antes de retornar
    const { senha: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userWithoutPassword
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Formata os erros do Zod de forma legível
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
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};
import { z } from 'zod';
import { readJson } from '../utils/jsonDb.js';

const loginSchema = z.object({
  login: z.string().min(3),
  senha: z.string().min(3)
});

export const login = async (req, res) => {
  try {
    const { login, senha } = loginSchema.parse(req.body);

    // Lê o arquivo direto
    const users = await readJson('users.json');

    const user = users.find(u => u.login === login && u.senha === senha);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const { senha: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Erro no servidor' });
  }
};
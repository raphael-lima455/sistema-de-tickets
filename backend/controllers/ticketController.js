import { z } from 'zod';
import { readJson, writeJson } from '../utils/jsonDb.js';

// Schema para criar ticket
const createTicketSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  prioridade: z.enum(['baixa', 'media', 'alta'], { message: 'Prioridade inválida' }),
  criadoPor: z.number()
});

// Schema para atualizar ticket
const updateTicketSchema = z.object({
  titulo: z.string().min(3).optional(),
  descricao: z.string().min(10).optional(),
  status: z.enum(['aberto', 'em_andamento', 'fechado']).optional(),
  prioridade: z.enum(['baixa', 'media', 'alta']).optional(),
  atribuidoPara: z.number().nullable().optional()
});

// GET - Listar todos os tickets
export const getTickets = async (req, res) => {
  try {
    // Lê tickets
    const tickets = await readJson('tickets.json');

    // Lê usuários
    const users = await readJson('users.json');

    // Popula os tickets com os nomes dos usuários
    const ticketsComNomes = tickets.map(ticket => {
      const criador = users.find(u => u.id === ticket.criadoPor);
      const atribuido = users.find(u => u.id === ticket.atribuidoPara);

      return {
        ...ticket,
        criadoPorNome: criador?.login || 'Desconhecido',
        atribuidoParaNome: atribuido?.login || null
      };
    });

    res.json(ticketsComNomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tickets' });
  }
};

// GET - Buscar ticket por ID
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    // Lê tickets
    const tickets = await readJson('tickets.json');

    // Lê usuários
    const users = await readJson('users.json');


    // Encontra o ticket
    const ticket = tickets.find(t => t.id === parseInt(id));

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    // Popula com nomes
    const criador = users.find(u => u.id === ticket.criadoPor);
    const atribuido = users.find(u => u.id === ticket.atribuidoPara);

    const ticketComNomes = {
      ...ticket,
      criadoPorNome: criador?.login || 'Desconhecido',
      atribuidoParaNome: atribuido?.login || null
    };

    res.json(ticketComNomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar ticket' });
  }
};

// POST - Criar novo ticket
export const createTicket = async (req, res) => {
  try {
    const dados = createTicketSchema.parse(req.body);

    // Lê os tickets existentes
    const tickets = await readJson('tickets.json');


    // Cria o novo ticket
    const novoTicket = {
      id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
      titulo: dados.titulo,
      descricao: dados.descricao,
      status: 'aberto',
      prioridade: dados.prioridade,
      criadoPor: dados.criadoPor,
      atribuidoPara: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Adiciona ao array
    tickets.push(novoTicket);

    // Salva no arquivo
    await writeJson('tickets.json', tickets);

    // Busca o nome do criador para retornar
    const users = await readJson('users.json');
    const criador = users.find(u => u.id === novoTicket.criadoPor);

    res.status(201).json({
      message: 'Ticket criado com sucesso',
      ticket: {
        ...novoTicket,
        criadoPorNome: criador?.login || 'Desconhecido',
        atribuidoParaNome: null
      }
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
    res.status(500).json({ error: 'Erro ao criar ticket' });
  }
};

// PUT - Atualizar ticket
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = updateTicketSchema.parse(req.body);

    // Lê os tickets
    const tickets = await readJson('tickets.json');

    // Encontra o ticket
    const ticketIndex = tickets.findIndex(t => t.id === parseInt(id));

    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    // Atualiza o ticket
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Salva no arquivo
    await writeJson('tickets.json', tickets);

    // Busca nomes dos usuários
    const users = await readJson('users.json');
    const criador = users.find(u => u.id === tickets[ticketIndex].criadoPor);
    const atribuido = users.find(u => u.id === tickets[ticketIndex].atribuidoPara);

    res.json({
      message: 'Ticket atualizado com sucesso',
      ticket: {
        ...tickets[ticketIndex],
        criadoPorNome: criador?.login || 'Desconhecido',
        atribuidoParaNome: atribuido?.login || null
      }
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
    res.status(500).json({ error: 'Erro ao atualizar ticket' });
  }
};

// DELETE - Deletar ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    // Lê os tickets
    const tickets = await readJson('tickets.json');

    // Encontra o ticket
    const ticketIndex = tickets.findIndex(t => t.id === parseInt(id));

    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    // Remove o ticket
    tickets.splice(ticketIndex, 1);

    // Salva no arquivo
    await writeJson('tickets.json', tickets);

    res.json({ message: 'Ticket deletado com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar ticket' });
  }
};
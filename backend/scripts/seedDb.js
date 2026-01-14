// scripts/seedDb.js
import { writeJson } from '../utils/jsonDb.js';

const initialUsers = [
  {
    "id": 1,
    "login": "admin",
    "senha": "admin",
    "role": "admin",
    "createdAt": "2025-01-13T00:00:00.000Z"
  },
];

const initialTickets = [
  {
    "id": 2,
    "titulo": "Sistema lento",
    "descricao": "O sistema está demorando muito para carregar as páginas",
    "status": "em_andamento",
    "prioridade": "baixa",
    "criadoPor": 1,
    "atribuidoPara": null,
    "createdAt": "2026-01-14T02:00:49.926Z",
    "updatedAt": "2026-01-14T02:43:06.849Z"
  }
];

await writeJson('users.json', initialUsers);
await writeJson('tickets.json', initialTickets);

console.log('✅ Banco inicializado com sucesso!');
console.log(`📊 ${initialUsers.length} usuários criados`);
console.log(`🎫 ${initialTickets.length} tickets criados`);
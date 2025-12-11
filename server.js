const express = require('express');   
const cors = require('cors');
require('dotenv').config();
const supabase = require('./db');



const app = express();
app.use(cors());
app.use(express.json());

console.log('[DEBUG] Express app initialized');

const PORT = process.env.PORT || 4000;

// Global error handler for uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Rota: listar recados
app.get('/api/recados', async (req, res) => {
  const { data, error } = await supabase
    .from('recados')
    .select(`
      id,
      mensagem,
      usuario_id (
        nome
      )
    `);

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});



// Rota: criar recado
app.post('/api/recados', async (req, res) => {
try {
const { mensagem, usuario_id } = req.body;
if (!mensagem || !usuario_id) {
return res.status(400).json({ error: 'mensagem e usuario_id são obrigatórios' });
}


const { data, error } = await supabase
.from('recados')
.insert([{ mensagem, usuario_id }])
.select()
.single();


if (error) throw error;
res.status(201).json(data);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro ao criar recado' });
}
});


// Rota: criar usuário
app.post('/api/usuario_id', async (req, res) => {
try {
const { nome } = req.body;
if (!nome) return res.status(400).json({ error: 'nome é obrigatório' });

const { data, error } = await supabase
.from('usuarios')
.insert([{ nome }])
.select()
.single();


if (error) throw error;
res.status(201).json(data);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro ao criar usuário' });
}
});


app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

console.log('[DEBUG] Server listening - now waiting for requests');

// Keep the process alive
setInterval(() => {
  // This prevents the process from exiting
}, 60000);

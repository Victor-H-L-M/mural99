const supabase = require('../db');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
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
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar recados' });
      }

      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }

  if (req.method === 'POST') {
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

      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar recado', details: error });
      }

      return res.status(201).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method Not Allowed');
};

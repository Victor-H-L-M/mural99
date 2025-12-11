const supabase = require('../db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { nome } = req.body || {};
    if (!nome) return res.status(400).json({ error: 'nome é obrigatório' });

    const { data, error } = await supabase
      .from('usuario_id')
      .insert([{ nome }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Erro ao criar usuário', details: error });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno' });
  }
};

const formUsuario = document.getElementById('form-usuario');
const formRecado = document.getElementById('form-recado');
const listaRecados = document.getElementById('lista-recados');

// Usar a URL completa do backend (porta 4000) quando servir estático via Live Server
const API_URL = 'http://127.0.0.1:4000/api'; // apontar diretamente para o backend

if (!formUsuario) console.warn('form-usuario não encontrado no DOM');
if (!formRecado) console.warn('form-recado não encontrado no DOM');
if (!listaRecados) console.warn('lista-recados não encontrado no DOM');

if (formUsuario) {
  formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeUsuario')?.value?.trim();

    if (!nome) {
      alert('Por favor, preencha o nome do usuário.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuario_id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome })
      });

      if (!res.ok) {
        let detalhe = '';
        try {
          detalhe = await res.text();
        } catch (err) {
          detalhe = '(não foi possível ler o corpo da resposta)';
        }
        console.error('Falha ao cadastrar usuário', res.status, detalhe);
        throw new Error(`Erro ao cadastrar usuário (status ${res.status}): ${detalhe}`);
      }

      let dados = null;
      try {
        dados = await res.json();
      } catch (err) {
        // sem corpo JSON
      }

      alert('Usuário cadastrado com sucesso!' + (dados && (dados.id || dados._id) ? ` ID: ${dados.id || dados._id}` : ''));
      formUsuario.reset();

    } catch (err) {
      console.error(err);
      alert(err.message || 'Erro ao cadastrar usuário');
    }
  });
}

if (formRecado) {
  formRecado.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mensagem = document.getElementById('mensagem')?.value;
    const usuario_id = document.getElementById('usuarioId')?.value;

    if (!mensagem || !usuario_id) {
      alert('Preencha todos os campos do recado.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/recados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mensagem,
          usuario_id
        })
      });

      if (!res.ok) {
        let detalhe = '';
        try {
          detalhe = await res.text();
        } catch (err) {
          detalhe = '(não foi possível ler o corpo da resposta)';
        }
        console.error('Falha ao enviar recado', res.status, detalhe);
        throw new Error(`Erro ao enviar recado (status ${res.status}): ${detalhe}`);
      }

      formRecado.reset();
      carregarRecados();

    } catch (err) {
      console.error(err);
      alert(err.message || 'Erro ao enviar recado');
    }
  });
}

// Função unificada para carregar recados (retirada duplicação)
async function carregarRecados() {
  console.log('CARREGAR RECADOS CHAMADO');
  try {
    const res = await fetch(`${API_URL}/recados`);
    if (!res.ok) {
      let detalhe = '';
      try {
        detalhe = await res.text();
      } catch (err) {
        detalhe = '(não foi possível ler o corpo da resposta)';
      }
      console.error('Falha ao buscar recados', res.status, detalhe);
      return;
    }
    const dados = await res.json();
    listaRecados.innerHTML = '';
    dados.forEach(r => {
      const li = document.createElement('li');
      li.textContent = `${r.usuario_id?.nome || 'Usuário'}: ${r.mensagem}`;
      listaRecados.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

carregarRecados();

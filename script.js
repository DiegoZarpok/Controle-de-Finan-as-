let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
let editIndex = null;  // Índice da transação sendo editada

// Formata valor como moeda
function formatCurrency(value) {
    if (isNaN(value)) {
        return 'R$ 0,00';
    }
    return 'R$ ' + value.toFixed(2).replace('.', ',');
}

// Formata data
function formatDate(date) {
    return date.split('-').reverse().join('/');
}

// Salva transações no localStorage
const saveToLocalStorage = () => {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
};

// Renderiza tabela
function renderTable() {
    const tbody = document.getElementById('transacoesTableBody');
    tbody.innerHTML = ''; 

    transacoes.forEach((transacao, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transacao.descricao}</td>
            <td>${formatCurrency(transacao.valor)}</td>
            <td>${formatDate(transacao.data)}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editTransacao(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTransacao(${index})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    calcularSaldo();
}

// Calcula saldo
function calcularSaldo() {
    const saldo = transacoes.reduce((acc, t) => acc + t.valor, 0);
    document.getElementById('saldo').textContent = 'Saldo Total: ' + formatCurrency(saldo);
}

// Adiciona ou edita transação
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value.replace(',', '.')) || 0;
    const data = document.getElementById('data').value;
    
    if (descricao && valor && data) {
        if (editIndex !== null) {
            // Se estamos editando, atualizamos a transação existente
            transacoes[editIndex] = { descricao, valor, data };
            editIndex = null; // Limpa o índice de edição após salvar
        } else {
            // Se não estamos editando, adicionamos uma nova transação
            transacoes.push({ descricao, valor, data });
        }
        saveToLocalStorage();
        renderTable();
        e.target.reset(); // Limpa o formulário
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
});

// Abre modal de exclusão
function deleteTransacao(index) {
    deleteIndex = index;
    document.getElementById('confirmDeleteModal').style.display = 'flex';
}

// Fecha modal
function closeModal() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
    deleteIndex = null;
}

// Confirma exclusão
document.getElementById('confirmDeleteButton').addEventListener('click', () => {
    if (deleteIndex !== null) {
        transacoes.splice(deleteIndex, 1);
        saveToLocalStorage();
        renderTable();
    }
    closeModal();
});

// Alterna modo escuro
document.getElementById('toggleDarkMode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Função chamada quando o botão de editar é clicado
function editTransacao(index) {
    const transacao = transacoes[index];
    document.getElementById('descricao').value = transacao.descricao;
    document.getElementById('valor').value = transacao.valor.toFixed(2).replace('.', ',');
    document.getElementById('data').value = transacao.data;
    editIndex = index; // Armazena o índice da transação que está sendo editada
}

// Renderiza a tabela ao carregar a página
renderTable();

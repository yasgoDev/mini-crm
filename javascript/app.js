function getData(chave) {
  return JSON.parse(localStorage.getItem(chave)) || [];
}

function setData(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function gerarId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/* =========================
   DASHBOARD
========================= */
function atualizarDashboard() {
  const clientes = getData("clientes");
  const produtos = getData("produtos");
  const vendas = getData("vendas");

  const faturamento = vendas.reduce((total, venda) => total + Number(venda.total), 0);

  const totalClientes = document.getElementById("totalClientes");
  const totalProdutos = document.getElementById("totalProdutos");
  const totalVendas = document.getElementById("totalVendas");
  const faturamentoTotal = document.getElementById("faturamentoTotal");

  if (totalClientes) totalClientes.textContent = clientes.length;
  if (totalProdutos) totalProdutos.textContent = produtos.length;
  if (totalVendas) totalVendas.textContent = vendas.length;
  if (faturamentoTotal) faturamentoTotal.textContent = formatarMoeda(faturamento);
}

/* =========================
   CLIENTES
========================= */
function iniciarPaginaClientes() {
  listarClientes();

  const formCliente = document.getElementById("formCliente");
  const buscaCliente = document.getElementById("buscaCliente");

  if (formCliente) {
    formCliente.addEventListener("submit", salvarCliente);
  }

  if (buscaCliente) {
    buscaCliente.addEventListener("input", listarClientes);
  }
}

function salvarCliente(event) {
  event.preventDefault();

  const clientes = getData("clientes");
  const id = document.getElementById("clienteId").value;

  const cliente = {
    id: id ? Number(id) : gerarId(),
    nome: document.getElementById("nomeCliente").value.trim(),
    telefone: document.getElementById("telefoneCliente").value.trim(),
    email: document.getElementById("emailCliente").value.trim(),
    categoria: document.getElementById("categoriaCliente").value.trim(),
    observacoes: document.getElementById("obsCliente").value.trim()
  };

  if (!cliente.nome) {
    alert("Preencha o nome do cliente.");
    return;
  }

  if (id) {
    const index = clientes.findIndex(c => c.id === Number(id));
    clientes[index] = cliente;
  } else {
    clientes.push(cliente);
  }

  setData("clientes", clientes);
  limparFormularioCliente();
  listarClientes();
}

function listarClientes() {
  const lista = document.getElementById("listaClientes");
  if (!lista) return;

  const busca = (document.getElementById("buscaCliente")?.value || "").toLowerCase();
  const clientes = getData("clientes").filter(cliente =>
    cliente.nome.toLowerCase().includes(busca)
  );

  lista.innerHTML = "";

  if (clientes.length === 0) {
    lista.innerHTML = `<div class="empty">Nenhum cliente cadastrado.</div>`;
    return;
  }

  clientes.forEach(cliente => {
    const div = document.createElement("div");
    div.className = "item-card";
    div.innerHTML = `
      <h3>${cliente.nome}</h3>
      <p><strong>Telefone:</strong> ${cliente.telefone || "-"}</p>
      <p><strong>E-mail:</strong> ${cliente.email || "-"}</p>
      <p><strong>Categoria:</strong> ${cliente.categoria || "-"}</p>
      <p><strong>Observações:</strong> ${cliente.observacoes || "-"}</p>
      <div class="item-actions">
        <button class="btn edit" onclick="editarCliente(${cliente.id})">Editar</button>
        <button class="btn delete" onclick="excluirCliente(${cliente.id})">Excluir</button>
        <button class="btn primary" onclick="irParaVenda(${cliente.id})">Cadastrar Venda</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

function editarCliente(id) {
  const clientes = getData("clientes");
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) return;

  document.getElementById("clienteId").value = cliente.id;
  document.getElementById("nomeCliente").value = cliente.nome;
  document.getElementById("telefoneCliente").value = cliente.telefone;
  document.getElementById("emailCliente").value = cliente.email;
  document.getElementById("categoriaCliente").value = cliente.categoria;
  document.getElementById("obsCliente").value = cliente.observacoes;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function excluirCliente(id) {
  const confirmar = confirm("Deseja excluir este cliente?");
  if (!confirmar) return;

  const clientes = getData("clientes").filter(c => c.id !== id);
  setData("clientes", clientes);
  listarClientes();
}

function limparFormularioCliente() {
  document.getElementById("clienteId").value = "";
  document.getElementById("nomeCliente").value = "";
  document.getElementById("telefoneCliente").value = "";
  document.getElementById("emailCliente").value = "";
  document.getElementById("categoriaCliente").value = "";
  document.getElementById("obsCliente").value = "";
}

function irParaVenda(clienteId) {
  localStorage.setItem("clienteSelecionadoVenda", clienteId);
  window.location.href = "vendas.html";
}

/* =========================
   PRODUTOS
========================= */
function iniciarPaginaProdutos() {
  listarProdutos();

  const formProduto = document.getElementById("formProduto");
  if (formProduto) {
    formProduto.addEventListener("submit", salvarProduto);
  }
}

function salvarProduto(event) {
  event.preventDefault();

  const produtos = getData("produtos");
  const id = document.getElementById("produtoId").value;

  const produto = {
    id: id ? Number(id) : gerarId(),
    nome: document.getElementById("nomeProduto").value.trim(),
    descricao: document.getElementById("descricaoProduto").value.trim(),
    precoCusto: Number(document.getElementById("precoCusto").value),
    precoVenda: Number(document.getElementById("precoVenda").value)
  };

  if (!produto.nome) {
    alert("Preencha o nome do produto.");
    return;
  }

  if (id) {
    const index = produtos.findIndex(p => p.id === Number(id));
    produtos[index] = produto;
  } else {
    produtos.push(produto);
  }

  setData("produtos", produtos);
  limparFormularioProduto();
  listarProdutos();
}

function listarProdutos() {
  const lista = document.getElementById("listaProdutos");
  if (!lista) return;

  const produtos = getData("produtos");
  lista.innerHTML = "";

  if (produtos.length === 0) {
    lista.innerHTML = `<div class="empty">Nenhum produto cadastrado.</div>`;
    return;
  }

  produtos.forEach(produto => {
    const div = document.createElement("div");
    div.className = "item-card";
    div.innerHTML = `
      <h3>${produto.nome}</h3>
      <p><strong>Descrição:</strong> ${produto.descricao || "-"}</p>
      <p><strong>Preço de custo:</strong> ${formatarMoeda(produto.precoCusto)}</p>
      <p><strong>Preço de venda:</strong> ${formatarMoeda(produto.precoVenda)}</p>
      <div class="item-actions">
        <button class="btn edit" onclick="editarProduto(${produto.id})">Editar</button>
        <button class="btn delete" onclick="excluirProduto(${produto.id})">Excluir</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

function editarProduto(id) {
  const produtos = getData("produtos");
  const produto = produtos.find(p => p.id === id);

  if (!produto) return;

  document.getElementById("produtoId").value = produto.id;
  document.getElementById("nomeProduto").value = produto.nome;
  document.getElementById("descricaoProduto").value = produto.descricao;
  document.getElementById("precoCusto").value = produto.precoCusto;
  document.getElementById("precoVenda").value = produto.precoVenda;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function excluirProduto(id) {
  const confirmar = confirm("Deseja excluir este produto?");
  if (!confirmar) return;

  const produtos = getData("produtos").filter(p => p.id !== id);
  setData("produtos", produtos);
  listarProdutos();
}

function limparFormularioProduto() {
  document.getElementById("produtoId").value = "";
  document.getElementById("nomeProduto").value = "";
  document.getElementById("descricaoProduto").value = "";
  document.getElementById("precoCusto").value = "";
  document.getElementById("precoVenda").value = "";
}

/* =========================
   VENDAS
========================= */
function iniciarPaginaVendas() {
  preencherSelectClientes();
  preencherSelectProdutos();
  listarVendas();

  const formVenda = document.getElementById("formVenda");
  if (formVenda) {
    formVenda.addEventListener("submit", salvarVenda);
  }

  const clienteSelecionado = localStorage.getItem("clienteSelecionadoVenda");
  if (clienteSelecionado) {
    document.getElementById("clienteVenda").value = clienteSelecionado;
    localStorage.removeItem("clienteSelecionadoVenda");
  }
}

function preencherSelectClientes() {
  const select = document.getElementById("clienteVenda");
  if (!select) return;

  const clientes = getData("clientes");
  select.innerHTML = `<option value="">Selecione um cliente</option>`;

  clientes.forEach(cliente => {
    select.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
  });
}

function preencherSelectProdutos() {
  const select = document.getElementById("produtoVenda");
  if (!select) return;

  const produtos = getData("produtos");
  select.innerHTML = `<option value="">Selecione um produto</option>`;

  produtos.forEach(produto => {
    select.innerHTML += `<option value="${produto.id}">${produto.nome}</option>`;
  });
}

function salvarVenda(event) {
  event.preventDefault();

  const vendas = getData("vendas");
  const clientes = getData("clientes");
  const produtos = getData("produtos");

  const clienteId = Number(document.getElementById("clienteVenda").value);
  const produtoId = Number(document.getElementById("produtoVenda").value);
  const quantidade = Number(document.getElementById("quantidadeVenda").value);
  const desconto = Number(document.getElementById("descontoVenda").value || 0);
  const observacoes = document.getElementById("obsVenda").value.trim();

  const cliente = clientes.find(c => c.id === clienteId);
  const produto = produtos.find(p => p.id === produtoId);

  if (!cliente || !produto) {
    alert("Selecione um cliente e um produto válidos.");
    return;
  }

  const subtotal = produto.precoVenda * quantidade;
  const total = subtotal - desconto;

  const venda = {
    id: gerarId(),
    clienteId: cliente.id,
    clienteNome: cliente.nome,
    produtoId: produto.id,
    produtoNome: produto.nome,
    quantidade: quantidade,
    precoUnitario: produto.precoVenda,
    subtotal: subtotal,
    desconto: desconto,
    total: total,
    observacoes: observacoes,
    data: new Date().toLocaleString("pt-BR")
  };

  vendas.push(venda);
  setData("vendas", vendas);

  document.getElementById("formVenda").reset();
  preencherSelectClientes();
  preencherSelectProdutos();
  listarVendas();

  alert("Venda cadastrada com sucesso!");
}

function listarVendas() {
  const lista = document.getElementById("listaVendas");
  if (!lista) return;

  const vendas = getData("vendas");
  lista.innerHTML = "";

  if (vendas.length === 0) {
    lista.innerHTML = `<div class="empty">Nenhuma venda cadastrada.</div>`;
    return;
  }

  vendas.slice().reverse().forEach(venda => {
    const div = document.createElement("div");
    div.className = "item-card";
    div.innerHTML = `
      <h3>Venda #${venda.id}</h3>
      <p><strong>Cliente:</strong> ${venda.clienteNome}</p>
      <p><strong>Produto:</strong> ${venda.produtoNome}</p>
      <p><strong>Quantidade:</strong> ${venda.quantidade}</p>
      <p><strong>Preço unitário:</strong> ${formatarMoeda(venda.precoUnitario)}</p>
      <p><strong>Subtotal:</strong> ${formatarMoeda(venda.subtotal)}</p>
      <p><strong>Desconto:</strong> ${formatarMoeda(venda.desconto)}</p>
      <p><strong>Total:</strong> ${formatarMoeda(venda.total)}</p>
      <p><strong>Data:</strong> ${venda.data}</p>
      <p><strong>Observações:</strong> ${venda.observacoes || "-"}</p>
      <div class="item-actions">
        <button class="btn pdf" onclick="gerarPDFVenda(${venda.id})">Gerar PDF</button>
        <button class="btn delete" onclick="excluirVenda(${venda.id})">Excluir</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

function excluirVenda(id) {
  const confirmar = confirm("Deseja excluir esta venda?");
  if (!confirmar) return;

  const vendas = getData("vendas").filter(v => v.id !== id);
  setData("vendas", vendas);
  listarVendas();
}

function gerarPDFVenda(id) {
  const vendas = getData("vendas");
  const venda = vendas.find(v => v.id === id);

  if (!venda) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Comprovante de Venda", 20, 20);

  doc.setFontSize(12);
  doc.text(`Venda: ${venda.id}`, 20, 35);
  doc.text(`Cliente: ${venda.clienteNome}`, 20, 45);
  doc.text(`Produto: ${venda.produtoNome}`, 20, 55);
  doc.text(`Quantidade: ${venda.quantidade}`, 20, 65);
  doc.text(`Preço unitário: ${formatarMoeda(venda.precoUnitario)}`, 20, 75);
  doc.text(`Subtotal: ${formatarMoeda(venda.subtotal)}`, 20, 85);
  doc.text(`Desconto: ${formatarMoeda(venda.desconto)}`, 20, 95);
  doc.text(`Total: ${formatarMoeda(venda.total)}`, 20, 105);
  doc.text(`Data: ${venda.data}`, 20, 115);
  doc.text(`Observações: ${venda.observacoes || "-"}`, 20, 125, { maxWidth: 170 });

  doc.save(`venda-${venda.id}.pdf`);
}
const initialClients = [
  { name: 'Camila Ribeiro', email: 'camila.ribeiro@email.com', phone: '(11) 98765-4321', date: '18 set, 2026', status: 'Ativo', tone: 'tone-a' },
  { name: 'Lucas Mendes', email: 'lucas.mendes@email.com', phone: '(21) 99876-5432', date: '17 set, 2026', status: 'Ativo', tone: 'tone-b' },
  { name: 'Beatriz Costa', email: 'beatriz.costa@email.com', phone: '(31) 97654-3210', date: '15 set, 2026', status: 'Ativo', tone: 'tone-c' },
  { name: 'Rafael Oliveira', email: 'rafael.oliveira@email.com', phone: '(41) 96543-2109', date: '12 set, 2026', status: 'Inativo', tone: 'tone-d' },
  { name: 'Juliana Martins', email: 'juliana.martins@email.com', phone: '(51) 95432-1098', date: '10 set, 2026', status: 'Ativo', tone: 'tone-e' },
];

let clients = JSON.parse(localStorage.getItem('clara-clients') || 'null') || initialClients;
const table = document.querySelector('#clientTable');
const searchInput = document.querySelector('#searchInput');
const statusFilter = document.querySelector('#statusFilter');
const emptyState = document.querySelector('#emptyState');
const resultCount = document.querySelector('#resultCount');
const purchases = [
  { name: 'Beatriz Costa', product: 'Plano Premium + Suporte', quantity: 6, total: 'R$ 4.860,00', date: '18 set, 2026' },
  { name: 'Camila Ribeiro', product: 'Plano Profissional', quantity: 4, total: 'R$ 2.480,00', date: '17 set, 2026' },
  { name: 'Lucas Mendes', product: 'Consultoria de implantação', quantity: 3, total: 'R$ 1.950,00', date: '15 set, 2026' },
  { name: 'Juliana Martins', product: 'Plano Premium', quantity: 2, total: 'R$ 1.240,00', date: '12 set, 2026' },
];

function initials(name) { return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }

function renderClients() {
  const term = searchInput.value.toLowerCase().trim();
  const status = statusFilter.value;
  const filtered = clients.filter((client) => {
    const matchesTerm = `${client.name} ${client.email}`.toLowerCase().includes(term);
    return matchesTerm && (status === 'Todos' || client.status === status);
  });
  table.innerHTML = filtered.map((client) => `<tr><td><div class="client-cell"><span class="client-avatar ${client.tone}">${initials(client.name)}</span>${client.name}</div></td><td>${client.email}<br><small>${client.phone}</small></td><td>${client.date}</td><td><span class="status ${client.status === 'Ativo' ? 'active' : 'inactive'}">${client.status}</span></td><td><button class="row-action" aria-label="Opções de ${client.name}">•••</button></td></tr>`).join('');
  emptyState.hidden = filtered.length > 0;
  resultCount.textContent = `Mostrando ${filtered.length} de ${clients.length} clientes`;
  document.querySelector('#totalClients').textContent = String(24 + clients.length - initialClients.length).padStart(2, '0');
  document.querySelector('#activeClients').textContent = String(clients.filter((client) => client.status === 'Ativo').length + 16).padStart(2, '0');
  document.querySelector('#inactiveClients').textContent = String(clients.filter((client) => client.status === 'Inativo').length).padStart(2, '0');
}

searchInput.addEventListener('input', renderClients);
statusFilter.addEventListener('change', renderClients);
renderClients();

function renderPurchases() {
  const filter = document.querySelector('#purchaseFilter').value;
  const rows = purchases.filter((purchase) => filter === 'Todos' || purchase.name === filter);
  document.querySelector('#purchaseTable').innerHTML = rows.map((purchase) => `<tr><td><div class="client-cell"><span class="client-avatar tone-c">${initials(purchase.name)}</span>${purchase.name}</div></td><td><strong>${purchase.product}</strong></td><td>${purchase.quantity} itens</td><td class="purchase-total">${purchase.total}</td><td>${purchase.date}</td></tr>`).join('');
}

document.querySelector('#purchaseFilter').addEventListener('change', renderPurchases);
renderPurchases();

const settingsForm = document.querySelector('#settingsForm');
const savedSettings = JSON.parse(localStorage.getItem('clara-settings') || 'null');
if (savedSettings) {
  Object.entries(savedSettings).forEach(([key, value]) => {
    const field = settingsForm.elements[key];
    if (field) field.type === 'checkbox' ? field.checked = value : field.value = value;
  });
}
settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(settingsForm);
  const settings = { systemName: formData.get('systemName'), adminName: formData.get('adminName'), dateFormat: formData.get('dateFormat'), notifications: formData.get('notifications') === 'on' };
  localStorage.setItem('clara-settings', JSON.stringify(settings));
  document.querySelector('.brand span:last-child').textContent = settings.systemName;
  document.querySelector('.profile-copy strong').textContent = settings.adminName;
  document.querySelector('#savedState').textContent = 'Configurações salvas agora';
  const toast = document.querySelector('#toast'); toast.textContent = 'Configurações salvas com sucesso.'; toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); document.querySelector('#savedState').textContent = 'Alterações salvas automaticamente'; }, 2800);
});
document.querySelector('#resetSettings').addEventListener('click', () => { localStorage.removeItem('clara-settings'); settingsForm.reset(); document.querySelector('#systemName').value = 'Sistema de cadastramento de cliente'; document.querySelector('#adminName').value = 'Stanley Alves'; });
document.querySelector('#exportReport').addEventListener('click', () => {
  const report = ['RELATÓRIO DE COMPRAS', '', 'Cliente que mais comprou: Beatriz Costa - R$ 4.860,00', 'Produto mais comprado: Plano Premium - 18 vendas', '', ...purchases.map((purchase) => `${purchase.name} | ${purchase.product} | ${purchase.quantity} itens | ${purchase.total} | ${purchase.date}`)].join('\n');
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([report], { type: 'text/plain' })); link.download = 'relatorio_compras.txt'; link.click(); URL.revokeObjectURL(link.href);
});

const modal = document.querySelector('#modal');
const openModal = () => { modal.hidden = false; document.querySelector('#clientForm input').focus(); };
const closeModal = () => { modal.hidden = true; };
document.querySelector('#openModal').addEventListener('click', openModal);
document.querySelector('#closeModal').addEventListener('click', closeModal);
document.querySelector('#cancelModal').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

document.querySelector('#clientForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  clients.unshift({ name: data.get('name'), email: data.get('email'), phone: data.get('phone'), date: '19 set, 2026', status: 'Ativo', tone: ['tone-a', 'tone-b', 'tone-c', 'tone-d', 'tone-e'][clients.length % 5] });
  localStorage.setItem('clara-clients', JSON.stringify(clients));
  event.currentTarget.reset(); closeModal(); renderClients();
  const toast = document.querySelector('#toast'); toast.textContent = 'Cliente cadastrado com sucesso.'; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
});

document.querySelector('#mobileMenu').addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('open'));
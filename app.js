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
const form = document.getElementById("blacklistForm");
const tableBody = document.querySelector("#blacklistTable tbody");
const searchInput = document.getElementById("search");

// Cargar datos de localStorage al iniciar
document.addEventListener("DOMContentLoaded", loadData);

// Agregar a la tabla
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const razon = document.getElementById("razon").value;
  const rol = document.getElementById("rol").value;
  const clase = document.getElementById("clase").value;

  const entry = { nombre, razon, rol, clase };
  saveToStorage(entry);
  addRow(entry);

  form.reset();
});

// Buscar en la tabla
searchInput.addEventListener("keyup", () => {
  const filter = searchInput.value.toLowerCase();
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach(row => {
    const nombre = row.cells[0].textContent.toLowerCase();
    row.style.display = nombre.includes(filter) ? "" : "none";
  });
});

// Función para agregar fila a la tabla
function addRow(entry) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${entry.nombre}</td>
    <td>${entry.razon}</td>
    <td>${entry.rol}</td>
    <td>${entry.clase}</td>
    <td><button class="delete">Eliminar</button></td>
  `;

  // Evento eliminar
  row.querySelector(".delete").addEventListener("click", () => {
    removeFromStorage(entry.nombre);
    row.remove();
  });

  tableBody.appendChild(row);
}

// Guardar en localStorage
function saveToStorage(entry) {
  let data = JSON.parse(localStorage.getItem("blacklist")) || [];
  data.push(entry);
  localStorage.setItem("blacklist", JSON.stringify(data));
}

// Cargar datos
function loadData() {
  let data = JSON.parse(localStorage.getItem("blacklist")) || [];
  data.forEach(entry => addRow(entry));
}

// Eliminar de localStorage
function removeFromStorage(nombre) {
  let data = JSON.parse(localStorage.getItem("blacklist")) || [];
  data = data.filter(entry => entry.nombre !== nombre);
  localStorage.setItem("blacklist", JSON.stringify(data));
}

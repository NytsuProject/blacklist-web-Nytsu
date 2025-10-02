// ⚡ Configura tus credenciales de Supabase aquí
const SUPABASE_URL = "https://kjncexypjqzwjtplboua.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbmNleHlwanF6d2p0cGxib3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzU0NDcsImV4cCI6MjA3NDk1MTQ0N30.x1qNlo4Nfwa-jrAUAdIVmkZeIOjKVCbDGQ78et8zQQo"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("blacklistForm");
const tableBody = document.querySelector("#blacklistTable tbody");
const searchInput = document.getElementById("search");

// Cargar datos al inicio
document.addEventListener("DOMContentLoaded", loadData);

// Agregar registro
form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const razon = document.getElementById("razon").value;
  const rol = document.getElementById("rol").value;
  const clase = document.getElementById("clase").value;

  const { data, error } = await supabaseClient
    .from("blacklist")
    .insert([{ nombre, razon, rol, clase }])
    .select();

  if (error) {
    alert("❌ Error guardando en la base: " + error.message);
  } else {
    addRow(data[0]);
    form.reset();
  }
});

// Cargar datos de Supabase
async function loadData() {
  const { data, error } = await supabaseClient
    .from("blacklist")
    .select("*");

  if (error) {
    console.error("Error cargando datos:", error);
    return;
  }

  tableBody.innerHTML = "";
  data.forEach(row => addRow(row));
}

// Agregar fila en la tabla
function addRow(item) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${item.nombre}</td>
    <td>${item.razon}</td>
    <td>${item.rol}</td>
    <td>${item.clase}</td>
    <td><button onclick="deleteRow('${item.id}', this)">Eliminar</button></td>
  `;
  tableBody.appendChild(row);
}

// Eliminar registro
async function deleteRow(id, btn) {
  const { error } = await supabaseClient
    .from("blacklist")
    .delete()
    .eq("id", id);

  if (error) {
    alert("❌ Error eliminando: " + error.message);
  } else {
    btn.closest("tr").remove();
  }
}

// Buscar en la tabla
searchInput.addEventListener("input", function() {
  const filter = searchInput.value.toLowerCase();
  const rows = tableBody.getElementsByTagName("tr");
  for (let row of rows) {
    const nombre = row.cells[0].textContent.toLowerCase();
    row.style.display = nombre.includes(filter) ? "" : "none";
  }
});


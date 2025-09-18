
const form = document.getElementById("personalForm");
const usuariosGrid = document.getElementById("usuariosGrid");
const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));
const confirmBtn = document.getElementById("confirmBtn");
const modalBody = document.querySelector("#confirmModal .modal-body");

let usuarios = [];
let usuarioTemp = null;


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const fechaNacimiento = new Date(document.getElementById("fechaNacimiento").value);
  const fechaIngreso = new Date(document.getElementById("fechaIngreso").value);
  const correo = document.getElementById("correo").value.trim();
  const cargo = document.getElementById("cargo").value.trim();
  const foto = document.getElementById("fotoPerfil").files[0] || null;

  if (usuarios.some(u => u.correo === correo)) {
    alert("El correo ya está registrado");
    return;
  }

  const fechaMinimaIngreso = new Date(fechaNacimiento);
  fechaMinimaIngreso.setFullYear(fechaMinimaIngreso.getFullYear() + 18);

  if (fechaIngreso < fechaMinimaIngreso) {
    alert("El usuario debe tener al menos 18 años al ingresar.");
    return;
  }

  usuarioTemp = { nombre, apellido, fechaNacimiento, fechaIngreso, correo, cargo, foto };

  modalBody.textContent = `¿Deseas agregar al usuario ${nombre} ${apellido}?`;

  confirmModal.show();
});

confirmBtn.addEventListener("click", () => {
  if (!usuarioTemp) return;

  usuarios.push(usuarioTemp);

  const usuarioActual = usuarioTemp;
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4";

  const reader = new FileReader();
  reader.onload = function(e) {
    const imgSrc = usuarioActual.foto ? e.target.result : "./assets/img/avatar.png";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${imgSrc}" class="card-img-top" alt="Foto de perfil">
        <div class="card-body">
          <h5 class="card-title">${usuarioActual.nombre} ${usuarioActual.apellido}</h5>
          <p class="card-text">
            <strong>Cargo:</strong> ${usuarioActual.cargo}<br>
            <strong>Correo:</strong> ${usuarioActual.correo}<br>
            <strong>Ingreso:</strong> ${usuarioActual.fechaIngreso.toLocaleDateString()}
          </p>
          <button type="button" class="btn btn-danger btn-sm eliminar">Eliminar</button>
        </div>
      </div>
    `;
    usuariosGrid.appendChild(col);

    col.querySelector(".eliminar").addEventListener("click", () => {
      usuarios = usuarios.filter(u => u.correo !== usuarioActual.correo);
      col.remove();
    });
  };

  if (usuarioActual.foto) {
    reader.readAsDataURL(usuarioActual.foto);
  } else {
    reader.onload({ target: { result: "./assets/img/avatar.png" } });
  }

  usuarioTemp = null;
  form.reset();
  confirmModal.hide();
});


// aca guardo mis tareas
let tareas = []
let filtroActual = "todas"

// key para no chocar con otras cosas
const LS_KEY = "tareasCoderFinal_v1"
const LS_SEED = "tareasCoderFinal_seeded_v1"

// agarro el html
const formTarea = document.getElementById("formTarea")
const inputTarea = document.getElementById("inputTarea")
const selectCategoria = document.getElementById("selectCategoria")
const selectPrioridad = document.getElementById("selectPrioridad")
const inputFecha = document.getElementById("inputFecha")
const inputMin = document.getElementById("inputMin")

const listaTareas = document.getElementById("listaTareas")
const msg = document.getElementById("msg")
const contador = document.getElementById("contador")

const filtroTodas = document.getElementById("filtroTodas")
const filtroPendientes = document.getElementById("filtroPendientes")
const filtroHechas = document.getElementById("filtroHechas")

const btnBorrarHechas = document.getElementById("btnBorrarHechas")
const btnLimpiar = document.getElementById("btnLimpiar")

const stPendientes = document.getElementById("stPendientes")
const stHechas = document.getElementById("stHechas")
const stMin = document.getElementById("stMin")

// una clase simple pa que se vea mas pro (y escalable)
class Tarea {
  constructor({ id, titulo, categoria, prioridad, fecha, minutos, hecha, creadaEn }) {
    this.id = id
    this.titulo = titulo
    this.categoria = categoria
    this.prioridad = prioridad
    this.fecha = fecha
    this.minutos = minutos
    this.hecha = hecha
    this.creadaEn = creadaEn
  }

  toggle() {
    this.hecha = !this.hecha
  }

  update(data) {
    this.titulo = data.titulo
    this.categoria = data.categoria
    this.prioridad = data.prioridad
    this.fecha = data.fecha
    this.minutos = data.minutos
  }
}

// helpers chiquitos
const uid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + "_" + Math.floor(Math.random() * 9999)

const hoyISO = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const guardar = () => {
  localStorage.setItem(LS_KEY, JSON.stringify(tareas))
}

const leer = () => {
  const raw = localStorage.getItem(LS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

const toast = (icon, title) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
    icon,
    title
  })
}

// aca cargo categorias y tareas base desde un json (async)
const cargarDesdeJSON = async () => {
  try {
    const res = await fetch("data.json", { cache: "no-store" })
    if (!res.ok) throw new Error("no se pudo leer el json")
    const data = await res.json()

    // lleno el select de categorias
    pintarCategorias(data.categorias || [])

    // seed 1 sola vez (si el usuario ya tiene tareas, no lo piso)
    const yaSeed = localStorage.getItem(LS_SEED)
    const yaTieneTareas = leer().length > 0

    if (!yaSeed && !yaTieneTareas) {
      const base = (data.tareasBase || []).map(t => new Tarea({
        id: uid(),
        titulo: t.titulo,
        categoria: t.categoria || "General",
        prioridad: t.prioridad || "media",
        fecha: t.fecha || "",
        minutos: Number(t.minutos || 0),
        hecha: false,
        creadaEn: Date.now()
      }))

      tareas = base
      guardar()
      localStorage.setItem(LS_SEED, "1")
      toast("success", "Listo: cargué tareas base del JSON")
    }
  } catch (e) {
    // si falla el json, igual dejo que funcione todo (pero cumpli con el intento async)
    pintarCategorias(["General", "Estudio", "Trabajo", "Casa"])
    toast("info", "No se pudo cargar data.json, igual puedes usar el simulador")
  }
}

const pintarCategorias = (cats) => {
  const lista = cats && cats.length ? cats : ["General"]
  selectCategoria.innerHTML = lista.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("")
  // precargo algo
  selectCategoria.value = lista.includes("Estudio") ? "Estudio" : lista[0]
}

// por si el usuario mete simbolos raros
const escapeHTML = (str) => {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

// filtros
const setFiltro = (f) => {
  filtroActual = f
  marcarChipActivo()
  render()
}

const marcarChipActivo = () => {
  filtroTodas.classList.toggle("active", filtroActual === "todas")
  filtroPendientes.classList.toggle("active", filtroActual === "pendientes")
  filtroHechas.classList.toggle("active", filtroActual === "hechas")
}

// validacion simple
const validarForm = (titulo) => {
  if (!titulo || titulo.trim().length < 3) {
    msg.textContent = "Pon un texto de al menos 3 letras 😅"
    return false
  }
  msg.textContent = ""
  return true
}

// crear tarea
const crearTarea = (data) => {
  const tarea = new Tarea({
    id: uid(),
    titulo: data.titulo.trim(),
    categoria: data.categoria || "General",
    prioridad: data.prioridad || "media",
    fecha: data.fecha || "",
    minutos: Number(data.minutos || 0),
    hecha: false,
    creadaEn: Date.now()
  })

  tareas.unshift(tarea)
  guardar()
  render()
}

// editar (con sweetalert2)
const editarTarea = async (id) => {
  const t = tareas.find(x => x.id === id)
  if (!t) return

  const categorias = Array.from(selectCategoria.options).map(o => o.value)

  const html = `
    <div class="swalForm">
      <input id="swalTitulo" class="swal2-input" placeholder="Título" value="${escapeHTML(t.titulo)}">
      <select id="swalCat" class="swal2-select">
        ${categorias.map(c => `<option value="${escapeHTML(c)}" ${c === t.categoria ? "selected" : ""}>${escapeHTML(c)}</option>`).join("")}
      </select>
      <select id="swalPrio" class="swal2-select">
        <option value="baja" ${t.prioridad === "baja" ? "selected" : ""}>Baja</option>
        <option value="media" ${t.prioridad === "media" ? "selected" : ""}>Media</option>
        <option value="alta" ${t.prioridad === "alta" ? "selected" : ""}>Alta</option>
      </select>
      <input id="swalFecha" class="swal2-input" type="date" value="${escapeHTML(t.fecha || "")}">
      <input id="swalMin" class="swal2-input" type="number" min="0" step="5" value="${Number(t.minutos || 0)}" placeholder="Minutos">
    </div>
  `

  const r = await Swal.fire({
    title: "Editar tarea",
    html,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const titulo = document.getElementById("swalTitulo").value
      const categoria = document.getElementById("swalCat").value
      const prioridad = document.getElementById("swalPrio").value
      const fecha = document.getElementById("swalFecha").value
      const minutos = document.getElementById("swalMin").value

      if (!titulo || titulo.trim().length < 3) {
        Swal.showValidationMessage("El título debe tener al menos 3 letras")
        return false
      }

      return { titulo, categoria, prioridad, fecha, minutos }
    }
  })

  if (!r.isConfirmed) return

  t.update({
    titulo: r.value.titulo.trim(),
    categoria: r.value.categoria,
    prioridad: r.value.prioridad,
    fecha: r.value.fecha,
    minutos: Number(r.value.minutos || 0)
  })

  guardar()
  render()
  toast("success", "Tarea editada")
}

// borrar con confirm (sweetalert2)
const borrarTarea = async (id) => {
  const t = tareas.find(x => x.id === id)
  if (!t) return

  const r = await Swal.fire({
    title: "¿Borrar tarea?",
    text: t.titulo,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar"
  })

  if (!r.isConfirmed) return

  tareas = tareas.filter(x => x.id !== id)
  guardar()
  render()
  toast("success", "Tarea borrada")
}

// aplicar filtro
const getFiltradas = () => {
  if (filtroActual === "pendientes") return tareas.filter(t => !t.hecha)
  if (filtroActual === "hechas") return tareas.filter(t => t.hecha)
  return tareas
}

// stats (para que se vea mas completo)
const calcularStats = () => {
  const pendientes = tareas.filter(t => !t.hecha)
  const hechas = tareas.filter(t => t.hecha)
  const minPend = pendientes.reduce((acc, t) => acc + (Number(t.minutos) || 0), 0)

  stPendientes.textContent = pendientes.length
  stHechas.textContent = hechas.length
  stMin.textContent = minPend
}

// render HTML desde JS (la parte clave de la consigna)
const render = () => {
  const filtradas = getFiltradas()

  contador.textContent = filtradas.length
  calcularStats()

  // si no hay nada, muestro un mini mensaje
  if (filtradas.length === 0) {
    listaTareas.innerHTML = `
      <li class="empty">
        <div class="badge">No hay tareas en este filtro 👀</div>
      </li>
    `
    return
  }

  listaTareas.innerHTML = filtradas.map(t => templateTarea(t)).join("")
}

const templateTarea = (t) => {
  const done = t.hecha ? "done" : ""
  const prioClass = `prio-${t.prioridad}`
  const fechaTxt = t.fecha ? `Vence: ${t.fecha}` : "Sin fecha"
  const minTxt = (Number(t.minutos) || 0) > 0 ? `${t.minutos} min` : "0 min"

  return `
    <li class="item ${done}" data-id="${escapeHTML(t.id)}">
      <div class="leftItem">
        <input class="check" type="checkbox" ${t.hecha ? "checked" : ""} data-action="toggle" />
        <div>
          <div class="title">${escapeHTML(t.titulo)}</div>
          <div class="meta">
            <span class="badge">${escapeHTML(t.categoria)}</span>
            <span class="badge ${prioClass}">${escapeHTML(t.prioridad)}</span>
            <span class="badge">${escapeHTML(fechaTxt)}</span>
            <span class="badge">${escapeHTML(minTxt)}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="iconBtn" type="button" data-action="edit">Editar</button>
        <button class="iconBtn danger" type="button" data-action="delete">Borrar</button>
      </div>
    </li>
  `
}

// eventos
formTarea.addEventListener("submit", (e) => {
  e.preventDefault()

  const titulo = inputTarea.value
  const categoria = selectCategoria.value
  const prioridad = selectPrioridad.value
  const fecha = inputFecha.value
  const minutos = inputMin.value

  if (!validarForm(titulo)) return

  crearTarea({ titulo, categoria, prioridad, fecha, minutos })

  // reseteo pero dejo defaults (precarga)
  inputTarea.value = ""
  inputMin.value = "30"
  inputFecha.value = ""
  toast("success", "Tarea agregada")
})

filtroTodas.addEventListener("click", () => setFiltro("todas"))
filtroPendientes.addEventListener("click", () => setFiltro("pendientes"))
filtroHechas.addEventListener("click", () => setFiltro("hechas"))

btnBorrarHechas.addEventListener("click", async () => {
  const hechas = tareas.filter(t => t.hecha)
  if (hechas.length === 0) return toast("info", "No hay hechas para borrar")

  const r = await Swal.fire({
    title: "Borrar hechas",
    text: `Se borrarán ${hechas.length} tareas hechas`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Borrar",
    cancelButtonText: "Cancelar"
  })

  if (!r.isConfirmed) return

  tareas = tareas.filter(t => !t.hecha)
  guardar()
  render()
  toast("success", "Hechas borradas")
})

btnLimpiar.addEventListener("click", async () => {
  if (tareas.length === 0) return toast("info", "No hay tareas para borrar")

  const r = await Swal.fire({
    title: "Borrar todo",
    text: "Esto borra todo (incluye pendientes)",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar todo",
    cancelButtonText: "Cancelar"
  })

  if (!r.isConfirmed) return

  tareas = []
  guardar()
  render()
  toast("success", "Listo, quedó limpio")
})

// delegacion para clicks dentro de la lista
listaTareas.addEventListener("click", async (e) => {
  const li = e.target.closest(".item")
  if (!li) return

  const id = li.getAttribute("data-id")

  const action = e.target.getAttribute("data-action")
  if (!action) return

  if (action === "edit") return editarTarea(id)
  if (action === "delete") return borrarTarea(id)
})

listaTareas.addEventListener("change", (e) => {
  const li = e.target.closest(".item")
  if (!li) return

  const action = e.target.getAttribute("data-action")
  if (action !== "toggle") return

  const id = li.getAttribute("data-id")
  const t = tareas.find(x => x.id === id)
  if (!t) return

  t.toggle()
  guardar()
  render()
})

// init
const init = async () => {
  // precargo fecha con hoy por si quieren
  inputFecha.min = hoyISO()

  // leo localstorage
  const guardadas = leer()
  tareas = guardadas.map(x => new Tarea(x))

  // cargo json (async) y categorias
  await cargarDesdeJSON()

  // si ya habia tareas, igual tengo que renderizar
  marcarChipActivo()
  render()
}

init()

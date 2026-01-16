
// aca guardo mis tareas
let tareas = []
let filtroActual = "todas"


// agarro el html
const formTarea = document.getElementById("formTarea")


const inputTarea = document.getElementById("inputTarea")
  const listaTareas = document.getElementById("listaTareas")

const msg = document.getElementById("msg")

const contador = document.getElementById("contador")

const filtroTodas = document.getElementById("filtroTodas")

const filtroPendientes = document.getElementById("filtroPendientes")

const filtroHechas = document.getElementById("filtroHechas")

const btnBorrarHechas = document.getElementById("btnBorrarHechas")

  const btnLimpiar = document.getElementById("btnLimpiar")



// cargo del storage

const guardado = localStorage.getItem("tareas")

 if (guardado) tareas = JSON.parse(guardado)

pintarTareas()

marcarFiltroActivo("todas")



// agregar
formTarea.addEventListener("submit", (e) => {

  e.preventDefault()

  const texto = inputTarea.value.trim()

  if (texto === "") {

    mostrarMsg("Escribe algo pues jovencitoo 😅")
     return
  }

  tareas.push({

    id: Date.now(),

    texto: texto,
    hecha: false

  })

  inputTarea.value = ""

  guardarEnStorage()

  pintarTareas()

  mostrarMsg("Listo, tarea agregada")
})



// filtros
filtroTodas.addEventListener("click", () => {
  filtroActual = "todas"
    marcarFiltroActivo("todas")
  pintarTareas()

})

filtroPendientes.addEventListener("click", () => {
  filtroActual = "pendientes" 

  marcarFiltroActivo("pendientes")

  pintarTareas()
})

filtroHechas.addEventListener("click", () => {
  filtroActual = "hechas"

  marcarFiltroActivo("hechas")
  pintarTareas()

})



/* borrar las tareas hechas */
btnBorrarHechas.addEventListener("click", () => {

  const antes = tareas.length
  tareas = tareas.filter(t => !t.hecha)

  if (tareas.length === antes) {

    mostrarMsg("No hay tareas hechas para borrar")


    return
  }

  guardarEnStorage()

  pintarTareas()
  mostrarMsg("Ya borré las tareas hechas")
})


/* 
 limpiar todo */

btnLimpiar.addEventListener("click", () => {

  if (tareas.length === 0) {
    
    mostrarMsg("No hay nada para limpiar aqui joven")
    return
  }

  tareas = []
  guardarEnStorage()
  pintarTareas()

  mostrarMsg("Ya quedó en cero")

    })



// click en lista (toggle / borrar)

listaTareas.addEventListener("click", (e) => {

  const boton = e.target

  if (boton.classList.contains("toggle")) {


    const id = Number(boton.value)

    const tarea = tareas.find(t => t.id === id)
      if (!tarea) return

    tarea.hecha = !tarea.hecha

    guardarEnStorage()

    pintarTareas()

     return
  }


  if (boton.classList.contains("borrar")) {


      const id = Number(boton.value)

    tareas = tareas.filter(t => t.id !== id)

    guardarEnStorage()

    pintarTareas()


    mostrarMsg("Tarea borrada")

      return
  }

})


function pintarTareas() {

  listaTareas.innerHTML = ""

   let lista = tareas



        if (filtroActual === "pendientes") {

    lista = tareas.filter(t => !t.hecha)

  }

  if (filtroActual === "hechas") {


    lista = tareas.filter(t => t.hecha)

  }


  if (lista.length === 0) {

   
    listaTareas.innerHTML = `<li class="vacio">No hay tareas acá</li>`


    actualizarContador()
      return
  }


  lista.forEach((t) => {

    const estado = t.hecha ? "Hecha" : "Pendiente"

    listaTareas.innerHTML += `
      <li class="item ${t.hecha ? "hecha" : ""}">

        <span>${t.texto}</span>

        <div class="acciones">
        <button class="toggle" value="${t.id}">


            ${estado}
           </button>

      <button class="borrar" value="${t.id}">
            X
          </button>
  </div>
  </li>
    `
  })

  actualizarContador()
}

function guardarEnStorage() {
  localStorage.setItem("tareas", JSON.stringify(tareas))


}



function actualizarContador() {

  const pendientes = tareas.filter(t => !t.hecha).length

    const hechas = tareas.filter(t => t.hecha).length

  contador.textContent = `Pendientes: ${pendientes} | Hechas: ${hechas} | Total: ${tareas.length}`

}


function mostrarMsg(texto) {

  if (!msg) return

  msg.textContent = texto

  msg.classList.add("show")

  setTimeout(() => {

    msg.classList.remove("show")
  }, 1700)


}

  function marcarFiltroActivo(f) {

  filtroTodas.classList.remove("activo")

    filtroPendientes.classList.remove("activo")
    
  filtroHechas.classList.remove("activo")

  if (f === "todas") filtroTodas.classList.add("activo")
    if (f === "pendientes") filtroPendientes.classList.add("activo")

   if (f === "hechas") filtroHechas.classList.add("activo")
}


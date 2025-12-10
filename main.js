

/* simulador basico de tareas - Entrega 1 para curso JS de Coder House */ 


/* aca guardo todas mis tareas */
let tareas = [];

/* esto sirve para que el simulador siga funcionando */


let seguir = true;


/* mensaje simple de inicio con bienvenidaa */


function inicio() {


    alert("Bienvenido :) abre la consola del navegador (inspeccionar)");
    console.log("Simulador de tareas");

}


/* menu donde el usuario elige que quiere hacer   */
function menu() {



    let opcion = prompt(
        "Elige una opcion:\n" +
        "1 Agregar tarea\n" +
        "2 Ver tareas\n" +
        "3 Completar tarea\n" +
        "4 Salir"
    );


    return opcion;  /* con el retrurn hago que devuelva lo que escribio el usuario */
}
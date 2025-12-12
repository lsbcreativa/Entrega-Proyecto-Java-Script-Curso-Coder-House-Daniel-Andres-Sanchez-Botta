

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



/* agregar tarea al array */
function agregarTarea() {

    let textoTarea = prompt("Escribe tu tarea:");

    /* si la persona no pone nada  */
    if (textoTarea == "" || textoTarea == null) {
        alert("No escribiste nada.");
        return;
    }

    tareas.push(textoTarea); /* guardo la tarea */

    alert("Tarea agregada");
    console.log("agregada:", textoTarea);
}


/* mostrar todas las tareas en pantalla y consola */
function verTareas() {

    if (tareas.length == 0) {
        alert("No tienes tareas");
        return;
    }

    let lista = "Tus tareas:\n\n";

    /* recorro el array */
    for (let i = 0; i < tareas.length; i++) {
        lista += i + " - " + tareas[i] + "\n";
        console.log(i, tareas[i]);
    }

    alert(lista);
}


/* funcion para completar una tarea */


function completarTarea() {

    if (tareas.length == 0) {
        alert("No hay tareas");
        return;
    }

    /* muestro las tareas en consola para ayudar al usuario */

    console.log("tareas actuales:");
    for (let i = 0; i < tareas.length; i++) {
        console.log(i + " - " + tareas[i]);
    }

    /* aqui aclaro para que el usuario sepa que debe poner el NUMERO y no el nombre */



    let numero = prompt("Escribe el NúMERO de la tarea que quieres completar");

    /* con esto valido de que exista el numero de la tarea*/

    if (numero == "" || numero == null || tareas[numero] == undefined) {
        alert("Numero no valido");
        return;
    }

    /* aqui les ppregunto si realmente quiere completar la tarea que esta haceindo */


    let confirmar = confirm("¿Completar?\n" + tareas[numero]);

           if (confirmar == false) {
        alert("No se cambio nada");
        return;
    }

    tareas[numero] = tareas[numero] + " COMPLETADA";



    alert("Listo");
       console.log("completada:", tareas[numero]);
}


/* parte principal del simulador */
function simulador() {

    inicio();  /* con esto  muestro el mensaje de bienvenida */

    while (seguir == true) {       /* aca se repite el menu hasta que el usuario o yo salga del menu */

        let opcion = menu(); /* aca guardo lo que el usuario eligio como su trrea */

        
        if (opcion == "1") {

             agregarTarea();  /* agregamos aqui una tarea nueva */

        }    else if (opcion == "2") {

    verTareas();  /* muestro la lista de tareas */

        }  else if (opcion == "3") {

              completarTarea();  /* marco una tarea como completada */

        }else if (opcion == "4") {

            let salir = confirm("¿Salir?");
            
            if (salir == true) {

                seguir = false;
                alert("Gracias por usar el simulador");


             return;  /* detengo esta parte para que no aparezca opcion incorrecta */
            }

        } else {

            alert("Opcion incorrecta");  /* por si escrinimos algo que no es */

        }
    }
}


/* inicio del simulador, aqui comienza todo */


simulador();
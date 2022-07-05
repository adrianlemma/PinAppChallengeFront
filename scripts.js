const CREAR_CLIENTE = "https://pinapp-cliente.herokuapp.com/clientes/crearcliente"
const KPI_DE_CLIENTES = "https://pinapp-cliente.herokuapp.com/clientes/kpideclientes"
const LIST_CLIENTES = "https://pinapp-cliente.herokuapp.com/clientes/listclientes"

const tabla = document.getElementById("tabla-clientes");
const bloqueo = document.getElementById("bloqueo");
const edadPromedio = document.getElementById("edad-promedio");
const desviacionEstandar = document.getElementById("desviacion-estandar");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const edad = document.getElementById("edad");
const fechaDeNacimiento = document.getElementById("fecha_de_nacimiento");

var regexNyA = /^([A-Za-z]+[ ]?){1,2}$/

var f = new Date();

function registerCliente() {
    if(!regexNyA.test(nombre.value)) {
        alert("El Nombre no es valido");
    } else if(!regexNyA.test(apellido.value)) {
        alert("El Apellido no es valido");
    } else if(edad.value <= 0 || edad.value == "") {
        alert("Ingrese un valor mayor a cero para la Edad");
    } else if(!fechaValida(fechaDeNacimiento.value)) {
        alert("La fecha debe ser menor a la fecha actual");
    }

    var cliente = {
        nombre: nombre.value,
        apellido: apellido.value,
        edad: edad.value,
        fechaDeNacimiento: fechaDeNacimiento.value + "T00:00:00.000Z"
    }

    bloqueo.classList.remove("invisible");

    fetch(CREAR_CLIENTE, {
        method: 'POST',
        body: JSON.stringify(cliente),
        headers: {
            "Content-type": "application/json"
        }
    }).then(res => res.json())
    .then(data => {
        console.log(data);
        if(data.message != null) {
            alert(data.message)
        } else {
            let rowRef = tabla.insertRow(-1);
            let cellRef = rowRef.insertCell(0);
            cellRef.textContent = data.nombre;
            cellRef = rowRef.insertCell(1);
            cellRef.textContent = data.apellido;
            cellRef = rowRef.insertCell(2);
            cellRef.textContent = data.edad;
            cellRef = rowRef.insertCell(3);
            cellRef.textContent = data.fechaDeNacimiento;
            cellRef = rowRef.insertCell(4);
            cellRef.textContent = data.fechaProbableDeMuerte;
        }
        getKpiDeClientes();
    })
    .catch(err => {
        console.log(err);
        alert(err);
    })

    nombre.value = "";
    apellido.value = "";
    edad.value = "";
    fechaDeNacimiento.value = "";

    bloqueo.classList.add("invisible");
}

function getKpiDeClientes() {
    bloqueo.classList.remove("invisible");
    fetch(KPI_DE_CLIENTES, {
        method: 'GET',
        'Access-Control-Allow-Origin': '*'
    })
    .then(response => response.json())
    .then(data => { 
        
        edadPromedio.textContent = "Edad promedio: " + data.edadPromedio + " Años";
        desviacionEstandar.textContent = "Desviación estándar: " + data.desviacionEstandar;

        bloqueo.classList.add("invisible");
    })
    .catch(err => console.error(err));
}

function fechaValida(fecha_input) {
    var now = new Date();
    var mes = (now.getMonth() + 1).toString();
    if(mes.length <= 1) {
        mes = "0" + mes;
    }
    var dia = now.getDate().toString();
    if(dia.length <= 1) {
        dia = "0" + dia;
    }
    fecha_actual = now.getFullYear() + "-" + mes + "-" + dia;

    if(fecha_input >= fecha_actual)
        return false;
    else
        return true;
}

function getListaClientes() {
    bloqueo.classList.remove("invisible");
    fetch(LIST_CLIENTES, {
        method: 'GET',
        'Access-Control-Allow-Origin': '*'
    })
    .then(response => response.json())
    .then(data => { 
        
        for(var i = 0; i < data.length; i++) {
            let rowRef = tabla.insertRow(-1);
            let cellRef = rowRef.insertCell(0);
            cellRef.textContent = data[i].nombre;
            cellRef = rowRef.insertCell(1);
            cellRef.textContent = data[i].apellido;
            cellRef = rowRef.insertCell(2);
            cellRef.textContent = data[i].edad;
            cellRef = rowRef.insertCell(3);
            cellRef.textContent = data[i].fechaDeNacimiento;
            cellRef = rowRef.insertCell(4);
            cellRef.textContent = data[i].fechaProbableDeMuerte;
        }

        bloqueo.classList.add("invisible");
    })
    .catch(err => console.error(err));
}

function init() {
    getKpiDeClientes();
    getListaClientes();
}
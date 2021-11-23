import AnuncioAnimales from "../models/anuncio.js";


//---- variables
const URL = "http://localhost:3000/mascotas/";
let idSeleccionado ="";
let listaAnuncios =[]; 
let divTabla= document.getElementById("divTabla");
let divTablaCheck= document.getElementById("divTablaCheck");
// seteo el div spinner
const divSpinner = document.querySelector(".spinner");
let valoresFiltro="";



window.addEventListener("DOMContentLoaded",()=>{

 //   document.forms[0].addEventListener("submit", handlerAgregar);

    document.addEventListener("submit",handlerAgregar);  
    document.addEventListener("click",handlerClick);    

    //GetAnuncios();
    GetAnunciosAXIOSAsync();
    setTimeout(()=>{
       //menos de 3 segundos rompe
       refrescarDiv(divTablaCheck,crearTabla(listaAnuncios))
       valoresFiltro = document.getElementsByClassName('checkbox');
       console.log(valoresFiltro);
       listeningChecks(valoresFiltro);
    },3000);
});

document.getElementById("filtroAnimales").addEventListener('change',filtrarDatos);
valoresFiltro = document.getElementsByClassName('checkbox');

//listeningChecks(checks);

function refrescarDiv(div,tabla){
    while(div.hasChildNodes()){
        div.removeChild(div.firstChild);
    }
    div.appendChild(tabla);
}

function handlerAgregar(e){
    e.preventDefault();
    const form = e.target; 
    console.log("estoy en handler agregar");
    if(document.getElementById("btnGuardar").value =="Guardar"){
        console.log("estoy generando el formulario en handler");

        const nuevoAnuncio = new AnuncioAnimales(
            generarId(),
            form.titulo.value,
            form.descripcion.value,
            opcionCheckAnuncio(),
            form.precio.value,
            form.raza.value,
            form.fecha.value,
            form.vacuna.value
        )
        //doy de alta anuncio
        PostAnuncio(JSON.stringify(nuevoAnuncio));
    }
}
function generarId(){
    return listaAnuncios.length +1;
}
function handlerClick(e){
    if(e.target.matches("td")){
        idSeleccionado = e.target.parentNode.dataset.id;
        console.log("id seleccionado: "+idSeleccionado);

    }else if(e.target.matches("#btnEliminar")){
        if(confirm("desea eliminar el id "+idSeleccionado+"?")){
            DeleteAnuncio(idSeleccionado);
        }
    }else if(e.target.matches("#btnModificar")){
        if(confirm("desea modificar el id "+idSeleccionado+"?")){
            console.log(document.getElementById("titulo-form").value);
            const nuevoAnuncio = new AnuncioAnimales(
                generarId(),
                document.getElementById("titulo-form").value,
                document.getElementById("descripcion-form").value,
                opcionCheckAnuncio(),
                document.getElementById("precio-form").value,
                document.getElementById("raza-form").value,
                document.getElementById("fecha-form").value,
                document.getElementById("vacuna-form").value
            )
            UpdateAnuncio(idSeleccionado,JSON.stringify(nuevoAnuncio));
        }
    }
}


 //funciones del spinner        
const getSpinner = ()=>{
    const spinner = document.createElement('img');
    spinner.setAttribute('src','./imagenes/loading-barra.gif');
    spinner.setAttribute('alt','loader');
    spinner.classList.add("col-sm-1");
    spinner.classList.add("img-responsive");
    console.log(spinner);
    return spinner;
}

const limpiarSpinner = ()=>{

    while(divSpinner.hasChildNodes()){
        divSpinner.removeChild(divSpinner.firstChild);
    }
}

function altaAnuncio(a){
    listaAnuncios.push(a);
    almacenarDatos(listaAnuncios);
}


function almacenarDatos(data){
    localStorage.setItem("animales",JSON.stringify(data));
    refrescarDiv(divTabla,crearTabla(data));
}

function crearTabla(item){

    const tabla = document.createElement("table");
    tabla.appendChild(crearThead(item[0]));
    tabla.appendChild(crearTBody(item));

    tabla.classList.add("table");
    tabla.classList.add("table-striped");
    tabla.classList.add("table-hovered");
    tabla.classList.add("table-bordered");
    tabla.classList.add("table-condenced");

    return tabla;
}

function crearTBody(items){
    const tbody = document.createElement("tbody");
    items.forEach(item=>{
        const tr = document.createElement("tr");
        
        for(const key in item){
            if (key == "id"){
                tr.setAttribute("data-id",item[key]);
            }else{
                const td = document.createElement("td");
                td.textContent = item[key];
                tr.appendChild(td);
            }
        }
        tbody.appendChild(tr);
    });
    return tbody;
}


function crearThead(item){
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");


    for(const key in item){
        const th = document.createElement("th");
        if(key != "id"){
            th.textContent = key;
            tr.appendChild(th);          
        }
    }    
    thead.appendChild(tr);
    return thead;
}
function crearTablaCheck(item,valor){
    console.log(valor);
    const tabla = document.createElement("table");
    tabla.appendChild(crearTheadParaCheck(item[0],valor));
    tabla.appendChild(crearTBodyCheck(item,valor));

    tabla.classList.add("table");
    tabla.classList.add("table-striped");
    tabla.classList.add("table-hovered");
    tabla.classList.add("table-bordered");
    tabla.classList.add("table-condenced");

    return tabla;
}


function crearTheadParaCheck(arr,elemento){
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    console.log(elemento);
    for(const key in arr){
        const th = document.createElement("th");
       // console.log(elemento);
        if(key != elemento && key != "id"){
            console.log(elemento);
            th.textContent = key;
            tr.appendChild(th);          
        }
    }    
    thead.appendChild(tr);
    return thead;
}

function crearTBodyCheck(items, elemento){
    const tbody = document.createElement("tbody");
    items.forEach(item=>{
        const tr = document.createElement("tr");
        
        for(const key in item){
            if(key != elemento && key != "id"){
                const td = document.createElement("td");
                td.textContent = item[key];
                tr.appendChild(td);
            }
        }
        tbody.appendChild(tr);
    });
    return tbody;
}


//PETICIONES

/*
//GET ajax
const GetAnuncios =()=>{
    divSpinner.appendChild(getSpinner());
    const xhr = new XMLHttpRequest();
    
    xhr.addEventListener('readystatechange',()=>{

        if(xhr.readyState ==4){

            if(xhr.status >= 200 && xhr.status<300){
                const data = JSON.parse(xhr.responseText);
             //   console.log("La data que viene del server es: ");
                console.log(data);
                listaAnuncios = data;
                //la tabla de anuncios
                refrescarDiv(divTabla,crearTabla(listaAnuncios))

            }else{
                console.error("error: ",xhr.status) 
                console.log(xhr.status);
            }

           limpiarSpinner();
        }
    });
        xhr.open("GET",URL);
        xhr.send();
}
*/
//GET
const GetAnunciosAXIOSAsync = async ()=>{

    divSpinner.appendChild(getSpinner());
    
    try {
        const {data} = await axios.get(URL);
        console.log(data);
        listaAnuncios = data;
        refrescarDiv(divTabla,crearTabla(listaAnuncios))
    } catch (err) {
        console.error(err);
    }
    finally{
        limpiarSpinner();
    }
}

//POST
const PostAnuncio = (data)=>{
    const options ={
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: data
    }
    divSpinner.appendChild(getSpinner());
    fetch(URL, options)
        .then((res)=>{
            if(res.ok)
                return res.json(); 
            else
                return Promise.reject("error");
        })
        .then((data)=>{
            //la veo ´por consola
           console.log(data);
           //se carga en el form
           altaAnuncio(data);
        })
        .catch((err)=>{
            console.error(err);
        })
        .finally(()=>{
            limpiarSpinner()
        }); 
}

// PUT
const UpdateAnuncio = (id,data)=>{

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange',()=>{

        if(xhr.readyState ==4){

            if(xhr.status >= 200 && xhr.status<300){
                const data = JSON.parse(xhr.responseText);

                console.log(data);
            }else{
                console.error("error: ",xhr.status) 
                console.log(xhr.status);
            }

           limpiarSpinner();
        }else{
            console.log("entro al else donde borra el spinner");
            divSpinner.appendChild(getSpinner());
        }
        
    });

        xhr.open("PUT",URL + "/" + id);
        xhr.setRequestHeader("Content-Type","application/json");
        // se envia la data
        xhr.send(data);
};

// DELETE
const DeleteAnuncio = (id)=>{

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange',()=>{

        if(xhr.readyState ==4){

            if(xhr.status >= 200 && xhr.status<300){
                alert("el id que se va a borrar es:"+id);
            }else{
                console.error("error: ",xhr.status) 
                console.log(xhr.status);
            }
          limpiarSpinner();
        }else{
            console.log("entre al else donde deberia estar el spinner");
            divSpinner.appendChild(getSpinner());
        }
        
    });
    //solo se pasa el id que se quiere borrar
    xhr.open("DELETE",URL + "/" + id);
    xhr.send();
}

// FILTER - MAP -REDUCE

//devuelve un array con el filtrado de item pasado
const mapPrecioAnuncios =(array)=>{
    return array.map(a =>a.precio);
}
//saca promedio del array precios
const promedioPrecioAnuncios =(array)=>{
    return array.reduce((p,c) =>p+c,0) / array.length;
}

//filtra el array segun la opcion
const filtrarAnuncios = (array, opcion)=>{
    return array.filter(array=> array.animal == opcion);
}

function filtrarDatos(e){

    let opcionFiltrado = e.target.value;
    console.log("opcion de filtrado: "+opcionFiltrado);
    let prom="";
    let auxArr=[];
    let precios=""
    switch(opcionFiltrado){
        case"todos":
            precios = mapPrecioAnuncios(listaAnuncios);
            prom = promedioPrecioAnuncios(precios);
            break;
        case"perro":
            auxArr =filtrarAnuncios(listaAnuncios,opcionFiltrado);
            precios = mapPrecioAnuncios(auxArr);
            prom = promedioPrecioAnuncios(precios);
            break;
        case"gato":
            auxArr =filtrarAnuncios(listaAnuncios,opcionFiltrado);
            precios = mapPrecioAnuncios(auxArr);
            prom = promedioPrecioAnuncios(precios);
            break;
        default:
            break;
    }
    document.getElementById("input-promedio").value = prom;
}

const opcionCheckAnuncio = ()=>{
    let opcion="";
    if(document.getElementById('perro').checked)
        opcion = "perro";
    else if(document.getElementById('gato').checked)
    opcion = "gato";

    return opcion;
}

const listeningChecks= (checks)=>{

    let arr=[];
    let valor=""
    for(let i=0; i<checks.length; i++){
        checks[i].addEventListener('change', ()=>{
            console.log("esta cambiando: " + checks[i].name);
            valor =checks[i].name;
             // aca tengo que pasar la funcion para borrar ese elemento de la tabla          
            console.log("esto hay en valor: "+valor);
           refrescarDiv(divTablaCheck,crearTablaCheck(listaAnuncios,valor));            
        });
    }

    console.log(arr);
}


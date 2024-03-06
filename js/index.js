// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function() {
    console.log('Clic en el menú hamburguesa');
    var enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});

// TOP MOTOS
document.addEventListener("DOMContentLoaded", function () {
    console.log("Documento listo, ejecutando el script");

    let productos; // Almacena todos los productos
    let intervalId; // Identificador del intervalo para la rotación

    fetch('js/productos.json')
        .then(response => response.json())
        .then(data => {
            console.log("Datos cargados:", data);

            // Almacena todos los productos
            productos = data.motos;

            // Recupera la selección almacenada o selecciona aleatoriamente tres productos
            const productosAlmacenados = obtenerProductosAlmacenados();
            const productosMostrar = productosAlmacenados.length > 0 ? productosAlmacenados : seleccionarAleatorios(productos, 3);

            // Tiempo que tarda en cambiar
            intervalId = setInterval(rotarProductos, 5000);

            // Muestra los productos seleccionados
            mostrarProductos(productosMostrar);
        })
        .catch(error => console.error("Error al cargar los datos:", error));

    function rotarProductos() {
        // Para seleccionar la cantidad de motos
        const productosAleatorios = seleccionarAleatorios(productos, 4);

        // Guardamos la seleccion,para que cuando recargemos no cambie
        almacenarProductosSeleccionados(productosAleatorios);

        // Mostramos los productos
        mostrarProductos(productosAleatorios);
    }

    function mostrarProductos(productosMostrar) {
        // Crea el HTML para los productos
        let motosHTML = "";
        productosMostrar.forEach(producto => {
            motosHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card m-3">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.marca} ${producto.modelo}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.marca} ${producto.modelo}</h5>
                            <p class="card-text">Color: ${producto.color}</p>
                            <p class="card-text">Precio: $${producto.precio}</p>
                            <a href="#" class="botonesPersonalizados">Detalles</a>
                        </div>
                    </div>
                </div>
            `;
        });

        // Agrega los productos al contenedor
        document.getElementById("productos-container").innerHTML = motosHTML;
    }

    function seleccionarAleatorios(arr, cantidad) {
        // Copia el array original para no modificarlo directamente
        const copiaArray = [...arr];
        const resultados = [];

        // Selecciona aleatoriamente elementos del array
        for (let i = 0; i < cantidad && copiaArray.length > 0; i++) {
            const indiceAleatorio = Math.floor(Math.random() * copiaArray.length);
            resultados.push(copiaArray.splice(indiceAleatorio, 1)[0]);
        }

        return resultados;
    }

    function almacenarProductosSeleccionados(productosAlmacenar) {
        localStorage.setItem('productosSeleccionados', JSON.stringify(productosAlmacenar));
    }

    function obtenerProductosAlmacenados() {
        // Recupera la selección almacenada del almacenamiento local
        const productosAlmacenados = localStorage.getItem('productosSeleccionados');
        return productosAlmacenados ? JSON.parse(productosAlmacenados) : [];
    }
});


// Para las categorias
const contenedorCartas = document.getElementById('contenedor-cartas');

// Función para crear una carta HTML para cada categoría
function crearCarta(categoria) {
    if (categoria.destacada) {
        return `
        <div class="col-md-4 mb-4">
        <div class="card m-3">
            <img src="${categoria.imagen}" class="card-img-top" alt="${categoria.nombre}">
            <div class="card-body">
                <a href="../tienda.html" class="btn btn-secondary">${categoria.nombre}</a>
            </div>
        </div>
    </div>
        `;
    } else {
        return '';
    }
}


// Cargar las categorías desde el archivo JSON
fetch('js/categorias.json')
    .then(response => response.json())
    .then(categorias => {
        // Mostrar una carta para cada categoría en el contenedor
        categorias.forEach(categoria => {
            contenedorCartas.innerHTML += crearCarta(categoria);
        });
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
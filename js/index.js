// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function() {
    console.log('Clic en el menú hamburguesa');
    let enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});


document.addEventListener("DOMContentLoaded", function () {
    console.log("Documento listo, ejecutando el script");

    let productos; // Para guardar los productos
    let intervalId; // Guardar el tiempo que tarda en cambiar

    fetch('js/productos.json')
        .then(response => response.json())
        .then(data => {
            console.log("Datos cargados:", data);

            // Dejamos nuestro json en productos
            productos = data.motos;

            // Recupera la selección almacenada o selecciona aleatoriamente tres productos
            const productosAlmacenados = obtenerProductosAlmacenados();
            const productosMostrar = productosAlmacenados.length > 0 ? productosAlmacenados : seleccionarAleatorios(productos, 3);

            // Tiempo que tarda en cambiar(30 min)
            intervalId = setInterval(rotarProductos, 300000);

            // Muestra los productos seleccionados
            mostrarProductos(productosMostrar);
        })
        .catch(error => console.error("Error al cargar los datos:", error));

    function rotarProductos() {
        // Vemos la cantidad de motos que salen en el index
        const productosAleatorios = seleccionarAleatorios(productos, 3);

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
                    <div class="producto-card m-3">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.marca} ${producto.modelo}">
                        <div class="producto-info">
                            <h5 class=""producto-titulo">${producto.marca} ${producto.modelo}</h5>
                            <p class="producto-datos">Color: ${producto.color}</p>
                            <p class="producto-datos">Precio: $${producto.precio}</p>
                            <a href="../tienda.html"> <button class="botonesPersonalizados">Detalles</button></a>
                        </div>
                    </div>
                </div>
            `;
        });

        // Agrega los productos al contenedor html para que cambie
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
    // Si la condicion esta en true
    if (categoria.destacada) {
        return `
        <div class="col-md-4 mb-4">
            <div class="producto-card m-3">
                <img src="${categoria.imagen}" class="card-img-top" alt="${categoria.nombre}">
                <div class="producto-titulo">
                    <a href="../tienda.html"> <button class="botonesPersonalizados">${categoria.nombre}</button></a>
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
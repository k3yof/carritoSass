document.getElementById('mobile-menu').addEventListener('click', function() {
    var enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("Documento listo, ejecutando el script");

    fetch('js/productos.json')  // Cambié la ruta aquí
        .then(response => response.json())
        .then(data => {
            console.log("Datos cargados:", data);

            // Almacena los productos en una variable
            let productosHTML = "";

            // Recorre los productos y crea cartas dinámicamente
            data.forEach(producto => {
                productosHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${producto.marca} ${producto.modelo}</h5>
                                <p class="card-text">Color: ${producto.color}</p>
                                <p class="card-text">Año de Fabricación: ${producto.anioFabricacion}</p>
                                <p class="card-text">Precio: $${producto.precio}</p>
                                <a href="#" class="btn btn-primary">Comprar</a>
                            </div>
                        </div>
                    </div>
                `;
            });

            // Agrega todos los productos al contenedor de una vez
            document.getElementById("productos-container").innerHTML = productosHTML;
        })
        .catch(error => console.error("Error al cargar los datos:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    const inputBusqueda = document.getElementById("inputBusqueda");
    const resultadosContainer = document.getElementById("resultadosContainer");

    inputBusqueda.addEventListener("input", function () {
        const terminoBusqueda = inputBusqueda.value.toLowerCase();
        buscarProductos(terminoBusqueda);
    });

    function buscarProductos(terminoBusqueda) {
        fetch('js/productos.json') // Reemplaza 'ruta_al_json' con la ruta correcta a tu archivo JSON
            .then(response => response.json())
            .then(data => {
                const productos = data.motos;
                const resultados = filtrarProductos(productos, terminoBusqueda);
                mostrarResultadosBusqueda(resultados);
            })
            .catch(error => console.error("Error al cargar los datos:", error));
    }

    function filtrarProductos(productos, terminoBusqueda) {
        return productos.filter(producto =>
            producto.marca.toLowerCase().includes(terminoBusqueda) ||
            producto.modelo.toLowerCase().includes(terminoBusqueda) ||
            producto.color.toLowerCase().includes(terminoBusqueda) ||
            producto.categoria.toLowerCase().includes(terminoBusqueda)
        );
    }

    function mostrarResultadosBusqueda(resultados) {
        resultadosContainer.innerHTML = ""; // Limpiar resultados anteriores

        if (resultados.length === 0) {
            resultadosContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        } else {
            resultados.forEach(producto => {
                const resultadoHTML = `
                    <div class="resultado-item">
                        <img src="${producto.imagen}" alt="${producto.marca} ${producto.modelo}">
                        <p>${producto.marca} ${producto.modelo}</p>
                        <p>Color: ${producto.color}</p>
                        <p>Categoría: ${producto.categoria}</p>
                        <p>Precio: €${producto.precio.toFixed(2)}</p>
                    </div>
                `;
                resultadosContainer.innerHTML += resultadoHTML;
            });
        }
    }
});

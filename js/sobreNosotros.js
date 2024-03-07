// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function() {
    console.log('Clic en el menú hamburguesa');
    let enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});
// Para las cartas informativas
const contenedorCartas = document.getElementById('cartasInformativas');

// Función para crear una carta HTML para cada noticia
function crearCarta(carta) {
    if (carta.activada) {
        return `
            <div class="col-md-4 mb-4">
                <div class="cartasDeSobreNosotros  m-3">
                    <img src="${carta.imagen}" class="card-img-top" alt="${carta.titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${carta.titulo}</h5>
                        <p class="card-text">${carta.texto}</p>
    
                    </div>
                </div>
            </div>
        `;
    } else {
        return '';
    }
}

// Cargar las categorías desde el archivo JSON
fetch('js/cartasInformativas.json')
    .then(response => response.json())
    .then(cartas => {
        // Mostrar una carta para cada categoría en el contenedor
        console.log(cartas);
        cartas.cartasInformativas.forEach(carta => {
            contenedorCartas.innerHTML += crearCarta(carta);
        });
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

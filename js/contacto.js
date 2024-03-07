// Menu hamburguesa
document.getElementById('mobile-menu').addEventListener('click', function() {
    console.log('Clic en el menú hamburguesa');
    let enlaces = document.querySelector('.enlaces');
    enlaces.classList.toggle('show');
});

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os dois cards pelos seus IDs
    const cardInternet = document.getElementById('card-internet');
    const cardCloud = document.getElementById('card-cloud');

    // Adiciona o evento de clique para o card de Internet
    cardInternet.addEventListener('click', function() {
        cardInternet.classList.toggle('flipped');
    });

    // Adiciona o evento de clique para o card de Cloud
    cardCloud.addEventListener('click', function() {
        cardCloud.classList.toggle('flipped');
    });
});

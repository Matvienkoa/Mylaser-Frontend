const consent = localStorage.getItem('consent');

if(!consent || consent === 'pending') {
    localStorage.setItem('consent', 'pending')
    const banner = document.createElement('aside');
    banner.classList.add('banner');
    banner.innerHTML = 
    "<div id='banner-box'><p id='banner-txt'>En poursuivant sur la boutique, vous acceptez l'utilisation des cookies pour vous assurer une navigation optimale et pour la réalisation de statistique de visites</p>" +
    "<input type='button' value='Accepter' id='banner-button'>";
    const page = document.querySelector('#page-wrapper');
    page.appendChild(banner);

    const bannerButton = document.getElementById('banner-button');
    bannerButton.addEventListener('click', () => {
        banner.classList.replace('banner', 'banner-off')
        localStorage.setItem('consent', 'yes')
    })
}


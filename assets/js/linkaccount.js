function linkAccount () {
    const link = document.getElementById('link');
    const linkOptions = document.getElementById('linkOptions');
    if (localStorage.getItem('customer')) {
        link.setAttribute('href', 'my-account.html');
        link.textContent = 'Mon Compte';
        const options = document.createElement('ul');
        options.innerHTML = '<li><a href="/my-infos.html">Mes Informations</a></li><li><a href="/my-adresses.html">Mes Adresses</a></li><li><a href="/my-orders.html">Mes Commandes</a></li><li><a onclick="logout()" href="/index.html">Déconnexion</a></li>';
        linkOptions.appendChild(options)
    } else {
        link.setAttribute('href', 'login.html')
        link.textContent = 'Se Connecter'
    }
}

linkAccount();

function logout() {
    localStorage.removeItem('customer')
} 
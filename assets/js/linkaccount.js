window.onload = linkAccount();

function linkAccount () {
    const link = document.getElementById('link')
    if (localStorage.getItem('customer')) {
        link.setAttribute('href', 'account.html')
        link.textContent = 'Mon Compte'
    } else {
        link.setAttribute('href', 'login.html')
        link.textContent = 'Se Connecter'
    }
}
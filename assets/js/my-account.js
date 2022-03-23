const token = localStorage.getItem('customer');

function logOut() {
    localStorage.removeItem('customer')
    window.location.href = '/index.html'
} 
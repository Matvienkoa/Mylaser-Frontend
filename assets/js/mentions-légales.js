const linkCookiesPref = document.getElementById('link-cookies-pref');

linkCookiesPref.addEventListener('click', () => {
    cookiesPrefBanner.classList.replace('hidden-consent', 'visible-consent');
})
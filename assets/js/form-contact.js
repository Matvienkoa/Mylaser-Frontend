const email = document.getElementById('email');
const send = document.getElementById('send');
const message = document.getElementById('message');
const boxError = document.getElementById('box-error');

send.addEventListener('click', () => {
    sendEmailToCustomer();
})

function sendEmailToCustomer() {
    const mailInfos = {
        name: '',
        intro: 'Nous avons bien reçu votre message :',
        email: email.value,
        subject: 'Merci pour votre message sur MyLaser!',
        instructions: message.value,
        text: 'Accéder à MyLaser',
        link: 'https://dt-mylaser.com/',
        outro: 'L\'équipe MyLaser vous répondra dans les plus brefs délais et a hâte de vous retrouver !'
    }
    const mailInit = {
        method: "POST",
        body: JSON.stringify(mailInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    }
    fetch(`api/mylaser/mail/infos`, mailInit)
    .then(res => {
        if(!res.ok) {
            // Error states
            res.json().then((data) => {
                boxError.innerHTML = '';
                boxError.innerHTML = data.message;
            })
        } else {
            const mailInfos2 = {
                name: '',
                intro: 'Vous avez reçu un nouveau message de : ' + email.value + ' :',
                email: 'contact@dt-mylaser.com',
                subject: 'Vous avez reçu un Nouveau message',
                instructions: message.value,
                text: 'Accéder à MyLaser',
                link: 'https://dt-mylaser.com/',
                outro: 'A bientôt !'
            }
            const mailInit2 = {
                method: "POST",
                body: JSON.stringify(mailInfos2),
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            }
            fetch(`api/mylaser/mail/infos`, mailInit2)
            .then(res => {
                if(!res.ok) {
                    // Error states
                    boxError.innerHTML = '';
                    boxError.innerHTML = 'Un problème est survenu, veuillez réessayer!';
                } else {
                    email.value = '';
                    message.value = '';
                    boxError.innerHTML = '';
                    boxError.innerHTML = 'Votre Message a bien été envoyé';
                }
            })
        }
    })
}
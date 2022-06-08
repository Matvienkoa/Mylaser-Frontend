const email = document.getElementById('email');
const send = document.getElementById('send');
const message = document.getElementById('message');
const boxError = document.getElementById('box-error');

function sendEmail() {
    const mailInfos2 = {
        email: email.value,
        subject: 'Merci pour votre message sur MyLaser!',
        intro: 'Nous avons bien reçu votre message!',
        instructions: 'Notre équipe vous répondras dans les plus brefs délais.',
        outro: 'L\'équipe MyLaser vous remercie et a hâte de vous retrouver !'
    }
    const mailInit2 = {
        method: "POST",
        body: JSON.stringify(mailInfos2),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    }
    fetch(`http://localhost:3000/api/mylaser/mail/infos`, mailInit2)
    .then(res => {
        if(!res.ok) {
            // Error states
            res.json().then((data) => {
                boxError.innerHTML = data.message;
            })
        } else {
            const mailInfos = {
                email: 'anthony.matvienko@westcode-dev.fr',
                subject: 'Vous avez reçu un Nouveau message',
                intro: 'Vous avez reçu un nouveau message de : ' + email.value + ' :',
                instructions: message.value,
                outro: 'A bientôt !'
            }
            const mailInit = {
                method: "POST",
                body: JSON.stringify(mailInfos),
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            }
            fetch(`http://localhost:3000/api/mylaser/mail/infos`, mailInit)
            .then(() => {
                email.value = '';
                message.value = '';
                boxError.innerHTML = '';
                boxError.innerHTML = 'Votre Message a bien été envoyé';
            })
        }
    })
}
const email = document.getElementById('email');
const send = document.getElementById('send');
const message = document.getElementById('message');
const boxError = document.getElementById('box-error');

function sendEmail() {
    const mailInfos = {
        email: email.value,
        subject: 'Nouveau message',
        text: message.value,
        html: message.value
    }
    const mailInit = {
        method: "POST",
        body: JSON.stringify(mailInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    }
    fetch(`http://localhost:3000/api/mylaser/mail`, mailInit)
    .then(res => {
        if(!res.ok) {
            // Error states
            res.json().then((data) => {
                boxError.innerHTML = data.message;
            })
        } else {
            const mailInfos2 = {
                email: email.value,
                subject: 'Merci pour votre message',
                text: 'Nous avons bien reçu votre message et vous en remercions',
                html: 'Nous avons bien reçu votre message et vous en remercions'
            }
            const mailInit2 = {
                method: "POST",
                body: JSON.stringify(mailInfos2),
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            }
            fetch(`http://localhost:3000/api/mylaser/mail`, mailInit2)
            .then(() => {
                email.value = '';
                message.value = '';
                boxError.innerHTML = '';
                boxError.innerHTML = 'Votre Message a bien été envoyé';
            })
        }
    })
}
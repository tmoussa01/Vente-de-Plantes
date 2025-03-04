function connexionInscriptionAcce(to, from, next) {
    if (localStorage.getItem("Authentification")) {
        let dataAutthentification = JSON.parse(localStorage.getItem("Authentification"));
        if (dataAutthentification.connection == false) {
            next();
        }
    } if (!localStorage.getItem("Authentification")) {
        next();
    }
    else {
        next({ path: '/ProfilePage' });
    }
}


export default connexionInscriptionAcce;
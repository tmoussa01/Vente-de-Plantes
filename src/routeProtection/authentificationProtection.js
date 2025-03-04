function authentificationAccessibilite(to, from, next) {
    if (localStorage.getItem("Authentification")) {
        let dataAutthentification = JSON.parse(localStorage.getItem("Authentification"));
        if (dataAutthentification.connection) {
            next();
        }
    } else {
        next({ path: '/ConnexionInscription', name: 'ConnexionInscription' });
    }
}


export default authentificationAccessibilite;



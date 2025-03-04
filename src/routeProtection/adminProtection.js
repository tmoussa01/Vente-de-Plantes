
function adminAccesibilite(to, from, next) {
    if (localStorage.getItem("Authentification")) {
        let dataAutthentification = JSON.parse(localStorage.getItem("Authentification"));

        if (dataAutthentification.role == "admin") {
            next();
        }
    } else {
        next({ path: '/', });
    }
}


export default adminAccesibilite;



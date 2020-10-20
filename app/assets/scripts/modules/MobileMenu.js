class MobileMenu {
    constructor () {
        // Mieux
        
        // On stock notre selection du DOM
        this.menuIcon = document.querySelector(".site-header__menu-icon");
        this.menuContent = document.querySelector(".site-header__menu-content");
        this.siteHeader = document.querySelector(".site-header");

        this.events();
    }

    // création d'une methode pour gérer tous les évenements que l'on veut surveiller
    // attention le addEventListener modifie le mot clé this et le fait pointer vers le dom
    // pour contrer cela on va utiliser un arrow function 
    // car l'arrow function ne manipule pas le mot clé this
    // nom de la méthode aurait peut être autre chose que events
    events() {
        this.menuIcon.addEventListener("click", () => this.toggleTheMenu())
    }

    // fonction que l'on veut lancer lors d'un event
    toggleTheMenu() {
        console.log("Horray- the icon was clicked");
        // ajoute une nouvelle classe à l'élément si celui ci ne l'a pas déjà sinon il le supprimera
        // ici this ne point pas vers l'élément cliqué car on a utilisé une arrow function
        this.menuContent.classList.toggle("site-header__menu-content--is-visible");
        this.siteHeader.classList.toggle("site-header--is-expanded");
        this.menuIcon.classList.toggle("site-header__menu-icon--close-x");
    }
}

export default MobileMenu;
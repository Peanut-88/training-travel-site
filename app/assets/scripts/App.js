import { xor } from 'lodash';
import '../styles/styles.css'
import 'lazysizes'
import MobileMenu from './modules/MobileMenu'
import RevealOnScroll from './modules/RevealOnScroll'
import StickyHeader from './modules/StickyHeader'
//import Modal from './modules/Modal'
import ClientArea from './modules/ClientArea'

new ClientArea();
//new Modal();
let stickyHeader = new StickyHeader();
//let revealOnScroll = new RevealOnScroll()
new RevealOnScroll(document.querySelectorAll(".feature-item"), 75);
new RevealOnScroll(document.querySelectorAll(".testimonial"), 60);
let mobileMenu = new MobileMenu();
let modal

document.querySelectorAll(".open-modal").forEach(el => {
    el.addEventListener("click", e => {
        e.preventDefault()
        // import retourne une promisse
        if (typeof modal == "undefined") {
            // webpackChunkName : permet de donner nom au fichier charge
            import(/* webpackChunkName: "modal" */'./modules/Modal').then(x => {
                modal = new x.default
                // on laisse le temps au navigateur de créer l'objet et de la charger dans le DOM
                setTimeout(() => modal.openTheModal(), 20)
            }).catch(() =>  console.log("There was a problem."))
        } else {
            modal.openTheModal()
        }
    })
})


if(module.hot) {
    module.hot.accept()
}


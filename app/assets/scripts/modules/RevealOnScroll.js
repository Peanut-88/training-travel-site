import throttle from 'lodash/throttle' // throttle car on ne veut pas importer toute la librairie lodash   
// throttle(a, b)   a : fonction qu'on veut lancer, b combien de millisecond on doit patienter avant de pouvoir relancer cette fonction 
import debounce from 'lodash/debounce'; // fiare une chose une fois après avoir resizé

class RevealOnScroll {
    constructor (els, thresholdPercent) {
        this.thresholdPercent = thresholdPercent;
        this.itemsToReveal = els;
        this.browserHeight = window.innerHeight; //afin de ne pas interroger le navigateur pour avoir dom
        this.hideInitially();

        // 200ms : En 1 seconde de scroll cette fonction sera lancée au maximum 5 fois
        // bind : permet d'être sûr que this pointe toujours sur notre objet
        this.scrollThrottle = throttle(this.calcCaller, 200).bind(this); 
        this.events();
    }

    events () {
        window.addEventListener("scroll", this.scrollThrottle);
        window.addEventListener("resize", debounce(() => {
            console.log("Resize just ran");
            this.browserHeight = window.innerHeight;
        }, 333));
    }

    calcCaller() {
        console.log("Scroll function ran")
        this.itemsToReveal.forEach(el => {
            if(el.isRevealed == false) {
                this.calculateIfScrolledTo(el);
            } 
        })
    }

    calculateIfScrolledTo(el) {
        if (window.scrollY + this.browserHeight  > el.offsetTop) {
            console.log("Element was calculate");
            // console.log(el.getBoundingClientRect().y) // ou est positionné mon élémént par rapport top navigateur
            // window.innerHeight : taille du navigateur
            let scrollPercent = (el.getBoundingClientRect().top / this.browserHeight ) * 100; // top compatible avec Edge
            if (scrollPercent < this.thresholdPercent) {
                el.classList.add("reveal-item--is-visible");
                el.isRevealed = true;
                if (el.isLastItem) {
                    window.removeEventListener("scroll", this.scrollThrottle);
                }
            }
        }
    }

    hideInitially () {
        this.itemsToReveal.forEach(el => {
            el.classList.add('reveal-item');
            el.isRevealed = false; 
        });
        this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true;
    }
}

export default RevealOnScroll;
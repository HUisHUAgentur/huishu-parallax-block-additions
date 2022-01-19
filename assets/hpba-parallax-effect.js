document.addEventListener("DOMContentLoaded", function() {
    //check if we are on mobile
    let huPBAIsMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if(!huPBAIsMobile){
        observe('.has-image-parallax', boxParallax);
        parallaxGroups = [].slice.call(document.querySelectorAll(".has-image-parallax"));
        if(parallaxGroups.length){
            window.addEventListener('scroll', function () { // on page scroll
                requestAnimationFrame(parallax);
            }, false);
            setTimeout(parallax, 50);
        }
    }
});

/**
 * Creates an IntersectionObserver and starts observing all elements found using the selector.
 *
 * @param {String} selector: Selector used to find all target elements
 * @param {Function} callback: Callback executed for each threshold
 */
 function observe(selector, callback) {
    const elements = [].slice.call(document.querySelectorAll(selector));
    const options = { };

    const observer = new IntersectionObserver(callback, options);

    elements.forEach(function(element){
        observer.observe(element);
    });
}
  
/**
 * Creates a CSS translateY value.
 *
 * @param {Number} ratio: A number between 0 and 1
 * @param {String} total: A valid CSS number and unit (10px, 100%, 30vh, …)
 * @return {String} The CSS translateY value.
 */
function translateY(ratio, total) {
    return `translateY(calc(-${ratio} * ${total})`;
}
  
/**
 * Callback executed for the box elements
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 *
 * @param {IntersectionObserverEntry[]} entries: Intersection Observer Entries
 */
function boxParallax( entries ) {
    entries.forEach(function(entry){
        if(entry.isIntersecting){
            box = entry.target;
            box.dataset.inview = 1;
        } else {
            box = entry.target;
            box.dataset.inview = 0;
        }
    });
}
  
function parallax(){
    parallaxLayers = [].slice.call(document.querySelectorAll('.has-image-parallax[data-inview="1"]'));
    parallaxLayers.forEach(function(parallaxLayer){
        layernumber = parseInt(parallaxLayer.dataset.layer) || 0;
        direction = parallaxLayer.dataset.direction || 'against';
        parScrollTop = window.pageYOffset;
        elScrollTop = parallaxLayer.getBoundingClientRect().top;
        delta = parScrollTop - elScrollTop;
        layernumber = (layernumber * 0.05);
        fromTop = delta * layernumber;
        if(direction == 'with'){
            parallaxLayer.style.transform = "translate3d(0," + (fromTop) + "px,0)";
        } else {
            parallaxLayer.style.transform = "translate3d(0," + (fromTop * -1) + "px,0)";
        }
    });
}
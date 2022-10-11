const slides = document.querySelectorAll('.hero-slider__item');

var currentSlide = 0;
showSlide(currentSlide)

function plusSlide(n){
    currentSlide+= n;
    showSlide(currentSlide);
}


//add class for active slide
function showSlide(index) {
    removeActiveSlices();
    if (index == slides.length) {
        currentSlide = 0;
    } else if (index < 0){
        currentSlide = slides.length -1
    }
    slides[currentSlide].classList.add('active');
    $('.index').text(`${currentSlide + 1}/${slides.length}`);
}

setInterval(() => {
    currentSlide++;
    showSlide(currentSlide)
}, 5000)

//remove active class for all slide
function removeActiveSlices(){
    slides.forEach(slide => slide.classList.remove('active'));
}
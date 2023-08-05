const thumbnails = document.querySelectorAll('.thumbnails__img img')
const mainImage = document.querySelector('.single-product__thumbnails--main')

thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
        const clickedSource = thumb.src
        const mainSource = mainImage.src
        thumb.src = mainSource
        mainImage.src = clickedSource
    })
})
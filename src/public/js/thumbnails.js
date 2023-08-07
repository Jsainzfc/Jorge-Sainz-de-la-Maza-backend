const thumbnails = document.querySelectorAll('.thumbnails__img img')
const mainImage = document.querySelector('.single-product__thumbnails--main')
const lightBoxImage = document.querySelector('.lightbox__image')
const lightBox = document.querySelector('.lightbox')
const lightBoxClose = document.querySelector('.lightbox__close')
const lightBoxPrev = document.querySelector('.lightbox__prev')
const lightBoxNext = document.querySelector('.lightbox__next')
let srcArray = []
let index = 0

thumbnails.forEach(thumb => {
  thumb.addEventListener('click', () => {
    const clickedSource = thumb.src
    const mainSource = mainImage.src
    thumb.src = mainSource
    mainImage.src = clickedSource
  })
})

const buildSrcArray = () => {
  srcArray.push(mainImage.src)
  thumbnails.forEach(thumb => {
    srcArray.push(thumb.src)
  })
}

mainImage.addEventListener('click', () => {
  lightBoxImage.src = mainImage.src
  lightBox.style.display = 'grid'
  buildSrcArray()
})

lightBoxClose.addEventListener('click', () => {
  lightBoxImage.src = ''
  lightBox.style.display = 'none'
  srcArray = []
})

lightBoxPrev.addEventListener('click', () => {
  if (index === 0) {
    index = srcArray.length - 1
  } else {
    index--
  }
  lightBoxImage.src = srcArray[index]
})

lightBoxNext.addEventListener('click', () => {
  if (index === srcArray.length - 1) {
    index = 0
  } else {
    index++
  }
  lightBoxImage.src = srcArray[index]
})

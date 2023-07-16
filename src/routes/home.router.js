import { Router } from 'express'

const router = Router()

router.get('/', async (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/index.html'))
  //const products = await productManager.getAll()
  // const randomId = getRandomNumber(0, products.length - 1)

  res.render('home', {
    title: 'Home',
    // products,
    // user: {
    //   ...req.user,
    //   isAdmin: req.user.role == 'admin',
    // },
    style: 'home'
  })
})

// router.get('/carrito', (req, res) => {
//   // res.sendFile(path.join(__dirname, '../public/carrito.html'))
//   res.render('carrito', {
//     numItems: 2,
//     title: 'Carrito'
//   })
// })

export default router
import {
  getById as getCartById,
  addOne as addOneCart,
  addProduct as addCartProduct,
  removeProduct as removeCartProduct,
  addProducts as addCartProducts,
  updateProduct as updateCartProduct,
  deleteOne as deleteOneProduct
} from './carts.controller.js'

const getById = async (req, res) => {
  const response = await getCartById(req)
  return res.status(response.status).json(response)
}

const addOne = async (req, res) => {
  const response = await addOneCart()
  return res.status(response.status).json(response)
}

const addProduct = async (req, res) => {
  const response = await addCartProduct(req)
  return res.status(response.status).json(response)
}

const removeProduct = async (req, res) => {
  const response = await removeCartProduct(req)
  return res.status(response.status).json(response)
}

const addProducts = async (req, res) => {
  const response = await addCartProducts(req)
  return res.status(response.status).json(response)
}

const updateProduct = async (req, res) => {
  const response = await updateCartProduct(req)
  return res.status(response.status).json(response)
}

const deleteOne = async (req, res) => {
  const response = await deleteOneProduct(req)
  return res.status(response.status).json(response)
}

export { getById, addOne, addProduct, removeProduct, addProducts, updateProduct, deleteOne }

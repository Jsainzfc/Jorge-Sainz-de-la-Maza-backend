import cartTesting from './cartManagerTesting.js'
import productTesting from './productManagerTesting.js'

const testing = async () => {
    await productTesting()
    await cartTesting()
}

testing()
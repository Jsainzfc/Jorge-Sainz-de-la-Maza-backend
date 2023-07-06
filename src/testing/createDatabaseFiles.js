import path from 'path'
import { fileURLToPath } from 'url';
import { ProductManager } from '../managers/productManager.js'
import fs from 'fs' // Module for managing files 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createFileForTesting = async () => {
    const code  = 'code'
    const title = 'Product'
    const description = 'Este es un product prueba'
    const price = 20
    const stock = 25

    if (fs.existsSync(path.join(__dirname, '../database/products.json'))) {
        fs.unlinkSync(path.join(__dirname, '../database/products.json'))
        //file removed
    }
    const manager = new ProductManager(path.join(__dirname, '../database/products.json'))
    for (let i = 0; i<10; i++) {
        await manager.addProduct({code: `code_${i}`, title: `title_${i}`, description, price, stock})
    }
}

createFileForTesting()
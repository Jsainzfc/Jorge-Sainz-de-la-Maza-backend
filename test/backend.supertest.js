/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

const regExpId = /^[a-f\d]{24}$/i

describe('Testing backend', () => {
  describe('Testing Products Router', () => {
    let id
    it('POST in /api/products must create a product', async () => {
      const body = {
        product: {
          code: 'productmock',
          title: 'Product Mock',
          description: 'This is product Mock',
          price: 10,
          stock: 10,
          thumbnails: ['thumbnail0', 'thumbnail1'],
          status: true,
          categories: []
        },
        user: 'jsainzfc@gmail.com'
      }
      const { _body } = await requester.post('/api/products').send(body)
      expect(_body.success).to.be.true
      expect(_body.status).to.be.deep.equal(200)
      expect(_body.error).to.be.deep.equal('')
      expect(_body.payload.code).to.be.deep.equal('productmock')
      id = _body.payload._id
    })
    it('GET in /api/products/id must return the product', async () => {
      const { _body } = await requester.get(`/api/products/${id}`)
      expect(_body.success).to.be.true
      expect(_body.status).to.be.deep.equal(200)
      expect(_body.error).to.be.deep.equal('')
      expect(_body.payload.code).to.be.deep.equal('productmock')
    })
    it('GET in /api/products must return all of the products', async () => {
      const { _body } = await requester.get('/api/products')
      expect(_body.success).to.be.true
      expect(_body.status).to.be.deep.equal(200)
      expect(_body.error).to.be.deep.equal('')
      expect(_body.totalPages).to.be.deep.equal(1)
      expect(_body.payload.length).to.be.deep.equal(1)
      expect(_body.payload[0].code).to.be.deep.equal('productmock')
    })
    it('PUT in /api/products/id must update the product', async () => {
      {
        const { _body } = await requester.get(`/api/products/${id}`)
        expect(_body.payload.price).to.be.deep.equal(10)
      }
      {
        const body = {
          product: {
            price: 30
          },
          user: 'jsainzfc@gmail.com'
        }
        const { _body } = await requester.put(`/api/products/${id}`).send(body)
        expect(_body.success).to.be.true
        expect(_body.status).to.be.deep.equal(200)
        expect(_body.error).to.be.deep.equal('')
      }
      {
        const { _body } = await requester.get(`/api/products/${id}`)
        expect(_body.payload.price).to.be.deep.equal(30)
      }
    })
    it('DELETE in /api/products/id must delete the product', async () => {
      const response = await requester.delete(`/api/products/${id}`).send({ user: 'jsainzfc@gmail.com' })
      expect(response.status).to.be.deep.equal(204)
      expect(response.ok).to.be.true
    })
  })

  describe('Testing Carts Router', () => {
    let id
    let pid
    before(async () => {
      const body = {
        product: {
          code: 'productmock',
          title: 'Product Mock',
          description: 'This is product Mock',
          price: 10,
          stock: 10,
          thumbnails: ['thumbnail0', 'thumbnail1'],
          status: true,
          categories: []
        },
        user: 'jsainzfc@gmail.com'
      }
      const { _body } = await requester.post('/api/products').send(body)
      pid = _body.payload._id
    })
    after(async () => {
      await requester.delete(`/api/products/${pid}`).send({ user: 'jsainzfc@gmail.com' })
    })
    it('GET in /api/carts/id must return no cart if id not existing', async () => {
      const { _body } = await requester.get('/api/carts/6543b696daade4b2a2cc8051')
      expect(_body.success).to.be.false
      expect(_body.status).to.be.deep.equal(500)
      expect(_body.error).to.be.deep.equal('Cart not found.')
    })
    it('POST in /api/carts must create a cart', async () => {
      const { _body } = await requester.post('/api/carts')
      expect(_body.success).to.be.true
      expect(_body.status).to.be.deep.equal(200)
      expect(_body.error).to.be.deep.equal('')
      expect(_body.payload).to.match(regExpId)
      id = _body.payload
    })
    it('GET in /api/carts/id must return a cart', async () => {
      const { _body } = await requester.get(`/api/carts/${id}`)
      expect(_body.success).to.be.true
      expect(_body.status).to.be.deep.equal(200)
      expect(_body.error).to.be.deep.equal('')
      expect(_body.payload.length).to.be.deep.equal(0)
    })
    it('POST in /api/carts/id/products/pid must add product to the cart', async () => {
      const { _body } = await requester.post(`/api/carts/${id}/product/${pid}`)
      expect(_body.success).to.be.true
      expect(_body.status).to.be.deep.equal(200)
      expect(_body.error).to.be.deep.equal('')
      expect(_body.payload.products.length).to.be.deep.equal(1)
    })
    it('DELETE in /api/carts/id/products/pid must remove product to the cart', async () => {
      {
        const response = await requester.delete(`/api/carts/${id}/product/${pid}`)
        expect(response.status).to.be.deep.equal(200)
        expect(response.ok).to.be.true
      }
      {
        const { _body } = await requester.get(`/api/carts/${id}`)
        expect(_body.success).to.be.true
        expect(_body.status).to.be.deep.equal(200)
        expect(_body.error).to.be.deep.equal('')
        expect(_body.payload.length).to.be.deep.equal(0)
      }
    })
  })
  describe('Testing Users Router', () => {
    it('POST in /signup must create a user', async () => {
      const mockUser = {
        firstname: 'First name',
        lastname: 'Last name',
        email: 'newuser@email.com',
        password: 'password',
        password2: 'password',
        age: 99
      }
      const { _body } = await requester.post('/signup').send(mockUser)
      expect(_body.message).to.be.deep.equal('User registered')
    })
    it('POST in /signup with existing user must fail', async () => {
      const mockUser = {
        firstname: 'First name',
        lastname: 'Last name',
        email: 'newuser@email.com',
        password: 'password',
        password2: 'password',
        age: 99
      }
      const { _body } = await requester.post('/signup').send(mockUser)
      expect(_body).to.be.undefined
    })
    it('POST in /login with existing user must access', async () => {
      const mockUser = {
        email: 'newuser@email.com',
        password: 'password'
      }
      const { _body } = await requester.post('/login').send(mockUser)
      console.log(_body)
      expect(_body).to.be.undefined
    })
    it('POST in /auth/login with existing user but not privileged must not access', async () => {
      const mockUser = {
        email: 'newuser@email.com',
        password: 'password'
      }
      const response = await requester.post('/login').send(mockUser)
      expect(response.status).to.be.deep.equal(302)
      expect(response.ok).to.be.false
    })
    it('DELETE in /api/users with existing email must delete user', async () => {
      const response = await requester.delete('/api/users').send({ email: 'newuser@email.com' })
      expect(response.status).to.be.deep.equal(200)
      expect(response.ok).to.be.true
    })
  })
})

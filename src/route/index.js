// Підключаємо технологію express для back-end сервера
const express = require('express')
const { Stats } = require('webpack')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #userlist = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#userlist.push(user)
  }

  static getList = () => this.#userlist

  static getById = (id) => this.#userlist.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#userlist.findIndex(
      (user) => user.id === id
    )
    if(index !== -1) {
      this.#userlist.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const user = this.getById(id)
    if(user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }
  static update = (user, {email}) => {
    if(email) {
      user.email = email
    }
  }
}

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.createDate = new Date()
    this.id = Math.trunc(Math.random(1) * 10000000)
  }
  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) => this.#list.find((product) => product.id === id)
  
  static updateById = (id, data) => {
    const product = this.getById(id)
    
    if(product) {
      this.update(product, data)
      return true
    }
    return false
  }
  static update = (product, {name, price, description}) => {
    if(product) {
      product.name = name;
      product.price = price;
      product.description = description;
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id
    )
    if(index !== -1) {
      this.#list.splice(index, 1)
      return true
    }
    return false
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list =  User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      }
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/user-create', function (req, res) {
  const {email, login, password} = req.body

  const user = new User (email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('alert-user', {
    style: 'alert-user',
    info: 'Користувач створений'
  })
})

router.get('/user-delete', function (req, res) {
  const {id} = req.query

  User.deleteById(Number(id))

  res.render('alert-user', {
    style: 'alert-user',
    info: 'Користувач видалений'
  })
})

router.post('/user-update', function (req, res) {
  const {email, password, id} = req.body

  let result = false

  const user = User.getById(Number(id))

  if(user.verifyPassword(password)) {
    User.update(user, {email})
    result = true
  }

  res.render('alert-user', {
    style: 'alert-user',
    info: result 
      ? 'Емайл пошта оновлена' 
      : 'Сталася помилка',
  })
})

// ================================================================

router.get('/product-create', function (req, res) {
  const productlist =  Product.getList()
  res.render('product-create', {
    style: 'product-create',
    data: {
      list: {
        productlist,
        isEmpty: productlist.length === 0,
      }
    },
  })
})

router.post('/product-create', function (req, res) {
  const {name, price, description} = req.body
  const product = new Product (name, price, description)
  Product.add(product)
  console.log(Product.getList())
  res.render('alert-products', {
    style: 'alert-products',
    info: 'Товар створений'
  })
})

router.get('/product-list', function (req, res) {
  const productlist = Product.getList()
  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        productlist,
        isEmpty: productlist.length === 0,
      }
    },  
  })
})

router.get('/product-edit', function (req, res) {

  const {id} = req.query
  
  const product = Product.getById(Number(id))

  const productlist = Product.getList()

  res.render('product-edit', {
    style: 'product-edit',
    data: {
      product,
      products: {
        productlist,
      }
    },
  })
})

router.post('/product-edit', function (req, res) {
  const {name, price, description, id} = req.body

  const result = Product.updateById(Number(id), {name, price, description})

  res.render('alert-products', {
    style: 'alert-products',
    info: result 
    ? 'Дані товару оновлені' 
    : 'Товар з таким ID не знайдено', 
  })
})

router.get('/product-delete', function (req, res) {

  const {id} = req.query
  
  const result = Product.deleteById(Number(id))

  res.render('alert-products', {
    style: 'alert-products',
    info: result 
    ? 'Товар видалено' 
    : 'Товар з таким ID не знайдено', 
  })
})

// Підключаємо роутер до бек-енду
module.exports = router

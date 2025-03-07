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

// ================================================================

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

// Підключаємо роутер до бек-енду
module.exports = router

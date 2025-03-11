// Підключаємо технологію express для back-end сервера
const express = require('express')
const { Stats } = require('webpack')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []
  static #count = 0

  constructor (img, title, comment, category, price, amount = 0) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.comment = comment
    this.category = category
    this.price = price
    this.amount = amount
  }
  static add = (...data) => {
    const newProduct = new Product (...data)
    this.#list.push(newProduct)
  }
  static getList = () => {
      return this.#list
  }
  static getById = (id) => {
    return this.#list.find ((product) => product.id === id)
  }
  static getRandomList = (id) => {
    // Фільтруємо товари, щоб вилучити той, з яким порівнюємо id
    const filteredList = this.#list.filter((product) => product.id !== id)
    // Відсортуємо за допомогою Math.random() та перемішаємо масив
    const shuffledList = filteredList.sort( () => Math.random() - 0.5)
    // Повертаємо перші 3 елементи з перемішаного масиву
    return shuffledList.slice (0, 3)
  }
}

Product.add(
  '/img/img-1.png',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [{id: 1, text: 'Готовий до відправки'}, {id: 2, text: 'Топ продажів'}],
  17000,
  10,
)

Product.add(
  '/img/img-2.png',
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`,
  [{id: 1, text: 'Готовий до відправки'}, {id: 2, text: 'Топ продажів'}],
  113109,
  10,
)

Product.add(
  '/img/img-3.png',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [{id: 1, text: 'Готовий до відправки'}, {id: 2, text: 'Топ продажів'}],
  27000,
  10,
)

Product.add(
  '/img/img-3.png',
  `1Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [{id: 1, text: 'Готовий до відправки'}, {id: 2, text: 'Топ продажів'}],
  27000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }
  static calcBonusBalance = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }
  static updateBonusBalance = (email, price, bonusUse = 0) => {
    const amount = this.calcBonusBalance(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updatedBalance = currentBalance + amount - bonusUse
    Purchase.#bonusAccount.set(email, updatedBalance)
    return amount
  }
  constructor (data, product) {
    this.id = ++Purchase.#count
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.phone = data.phone
    this.email = data.email
    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.bonusBalance = data.bonusBalance
    this.promocode = data.promocode || null
    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount
    this.product = product
  }
  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }
  static getById = (id) => {
    return Purchase.#list.find((item) => item.id = id)
  }
  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)
    if (purchase) {
      if(data.firstname) purchase.firstname = data.firstname
      if(data.lastname) purchase.lastname = data.lastname
      if(data.phone) purchase.phone = data.phone
      if(data.email) purchase.email = data.email
      return true
    }
    return false
  }
  static getList() {
    return Purchase.#list.reverse().map(purchase => ({
      id: purchase.id,
      totalPrice: purchase.totalPrice,
      bonusBalance: purchase.bonusBalance,
      product: {
        title: purchase.product.title
      }
    }))
  }
  static getInfo(id) {
    const purchase = Purchase.#list.find((item) => item.id === id)
      return {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      comment: purchase.comment,
      totalPrice: purchase.totalPrice,
      bonusBalance: purchase.bonusBalance,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      product: {
        title: purchase.product.title
      }
    }
  }
  
}

class Promocode {
  static #list = []

  constructor (name, factor) {
    this.name = name
    this.factor = factor
  }
  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }
  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }
  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

// ================================================================

// res.render генерує нам HTML сторінку
router.get('/', function (req, res) {


  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      list: Product.getList()
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

// res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if(amount < 1) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        messege: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)

  if(product.amount < amount) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        messege: 'Помилка',
        info: 'Такої кількості товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusBalance(totalPrice).toFixed(2)

  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: 'Доставка',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    phone,
    email,
    comment,

    promocode,
    bonus,
    bonusBalance
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
  
      data: {
        messege: 'Помилка',
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
  
      data: {
        messege: 'Помилка',
        info: 'Товару немає в вибраній кількості',
        link: '/purchase-list',
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)
  bonusBalance = Number(bonusBalance)


  if (isNaN(totalPrice) || isNaN(productPrice) || isNaN(deliveryPrice) || isNaN(amount) || isNaN(bonus)) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
  
      data: {
        messege: 'Помилка',
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
  
      data: {
        messege: 'Помилка',
        info: 'Заповніть обовʼязкові поля',
        link: '/purchase-list',
      },
    })
  }
  
  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email) 
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    bonusBalance = Purchase.updateBonusBalance(email, totalPrice, bonus).toFixed(2)
    totalPrice -= bonus
  } else {
    bonusBalance = Purchase.updateBonusBalance(email, totalPrice, 0).toFixed(2)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,
      bonusBalance,
  
      firstname,
      lastname,
      phone,
      email,
      comment,

      promocode,
    },
    product
  )

  // console.log(purchase)

// res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert-purchase', {
    style: 'alert-purchase',

    data: {
      messege: 'Успішно',
      info: 'Замовлення створено',
      link: '/purchase-list',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-list', function (req, res) {
  const purchaseList = Purchase.getList()
  
  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      purchaseList,
      isEmpty: purchaseList.length === 0,
    },  
  })
})

router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)
  const purchaseList = Purchase.getInfo(id)

  res.render('purchase-info', {
    style: 'purchase-info',
    data: {
      purchaseList,
    },  
  })
})

router.get('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)
  const purchaseList = Purchase.getInfo(id)

  console.log(id)
  console.log(purchaseList)

  res.render('purchase-edit', {
    style: 'purchase-edit',
    data: {
      purchaseList,
    },
  })
})

router.post('/purchase-edit', function (req, res) {
  const {firstname, lastname, phone, email} = req.body
  const id = Number(req.query.id)


  console.log(id)
  console.log(firstname, lastname, phone, email)

  if (!firstname || !lastname || !phone || !email) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
  
      data: {
        messege: 'Помилка',
        info: 'Заповніть обовʼязкові поля',
        link: '/purchase-list',
      },
    })
  }

  Purchase.updateById(id, {firstname, lastname, phone, email})

  console.log(id)
  console.log(firstname, lastname, phone, email)
  
  res.render('alert-purchase', {
    style: 'alert-purchase',
    data: {
      messege: 'Успішно',
      info: 'Дані змінено',
      link: '/purchase-list',
    },
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router

// Підключаємо технологію express для back-end сервера
const express = require('express')
const { Stats } = require('webpack')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  static #list = []
  static #count = 0 

  constructor(name, author, image) {
    this.id = ++Track.#count
    this.name = name
    this.author = author
    this.image = image
  }
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }
  static getList() {
    return this.#list
  }
  static getById(id) {
    return (
      Track.#list.find(
        (playlist) => playlist.id === id
      ) || null
    )
  }
}

Track.create (
  `Sunlight`,
  `ARIV3`,
  `/img/track-1.png`
)
Track.create (
  `Lose Myself Feat. LUFS (Extended Mix)`,
  `Jono Stephenson`,
  `/img/track-2.png`
)
Track.create (
  `Your Love (Original Mix)`,
  `Oliver Smith`,
  `/img/track-3.png`
)
Track.create (
  `Wildfire (Colyn Remix)`,
  `RÜFÜS DU SOL`,
  `/img/track-4.png`
)
Track.create (
  `Pretoria (Extended Mix)`,
  `Nora En Pure`,
  `/img/track-5.png`
)
Track.create (
  `Freyja (Extended Mix)`,
  `Nora En Pure`,
  `/img/track-6.png`
)
Track.create (
  `Horizon (Extended Mix)`,
  `Joris Voorn`,
  `/img/track-7.png`
)
Track.create (
  `Sonata (Extended Mix)`,
  `Tim Enso, Inaya`,
  `/img/track-8.png`
)
Track.create (
  `Sinfonia (Extended Mix)`,
  `Carl Bee`,
  `/img/track-9.png`
)
Track.create (
  `Forever (MEDUZA Remix)`,
  `Hugel, Diplo, Malou, Yuna`,
  `/img/track-10.png`
)

class Playlist {
  static #list = []
  static #count = 0

  constructor(name, image) {
    this.id = ++Playlist.#count
    this.name = name
    this.image = image
    this.tracks = []
  }
  static create(name, image) {
    const newPlayList = new Playlist(name, image)
    this.#list.push(newPlayList)
    return newPlayList
  }
  static getList() {
    return this.#list.reverse()
  }
  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks.sort(() => 0.5 - Math.random()).slice(0, 3)
    playlist.tracks.push(...randomTracks)
  }
  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id
      ) || null
    )
  }
  static addTrackById = (playlist, track) => {
    const newTrack = {...track}
    playlist.tracks.push(newTrack)
  }
  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id != trackId,
    )
  }
  static findListByValue(name) {
    return this.#list.filter((playlist) => playlist.name.toLowerCase().includes(name.toLowerCase()))
  }
}

Playlist.create('Мій плейліст №1', `/img/track-1.png`)
Playlist.create('Мій плейліст №2', `/img/track-2.png`)
Playlist.create('Мій плейліст №3', `/img/track-3.png`)

Playlist.makeMix(Playlist.create('Мій плейліст №4', `/img/track-4.png`))
Playlist.makeMix(Playlist.create('Спільний альбом', `/img/track-5.png`))
Playlist.makeMix(Playlist.create('Пісні, що сподобались', `/img/track-6.png`))


// ================================================================

// res.render генерує нам HTML сторінку

router.get('/', function (req, res) {
  const list = Playlist.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-library', {
    style: 'spotify-library',
    data: {
      list: list.map(({tracks, ...rest}) => ({...rest, 
        amount: tracks.length})),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/spotify-choose', function (req, res) {
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
  const playlist = Playlist.getById(id)

  if(!id) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Плейлист не знайдено',
        link: `/spotify-playlist?id=${id}`,
      },
    })
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/spotify-playlist', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Введіть назву плейлиста',
        link: isMix ? `/spotify-create?isMix=true` : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if(isMix) {
    Playlist.makeMix(playlist)
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if(!playlist) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Плейлист не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({tracks, ...rest}) => ({...rest, 
      amount: tracks.length})),
      value,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({tracks, ...rest}) => ({
        ...rest, 
        amount: tracks.length,
      })),
      value,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  const playlist = Playlist.getById(playlistId)
  const trackList = Track.getList()
  const list = Playlist.getList()

  if(!trackList) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Плейлист не знайдено',
        link: '/spotify-create?isMix=true',
      },
    })
  }
  
  // console.log(Track.getById(3))

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      trackList,
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
      list: list.map(({tracks, ...rest}) => ({...rest, 
        amount: tracks.length})),
    },
  })

  // ↑↑ сюди вводимо JSON дані
})

router.post('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)
  const track = Track.getById(trackId)
  const trackList = Track.getList()

  if(!playlistId) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Плейлист не знайдено',
        link: '/spotify-playlist',
      },
    })
  }

  if(!trackId) {
    return res.render('alert-purchase', {
      style: 'alert-purchase',
      data: {
        message: 'Помилка',
        info: 'Трек не знайдено',
        link: '/spotify-playlist',
      },
    })
  }

  Playlist.addTrackById(playlist, track)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router

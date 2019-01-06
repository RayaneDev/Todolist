(function () {
  'use strict'

  class App {
    constructor () {
      this.sheets = []
      this.offset = [0, 0]
      this.currentSheet = 0
      this.mousePosition = {}
      this.isDown = false
      this.limits = [400, 150]
    }

    run () {
      this.bind()
      this.load()
    }

    load () {
      let sheets = JSON.parse(window.localStorage.sheets || null) || {}

      if (sheets) {
        for (let i = 0; i < sheets.length; i++) {
          let sheet = this.getSheet()
          document.getElementById('content').appendChild(sheet)

          sheet.childNodes[1].firstChild.value = sheets[i][1]
          sheet.style.top = sheets[i][0][0]
          sheet.style.left = sheets[i][0][1]
        }
      }
    }

    drag (x, y, section) {
      this.currentSheet = section

      this.isDown = true
      this.offset = [
        section.offsetLeft - x,
        section.offsetTop - y
      ]
    }

    drop (x, y) {
      this.mousePosition = {

        x: x,
        y: y

      }
      if ((this.mousePosition.x + this.offset[0]) > 120 && (this.mousePosition.x + this.offset[0]) < window.innerWidth - this.limits[0]) {
        this.currentSheet.style.left = (this.mousePosition.x + this.offset[0]) + 'px'
      }

      if ((this.mousePosition.y + this.offset[1]) > 0 && (this.mousePosition.y + this.offset[1]) < window.innerHeight - this.limits[1]) {
        this.currentSheet.style.top = (this.mousePosition.y + this.offset[1]) + 'px'
      }
    }

    getSheet () {
      let section = document.createElement('section')
      section.classList.add('postIt')
      let header = document.createElement('header')
      header.classList.add('actions')

      let close = document.createElement('button')
      close.onclick = function (e) {
        section.style.display = 'none'
        section.classList.remove('postIt')
      }
      close.classList.add('close')
      close.classList.add('icon')

      let grab = document.createElement('button')

      grab.classList.add('grab')
      grab.classList.add('icon')

      header.appendChild(close)
      header.appendChild(grab)

      let content = document.createElement('div')
      content.classList.add('content')

      let textarea = document.createElement('textarea')
      textarea.classList.add('text')
      textarea.addEventListener('change', (e) => {
        textarea.style.height = '1px'
        if ((25 + textarea.scrollHeight) > window.innerHeight - this.limits[1]) {
          textarea.style.height = (window.innerHeight - this.limits[1]) + 'px'
        } else {
          textarea.style.height = (25 + textarea.scrollHeight) + 'px'
        }
      })
      content.appendChild(textarea)

      section.appendChild(header)
      section.appendChild(content)

      grab.addEventListener('mousedown', (e) => {
        this.drag(e.clientX, e.clientY, section)
        console.log('mouse', (e.clientX+e.clientY))
      }, true)

      grab.addEventListener('touchstart', (e) => {
        let x = e.touches[0].screenX
        let y = e.touches[0].screenY
        console.log('touch', (x+y))
        this.drag(x, y, section)
      }, true)

      textarea.addEventListener('focus', (e) => {
        section.classList.add('selected')
        this.currentSheet = section
      })

      textarea.addEventListener('blur', (e) => {
        section.classList.remove('selected')
      })

      textarea.focus()
      return section
    }

    fill () {
      this.sheets = []
      let postIts = document.getElementsByClassName('postIt')
      for (let i = 0; i < postIts.length; i++) {
        let style = window.getComputedStyle(postIts[i])
        let content = postIts[i].childNodes[1].firstChild.value

        this.sheets.push([[style.getPropertyValue('top'), style.getPropertyValue('left')], content])
      }
    }

    save () {
      this.fill()
      window.localStorage.sheets = JSON.stringify(this.sheets)

      return 1
    }

    bind () {
      document.getElementById('add').onclick = (e) => {
        let sheet = this.getSheet()
        document.getElementById('content').appendChild(sheet)

        sheet.childNodes[1].firstChild.focus()
      }

      document.getElementById('save').onclick = (e) => {
        if (this.save()) {
          window.alert('Vous avez bien sauvegardé vos post-its !')
        }
      }

      ['mouseup', 'touchend'].map((e) => {
        window.addEventListener(e, () => {
          console.log('end')
          this.isDown = false
        }, true)
      })

      document.addEventListener('mousemove', (e) => {
        if (this.isDown) {
          e.preventDefault()

          this.drop(e.clientX, e.clientY)
        }
      }, true)

      document.addEventListener('touchmove', (e) => {
        if (this.isDown) {
          let x = e.touches[0].screenX
          let y = e.touches[0].screenY

          this.drop(x, y)
        }
      }, true)
    }
  }

  let app = new App()

  app.run()
})()

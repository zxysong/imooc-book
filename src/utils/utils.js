import Cookies from 'js-cookie'

const TokenKey = 'Authorization'
/*
* 设置setLocalStorage
* */
export function setLocalStorage (key, value) {
  window.localStorage.setItem(key, window.JSON.stringify(value))
}
/*
* 获取getLocalStorage
* */
export function getLocalStorage (key) {
  return window.JSON.parse(window.localStorage.getItem(key) || '[]')
}
/*
* 设置setSessionStorage
* */
export function setSessionStorage (key, value) {
  window.sessionStorage.setItem(key, window.JSON.stringify(value))
}
/*
* 获取getSessionStorage
* */
export function getSessionStorage (key) {
  return window.JSON.parse(window.sessionStorage.getItem(key) || '[]')
}
/*
* 获取getToken
* */
export function getToken () {
  return Cookies.get(TokenKey)
}
/*
* 设置setToken
* */
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}
/*
* 移除removeToken
* */
export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function px2rem (px) {
  const ratio = 375 / 10
  return px / ratio
}

export function realPx (px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}
export function addCss (href) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}

export function removeCss (href) {
  const link = document.getElementsByTagName('link')
  for (var i = link.length; i >= 0; i--) {
    if (link[i] && link[i].getAttribute('href') != null && link[i].getAttribute('href').indexOf(href) !== -1) {
      link[i].parentNode.removeChild(link[i])
    }
  }
}

export function removeAllCss () {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
}

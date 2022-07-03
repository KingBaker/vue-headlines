// 本地存储的封装
// 可以替换localStorage,sessionStorage, cookie

export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}

export const getStorage = (key) => {
  return localStorage.getItem(key)
}

export const removeStorage = (key) => {
  localStorage.removeItem(key)
}

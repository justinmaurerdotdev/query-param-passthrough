/* global qppt_settings */

const cookieManager = {
  setCookie (name, value, hours) {
    let expires = ''
    if (hours) {
      const date = new Date()
      date.setTime(date.getTime() + hours * 60 * 60 * 1000)
      expires = '; expires=' + date.toUTCString()
    }
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    document.cookie =
      name + '=' + (value || '') + expires + '; SameSite=Lax; path=/'
  },
  getCookie (name) {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length)
      }
    }

    return null
  },
  eraseCookie (name) {
    document.cookie = name + '=; Max-Age=-99999999;'
  },
  cookieEnabled () {
    let cookieEnabled = navigator.cookieEnabled
    if (!cookieEnabled) {
      document.cookie = 'testcookie'
      cookieEnabled = document.cookie.indexOf('testcookie') !== -1
    }

    return cookieEnabled
  },
}

function set_cookie_values () {
  const searchParams = new URLSearchParams(window.location.search)

  const token = searchParams.get('token')
  const cid = searchParams.get('cid')

  let passthroughParams = {}

  if (token !== null) {
    passthroughParams.token = token

    if (cid !== null) {
      passthroughParams.cid = cid
    }
  }

  if (typeof passthroughParams.token !== 'undefined') {
    cookieManager.setCookie(
      'qpptparams',
      JSON.stringify(passthroughParams),
      24 * 365,
    )
  }
}

function replace_urls () {
  const cookie = cookieManager.getCookie('qpptparams')
  if (cookie) {
    const cookieValues = JSON.parse(cookie)

    if (typeof cookieValues.token !== 'undefined') {
      if (
        typeof qppt_settings !== 'undefined' &&
        typeof qppt_settings.qppt_target_domain !== 'undefined'
      ) {
        const target_domain = qppt_settings.qppt_target_domain

        const aTags = document.getElementsByTagName('a')
        for (const item of aTags) {
          if (typeof target_domain === 'string') {
            if (item.hostname === target_domain) {
              process_a_tag(item)
            }
          }
          else if (typeof target_domain === 'object') {
            if (target_domain.indexOf(item.hostname) >= 0) {
              process_a_tag(item)
            }
          }
        }
      }
    }
  }
}

function process_a_tag (item) {
  const cookie = cookieManager.getCookie('qpptparams')
  if (cookie) {
    const cookieValues = JSON.parse(cookie)

    const existingQueryString = item.search
    let params = new URLSearchParams(existingQueryString)

    if (
      typeof cookieValues.token !== 'undefined' &&
      cookieValues.token !== null
    ) {
      params.set('token', cookieValues.token)

      if (
        typeof cookieValues.cid !== 'undefined' &&
        cookieValues.cid !== null
      ) {
        params.set('cid', cookieValues.cid)
      }
    }

    item.search = params
  }
}

(function () {
  if (cookieManager.cookieEnabled) {
    set_cookie_values()
    replace_urls()
  }
})()

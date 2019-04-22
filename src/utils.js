function formatProxyUrl ({ ip, port, username, password }) {
  if (!ip || !port) {
    return null
  }

  if (!username && !password) {
    return `${ip}:${port}`
  }

  return `${username}:${password}@${ip}:${port}`
}

module.exports = {
  formatProxyUrl
}

const socks_agent = require('socks5-https-client/lib/Agent');
const faker = require('faker');

class Supplier {
    static _getPassword(password) {
        if (password == null) {
            return faker.internet.userName().replace(/[^A-Za-z0-9+]/g, '')
        }

        return password
    }

    static _getEmail(email) {
        if (email == null) {
            return faker.internet.email()
        }

        return email
    }

    static _getSocksAgent(socks_ip, socks_port) {
        if (socks_ip == null || socks_port == null)
            return null;

        return socks_agent;
    }

    static _formatProxy(socks_ip, socks_port, socks_username, socks_password) {
        if (socks_ip == null || socks_port == null) {
            return ''
        }

        if (socks_username == null || socks_password == null) {
            return socks_ip + ':' + socks_port
        }

        return socks_username + ':' + socks_password + '@' + socks_ip + ':' + socks_port
    }

    static _getRandomYear() {
        return Math.floor(Math.random() * 24) + 1980
    }

    static _getRandomMonth() {
        return Math.floor(Math.random() * 12) + 1
    }

    static _getRandomDay() {
        return Math.floor(Math.random() * 28) + 1
    }
}

module.exports = Supplier;
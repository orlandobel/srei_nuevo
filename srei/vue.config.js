const fs = require('fs')

module.exports = {
    devServer: {
        https: {
          key: fs.readFileSync('./certs/srei.com+5-key.pem'),
          cert: fs.readFileSync('./certs/srei.com+5.pem'),
        },
        public: 'https://localhost:8080/'
    }
}
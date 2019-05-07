// const proxy = require('http-proxy-middleware');

// module.exports = function (app) {
//     console.log('SETUP')
//     app.use(proxy('/api', { target: 'http://localhost:3001/' }));
//     app.use(proxy('/socket.io', { target: 'http://localhost:3001/', ws: true }))
//     app.use(proxy("/sockjs-node", {
//         "target": "ws://localhost:3001",
//         "ws": true
//     }))

// };
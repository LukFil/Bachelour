// import {uri, username, password} from './variables.js';

const connect  = require('./variables')
const neo4j_fun = require('./neo4j_fun')

// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello, World!\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// testObj = {
//     gene_sym: 'mojGen',
//     properties: {
//         sila: 'mocny',
//         vlasy: 'all-cool'
//     }    
// }

// testRel = {
//     origin: 'Alice',
//     nameRel: 'hello',
//     properties: {
//         sila: 'velka',
//         kedy: 'vnoci',
//         prec: 'kam'
//     },
//     target: 'Francis'
// }


// neo4j_fun.testDriver1(connect.uri, connect.username, connect.password)
// neo4j_fun.getTarget(connect.uri, connect.username, connect.password)
// neo4j_fun.getTargetTest(connect.uri, connect.username, connect.password)
// neo4j_fun.setTarget(connect.uri, connect.username, connect.password, testObj)
// neo4j_fun.setRelationship(connect.uri, connect.username, connect.password, testRel)
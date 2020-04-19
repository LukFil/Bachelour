// import {uri, username, password} from './variables.js';

const connect  = require('./variables')
const neo4j_fun = require('./neo4j_fun')
const string_db_fun = require('./string-db_fun')
const util = require('./util')

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

// testObj = [{
//     gene_sym: 'mojGen',
//     properties: {
//         sila: ['mocny', 'skvely', "a-tak-dalej"],
//         vlasy: 'all-cool'
//     }    
// }]

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

async function setFunAnnot (){
    
    const targets = await neo4j_fun.getTarget(connect.uri, connect.username, connect.password)
    // var testTar = targets.slice(0, 5)
    // console.log(testTar)
    // // var testTar2 = targets.slice(960, 1500)

    // var [tar1, tar2] = targets
    // console.log(tar1)

    // // var newTar = [tar1, tar2]
    // // console.log(newTar)

    const annotat = await string_db_fun.repackFunAnnot(targets, id_caller = "l.filipcik@student.maastrichtuniversity.nl")
    
    for (var i = 0; i < annotat.length; i++){
        console.log("Did I get Here")
        await util.sleep(1000)
        console.log("I waited too")
        neo4j_fun.setTarget(connect.uri, connect.username, connect.password, annotat[i])
    }
    // annotat.forEach(async (obj) => {
    //     await util.sleep(10000)
    //     console.log("I waited too")
    //     neo4j_fun.setTarget(connect.uri, connect.username, connect.password, obj)
    // })
}

async function setRel(){
    const targets = await neo4j_fun.getTarget(connect.uri, connect.username, connect.password)

    const rel = await string_db_fun.outStringDB(
        targets, 
        id_caller = "l.filipcik@student.maastrichtuniversity.nl", 
        species = "9606", 
        req_score = "400"
    )

    // console.log(rel)
    const chunkSize = 350;
    var run = true;
    var cnt = 0;

    while (run == true) {
        var subRel = rel.slice(cnt*chunkSize, (cnt+1) *chunkSize)

        subRel.forEach((obj) => {
            neo4j_fun.setRelationship(connect.uri, connect.username, connect.password, obj)
        })

        await util.sleep(10000);
        console.log("Passing relationships to Neo4J chunk " + cnt)

        cnt += 1; 
        if (cnt * chunkSize >= rel.length){
            run = false;
        }
    }
}

async function main(){
    // setFunAnnot()
    setRel();
}

main()
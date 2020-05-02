// import {uri, username, password} from './variables.js';

const connect  = require('./variables')
const neo4j_fun = require('./neo4j_fun')
const string_db_fun = require('./string-db_fun')
const util = require('./util')
const fs = require('fs');
const queryFrames = require('./queryFrames')


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

    const annotat = await string_db_fun.repackFunAnnot(
        targets, 
        id_caller = "l.filipcik@student.maastrichtuniversity.nl"
    )
    
    var finRun = [];

    var chunkSize = 350;
    var run = true;
    var cnt = 0;

    while (run == true){
        var subAnnotat = annotat.slice(cnt*chunkSize, (cnt+1) * chunkSize);

        try{
            subAnnotat.forEach((obj) => {
                neo4j_fun.setTarget(connect.uri, connect.username, connect.password, obj)
            }); 
        }
        catch(error) {
            finRun.push(subRel);
            console.log(error);
        }

        await util.sleep(6000);
        console.log("Passing Functional annotation to Neo4J chunk " + cnt);

        cnt += 1;
        if (cnt * chunkSize >= annotat.length){
            run = false
        }
    }

    if (finRun.length != 0){
        chunkSize = 50;
        run = true;
        cnt = 0;

        while (run == true){
            var subAnnotat = finRun.slice(cnt*chunkSize, (cnt+1) * chunkSize);
    
            try{
                subAnnotat.forEach((obj) => {
                    neo4j_fun.setTarget(connect.uri, connect.username, connect.password, obj)
                }); 
            }
            catch(error) {
                console.log(error);
                console.log("Even on second finer resolution it was impossible to pass all values");
            }
    
            await util.sleep(6000);
            console.log("Passing Functional annotation to Neo4J in finer chunks, chunk " + cnt);
    
            cnt += 1;
            if (cnt * chunkSize >= annotat.length){
                run = false
            }
        }
    }



    // for (var i = 0; i < annotat.length; i++){
    //     console.log("Did I get Here")
    //     await util.sleep(1000)
    //     console.log("I waited too")
    //     neo4j_fun.setTarget(connect.uri, connect.username, connect.password, annotat[i])
    // }
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
    var finRun = [];

    var chunkSize = 350;
    var run = true;
    var cnt = 0;

    while (run == true) {
        var subRel = rel.slice(cnt*chunkSize, (cnt+1) *chunkSize)

        try {
            subRel.forEach((obj) => {
                neo4j_fun.setRelationship(connect.uri, connect.username, connect.password, obj)
            })
        }
        catch(error) {
            finRun.push(subRel);
            console.log(error);
        }

        await util.sleep(6000);
        console.log("Passing relationships to Neo4J chunk " + cnt)

        cnt += 1; 
        if (cnt * chunkSize >= rel.length){
            run = false;
        }
    }

    if (finRun.length != 0){
        chunkSize = 50;
        run = true;
        cnt = 0;

        while (run == true) {
            var subRel = finRun.slice(cnt*chunkSize, (cnt+1) *chunkSize)
    
            try {
                subRel.forEach((obj) => {
                    neo4j_fun.setRelationship(connect.uri, connect.username, connect.password, obj)
                })
            }
            catch(error) {
                console.log(error);
                console.log("Even on second finer resolution it was impossible to pass all values");
            }
    
            await util.sleep(6000);
            console.log("Passing relationships to Neo4J in finer chunks, chunk " + cnt)
    
            cnt += 1; 
            if (cnt * chunkSize >= rel.length){
                run = false;
            }
        }
    }
}

async function testOut () {
    const targets = await neo4j_fun.getTarget(connect.uri, connect.username, connect.password)
    var testTar = targets.slice(0, 5)
    // console.log(testTar)
    // // var testTar2 = targets.slice(960, 1500)

    // var [tar1, tar2] = targets
    // console.log(tar1)

    // // var newTar = [tar1, tar2]
    // // console.log(newTar)

    const annotat = await string_db_fun.repackFunAnnot(
        testTar, 
        id_caller = "l.filipcik@student.maastrichtuniversity.nl"
    )

    // console.log(annotat[1])
    
    const save = JSON.stringify(annotat);
    fs.writeFileSync('data-for-neo4j.json', save)

    // neo4j_fun.setTargetV2(connect.uri, connect.username, connect.password, annotat)
}

function goTermAsARelationship ( data ) {
    // DATA expected to be an array of objects with each object having following structure
    // {
    //     gene_sym: 'STRING',
    //     properties: {
    //         GO_term: [ARRAY of STRINGS]
    //     }
    // }

    // TECHNICALLY WORKS BUT REQUIRES AS MANY SESSIONS AS THERE ARE PROTEINS

    data.forEach( gene => {
        // console.log(gene.gene_sym)

        reformGene = {
            target: gene.gene_sym,
            origin: gene.properties.GO_term
        }

        arrOfQueries = []
        reformGene.origin.forEach( origin => {
            arrOfQueries.push({
                target: reformGene.target,
                origin: origin
            })
        })


        neo4j.versatileWriteQueryCnt(connect, {
            text: queryFrames.setPropertyRel,
            parameters: {
                paramsArray: arrOfQueries
            }
        })
    })
}



async function main(){
    await testOut ();
    // await setRel();
    // await setFunAnnot();
}

main()
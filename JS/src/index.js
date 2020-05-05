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
        req_score = "900"
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
    // const targets = await neo4j_fun.getTarget(connect.uri, connect.username, connect.password)
    // var testTar = targets.slice(0, 5)
    // // console.log(testTar)
    // // var testTar2 = targets.slice(960, 1500)

    // var [tar1, tar2] = targets
    // console.log(tar1)

    // // var newTar = [tar1, tar2]
    // // console.log(newTar)

    // const annotat = await string_db_fun.repackFunAnnot(
    //     testTar, 
    //     id_caller = "l.filipcik@student.maastrichtuniversity.nl"
    // )

    // // console.log(annotat[1])

    const targets = await neo4j_fun.getTarget(connect.uri, connect.username, connect.password)

    const rel = await string_db_fun.outStringDB(
        targets, 
        id_caller = "l.filipcik@student.maastrichtuniversity.nl", 
        species = "9606", 
        req_score = "900"
    )
    
    const slicRel = rel.slice(0, 20);

    const save = JSON.stringify(slicRel);
    fs.writeFileSync('reldata-for-neo4j.json', save)

    // neo4j_fun.setTargetV2(connect.uri, connect.username, connect.password, annotat)
}

function propertyAsRelationship ( data, { connect, keyOfOrigins, queryFrame } ) {
    // DATA expected to be an array of objects with each object having following structure
    // {
    //     Gene_Symbol: 'STRING',
    //     properties: {
    //         keyOfOrigins: [ARRAY of STRINGS]
    //     }
    // }
    
    // REST OF ARGUMENTS ARE EXPECTED TO BE WITHIN A SINGLE OBJECT IN THE 
    // FOLLOWING PATTERN
    // CONNECT expected to be an object containing following keys
    // {
    //     uri: 'STRING',
    //     username: 'STRING',
    //     password: 'STRING'
    // }
    // 
    // 
    // KEYOFORIGINS expected to be a STRING value corresponding to key used to find
    // origins of the relationship
    // 
    // QUERYFRAME is expected to be a STRING containing NO ENTER SYMBOLS (escape them by /)
    // containig a framework for the query to be used

    arrOfQueriesConcat = []
    data.forEach( gene => {
        // console.log(gene.Gene_Symbol)

        reformGene = {
            target: gene.Gene_Symbol,
            origin: gene.properties[keyOfOrigins]
        }

        arrOfQueries = []
        reformGene.origin.forEach( origin => {
            arrOfQueries.push({
                target: reformGene.target,
                origin: origin
            })
        })


        arrOfQueries.forEach( query => {
            arrOfQueriesConcat.push(query)
        })        
    })


    neo4j_fun.versatileWriteQueryCnct(connect, {
        text: queryFrame,
        parameters: {
            paramsArray: arrOfQueriesConcat
        }
    })
}

async function getProteinArray( connect, property = 'Gene_Symbol' ) {
    arrProtein = [];

    const result = await neo4j_fun.versatileReadQueryCnct( connect, {
        text: queryFrames.getAllProteins
    })

    result.forEach( record => {
        arrProtein.push(record._fields[0].properties[property])
    })
    
    return arrProtein;
}

async function setProteinAndProperties( connect, data ) {
    // DATA to be formatted as following
    // {
    //     Gene_Symbol: 'STRING',
    //     properties: {
    //         keyOfOrigins: [ARRAY of STRINGS]
    //     }
    // }

    try {
        const result = await neo4j_fun.versatileWriteQueryCnct( connect, {
            text: queryFrames.setProteinGene_Symbol,
            parameters: {
                paramsArray: data
            }
        })
    } catch (error) {
        console.log(error)
    }

    
}

async function setRelationship ( connect, data, relationshipName ){
    // DATA argument requires an array of objects of following structure
    // {
    //     originGene_Symbol: STRING,
    //     originProperties: { VARIABLE },
    //     relationshipProperties: {
    //       [VARIABLE]
    //     },
    //     targetGene_Symbol: STRING,
    //     targetProperties: { VARIABLE }
    //   }
    
    const queryFrame = queryFrames.setRelationshipBetweenProteins.replace("Placeholder", relationshipName)

    try {
        const result = await neo4j_fun.versatileWriteQueryCnct( connect, {
            text: queryFrame,
            parameters: {
                paramsArray: data
            }
        })
    } catch (error) {
        console.log(error)
    }

    
}

// FLOW: setRelationships => Annotate

async function createNetwork() {

    const targets = await getProteinArray ( connect, 'Gene_Symbol')

    const relationships = await string_db_fun.outStringDB(
        targets,
        id_caller = "l.filipcik@student.maastrichtuniversity.nl",
        species = "9606",
        req_score = "900"
    )
    
    // const save = JSON.stringify(relationships);
    // fs.writeFileSync('reldata-2for-neo4j.json', save)

    var chunkSize = 350;
    var run = true;

    setRelationship( connect, relationships, "STRING_DB")
}

async function annotateNetwork (){
    const targets = await getProteinArray ( connect, 'Gene_Symbol')
    const annotat = await string_db_fun.repackFunAnnot (
        targets,
        id_caller = "l.filipcik@student.maastrichtuniversity.nl"
    )

    keyArr = ["GO_term", "str_cat", "str_des"]
    qFrArr = [
        queryFrames.setPropertyRelGOtermToProtein,
        queryFrames.setPropertyRelStringCategoryToProtein,
        queryFrames.setPropertyRelStringDescriptionToProtein
    ]

    let run = true;
    let cnt = 0;
    let chunkSize = 2500;

    while (run == true) {
        let subAnnotation = annotat.slice(cnt*chunkSize, (cnt+1)*chunkSize)

        await util.paralelisationOfFunctions(
            numOfRequests = 10,
            numofQueriesPerRequest = 10,
            dataArray = subAnnotation,
            funExecuted = propertyAsRelationship,
            funExecutedArgs = {
               connect: connect,
               keyOfOrigins: keyArr[0],
               queryFrame: qFrArr[0]
            },
            sleepPeriod = 60000
        )
        
        cnt += 1;

        if ( cnt * chunkSize >= annotat.length ){
            run = false
        }

        console.log(`Network Construction: up to ${cnt*chunkSize} elements completed`)
    }

    // for (i = 0; i < keyArr.length; i++) {
        
    //     // while (run == true) {
    //     //     let subAnnotat = annotat.slice(cnt*)
    //     // }


    //     await util.paralelisationOfFunctions(
    //         numOfRequests = 25,
    //         numofQueriesPerRequest = 5,
    //         dataArray = annotat,
    //         funExecuted = propertyAsRelationship,
    //         funExecutedArgs = {
    //            connect: connect,
    //            keyOfOrigins: keyArr[i],
    //            queryFrame: qFrArr[i]
    //         },
    //         sleepPeriod = 60000
    //     )
    // }
    
}


async function main(){
    // createNetwork()

    annotateNetwork()

    // util.paralelisationOfFunctions(
    //     20,
    //     20,
    //     new Array ( 1000 ),
    //     1000
    // )

    // await testOut ();
    // await setRel();
    // await setFunAnnot();
}

main()
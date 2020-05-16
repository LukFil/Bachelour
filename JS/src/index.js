
// LOGIN info for the NEO4J Database
// Must exports as an object in the following shape
// {
//     uri: String,
//     username: String,
//     password: String
// }
const connect  = require('./variables')   // LOGIN INFO FOR THE DATABASE


const neo4j_fun = require('./neo4j_fun')
const string_db_fun = require('./string-db_fun')
const util = require('./util')
const fs = require('fs');
const queryFrames = require('./queryFrames')

// Old implementation of getting and setting functional annotation as a list of properties
// Highly unoptimised in terms of communcation because it is using old and sub-optimal implementation of Neo4J API
// It is recommended not to use this function
async function setFunAnnot (){
    
    const targets = await neo4j_fun.getTarget(connect.uri, connect.username, connect.password)

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
}

// 
async function setRel(){
    const targets = await neo4j_fun.getTarget(connect.uri, connect.username, connect.password)

    const rel = await string_db_fun.outStringDB(
        targets, 
        id_caller = "l.filipcik@student.maastrichtuniversity.nl", 
        species = "9606", 
        req_score = "900"
    )

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

// Function that was used in development
async function testOut () {
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

// Function intended to send a single write request containing one or more
// queries, leading to construction of one or multiple edges in the Neo4J database
// 
// Arguments accepted by the function
//       connect: JSON
//          REQUIRED!
//          needs to contain authentication information for Neo4j database.
//          specifically 
//              uri: String
//              username: String
//              password: String
//       data: Array of JSONs,
//          REQUIRED!
//          the body of the query, with each JSON representing a single query
//          JSONS contained must have following structure
//            {
//                originGene_Symbol: STRING,
//                originProperties: { VARIABLE },
//                relationshipProperties: {
//                [VARIABLE]
//                },
//                targetGene_Symbol: STRING,
//                targetProperties: { VARIABLE }
//            }
//       queryFrame: String
//          Contains a CYPHER framework for constructing the query 'style'
//       relationshipName: String
//          Contains a name that will be used as the label of the edge
async function setRelationship ( 
    connect, 
    data, 
    queryFrame = queryFrames.setRelationshipBetweenProteins,
    relationshipName 
){
    queryFrame = queryFrame.replace("Placeholder", relationshipName)

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


// Function intended to expand the network by inclusion of the first interaction
// partners of the targets provided, from string db
// 
// Arguments accepted by the function
//       targets: Array of Strings
//          REQUIRED!
//          needs to contain gene identifiers STRING-DB recognises, such as
//          gene symbols
//       connect: JSON
//          REQUIRED!
//          needs to contain authentication information for Neo4j database.
//          specifically 
//              uri: String
//              username: String
//              password: String
//       id_caller: String
//          REQUIRED!
//          your identifier to StringDB, ideally an email
//       species: String OR Integer
//          identifier of species for which the queries are to be executed
//          default represents human
//       req_score: String OR Integer
//          a STRING DB indicator of stringency of evidence on which to include the 
//          relationship in the database
//          
//       Note: No paralelisation implemented, but can be easily included by following
//             pattern in annotateNetworkFromStringDB  
// 
//       RETURN: void
async function createNetwork(
    targets, 
    connect,
    id_caller = "your_id",
    species = "9606", 
    req_score = "900"
) {
    if (targets == undefined) {
        console.log('targets must be defined')
        return
    }
    if (connect == undefined) {
        console.log('connect must be defined')
        return
    }

    const relationships = await string_db_fun.outStringDB(
        targets,
        id_caller,
        species,
        req_score
    )

    setRelationship( connect, relationships, "STRING_DB")
}

// Function intended for annotation of a protein network in Neo4j database
// with functional annotation retrieved from string DB. The annotation is
// by default executed in a form of creation of nodes of the unique properties,
// with edges of type [propertyOf] to proteins annotated
// 
// Arguments accepted by the function
//       targets: Array of Strings
//          REQUIRED!
//          needs to contain gene identifiers STRING-DB recognises, such as
//          gene symbols
//       connect: JSON
//          REQUIRED!
//          needs to contain authentication information for Neo4j database.
//          specifically 
//              uri: String
//              username: String
//              password: String
//       id_caller: String
//          REQUIRED!
//          your identifier to StringDB, ideally an email
//       keyArr: Array of Strings
//          an array containing which functional annotation from String DB
//          to include in the annotation
//          valid inputs are (any combination of)
//              "GO_term" - Gene Ontology Term
//              "str_cat" - StringDB Category
//              "str_des" - StringDB Description
//       qFrArr: Array of Strings
//          an array containing instructions (a query frame) of how to submit
//          the annotation to the Neo4j database
//          IMPORTANT to coordinate with keyArr, and to supply appropriate
//          query frames in the same order as in keyArr
//      chunkSize: Integer
//          determines what fraction of the complete 'targets' array to be 
//          submitted at a time - a greater number is not likely to lead to
//          overloading the server if resources are limited, however it is
//          intended to be a gauge of the progress and, in case of error-induced,
//          breaking to identify the fraction of the input the error ocurred at
//          CAN be greater than the length of targets
//      numOfRequests: Integer
//          determines how many requests are made at the same time to the 
//          Neo4j database, 
//          High value might result in errors if the resources are limited or
//          in errors caused by Neo4j deadlocks
//      numOfQueriesPerRequest: Integer
//          determines how many Queries are batched into a single request
//          very high values might result in performance hits, or excess of memory
//          in very big networks when resources are low
//          together with numOfRequests create a balance of batching and paralelisation
//          for optimal performance
//      sleepPeriod: Integer
//          determines the delay between each batch of requests. Higher value
//          leads to slower execution, higher value requests greater computational power
//          at the database side
//          units: ms
//          
//      RETURN: void
//      Result: a network of proteins is annotated in Neo4j database with functional
//              annotation from StringDB
async function annotateNetworkFromStringDB (
    targets,
    connect,
    id_caller = 'your_ID',
    keyArr = ["GO_term", "str_cat", "str_des"],
    qFrArr = [
        queryFrames.setPropertyRelGOtermToProtein,
        queryFrames.setPropertyRelStringCategoryToProtein,
        queryFrames.setPropertyRelStringDescriptionToProtein
    ],
    chunkSize = 3000,
    numOfRequests = 10,
    numofQueriesPerRequest = 100,
    sleepPeriod = 2 * 60 * 1000
){    
    if (targets == undefined) {
        console.log('targets must be defined')
        return
    }
    if (connect == undefined) {
        console.log('connect must be defined')
        return
    }

    const annotat = await string_db_fun.repackFunAnnot (
        targets,
        id_caller,
    )

    for (i = 0; i < keyArr.length; i++) {
        let run = true;
        let cnt = 0;

        console.log(annotat.length)

        while (run == true) {
            let subAnnotation = annotat.slice(cnt*chunkSize, (cnt+1)*chunkSize)

            await util.paralelisationOfFunctions(
                numOfRequests,
                numofQueriesPerRequest ,
                dataArray = subAnnotation,
                funExecuted = propertyAsRelationship,
                funExecutedArgs = {
                connect: connect,
                keyOfOrigins: keyArr[i],
                queryFrame: qFrArr[i]
                },
                sleepPeriod
            )
            
            cnt += 1;

            if ( cnt * chunkSize >= annotat.length ) { run = false }

            console.log(`Network Construction: up to ${cnt*chunkSize} elements completed`)
        }

    console.log(`DONE WITH ${keyArr[i]}`)
    }
    
    console.log('DONE COMPLETE')
}


async function main(){
    // createNetwork()


    // EXAMPLE CALLs
    // Example annotate NetworkFromString
    const targets = await getProteinArray(connect, 'Gene_Symbol')
    annotateNetworkFromStringDB(targets, connect, "test")



    // const protein = await getProteinArray( connect, 'Gene_Symbol')
    // const save = JSON.stringify(protein)
    // fs.writeFileSync('listOfProteins.json', protein)
    // await testOut ();
    // await setRel();
    // await setFunAnnot();
}

main()
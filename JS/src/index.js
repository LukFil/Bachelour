
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
const disGeNET_fun = require('./disGeNET_fun')

// Function that was used in development
// Can be used for further development, or to be used as a template for when 
// parts of datastreams are wanted to be locally saved 
async function testWriteToFile () {
    const targets = await neo4j_fun.getTarget(connect.uri, connect.username, connect.password)
    const rel = await string_db_fun.outStringDB(
        targets, 
        id_caller = "your_email", 
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

// A function intended to retrieve a set subset of the network as defined by a queryFrame,
// and returns a Cytoscape elements JSON. Optionally it can also save the JSON

// Arguments accepted by the function
//       connect: JSON
//          REQUIRED!
//          needs to contain authentication information for Neo4j database.
//          specifically 
//              uri: String
//              username: String
//              password: String
//       save: JSON
//          OPTIONAL
//          if save is provided, the function will attempt to save the elements JSON into a 
//          .json file
//          structure of save is expected to be as follows
//                 save: {
//                     path: String, NOT ending with / (that is included by the code)
//                           OPTIONAL even within save: if not provided, the file will be
//                              saved within the folder where the node.js server was called
//                     name: String
//                 }
//       queryFrame
//          OPTIONAL
//          determines which subset of th network is to be taken
//          by default it returns a subset described by these requirements
//              "miRNA controlling proteins with property 'isImplicatedInSuicide' == "YES",
//                  and the relationships between them, returning miRNA, proteins, and 
//                  relationships"
//          cannot contain /n symbol
//          needs to contain a CYPHER-valid Query

//       RETURNS an output in the following pattern 
//           {
//               "elements": [
//               {
//                   "data": {
//                   "edge": 4130,                      // Neo4j identifier of the relationship
//                   "source": "hsa-miR-148b-3p",       // Neo4j property stored as 'miRNA'
//                   "target": "HTR2C"                  // Neo4j property stored as 'Gene_Symbol'
//                   }
//               }
//               ]
//           }
//           output can be easily adapted into a truly blind network (only neo4j IDs) (will increase the generilasibility of the function) 
//           by a switching out a commented out section as marked in the code
async function getNetworkInCytoscapeJSONFormat (
    connect,
    save,
    networkName = 'Default_Name',
    queryFrame = queryFrames.getNetworkImplicatedInSuicide
    ){
    let arrNodes = []
    let arrEdges = []
    let usedIds  = []
    let miRNAIds = []
    const result = await neo4j_fun.versatileReadQueryCnct( connect, {
        text: queryFrame
    })
    // console.log(result[1]._fields)
    result.forEach( record => {
        arrNodes.push({
            data: {
                id: `${record._fields[0].identity.low}`,
                SUID: record._fields[0].identity.low,
                shared_name: record._fields[0].properties.miRNA,
                name: record._fields[0].properties.miRNA,
                P_Value: record._fields[0].properties.P_Value,
                log2FC: record._fields[0].properties.log2FC,
                class: `miRNA`,
                selected: false
                // ALTERNATIVE IMPLEMENTATION
                // this will cause only the Neo4j IDs to be retained and thus when the network
                // is constructed, it will be truly 'blind'
                // source: record._fields[0].identity,
                // target: record._fields[2].identity
            },
            // HERE ADDITIONAL PROPERTIES CAN BE INCLUDED ACCORDING TO THE CYTOSCAPE KEY
            selected: false
        })
        arrNodes.push({
            data: {
                id: `${record._fields[2].identity.low}`,
                SUID: record._fields[2].identity.low,
                name: record._fields[2].properties.Gene_Symbol,
                shared_name: record._fields[2].properties.Gene_Symbol,
                isImplicatedInSuicide: record._fields[2].properties.isImplicatedInSuicide,
                class: `Protein`,
                selected: false
            },
            selected: false
        })
        arrEdges.push({
            data: {
                id: `${record._fields[1].identity.low}`,
                SUID: record._fields[1].identity.low,
                source: `${record._fields[1].start.low}`,
                target: `${record._fields[1].end.low}`,
                name: `${record._fields[0].properties.miRNA} (${record._fields[1].type}) ${record._fields[2].properties.Gene_Symbol}`,
                shared_name: `${record._fields[0].properties.miRNA} (${record._fields[1].type}) ${record._fields[2].properties.Gene_Symbol}`,
                interaction: `${record._fields[1].type}`,
                shared_interaction: `${record._fields[1].type}`,
                selected: false
            },
            selected: false
        })
        record.forEach(element => {
            usedIds.push(element.identity.low)
        })
        miRNAIds.push(record._fields[0].identity.low)
    })

    // console.log(miRNAIds)
    
    // let uniqueIds = [...new Set(miRNAIds)]
    // let uniqueCount = { }

    // uniqueIds.forEach( elementKey => {
    //     eval(`uniqueCount.${String(elementKey)} = 0`)
    //     miRNAIds.forEach( elementLock => {
    //         if (elementKey == elementLock) {
    //             eval(`uniqueCount.${String(elementKey)} = uniqueCount.${String(elementKey)} + 1`)
    //         }
    //     })
    // })

    // console.log(uniqueCount)

    const networkID = Math.max(usedIds) + 1

    const outCytoscapeJson = { 
        format_version: "1.0",
        generated_by: "Luke's Bachelour 0.1",
        target_cytoscapejs_version: "~2.1",
        data: {
            shared_name: networkName,
            name: networkName,
            SUID: networkID,
            __Annotations: [ ],
            selected: true
        },
        elements: {
            nodes: arrNodes,
            edges: arrEdges,
        } 
    }

    if (save != undefined){
        if (save.path == undefined) {
            fs.writeFileSync(`${save.name}.json`, JSON.stringify(outCytoscapeJson, null, 2))
        } else {
            // THIS PART THROWS AN ERROR: fix it eventually
            fs.writeFileSync(`${save.path}/${save.name}.json`, JSON.stringify(outCytoscapeJson, null, 2))
        }
    }

    return outCytoscapeJson
}

async function main(){
    // createNetwork()

    // await getNetworkInCytoscapeJSONFormat(connect)
    if (true){
        console.log(await getNetworkInCytoscapeJSONFormat(
            connect, 
            {name: 'networkSuicideCompleteNeuronDeathImplicatedInSuicide'}, 
            'miRNA-Protein-Network-Suicide', 
            queryFrames.getCompleteNeuronDeathNetworkImplicatedInSuicide
        ))
    }
    // EXAMPLE CALLs
    // Example annotate NetworkFromString

    if (false) {
        const targets = await getProteinArray(connect, 'Gene_Symbol')
        annotateNetworkFromStringDB(targets, connect, "test")
    
    }

    if (false) {
        // WORKS AS DESIRED, Yaay
        setProteinAndProperties( connect, await disGeNET_fun.packageDisGeNET(disGeNET_fun.LIST_OF_SUICIDE_CUI))
    }
    
    // const protein = await getProteinArray( connect, 'Gene_Symbol')
    // const save = JSON.stringify(protein)
    // fs.writeFileSync('listOfProteins.json', protein)
    // await testOut ();
    // await setRel();
    // await setFunAnnot();
}

main()
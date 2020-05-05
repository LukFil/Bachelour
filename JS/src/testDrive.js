const fs = require('fs');
const util = require('./util');
const neo4j_fun = require('./neo4j_fun');
const connect = require('./variables');
const queryFrames = require('./queryFrames')


async function main(){
    
    const rawData = fs.readFileSync('reldata-2for-neo4j.json');
    const parData = JSON.parse(rawData);

    // TO rework
    //      getTarget DONE
    //      setTarget DONE
    //      setRelationship DONE


    const queryFrame = queryFrames.setRelationshipBetweenProteins.replace("Placeholder", "STRING_DB")

    // parData.forEach(async (line) => {
    //     try {
    //         const result = await neo4j_fun.versatileWriteQueryCnct( connect, {
    //             text: queryFrame,
    //             parameters: {
    //                 paramsArray: line
    //              }
    //         })   
    //     } catch {
    //         console.log(line)
    //     } finally {

    //     }
    // })
    
    console.log(parData)
    let finRun = [];

    let chunkSize = 1000;
    let run = true;
    let cnt = 0;

    // while (run == true){
    //     var subData = parData.slice(cnt*chunkSize, (cnt+1)*chunkSize);

    //     try {
    //         const result = await neo4j_fun.versatileWriteQueryCnct( connect, {
    //             text: queryFrame,
    //             parameters: {
    //                 paramsArray: subData
    //             }
    //         })   
    //     } catch (error) {
    //         console.log(error)
    //     } finally {

    //     }

    //     await util.sleep(1000);
    //     console.log("Passing relationships to Neo4J chunk " + cnt);
        
    //     cnt += 1;
    //     if (cnt * chunkSize >= parData.length){
    //         run = false
    //     }
    // }

    // const result = await neo4j_fun.versatileWriteQueryCnct( connect, {
    //     text: queryFrame,
    //     parameters: {
    //         paramsArray: parData
    //     }
    // })


    
    // console.log(queryFrames.setRelationshipBetweenProteins.replace("Placeholder", "ActualName"))

    // const result = await neo4j_fun.versatileWriteQueryCnct( connect, {
    //     text: queryFrames.setTargetGene_Symbol,
    //     parameters: {
    //         paramsArray: parData
    //     }
    // })


    // arrTarget = [];

    // const result = await neo4j_fun.versatileReadQueryCnct( connect, {
    //     text: queryFrames.getAllTargets
    // })

    // result.forEach( record => {
    //     console.log(record)
    //     // arrTarget.push(record._fields[0].properties[property])
    // })

    // return arrTarget;



    // const result = await neo4j.versatileReadQueryCnct( connect, { 
    //     text: queryFrames.getAllTargets
    // } )

    // arrTarget = [];
    // result.forEach( record => {
    //     console.log( record )
    //     // arrTarget.push(record._fields[0].properties['Gene_Symbol'])
    // })
    // console.log(arrTarget)


    // // console.log(parData[1].properties['str_des']);

    // // const loc = 'str_des'

    // arrOfQueriesConcat = []
    // parData.forEach( gene => {
    //     // console.log(gene.gene_sym)

    //     reformGene = {
    //         target: gene.gene_sym,
    //         origin: gene.properties[loc]
    //     }

    //     arrOfQueries = []
    //     reformGene.origin.forEach( origin => {
    //         arrOfQueries.push({
    //             target: reformGene.target,
    //             origin: origin
    //         })
    //     })


    //     arrOfQueries.forEach( query => {
    //         arrOfQueriesConcat.push(query)
    //     })        
    // })


    // neo4j.versatileWriteQueryCnt(connect, {
    //     text: queryFrames.setPropertyRelStringDescriptionToTarget,
    //     parameters: {
    //         paramsArray: arrOfQueriesConcat
    //     }
    // })

    // testData = {
    //     target: parData[1].gene_sym,
    //     origin: parData[1].properties.GO_term
    // }
    
    // // console.log(testData)
    // arrOfQueriesPrep = []
    // testData.origin.forEach((origin) => {
    //     arrOfQueriesPrep.push({
    //         target: testData.target,
    //         origin: origin
    //     })
    // })

    // console.log(arrOfQueriesPrep)

    // obj = {
    //     paramsArray: arrOfQueriesPrep
    // }

    // query = {
    //     text: queryFrames.setPropertyRel,
    //     parameters: obj
    // }


    // arrOfQueriesRdy = []
    // arrOfQueriesPrep.forEach((obj) => {
    //     arrOfQueriesRdy.push(neo4j.createQueryObject(frame, obj))
    // })

    // console.log(arrOfQueriesRdy)
    // const query = neo4j.createQueryObject (frame, testData)
    // console.log(query)

    // const session = await neo4j.openSession(connect)
    // arrOfQueriesRdy.forEach((query) => {
    //     neo4j.versatileWriteQuery(session, query)
    // })

    // neo4j.closeSession(session)

    // neo4j.versatileWriteQueryCnt(connect, query)
}

main();
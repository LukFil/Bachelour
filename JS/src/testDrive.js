const fs = require('fs');
const util = require('./util');
const neo4j = require('./neo4j_fun');
const connect = require('./variables');
const queryFrames = require('./queryFrames')


async function main(){
    
    const rawData = fs.readFileSync('data-for-neo4j.json');
    const parData = JSON.parse(rawData);

    console.log(parData);

    parData.forEach( gene => {
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
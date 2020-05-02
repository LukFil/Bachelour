// PROVIDER's considerations!
// 
// IMPORTANT: WAIT 1sec between each call!
// FIRST step is always to disambiguate the input by using STRING-DB's map function
// IDENTIFY species from which the protein comes
// use IDENTITY parameter 
// understands both GET and POST requests, but use POST in all possible occurances

const fetch = require("node-fetch");
const util = require('./util')

// protein = "ROBO1";
// protArr = ['ROBO1', 'ARL8B', 'AGO4']
// id_caller = "lfp_um_bach_dev"
// species = "9606" //HUMAN

async function mapIdentifiers (protein, id_caller, species = "9606"){
    const response = await fetch(`https://string-db.org/api/json/get_string_ids?identifiers=${protein}&species=${species}&caller_identity=${id_caller}`, {
        method: 'POST' // POST is recommended by the provider, therefore it is used as if it was a GET
    });
    const myJson = await response.json()
    console.log(myJson)
    return myJson[0] // According to the provider, 1st entry is usually the correct one
}

// mapIdentifiers(batchIntoSingleQuery(protArr), id_caller, species)

function batchIntoSingleQuery (protArr){
    if(Array.isArray(protArr)){
        outStr = protArr[0]
        for (i = 1; i < protArr.length; i++){
            outStr += '%0d'+protArr[i]
        }
        return outStr
    } else {
        return protArr
    }
}

// async function queryForNetworkInteractions(protein, id_caller, species = "9606"){
//    const response = await fetch(`https://string-db.org/api/json/network?identifiers=${protein}&species=${species}&caller_identity=${id_caller}&add_nodes=20`, {
//        method: 'POST'
//    });
//    const myJson = await response.json()
//    console.log(myJson)
//    return myJson
// }

// queryForNetworkInteractions(batchIntoSingleQuery(protArr), id_caller, species)

// 900 as a req score means that at least twice it was found experimentally 
async function queryForInteractionPartners(protein, id_caller, species = "9606", req_score = "900"){
    const response = await fetch(`https://string-db.org/api/json/interaction_partners?identifiers=${protein}&species=${species}&caller_identity=${id_caller}&required_score=${req_score}`, {
        method: 'POST'
    });
    const myJson = await response.json()
    // console.log(myJson)
    return myJson
 }

//  queryForInteractionParters(batchIntoSingleQuery(protArr), id_caller, species)

async function queryForFunctAnnotation(protein, id_caller, species = "9606", pubmed = "0"){
    const response = await fetch(`https://string-db.org/api/json/functional_annotation?identifiers=${protein}&species=${species}&caller_identity=${id_caller}&allow_pubmed=${pubmed}`, {
        method: 'POST'
    });
    const myJson = await response.json()
    // console.log(myJson)

    outArr = []
    myJson.forEach(response => {
        for (i = 0; i < response.number_of_genes; i++){
            outArr.push({
                gene_sym: response.preferredNames[i],
                properties: {
                    GO_term: [response.term],
                    str_cat: [response.category],
                    str_des: [response.description],
                }
            });
        }
    });

    // console.log(outArr)
    return outArr
}

// queryForFunctAnnotation(batchIntoSingleQuery(protArr), id_caller, species, pubmed = "0")


// IMPORTANT NOTE: if the number of entries is greater than 960, it will make multiple
// calls to the API, each spaced by a second
async function repackFunAnnot(protArr, id_caller, species = "9606", pubmed = "0", chunkSize = 700){
    var outArr = [];
    var hldNam = [];
    
    if (protArr.length > chunkSize) {
        var run = true;
        var cnt = 0;
        while (run == true){
            var subProtArr = protArr.slice(cnt*chunkSize, (cnt+1) * chunkSize)

            var protein = batchIntoSingleQuery(subProtArr)
            var funAnno = await queryForFunctAnnotation(protein, id_caller, species, pubmed)

            await util.sleep(1000);
            console.log("repackFunAnnot call number " + cnt)

            funAnno.forEach(prot => {
                if (!hldNam.includes(prot.gene_sym)){
                    outArr.push(
                        prot
                    )
                    hldNam.push(
                        prot.gene_sym
                    )
                } else {
                    var loc = hldNam.indexOf(prot.gene_sym)
                    outArr[loc].properties.GO_term.push(prot.properties.GO_term.toString());
                    outArr[loc].properties.str_cat.push(prot.properties.str_cat.toString());
                    outArr[loc].properties.str_des.push(prot.properties.str_des.toString());
                }
            });

            cnt += 1;
            if (cnt* chunkSize >= protArr.length){
                run = false
            }
        }
    } else {
        const protein = batchIntoSingleQuery(protArr)
        const funAnno = await queryForFunctAnnotation(protein, id_caller, species, pubmed)

        funAnno.forEach(prot => {
            if (!hldNam.includes(prot.gene_sym)){
                outArr.push(
                    prot
                )
                hldNam.push(
                    prot.gene_sym
                )
            } else {
                var loc = hldNam.indexOf(prot.gene_sym)
                outArr[loc].properties.GO_term.push(prot.properties.GO_term.toString());
                outArr[loc].properties.str_cat.push(prot.properties.str_cat.toString());
                outArr[loc].properties.str_des.push(prot.properties.str_des.toString());
            }
        });
    }

    // console.log(outArr)
    return(outArr)
}

// repackFunAnnot(protArr, id_caller, species)

async function outStringDB(protArr, id_caller, species = "9606", req_score, chunkSize = 700){
    var outArr  = []

    if (protArr.length > chunkSize){
        var run = true;
        var cnt = 0;

        while (run == true){
            var subProtArr = protArr.slice(cnt * chunkSize, (cnt+1) * chunkSize)

            var protein = await batchIntoSingleQuery(subProtArr)
            var resStrD = await queryForInteractionPartners(protein, id_caller, species, req_score)

            await util.sleep(1000);
            console.log("outStringDB call number "+ cnt)
        
            resStrD.forEach( (response) => {
                outArr.push({
                    origin: response.preferredName_A,
                    oriProp: {
                        stringDB_id: response.stringId_A,
                    },
                    nameRel: "STRING_DB",
                    properties: {
                        ascore: response.ascore,
                        dscore: response.dscore,
                        escore: response.escore,
                        fscore: response.fscore,
                        nscore: response.nscore,
                        pscore: response.pscore,
                        tscore: response.tscore,
                        score: response.score
                    },
                    target: response.preferredName_B,
                    tarProp: {
                        stringDB_id: response.stringId_B
                    }
                })
            })

            cnt += 1;
            if (cnt * chunkSize >= protArr.length){
                run = false
            }

        }

    } else {
        protein = batchIntoSingleQuery(protArr)
        resStrD = await queryForInteractionPartners(protein, id_caller, species, req_score)

        
        resStrD.forEach( (response) => {
            outArr.push({
                origin: response.preferredName_A,
                oriProp: {
                    stringDB_id: response.stringId_A,
                },
                nameRel: "STRING_DB",
                properties: {
                    ascore: response.ascore,
                    dscore: response.dscore,
                    escore: response.escore,
                    fscore: response.fscore,
                    nscore: response.nscore,
                    pscore: response.pscore,
                    tscore: response.tscore,
                    score: response.score
                },
                target: response.preferredName_B,
                tarProp: {
                    stringDB_id: response.stringId_B
                }
            })
        })
    }    
    // console.log(outArr)
    return outArr
}

// // outStringDB(protArr, id_caller, species)

// exports.outStringDB = outStringDB;
// exports.repackFunAnnot = repackFunAnnot;

module.exports = {
    outStringDB,
    repackFunAnnot
}
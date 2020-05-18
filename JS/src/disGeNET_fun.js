const fetch = require("node-fetch");
// const util = require('./util')

const LIST_OF_SUICIDE_CUI = ["C0852733", "C0038663", "C1524032", "C0038661", "C0424000"]

// TAKES AN ARRAY OF ULMS CUI AS AN INPUT
async function getListOfGenesAssociatedWithCondition(condition){
    let toQueryBy = ''
    if (Array.isArray(condition)) {
        toQueryBy = condition[0]
        for (let i = 1; i < condition.length; i++) {
            toQueryBy += "%2C"+condition[i];
        }
    } else {
        toQueryBy = condition
    }

    // console.log(toQueryBy)

    const response = await fetch(`https://www.disgenet.org/api/gda/disease/${toQueryBy}`)
    const result = await response.json()
    console.log(result.length)

    return result
}

// returnListOfGenesAssociatedWithCondition(LIST_OF_SUICIDE_CUI)

async function packageDisGeNET(condition){
    const arrayOfGDA = await getListOfGenesAssociatedWithCondition(condition)
    let arrayOfFormatedGDA = []

    arrayOfGDA.forEach(element => {
        arrayOfFormatedGDA.push({
            Gene_Symbol: element.gene_symbol,
            properties: {
                implicatedInSuicide: "YES"
            }
        })
    });

    return arrayOfFormatedGDA
}


async function test (){
    console.log(await packageDisGeNET(LIST_OF_SUICIDE_CUI))
}

// test()

module.exports = {
    LIST_OF_SUICIDE_CUI,
    getListOfGenesAssociatedWithCondition,
    packageDisGeNET
}
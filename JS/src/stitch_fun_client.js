
protein = 'ROBO1'
id_caller = 'lpf_um_bach_dev'
species = '9606'

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



async function getChemInter (protein, id_caller, species, req_score = "400"){
    const response = await fetch(`http://stitch.embl.de/api/json/interactionsList?identifiers=${protein}&species=${species}&caller_identity=${id_caller}`,{
        method: 'GET'
    });


    console.log(response)
}

// getChemInter(protein, id_caller, species);

async function testThisBull (){
    const response = await fetch('http://stitch.emb.de/api/');
    console.log(response)
}

// testThisBull()
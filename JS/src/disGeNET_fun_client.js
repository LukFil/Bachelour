// const fetch = require("node-fetch");
// const util = require('./util')

// FUCK SPARQL AND ALL HIS SIBLINGS

// Query in a legible format (for later development, it is planned to be solved functionally, so this format of query
// would be a legitimate input, yet in interest of time limitations it is deferred until later point)
// 
// SELECT DISTINCT ?gene str(?geneName) as ?name ?score 
// WHERE { 
//     ?gda sio:SIO_000628('refers_to') ?gene,?disease ; 
//         sio:SIO_000216('has measurement value') ?scoreIRI . 
//     ?gene rdf:type ncit:C16612 ('Gene') ;
//         dcterms:title ?geneName . 
//     ?disease rdf:type ncit:C7057 ('MeSH disease (?)') ; 
//         dcterms:title "Suicide"@en . 
//     ?scoreIRI sio:SIO_000300 ('HasValue') ?score . 
//     FILTER (?score >= 0.4) 
// } ORDER BY DESC(?score) 
// 
// according to documentation 'encodeURIComponent()' and 'escape()' should both give the correct
// response yet somehow they are giving me completely different ones to the expected one
const queryFrame = `SELECT+DISTINCT+%3Fgene+str%28%3FgeneName%29+as+%3Fname+%3Fscore+\
%0D%0AWHERE+%7B+%0D%0A%09%3Fgda+sio%3ASIO_000628+%3Fgene%2C%3Fdisease+%3B+%0D%0A%09%09sio\
%3ASIO_000216+%3FscoreIRI+.+%0D%0A%09%3Fgene+rdf%3Atype+ncit%3AC16612+%3B%0D%0A%09%09dcterms\
%3Atitle+%3FgeneName+.+%0D%0A%09%3Fdisease+rdf%3Atype+ncit%3AC7057+%3B+%0D%0A%09%09dcterms%3Atitle+\
%22DISEASE%22%40en+.+%0D%0A%09%3FscoreIRI+sio%3ASIO_000300+%3Fscore+.+%0D%0A%09FILTER+\
%28%3Fscore+%3E%3D+0%29+%0D%0A%7D+ORDER+BY+DESC%28%3Fscore%29+`

const queryLegible = `\
SELECT DISTINCT ?gene str(?geneName) as ?name ?score 
WHERE {
    ?gda sio:SIO_000628('refers_to') ?gene,?disease ; 
        sio:SIO_000216('has measurement value') ?scoreIRI . 
    ?gene rdf:type ncit:C16612 ('Gene') ;
        dcterms:title ?geneName . 
    ?disease rdf:type ncit:C7057 ('MeSH disease (?)') ; 
        dcterms:title "Suicide"@en . 
    ?scoreIRI sio:SIO_000300 ('HasValue') ?score . 
    FILTER (?score >= 0.4) 
} ORDER BY DESC(?score)`

// convQuery = encodeURIComponent(queryFrame).replace(/%2B/g, "+")
console.log(replaceBullshit(queryLegible))

function replaceBullshit(string){
    let outString;

    const arrToRep = [':',    '/',   '?',  	'#',   '[',   ']', 	 '@', 	'!',   '$',  '&',  	"'", 	'(', 	')', 	'*',  '+', 	',', 	';',   '=',  '%', 	' ']
    const arrWiRep = ["%3A", "%2F",	"%3F", "%23", "%5B", "%5D", "%40", "%21", "%24", "%26", "%27",	"%28", "%29", "%2A", "%2B", "%2C", "%3B", "%3D", "%25", "+" ]

    outString = string.replace(/\n/g, "%0D%0A")
    outString = outString.replace(/\t/g, "%09")

    for (let i = 0; i < arrToRep.length; i++) {
        outString = outString.replace(arrToRep[i], arrWiRep[i])
    }

    return outString
}

// console.log(replaceBullshit("Alzheimer's Disease"))


async function getGenesAssociatedWithCondition(condition, queryRaw = ''){
    if (condition == undefined) return

    let query = queryRaw
    query = query.replace('DISEASE', replaceBullshit(condition))

    const url = `http://rdf.disgenet.org/sparql/?default-graph-uri=&query=${query}&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on`
    const response = await fetch(url, {
        method: 'GET',
    })
    console.log(await response.json())


    try {
        
    } catch (error) {
        
    }
}

getGenesAssociatedWithCondition("Completed Suicide", queryFrame)
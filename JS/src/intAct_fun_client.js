// Provider's considerations
// Requests: 30 jobs at once


// const fetch = require("node-fetch");

async function getTargets (){
    const response = await fetch(`http://www.ebi.ac.uk/Tools/webservices/psicquic/intact/webservices/current/search`, {
        method: 'POST'
    });

    console.log(response);
}

function test (arg) {
    console.log(arg == undefined)
}
// console.log(getTargets.name)

test()

// EXPORTS

module.exports = {
    
}
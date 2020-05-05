function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function paralelisationOfFunctions( 
        numOfRequests,
        numOfQueriesPerReq,
        dataArray, 
        funExecuted, 
        funExecutedArgs,
        sleepPeriod 
    ){
    finRun = [];

    run = true;
    cnt = 0;


    while ( run == true ) {
        
        for (let i = 0; i < numOfRequests; i++){
            let subQueries = dataArray.slice(cnt*numOfQueriesPerReq, (cnt+1)*numOfQueriesPerReq)

            try {
                await funExecuted(subQueries, funExecutedArgs)
            } catch (error) {
                // console.error(error)
                await sleep(2*sleepPeriod)
                try {
                    await funExecuted(subQueries, funExecutedArgs)
                } catch (error) {
                    // console.error(error)
                    console.log(`A query was still non-functional, saving it for later,
                                 it will be rerun later with a finer sieve`)
                    
                    subQueries.forEach( element => {
                        finRun.push( element )
                    })
                }
                
            }

            cnt += 1;
        }

        await sleep(sleepPeriod)

        console.log(`Number of queries succesfully sent: ${cnt}`)

        if (cnt * numOfQueriesPerReq >= dataArray.length){
            run = false
        }
    }


    if (finRun !== []){
        console.log(`Going over the non-executed entries with finer resolution.
                     Number of these queries = ${finRun.length}`)
        for (let j = 0; j < finRun.length; j++){
            let finerQueries = finRun.slice(j*numOfQueriesPerReq, (j+1)*numOfQueriesPerReq)

            try {
                await funExecuted(finerQueries, funExecutedArgs)
            } catch (error) {
                console.log(`An error ocurred: Submitting each query individually`)

                for (let n = 0; n < finerQueries.length; n++) {
                    let finestQueries = finerQueries.slice(n, (n+1))

                    try {
                        await funExecuted(finestQueries, funExecutedArgs)
                    } catch (error) {
                        console.log(error)
                    }
                    
                    await sleep(sleepPeriod)
                }
            }
            await sleep(sleepPeriod)
        }
    }

}


module.exports = {
    sleep,
    paralelisationOfFunctions
}
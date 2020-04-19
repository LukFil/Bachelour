const neo4j = require('neo4j-driver')

async function testDriver1(uri, username, password){
    const driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
    const session = driver.session()
    const personName = 'Alice'
    
    try {
      const result = await session.run(
        'CREATE (a:Person {name: $name}) RETURN a',
        {name: personName}
      )
    
      const singleRecord = result.records[0]
      const node = singleRecord.get(0)
    
      console.log(node.properties.name)
    } finally {
      await session.close()
    }
    
    // on application exit:
    await driver.close()
}


// GETTER numero uno
async function getTarget(uri, username, password){
    const driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
    const session = driver.session()

    const result = await session
      .run(
        'MATCH (a:Target) RETURN a.Gene_Symbol'
      )
      .then(result => {
        resArr = [];
        result.records.map(record => {
          resArr.push({
            gene_sym: record.get('a.Gene_Symbol')
          })
        });
      })
      .catch(error => {
        throw error;
      });
    
    // console.log(resArr);
    
    const trueResArr = [];
    resArr.forEach(ele => {
      trueResArr.push(ele.gene_sym)
    })

    // console.log(trueResArr);

    await driver.close();
    return trueResArr;
}

// TEST GETTER 02
async function getTargetTest(uri, username, password){
  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
  const session = driver.session()

  const result = await session
    .run(
      'MATCH (a:Target) RETURN a LIMIT 1'
    )
    .then(result => {
      resArr = [];
      result.records.map(record => {
        resArr.push({
          gene_sym: record.get('a')
        })
      });
    })
    .catch(error => {
      throw error;
    });
  
  console.log(resArr[0].gene_sym);
  
  await driver.close();
  return resArr;
}

// SETTER a node
async function setTarget(uri, username, password, objTarget) {
  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
  const session = driver.session()
  var   status = 'No change'

  const { gene_sym, properties: props } = objTarget;

  // console.log(props)
  const result = await session
    .run(
      'MERGE (tar:Target {Gene_Symbol: $Gene_Symbol}) \
      SET  tar += $prop \
      RETURN tar',
      // MULTIPLE PROPERTIES WORKING
      {
        Gene_Symbol: gene_sym, 
        prop: props
      }
    )
    .then(
      console.log(status = 'Succesfully completed')
    )
    .catch(error => {
      console.log(status = 'Error ocurred')
      throw error;
    });
    // console.log(status)
    // console.log(result)
  // })
  await driver.close();
  
  // return status
}

// EXPERIMENTAL SETTER

async function setTargetExp(uri, username, password, objTargetArr) {
  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
  const session = driver.session()
  var   status = 'No change'

  const { gene_sym, properties: props } = objTargetArr;

  // console.log(props)
  const result = await session
    .run(
      'MERGE (tar:Target {Gene_Symbol: $Gene_Symbol}) \
      SET  tar += $prop \
      RETURN tar',
      // MULTIPLE PROPERTIES WORKING
      {
        Gene_Symbol: gene_sym, 
        prop: props
      }
    )
    .then(
      console.log(status = 'Succesfully completed')
    )
    .catch(error => {
      console.log(status = 'Error ocurred')
      throw error;
    });
    // console.log(status)
    // console.log(result)
  
  await driver.close();
  
  // return status
}



// SETTER a relationship
async function setRelationship (uri, username, password, objRelati) {
  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
  const session = driver.session()
  var   status = 'No change'

  const { origin, nameRel, properties, target, oriProp, tarProp } = objRelati

  const result = await session
    .run(
      `  \
      MERGE (o:Target {Gene_Symbol: $Gene_Symbol})  \
      MERGE (t:Target {Gene_Symbol: $target})  \
      MERGE (o) -[rel: ${nameRel}]-> (t) \
      SET rel += $prop  \
      SET o += $oriProp \
      SET t += $tarProp \
      RETURN count(rel)`,

      {
        Gene_Symbol: origin,
        rel_name: nameRel,
        oriProp: oriProp,
        prop: properties,
        tarProp: tarProp, 
        target: target
      }
    )
    .then(
      status = "Succesfully completed"
    )
    .catch(error => {
      status = "Error ocurred"
      throw error
    });


  await driver.close();
  // console.log(status)
  // return status
}

// exports.testDriver1 = testDriver1;
exports.getTarget       = getTarget;
exports.getTargetTest   = getTargetTest;
exports.setTarget       = setTarget;
exports.setRelationship = setRelationship;
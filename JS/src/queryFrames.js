NAME_OF_RELATIONSHIP = 'Placeholder'

// const setPropertyRelGOtermToProtein = `\
// UNWIND $paramsArray AS parameters \
// MERGE (o: GO_term {value: parameters.origin})\
// MATCH (t: Protein) WHERE t.Gene_Symbol = parameters.target\
// MERGE (o) -[rel: propertyOf]-> (t)\
// RETURN count(rel)`

// CREATE CONTRAINT [goTerm_constratint] ON (o:GO_term) \
// ASSERT o.value IS UNIQUE \
// CREATE CONSTRAINT [protein_constraint] ON (t:Protein) \
// ASSERT t.Gene_Symbol IS UNIQUE \
const setPropertyRelGOtermToProtein = `\
UNWIND $paramsArray AS parameters \
MERGE (o: GO_term {value: parameters.origin})\
MERGE (t: Protein {Gene_Symbol: parameters.target})\
MERGE (o) -[rel: propertyOf]-> (t)\
RETURN count(rel)`

// CREATE CONTRAINT [strDB_category_constratint] ON (o:STRdb_category) \
// ASSERT o.value IS UNIQUE \
// CREATE CONSTRAINT [protein_constraint] ON (t:Protein) \
// ASSERT t.Gene_Symbol IS UNIQUE \
const setPropertyRelStringCategoryToProtein = `\
UNWIND $paramsArray AS parameters \
MERGE (o: STRdb_category {value: parameters.origin}) \
MERGE (t: Protein {Gene_Symbol: parameters.target}) \
MERGE (o) -[rel: propertyOf]-> (t) \
RETURN count(rel)`

// CREATE CONTRAINT [strDB_description_constratint] ON (o:STRdb_description) \
// ASSERT o.value IS UNIQUE \
// CREATE CONSTRAINT [protein_constraint] ON (t:Protein) \
// ASSERT t.Gene_Symbol IS UNIQUE \
const setPropertyRelStringDescriptionToProtein = `\
UNWIND $paramsArray AS parameters \
MERGE (o: STRdb_description {value: parameters.origin}) \
MERGE (t: Protein {Gene_Symbol: parameters.target}) \
MERGE (o) -[rel: propertyOf]-> (t)\ 
RETURN count(rel)`

const getAllProteins = `\
MATCH (t: Protein) RETURN t`
// Multiple getters are posslbe to be derived from this

const setProteinGene_Symbol = `\
UNWIND $paramsArray AS parameters \
MERGE (t: Protein {Gene_Symbol: parameters.Gene_Symbol}) \
SET t += parameters.properties \
RETURN count(t)`

const setRelationshipBetweenProteins = `\
UNWIND $paramsArray AS parameters \
MERGE (o: Protein {Gene_Symbol: parameters.originGene_Symbol}) \
MERGE (t: Protein {Gene_Symbol: parameters.targetGene_Symbol}) \
MERGE (o) -[rel: ${NAME_OF_RELATIONSHIP}]-> (t) \
SET rel += parameters.relationshipProperties \
SET o   += parameters.originProperties \ 
SET t   += parameters.targetProperties \
RETURN count(rel)`

const getNetworkImplicatedInSuicide = `\
MATCH (m:miRNA) -[r]-> (p:Protein {implicatedInSuicide: "YES"})\
RETURN m, r, p`

const getCompleteNeuronDeathNetwork = `MATCH (m:miRNA) -[r]->(p:Protein) \
MATCH (g:GO_term) -[pr:propertyOf]-> (p) \
WHERE g.value = "GO:1901214" OR g.value = "GO:1901215" OR g.value = "GO:0045665" \
OR g.value = "GO:0043523" OR g.value = "GO:0043524" OR g.value = "GO:0070997" \
OR g.value = "GO:1903203" OR g.value = "GO:1901216" OR g.value = "GO:0043525" \
RETURN m, r, p`

const getCompleteNeuronDeathNetworkImplicatedInSuicide = `MATCH (m:miRNA) -[r]->(p:Protein {implicatedInSuicide: "YES"}) \
MATCH (g:GO_term) -[pr:propertyOf]-> (p) \
WHERE g.value = "GO:1901214" OR g.value = "GO:1901215" OR g.value = "GO:0045665" \
OR g.value = "GO:0043523" OR g.value = "GO:0043524" OR g.value = "GO:0070997" \
OR g.value = "GO:1903203" OR g.value = "GO:1901216" OR g.value = "GO:0043525" \
RETURN m, r, p`

module.exports = {
    setPropertyRelGOtermToProtein,
    setPropertyRelStringCategoryToProtein,
    setPropertyRelStringDescriptionToProtein,
    getAllProteins,
    setProteinGene_Symbol,
    setRelationshipBetweenProteins,
    getNetworkImplicatedInSuicide,
    getCompleteNeuronDeathNetwork,
    getCompleteNeuronDeathNetworkImplicatedInSuicide
}
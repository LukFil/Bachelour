NAME_OF_RELATIONSHIP = 'Placeholder'

// const setPropertyRelGOtermToProtein = `\
// UNWIND $paramsArray AS parameters \
// MERGE (o: GO_term {value: parameters.origin})\
// MATCH (t: Protein) WHERE t.Gene_Symbol = parameters.target\
// MERGE (o) -[rel: propertyOf]-> (t)\
// RETURN count(rel)`

const setPropertyRelGOtermToProtein = `\
UNWIND $paramsArray AS parameters \
MERGE (o: GO_term {value: parameters.origin})\
MERGE (t: Protein {Gene_Symbol: parameters.target})\
MERGE (o) -[rel: propertyOf]-> (t)\
RETURN count(rel)`

const setPropertyRelStringCategoryToProtein = `\
UNWIND $paramsArray AS parameters \
MERGE (o: STRdb_category {value: parameters.origin}) \
MERGE (t: Protein {Gene_Symbol: parameters.target}) \
MERGE (o) -[rel: propertyOf]-> (t) \
RETURN count(rel)`

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


module.exports = {
    setPropertyRelGOtermToProtein,
    setPropertyRelStringCategoryToProtein,
    setPropertyRelStringDescriptionToProtein,
    getAllProteins,
    setProteinGene_Symbol,
    setRelationshipBetweenProteins
}
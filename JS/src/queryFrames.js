
const setPropertyRel = `\
UNWIND $paramsArray AS parameters \
MERGE (o: GO_term {value: parameters.origin})\
MERGE (t: Target {Gene_Symbol: parameters.target})\
MERGE (o) -[rel: propertyOf]-> (t)\
RETURN count(rel)`


module.exports = {
    setPropertyRel
}
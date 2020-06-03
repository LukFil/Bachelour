# targetMapping
# a script for running the mirDIP and mirTarBase annotation completely

# produce mirDIP results
source('~/Bachelour/R/produceMirDIPres.R')

# produce mirTarBase results
source('~/Bachelour/R/mirTarBase_call.R')

# 
source('~/Bachelour/R/produceMIRandDIPlinksets.R')

# reformatting for Neo4j linksets
source('~/Bachelour/R/reformatingForNeo4J.R')
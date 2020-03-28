# mirDIP API functions provided by the authors, can be accessed at http://ophid.utoronto.ca/mirDIP/
# 
# contains three search functions
#   unidirectionalSearchOnGenes
#   unidirectionalSearchOnMicroRnas
#   bidirectionalSearch
# and a helper - unpacking function 
#   makeMap
#
# how these can be used can be seen in mirDIP_call

# please install package httr
library(httr)

# const values
url <- "http://ophid.utoronto.ca/mirDIP"

mapScore <- list("0", "1", "2", "3");
names(mapScore) <- c("Very High", "High", "Medium", "Low")


unidirectionalSearchOnGenes <- function(geneSymbols, minimumScore) {
  
  parameters <- list(
    genesymbol = geneSymbols,
    microrna = "",
    scoreClass = mapScore[minimumScore]
  )
  
  # ... send http POST
  res <- POST(paste(url, "/Http_U", sep = ""), body = parameters, encode = "form", verbose())
}


unidirectionalSearchOnMicroRNAs <- function(microRNAs, minimumScore) {
  
  parameters <- list(
    genesymbol = "",
    microrna = microRNAs,
    scoreClass = mapScore[minimumScore]
  )
  
  # ... send http POST
  res <- POST(paste(url, "/Http_U", sep = ""), body = parameters, encode = "form", verbose())
}


bidirectionalSearch <- function(geneSymbols, microRNAs, minimumScore, sources, occurrances) {
  
  parameters <- list(
    genesymbol = geneSymbols,
    microrna = microRNAs,
    scoreClass = mapScore[minimumScore],
    dbOccurrences = occurrances,
    sources = sources
  )
  
  # ... send http POST
  res <- POST(paste(url, "/Http_B", sep = ""), body = parameters, encode = "form", verbose())
}

# make results-map as keyword - value
makeMap <- function(res) {
  
  ENTRY_DEL = "\001"
  KEY_DEL = "\002"
  
  response = content(res, "text")
  
  arr = unlist(strsplit(response, ENTRY_DEL, fixed = TRUE))
  
  list_map <- list("")
  vec_map_names <- c("");
  
  for (str in arr) {
    arrKeyValue = unlist(strsplit(str, KEY_DEL, fixed = TRUE));
    
    if (length(arrKeyValue) > 1) {
      list_map[length(list_map) + 1] <- arrKeyValue[2]
      vec_map_names[length(vec_map_names) + 1] <- arrKeyValue[1]
    }
  }
  
  names(list_map) <- vec_map_names
  
  list_map
}





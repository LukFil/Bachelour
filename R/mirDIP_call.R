# CALL mirDIP
# An example how a mirDIP might be called, recieved, and interpreted into a dataframe

source('~/Bachelour/R/mirDIP_functions.R')

# MicroRNAs
# - Comma delimited.
# - Follow the notation as shown.
microRNAs = "hsa-miR-603, hsa-let-7a-3p, hsa-miR-625-5p, hsa-miR-7852-3p, hsa-miR-17-5p"
# microRNAs <- formatForMirDIP(list[[1]]$miRNA)

# Minimum Score
# - Use one of those:'Very High', 'High', 'Medium', 'Low' .
# - Mind exact spelling.
minimumScore = "Very High"

res <- unidirectionalSearchOnMicroRNAs(microRNAs, minimumScore)

responseCode = status_code(res)
if (responseCode != 200) {
  
  cat("Error: Response Code : ", responseCode, "\r\n")
} else {
  
  list_map <- makeMap(res)
}


result <- confusedStringIntoDF(list_map[["results"]])

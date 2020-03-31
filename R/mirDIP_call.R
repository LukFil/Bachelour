# CALL mirDIP

mirDIP_call <- function (listChoice = 1, saveDir = NULL, saveFil = NULL){
  source('~/Bachelour/R/mirDIP_functions.R')
  source('~/Bachelour/R/getPrunedList.R')
  
  list <- getPrunedList(listChoice)
  # MicroRNAs
  # - Comma delimited.
  # - Follow the notation as shown.
  # microRNAs = "hsa-miR-603, hsa-let-7a-3p, hsa-miR-625-5p, hsa-miR-7852-3p, hsa-miR-17-5p"
  microRNAs <- formatForMirDIP(list[[1]]$miRNA)
  
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
  if (!is.null(saveDir) & !is.null(saveFil)){
    
    if(!dir.exists(saveDir)){
      dir.create(saveDir, recursive = TRUE)
    }
    
    setwd(saveDir)
    
    write.table(result,
                file = paste(c(saveFil, ".txt"), collapse = ''),
                sep  = "\t",
                row.names = FALSE,
                col.names = TRUE)
  }
}


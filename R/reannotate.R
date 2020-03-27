reannotate <- function(data, dict){
  # Required characteristics of input
  #   data             = a DATA.FRAME containing the dataset to be reannotated
  #     data$Gene.ID   = a column containing the identifiers of the elements: these will 
  #                      be used as a meeting point between the dictonary and the dataset
  #     data$Name      = a column containing the names of the elements in the dataset, 
  #                      will act as a source for names that are not present in the dict
  #                      or are present but have a 'nM' tag
  #   dict             = a DATA.FRAME containing the dictonary to be used for reannotation
  #     dict$Reporter  = a column containing the identifiers of the elements: these will 
  #                      be used as a meeting point between the dictonary and the dataset
  #     dict$miRBase22 = a column of updated names, to be used based on the status of
  #                      change inbetween the versions
  #     dict$isChanged = a column of status tags indicating what change there was in between
  #                      the versions. Acceptable tags are: 'RM' (REMOVED)
  #                                                         'SA' (SAME)
  #                                                         'CH' (CHANGED)
  #                                                     and 'nM' (not miRNA)
  
  # Output consists is simply the 'data' variable with appended columns for updated names
  # and status of change
  #   $newName
  #   $changeStatus
  
  
  changeStatus <- character()
  newNames     <- character()
  
  for (n in 1:length(data$Gene.ID)){
    
    countForWhil <- 1
    foundForWhil <- FALSE
    while(!foundForWhil){
      
      if (data$Gene.ID[n] == dict$Reporter[countForWhil]){
        foundForWhil <- TRUE
        # print(c("dataGeneID is: ", dat$Gene.ID[n], " and dictReporter is: ", dict$Reporter[countForWhil]))
        # warning(c("dataGeneID is: ", data$Gene.ID[n], " and dictReporter is: ", dict$Reporter[countForWhil]))
        # break
      }
      
      if (foundForWhil == FALSE){
        countForWhil <- countForWhil + 1
      }
      
      if(countForWhil > length(dict$Reporter)){
        warning("countForWhile has exceeded the length of dict$Reporter")
        break
      }
    }
    
    foundInd <- countForWhil
    # print(as.character(dict$miRBase22[foundInd]))
    
    # HAS THE ANNOTATION CHANGED BETWEEN THE VERSIONS?
    if     (dict$isChanged[foundInd] == "RM"){        # IT HAS BEEN REMOVED
      changeStatus[n] <- "RM"
      newNames[n]     <- ""
    }
    else if(dict$isChanged[foundInd] == "SA"){        # IT HAS REMAINED THE SAME
      changeStatus[n] <- "SA"
      newNames[n]     <- as.character(dict$miRBase22[foundInd])
    }
    else if(dict$isChanged[foundInd] == "CH"){        # IT HAS CHANGED
      changeStatus[n] <- "CH"
      newNames[n]     <- as.character(dict$miRBase22[foundInd])
    }
    else if(dict$isChanged[foundInd] == "nM"){        # IT IS NOT AN miRNA
      changeStatus[n] <- "nM"
      newNames[n]     <- data$Name[n]
    }
    else{
      warning(c("No if statement has been triggered, n =", n))
      break
    }
  }
  
  
  retData              <- data
  retData$changeStatus <- changeStatus
  retData$newName      <- newNames
    
  return(retData)
}
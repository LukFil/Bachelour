createDesignFile <- function(data){
  
  
  
  nameFile <- character()
  caseVRef <- character()
  suiVCtrl <- character()
  holdName <- character()
  groupVal <- character()
  for (n in 1:length(data[1, ])){
    holdName    <- colnames(data)[n]
    nameFile[n] <- holdName
    
    if        (grepl("Case", holdName)){
      caseVRef[n] <- "Case"
    } else if (grepl("Refe", holdName)){
      caseVRef[n] <- "Refe"
    }
    
    if        (grepl("Suicide", holdName)){
      suiVCtrl[n] <- "Suicide"
    } else if (grepl("Control", holdName)){
      suiVCtrl[n] <- "Control"
    }
    
    groupVal[n] <- paste(c(caseVRef[n], suiVCtrl[n]), collapse = '')
    holdName <- character()
  }
  desc <- cbind(nameFile, groupVal, caseVRef, suiVCtrl)
  return(as.data.frame(desc))
}
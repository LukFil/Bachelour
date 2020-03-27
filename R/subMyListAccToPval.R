subMyListAccToPval <- function(list = NULL, pVal = 0.05, adj = FALSE){
  # SUBSET 
  outList <- subset(list, subset = miRNA == '')
  
  for (n in 1:length(list[, 1])){
    if (adj == FALSE){
      if (list$P.Value[n] < pVal){
        outList[length(outList[ , 1]) + 1, ] <- list[n, ]
      }
    }
    if (adj == TRUE){
      if (list$adj.P.Val[n] < pVal){
        outList[length(outList[ , 1]) + 1, ] <- list[n, ]
      }
    }
  }
  
  
  
  return(outList)
}
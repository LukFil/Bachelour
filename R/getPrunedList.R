# Function developed for a retrieval and pruning of data files produced by statistics functions
# 

getPrunedList <- function (choice = 1,
                           dirPat = NULL,
                           pVal   = 0.05,
                           adj    = FALSE){
  
  source('~/Bachelour/R/subMyListAccToPval.R')
  
  
  dir    <- character()
  
  if (choice == 1){ dir <- '/home/lukekrishna/Bachelour/R/stats/stats-both'           }
  if (choice == 2){ dir <- '/home/lukekrishna/Bachelour/R/stats/stats-caseVRef'       }
  if (choice == 3){ dir <- '/home/lukekrishna/Bachelour/R/stats/stats-suiVCtrl'       }
  if (choice == 4){ dir <- '/home/lukekrishna/Bachelour/R/stats/stats-case-minAvgRefe'}
  if (choice == 5){ dir <- '/home/lukekrishna/Bachelour/R/stats/stats-case-minRefe'   }
  if (choice == 6){ dir <- '/home/lukekrishna/Bachelour/R/stats/stats-suiVCtrl-substr'}
  
  if (!is.null(dirPat) & is.character(dirPat)){ dir <- dirPat }
  
  setwd(dir)
  
  filenames <- list.files(path = dir, pattern = "*.tab", full.names = FALSE)
  filenames <- filenames[which(!grepl("Summary", filenames))]
  
  dataList  <- lapply(filenames, read.table, skip = 1)
  dataName  <- c("miRNA", "logFC", "Fold Change", "AveExpr", "t", "P.Value", "adj.P.Val")
  
  names(dataList) <- filenames
  
  for (n in 1:length(dataList)) {
    names(dataList[[n]]) <- dataName
  }
  
  prunList <- list()
  for (n in 1:length(dataList)){
    prunList[n] <- lapply(dataList[n], FUN = subMyListAccToPval, pVal, adj)
  }
  
  names(prunList) <-  names(dataList)
  
  return(prunList)
}



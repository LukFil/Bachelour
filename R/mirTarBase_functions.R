# THIS SET OF FUNCTIONS IS STILL UNDER DEVELOPMENT - optimisation for performance and fuctionality is highly required 

# A collection of functions intended to allow the user to query mirTarBase for miRNA - target links
# 
#   complexMirTarBaseComparision
#     a generalised wrapper function that should be able to execute the whole analysis with only given the input list, 
#     and a path where the user wants the results to be printed at
#       potentially not fully functional
#
#   getMirTarBase
#     a simple function that is intended to simply load the mirTarBase into a variable and then return it
#
#   lookAndMapMirTarBase
#     a function expected ting to take a dataframe containing $miRNA collumn, and miRTarBase, which will then pair and return a 
#     large paired dataframe
#
#   whichNotFound
#     a function expecting to take in a list of miRNA from annotated dataframe, and the original dataset, and  to return a list of miRNA's which
#     have not found any targets in mirTarBase
#
#   lookupMirTarBase
#     a function which is able to look up targets of individual miRNA's and return their targets from mirTarBase
#
#   mapMirTarBase
#     a wrapper for lookupMirTarBase which allows for take-in of whole lists instead of individual miRNAs only 

# retrieve from miRTarBase
complexMirTarBaseComparision <- function(list, path = NULL){
  mTBase <- getMirTarBase()
  
  if (!is.null(path) & is.character(path)) {
    setwd(path)
  }
  
  lookAndMapMirTarBase(list, mTBase) %>% write.table(file = "miRTarBase.txt", append = TRUE)
}

getMirTarBase <- function(dir = '/home/lukekrishna/Bachelour/R'){
  setwd(dir)
  
  names            <- read.table('miRTarBase_MTI.txt', nrows = 1)
  mTBase           <- read.table('miRTarBase_MTI.txt', skip  = 1)
  colnames(mTBase) <- as.character(unlist(names, use.names = FALSE))
  
  return(mTBase)
}

lookAndMapMirTarBase <- function(miRNAdf, mTBase){
  outDF <- data.frame()
  
  for (n in 1:length(mTBase[, 1])) {
    for (m in 1:length(miRNAdf[, 1])) {
      if (mTBase$miRNA[n] == miRNAdf$miRNA[m]) {
        outDF[length(outDF[, 1]+1), ] <- rbind(outDF, cbind(mTBase[n, ], miRNAdf[m, ]))
      }
    }
  }
  
  return(outDF)
}

whichNotFound <- function(annotList, originList){
  return(originList[which(!originList %in% annotList)])
}

lookupMirTarBase <- function(miRNA, mTBase){
  source('~/Bachelour/R/addFactorLevel.R')
  outDF            <- subset(mTBase, miRNA == "")

  
  for (n in 1:length(miRNA)) {
    for (m in 1:length(mTBase[, 1])) {
      if (miRNA[n] == mTBase$miRNA[m]){
        outDF[(length(outDF[ , 1]) + 1), ] <- mTBase[m, ]
      }
    }
  }
  
  if (length(outDF[ , 1]) == 0){
    for (n in 1:length(outDF)) {
      outDF[1, n] <- NA
    }
    outDF$miRNA    <- addFactorLevel(outDF$miRNA, miRNA)
    outDF$miRNA[1] <- miRNA
  }

  return(outDF)
}

mapMirTarBase <- function(list){
  mTBase  <- getMirTarBase()
  outList <- list()
  
  for (n in 1:length(list)){
    pairedDF <-  data.frame()
    
    for (m in 1:length(list[[n]]$miRNA)) {
      pairedDF <- rbind(pairedDF, lookupMirTarBase(list[[n]]$miRNA[m], mTBase))
    }
    
    outList[n] <- pairedDF
    names(outList[n]) <- names(list[n])
  }
  
  return(outList)
}


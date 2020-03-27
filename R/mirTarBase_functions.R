# retrieve from miRTarBase
complexMirTarBaseComparision <- function(list, path = NULL){
  mTBase <- getMirTarBase()
  
  if (!is.null(path) & is.character(path)) {
    setwd(path)
  }
  
  lookAndMapMirTarBase(list, mTBase) %>% write.table(file = "miRTarBase.txt", append = TRUE)
}

getMirTarBase <- function(){
  setwd('/home/lukekrishna/Bachelour/R')
  
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
  source('~/Bachelour/R/mirTarBase_functions.R')
  
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


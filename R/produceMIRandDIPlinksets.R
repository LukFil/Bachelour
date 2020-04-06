# create mirDIP exportable list

rm(list=ls())

# functions for producing the exportable files

produceFinal <- function(data, stats){
  
  outDF <- data.frame(matrix(NA, nrow = length(data[, 1]), ncol = (length(data[1, ]) + length(stats[1, ])-1)))
  mapSt <- mapStats(data$miRNA, stats)
  
  outDF[, 1] <- data[, 1]
  outDF[, 2:length(stats[1, ])] <- mapSt[, 2:length(mapSt[1, ])]
  # findMatch(data, stats)
  outDF[, (length(stats[1, ])+1):(length(outDF[1, ]))] <- data[, 2:length(data[1, ])]
  
  names <- c(colnames(data)[1], colnames(stats)[2:length(stats[1, ])], colnames(data)[2:length(data[1, ])])
  colnames(outDF) <- names
  
  return(outDF)
}

mapStats <- function(miRNAarr, stats){
  
  if (is.factor(miRNAarr)){miRNAarr <- as.character(unlist(miRNAarr))}
  
  outDF      <- data.frame(matrix(NA, nrow = length(miRNAarr), ncol = length(stats[1, ])))
  outDF[, 1] <- miRNAarr
  
  for (n in 1:length(miRNAarr)) {
    
    for (m in 1:length(stats[, 1])) {
      
      if (outDF[n, 1] == stats$miRNA[m]) {
        outDF[n, 2:length(outDF[1, ])] <- stats[m, 2:length(stats[1, ])]
      } 
    }
  }
  
  return(outDF)
}

# load mirDIP and the statistics 

setwd(dir = '~/Bachelour/results/stats')
stats <- read.table("resultStatsFix.txt", skip = 1)
sName <- read.table("resultStatsFix.txt", nrows = 1)
colnames(stats) <- unlist(sName)
rm(list = "sName")


setwd(dir = '~/Bachelour/results')
mirTar <- read.table("resultMirTar.txt", skip = 1)
sName <- read.table("resultMirTar.txt", nrows = 1)
colnames(mirTar) <- unlist(sName)
rm(list = "sName")
mirTar <- mirTar[c("miRNA", "Support_Type", "Experiments", "References_PMID", "Target_Gene", "Target_Gene_Entrez_ID")]

setwd(dir = '~/Bachelour/results/mirDIP/newStatRes')
mirDIP <- read.csv("mirDIP-results-fromE.csv", sep = "\t", quote = "")
mirDIP <- subset(mirDIP, subset = !is.na(Integrated.Score))
mirDIP <- mirDIP[c("MicroRNA","Integrated.Score", "Number.of.Sources", "Score.Class", "X.Sources", "Gene.Symbol", "Uniprot")]

colnames(mirDIP)[1] <- "miRNA"

mirDIPanno <- produceFinal(mirDIP, stats)
mirTARanno <- produceFinal(mirTar, stats)

setwd('~/Bachelour/results/linksets')

write.table(mirDIPanno, file = "mirDIPlinkset.csv", sep = "\t", row.names = FALSE, col.names = TRUE)
write.table(mirTARanno, file = "mirTARlinkset.csv", sep = "\t", row.names = FALSE, col.names = TRUE)







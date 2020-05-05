# Call miRTarBase
rm(list = ls())

source('~/Bachelour/R/mirTarBase_functions.R')

setwd('~/Bachelour/results/stats')
list  <- read.table('resultStatsFix.txt', skip = 1)
names <- read.table('resultStatsFix.txt', nrows = 1)
colnames(list) <- unlist(names)
inputList <- list[which(list$`P-Value` < 0.05), ]

results <- lookupMirTarBase(inputList$miRNA, mTBase = getMirTarBase())

setwd('~/Bachelour/results')
write.table(results,
            file = "resultMirTar.txt",
            sep = "\t",
            row.names = FALSE,
            col.names = TRUE)

# TEST mirTARBase

rm(list = ls())

# require(tidyverse)

source('~/Bachelour/R/mirTarBase_functions.R')
# source('~/Bachelour/R/getPrunedList.R')

setwd('/home/lukekrishna/Bachelour/results/stats')
list  <- read.table('resultStatsFix.txt', skip = 1)
names <- read.table('resultStatsFix.txt', nrows = 1)
colnames(list) <- unlist(names)
inputList <- list[which(list$`P-Value` < 0.05), ]


# list <- getPrunedList(4)
# hold <- as.data.frame(list[[1]][1:10, ])
# test <- mapMirTarBase(list[[1]]$miRNA)
# test2 <- miRTarBase_call(list)
test3 <- lookupMirTarBase(inputList$miRNA, mTBase = getMirTarBase())

# result <- lookAndMapMirTarBase(miRNAdf = hold, mTBase = getMirTarBase())
# getMirTarBase() %>% lookAndMapMirTarBase(miRNAdf = hold) %>% result


setwd('~/Bachelour/results')
write.table(test3,
            file = "resultMirTar.txt",
            sep = "\t",
            row.names = FALSE,
            col.names = TRUE)

rm(list = ls())
source('~/Bachelour/R/mirDIP_call.R')

setwd('/home/lukekrishna/Bachelour/results/stats')
list  <- read.table('resultStatsFix.txt', skip = 1)
names <- read.table('resultStatsFix.txt', nrows = 1)
colnames(list) <- unlist(names)


saveDir <- c("~/Bachelour/results/mirDIP/newStatRes")
saveFil <- "mirDIP-results"

inputList <- list[which(list$`P-Value` < 0.05), ]

mirDIP_call(list = inputList, saveDir = saveDir, saveFil = saveFil)

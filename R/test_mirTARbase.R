# TEST mirTARBase

rm(list = ls())

source('~/Bachelour/R/mirTarBase_functions.R')
source('~/Bachelour/R/getPrunedList.R')


miRNA <- c("hsa-miR-603", "hsa-let-7a-3p", "hsa-miR-625-5p")
df  <- data.frame(matrix(NA, ncol = 3, nrow = 3))
df  <- cbind(df, miRNA)

getMirTarBase() %>% lookAndMapMirTarBase(miRNAdf = df) %>% result

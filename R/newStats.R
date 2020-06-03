rm(list = ls())


library(limma)
library(pracma)

source('~/Bachelour/R/createDesignFile.R')
source('~/Bachelour/R/designMyOwn.R')
source('~/Bachelour/R/functions_ArrayAnalysis_v2.R')

datPath = '~/Bachelour/results'
datFile = 'data-dW-res-both-2020-03-30.RData'
outPath = '~/Bachelour/results/stats' 
coef    = 2

# Load the pre=prepped data
setwd(as.character(datPath))
load(as.character(datFile))
setwd(as.character(outPath))

desc          <- createDesignFile(data.norm.ori)
desc$suiVCtrl <- as.factor(desc$suiVCtrl)
design        <- as.data.frame(designMyOwn(desc))

outDF <- data.frame(matrix(NA, nrow = length(data.norm.ori[, 1]), 
                               ncol = 4))
colnames(outDF) <- c("miRNA", "P-Value", "FC", "log2FC")

for (n in 1:length(data.norm.ori[, 1])) {
  outDF$miRNA[n]     <- rownames(data.norm.ori)[n]
  tryCatch({
    outDF$`P-Value`[n] <- t.test(cont <- data.norm.ori[n, which(design$caseCtrl == 1)],
                                 case <- data.norm.ori[n, which(design$caseSuic == 1)],
                                 paired = FALSE)$p.value
  },
  error = function(cond){
    outDF$`P-Value`[n] <- 1
  })
  outDF$FC[n]        <- (mean(data.norm.ori[n, which(design$caseCtrl == 1)]) / mean(data.norm.ori[n, which(design$caseSuic == 1)]))
  outDF$log2FC[n]    <- log2(outDF$FC[n])
}

write.table(outDF, file = "resultStatsFix.txt", sep = "\t", row.names = FALSE, col.names = TRUE)

# A function that produces statistcs analysis on the results from prepData.R

statWork <- function(datPath = '/home/lukekrishna/Bachelour/results',
                     datFile = 'data-dW-res-both-2020-03-30.RData',
                     outPath = '/home/lukekrishna/Bachelour/results/stats', 
                     coef    = 2){
  
  library(limma)
  library(pracma)
  
  source('~/Bachelour/R/createDesignFile.R')
  source('~/Bachelour/R/designMyOwn.R')
  source('~/Bachelour/R/functions_ArrayAnalysis_v2.R')
  
  
  # Load the pre=prepped data
  setwd(as.character(datPath))
  # load("data-dW-res.RData")
  load(as.character(datFile))
  
  setwd(as.character(outPath))
  
  
  # CREATE DESIGN FILE 
  
  desc <- createDesignFile(data.norm.ori)
  # desc$caseVRef <- as.factor(desc$caseVRef)
  desc$suiVCtrl <- as.factor(desc$suiVCtrl)
  
  #design <- model.matrix(~groupVal, data = desc)
  design  <- designMyOwn(desc)
  
  fit <- lmFit(data.norm.ori, design)
  fit <- eBayes(fit)
  
  # topTable(fit, adjust.method = "BH", coef = coef, number = dim(data.norm.ori)[1], resort.by = "P")
  files <-  saveStatOutput(design, fit)
  
  createPvalTab(files, html = TRUE)
  
}

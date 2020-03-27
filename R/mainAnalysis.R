# LET'S TRY AND ADAPT
# WRITING UP AN UNFIsItED SCRIPT

rm(list=ls())

require(limma)
require(ExiMiR)
library(bioDist)
library(gplots)
library(gcrma)
library(affy)

source('~/Bachelour/R/reannotate.R')
source('~/Bachelour/R/createDict.R')
source('~/Bachelour/R/newMakeGalEnv.R')
source('~/Bachelour/R/newReadExi.R')
source('~/Bachelour/R/newCreateAB.R')
source('~/Bachelour/R/functions_ArrayAnalysis_v2.R')

setwd("/home/lukekrishna/Bachelour/R/Data")

datAnnotOld <- read.delim("A-MEXP-1469.txt",       as.is = TRUE, skip = 18 )
datDescript <- read.delim("E-GEOD-34120.sdrf.txt", as.is = TRUE)
# Apparently the description file contains a lot of duplicates, therefore it needs to be pruned to avoid 
# duplication of data

prunDescri <- subset(datDescript, FactorValue..INDIVIDUAL. != 'not specified')


# To BE USED: 
#   getMiRNAHistory
#   miRNAVersionConvert

setwd("/home/lukekrishna/Bachelour/R")

# LIMMA getLayout requires a single BLOCK collumn - so we're going to create it
# Furthermore it needs to be ordered, without gaps, and integer
Block <- integer()
for (n in 1:length(datAnnotOld$Block.Row)) {
  # Block[n] <- as.integer(paste(c(datAnnotOld$Block.Column[n],datAnnotOld$Block.Row[n]), collapse = ''))
  if (datAnnotOld$Block.Column[n] == 1){
    Block[n] <- as.integer(datAnnotOld$Block.Row[n])
  }
  else if(datAnnotOld$Block.Column[n] == 2){
    Block[n] <- as.integer(datAnnotOld$Block.Row[n]) + 8
  }
  else if(datAnnotOld$Block.Column[n] == 3){
    Block[n] <- as.integer(datAnnotOld$Block.Row[n]) + 16
  }
  else if(datAnnotOld$Block.Column[n] == 4){
    Block[n] <- as.integer(datAnnotOld$Block.Row[n]) + 24
  }
  
}
datAnnotOld <- cbind(datAnnotOld, Block)


# datAnnotOld needs grooming
# So that newMakeGalEnv works with proper vars
names(datAnnotOld)[names(datAnnotOld) == "Reporter.Name"] <- "Gene.ID"
names(datAnnotOld)[names(datAnnotOld) == "Reporter.Database.Entry.mirbase."] <- "Name"

uniqDict <- createDict(dictChoice = "uniq")

datAnnotOld <- reannotate(data = datAnnotOld,
                          dict = uniqDict)

datAnnotOld$Name    <- datAnnotOld$newName
datAnnotOld$newName <- NULL
names(datAnnotOld)[names(datAnnotOld) == "Gene.ID"] <- "ID"

newMakeGalEnv(datAnnotOld,
              # filename = ,
              # galname  = ,
              # gal.path = "/home/lukekrishna/Bachelour/R/Data"
              )

# CREATING AFFYBATCH
setwd("/home/lukekrishna/Bachelour/R/Data/E-GEOD-34120.raw.1")
ebatch    <- newReadExi(galname=galname, annotFile = datAnnotOld)


# # CREATING EXPRESSIONset
# eset.spike <- NormiR(ebatch, bg.correct = FALSE,
#                      normalize.method   = 'quantile',
#                      summary.method     = 'medianpolish')
# assayExpr <- eset.spike@assayData[["exprs"]]  
# # 

setwd("/home/lukekrishna/Bachelour/R")


# Assign the AffyBatch into a new variable, and create a backup
dat   <- ebatch
dat.b <- dat

# Requires prunDescri from 'dataWork.R'

oldNamesCol <- colnames(dat)
newNamesCol <- character()
condStatCol <- character()
labelUseCol <- character()
for (n in 1:length(oldNamesCol)){
  
  for (m in 1:length(prunDescri$Source.Name)){
    if (grepl(prunDescri$Hybridization.Name[m], oldNamesCol[n]) & 
        grepl(prunDescri$Label[m], oldNamesCol[n])){
      newNamesCol[n] <- paste(c(prunDescri$Comment..Sample_title.[m],"_", prunDescri$Label[m]), collapse = '')
      labelUseCol[n] <- prunDescri$Label[m]
      if(grepl("Suicide", newNamesCol[n])){
        condStatCol[n] <- "Suicide"
      }
      else {
        condStatCol[n] <- "Control"
      }
    }
  }
}
# somehow it would be cool if we could replace the names with newnamescol
# `colnames<-`(newNamesCol)
# 

desc <- as.data.frame(cbind(oldNamesCol, newNamesCol, condStatCol, labelUseCol))

factor <- c(as.factor("oneFactor"))
createQCPlots(data, factors = factor)





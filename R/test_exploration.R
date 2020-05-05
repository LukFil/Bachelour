# Testing and explorative script, not part of the final workflow


rm(list=ls())

require(limma)
require(ExiMiR)
require(bioDist)
require(gplots)
require(gcrma)
require(affy)

source('~/Bachelour/R/reannotate.R')
source('~/Bachelour/R/createDict.R')
source('~/Bachelour/R/newMakeGalEnv.R')
source('~/Bachelour/R/newReadExi.R')
source('~/Bachelour/R/newCreateAB.R')
source('~/Bachelour/R/functions_ArrayAnalysis_v2.R')
source('~/Bachelour/R/getBlockLayout.R')

setwd("/home/lukekrishna/Bachelour/data/oriData")

datAnnotOld <- read.delim("A-MEXP-1469.txt",       as.is = TRUE, skip = 18 )
datDescript <- read.delim("E-GEOD-34120.sdrf.txt", as.is = TRUE)
# Apparently the description file contains a lot of duplicates, therefore it needs to be pruned to avoid 
# duplication of data

prunDescri <- subset(datDescript, FactorValue..INDIVIDUAL. != 'not specified')

setwd("/home/lukekrishna/Bachelour/result")

# LIMMA getLayout requires a single BLOCK collumn - so we're going to create it
# Furthermore it needs to be ordered, without gaps, and integer
datAnnotOld <- cbind(datAnnotOld, getBlockLayout(datAnnotOld))


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

newMakeGalEnv(datAnnotOld)

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

desc <- as.data.frame(cbind(oldNamesCol, newNamesCol, condStatCol, labelUseCol))

factor <- c(as.factor("oneFactor"))
createQCPlots(data, factors = factor)





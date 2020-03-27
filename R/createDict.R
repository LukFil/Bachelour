# R Script for Lukas Filipcik's thesis
  

createDict <- function(dictChoice = "true", providedDataStatus = FALSE, providedData = NULL){

# Admittable inputs
  # dictChoice = "true"  means it returns trueDict
  # dictChoice = "uniq"  means it returns unieDict
  # providedDataStatus = FALSE or TRUE, determines whether to use input as a source for dictonary or datafile
  # providedData = a table of 2 collumns containing dataset
      # $Reporter  = an array of reporters (or IDs) of the appropriate miRNA
      # $Name      = an array of Names of the apropriate miRNA

#
# What to do now:
# Create annotation dictonary
# ANNOTATE for 22.1
# CHECK for differences between old and new annotations
#
# BIOCONDUCTOR is required
require("miRBaseConverter")
require("pracma")

# if (!requireNamespace("BiocManager", quietly = TRUE))
#   install.packages("BiocManager")
# BiocManager::install(version = "3.10")
# BiocManager::install("miRBaseConverter")
# 
# # Needed for mathematical operations (such as STRCMP)
# install.packages("pracma")

library("miRBaseConverter")
library("pracma")

setwd("/home/lukekrishna/Bachelour/R/Data")

if (!providedDataStatus){
  datAnnotOld <- read.delim("A-MEXP-1469.txt",       as.is = TRUE, skip = 18 )
  names(datAnnotOld)[names(datAnnotOld) == "Reporter.Database.Entry.mirbase."] <- "Name"
  names(datAnnotOld)[names(datAnnotOld) == "Reporter.Name"] <- "Reporter"
} else if (is.null(providedData)){
  warning('Data not provided')
} else{
  datAnnotOld <- providedData
}

# To BE USED: 
#   getMiRNAHistory
#   miRNAVersionConvert

setwd("/home/lukekrishna/Bachelour/R")
# Make a list of changes
# Question to be answered: is there a difference if the transfer is done directly to the target version, as compared to 
# going through each individual intremediate version?
newAnnotDct    <- miRNAVersionConvert(datAnnotOld$Name, targetVersion = "v22", 
                                      exact = TRUE, verbose = TRUE)

listMissing    <- is.na(newAnnotDct$TargetName)
listNotMiRNInd <- which(newAnnotDct$OriginalName %in% "")
listMissingInd <- which(listMissing)
listMissingInd <- listMissingInd[!listMissingInd %in% listNotMiRNInd]
isChanged      <- character()
innerCount     <- 0;

# Create classification for changes between the annotation process
for (n in 1:length(listMissing)) {
  if (listMissing[n] & innerCount-1 <= length(listMissingInd)){
    isChanged[n] = "RM"
    innerCount   <- innerCount +1;
  }  else if(nchar(as.character(newAnnotDct$OriginalName[n])) == 0){
    isChanged[n] = "nM"
  }  else{
    if (is.na(strcmp(newAnnotDct$OriginalName[n], newAnnotDct$TargetName[n]))){
      isChanged[n] = "SA"
    } else if(strcmp(newAnnotDct$OriginalName[n], newAnnotDct$TargetName[n])){
      isChanged[n] = "SA"
    }  else{
      isChanged[n] = "CH"
    }
  }
}

# I need my blocks
if (providedDataStatus){
  setwd("/home/lukekrishna/Bachelour/R/Data")
  
    getMyBlocks <- read.delim("A-MEXP-1469.txt",       as.is = TRUE, skip = 18 )
    
  setwd("/home/lukekrishna/Bachelour/R")
  datAnnotOld <- cbind(datAnnotOld, "Block.Row"    = getMyBlocks$Block.Row, 
                                    "Block.Column" = getMyBlocks$Block.Column, 
                                    "Row"          = getMyBlocks$Row, 
                                    "Column"       = getMyBlocks$Column)
}

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


# The final annotation dictonary
#   isChanged holds three types of values
#     RM for REMOVED miRNA - it had been present in version 12, but not   in 22
#     SA for SAME    miRNA - no changes have been made
#     CH for CHANGED miRNA - the name of the miRNA has been changed inbetween the versions
#     nM for not     miRNA - the name of the original is not a valid name of miRNA in miRBase
trueDict <- data.frame("Reporter"  = datAnnotOld$Reporter, "miRBase12" = as.character(newAnnotDct$OriginalName), 
                       "miRBase22" = as.character(newAnnotDct$TargetName), "isChanged" = isChanged, 
                       "Block"     = datAnnotOld$Block, "Column" = datAnnotOld$Column, "Row" = datAnnotOld$Row)
# Only unique by Reporters
uniqDict <- subset(trueDict, !duplicated(trueDict$Reporter))


  # Dictonary further refined - cleansed of non-miRNA entries
# Remove empty entries
#   Specifically those, that are empty in miRBase12 (since miRBase22 was gathered based on the 12, there will be no
#   entries that are present in 22 but not in 12)

# refiDict <- subset(trueDict, , select = c(Reporter, miRBase12, miRBase22, isChanged)
rowsToRemoveInd <- which(trueDict$miRBase12 %in% "")
rowsToRemove    <- unique(trueDict$Reporter[rowsToRemoveInd])

# THIS MIGHT BE FUCKED YET! NOT CERTAIN
# rowsToRemove <- 13138
n = 0
refiDict <- trueDict

for (n in 1:length(rowsToRemove)) {
  refiDict <- subset(refiDict, Reporter != rowsToRemove[n], select = c(Reporter, miRBase12, miRBase22, isChanged))
}


# checkMiRNAVersion(trueDict$miRBase22)
# checkMiRNAVersion(refiDict$miRBase22)
# Interesting note retrieved by miRBase Converter: it seems to have a higher confidence (only slightly, albeit), that our dataset is
# is annotated in miRBase v11, as opposed to the v12. That either means that there was little difference between the versions, or that
# it was rather strange annotation process in the first place. However, I don't believe that is important
if(dictChoice == "true"){
  return(trueDict)
}
if(dictChoice == "uniq"){
  return(uniqDict)
}
}
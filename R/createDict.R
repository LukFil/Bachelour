# A function used to return a mapping annotation dictionary

createDict <- function(dictChoice = "true", providedDataStatus = FALSE, providedData = NULL){

# Admittable inputs
  # dictChoice = "true"  means it returns trueDict
  # dictChoice = "uniq"  means it returns unieDict
  # providedDataStatus = FALSE or TRUE, determines whether to use input as a source for dictonary or datafile
  # providedData = a table of 2 collumns containing dataset
      # $Reporter  = an array of reporters (or IDs) of the appropriate miRNA
      # $Name      = an array of Names of the apropriate miRNA

require("miRBaseConverter")
require("pracma")
require("miRBaseConverter")
require("pracma")

source('~/Bachelour/R/getBlockLayout.R')
  
setwd("/home/lukekrishna/Bachelour/data/oriData")

if (!providedDataStatus){
  datAnnotOld <- read.delim("A-MEXP-1469.adf.txt",       as.is = TRUE, skip = 18 )
  names(datAnnotOld)[names(datAnnotOld) == "Reporter.Database.Entry.mirbase."] <- "Name"
  names(datAnnotOld)[names(datAnnotOld) == "Reporter.Name"] <- "Reporter"
} else if (is.null(providedData)){
  warning('Data not provided')
} else{
  datAnnotOld <- providedData
}

setwd("/home/lukekrishna/Bachelour/R")


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
  setwd("/home/lukekrishna/Bachelour/data/oriData")
  
    getMyBlocks <- read.delim("A-MEXP-1469.adf.txt",       as.is = TRUE, skip = 18 )
    
  setwd("/home/lukekrishna/Bachelour/R")
  datAnnotOld <- cbind(datAnnotOld, "Block.Row"    = getMyBlocks$Block.Row, 
                                    "Block.Column" = getMyBlocks$Block.Column, 
                                    "Row"          = getMyBlocks$Row, 
                                    "Column"       = getMyBlocks$Column)
}


datAnnotOld <- cbind(datAnnotOld, Block = getBlockLayout(datAnnotOld))


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

if(dictChoice == "true"){
  return(trueDict)
}
if(dictChoice == "uniq"){
  return(uniqDict)
}
}
rm(list = ls())
## FUNCTIONS 

isProteinInString <- function (protein, string){
  splitString <- strsplit(string, "|", fixed = TRUE)[[1]]
  
  # for (i in 1:length(splitString)) {
  #   if (splitString[i] == protein) {
  #     outValue = TRUE
  #   }
  # }
  
  outValue <- splitString %in% protein
  
  return(outValue)
}


## SCRIPT
setwd("~/Bachelour/results")

protein_set <- read.csv("protein_list.csv", header = FALSE)

setwd("~/Bachelour/results/GOres")

suiAssocGenes <- read.delim("suicide_associated_genes.tsv")
GOnet_res <- read.csv("GOnet_res.csv")

statusArray <- character()
numArray <- integer()

for (i in 1:length(GOnet_res[, 1])) {
  status <- character()
  num <- 0
  
  # for (j in 1:length(suiAssocGenes$Gene)) {
  #   if (grepl(suiAssocGenes$Gene[j], GOnet_res$Genes[i])){
  #     num  <- num + 1
  #   }
  #   status <- c(status, grepl(suiAssocGenes$Gene[j], GOnet_res$Genes[i]))
  # }
  # status <- c(status, grepl(suiAssocGenes$Gene[j], GOnet_res$Genes[i]))
  
  for (j in 1:length(suiAssocGenes$Gene)) {
    cond <- sum(isProteinInString(suiAssocGenes$Gene[j], as.character(GOnet_res$Genes[i])))
    if (cond > 0){
      num  <- num + cond
      hldStatus <- TRUE
    } else {
      hldStatus <- FALSE
    }
    status <- c(status, hldStatus)
  }
  
  numArray <- rbind(numArray, num)
  statusArray <- rbind(statusArray, paste(status, collapse = ""))
}
implicatedInSuicide <- grepl(TRUE, statusArray)
numberOfImplicatedGenes <- numArray

GOnet_res <- cbind(GOnet_res, implicatedInSuicide)
GOnet_res <- cbind(GOnet_res, numberOfImplicatedGenes)

ratioSuicideGenesOverTotal <- GOnet_res$numberOfImplicatedGenes/GOnet_res$NofGenes

GOnet_res <- cbind(GOnet_res, ratioSuicideGenesOverTotal)

# #
# #
# string <- as.character(protein_set$V1[1])
# for (i in 2:length(protein_set$V1)) {
#   string <- paste(c(string, "|", as.character(protein_set$V1[i]) ), collapse = "")
# }

#
# TRIM LEADING WHITESPACE
protein_set$V1 <- trimws(protein_set$V1)

number <- integer()
name   <- character()
for (i in 1:length(suiAssocGenes$Gene)) {
  number[i] <- sum(protein_set$V1 %in% suiAssocGenes$Gene[i])
  name[i]   <- as.character(suiAssocGenes$Gene[i])
}
result <- as.data.frame(cbind(name, number))

# number of known suicide associated genes present in the dataset
length(result$name[which(as.integer(as.character(result$number)) > 0)])

# SUBSETS

neuronSubset <- subset(GOnet_res, grepl("neur", GO_term_def))
synapsSubset <- subset(GOnet_res, grepl("synap", GO_term_def))
brainSubset  <- subset(GOnet_res, grepl("brain", GO_term_def))
transmSubset <- subset(GOnet_res, grepl("transmit", GO_term_def))
singalSubset <- subset(GOnet_res, grepl("signal", GO_term_def))

# 
# # TAUPROTEIN
# status2 <- character()
# for (i in 1:length(GOnet_res[, 1])) {
#   
#   status2 <- c(status2, grepl("MAPT", GOnet_res$Genes[i]))
# }

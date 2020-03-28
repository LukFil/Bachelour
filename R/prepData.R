# A script that takes in the extraction data from dataWork.R, and performes QC on various subsets of the data
# saving the output into files 

# GENERAL - BOTH REFE and CASE
#############################################################################################################
# CREATE A SINGLE DATAFRAME
load("~/Bachelour/R/data-rdyForExtraction.RData")

data <- cbind(Slide_1_Suicide_Case$Signal.Mean, Slide_1_Suicide_Refe$Signal.Mean,
              Slide_2_Control_Case$Signal.Mean, Slide_2_Control_Refe$Signal.Mean,
              Slide_3_Control_Case$Signal.Mean, Slide_3_Control_Refe$Signal.Mean,
              Slide_4_Control_Case$Signal.Mean, Slide_4_Control_Refe$Signal.Mean,
              Slide_5_Control_Case$Signal.Mean, Slide_5_Control_Refe$Signal.Mean,
              Slide_6_Suicide_Case$Signal.Mean, Slide_6_Suicide_Refe$Signal.Mean,
              Slide_7_Suicide_Case$Signal.Mean, Slide_7_Suicide_Refe$Signal.Mean,
              Slide_8_Suicide_Case$Signal.Mean, Slide_8_Suicide_Refe$Signal.Mean)
rownames(data) <- Slide_1_Suicide_Case$newName
colnames(data) <- rev(listDatVars)


data.b <- data
data   <- log2(data)
data[which(is.nan(data))] <- 0

desFile <- createDesignFile(data.b)
factors <- c("groupVal","caseVRef", "suiVCtrl")

desFile$groupVal <- factor(desFile$groupVal, levels=c("CaseSuicide", "RefeSuicide", "CaseControl", "RefeControl"))
desFile$caseVRef <- factor(desFile$caseVRef,levels=c("Case","Refe"))
desFile$suiVCtrl <- factor(desFile$suiVCtrl,levels=c("Suicide","Control"))
setwd('/home/lukekrishna/Bachelour/R/QC')
# factor <- c(as.factor("oneFactor"))
createQCPlots(data, factors = factors, Table = desFile)
# The size of the bars in the boxplot is significantly affected by whether or not the substraction of background has been performed

# NORMALISATION

data.norm.log <- normalizeBetweenArrays(data,   method = "quantile")
data.norm.ori <- normalizeBetweenArrays(data.b, method = "quantile")
setwd('/home/lukekrishna/Bachelour/R/QC-norm')
createQCPlots(data.norm.log, factors = factors, Table = desFile)
maFun(data.norm.log, perGroup = FALSE, postfix = "NormalisedLog")

# setwd('/home/lukekrishna/Bachelour/R/QC-prun')
# data.prun <- hateDuplicatesV4(data.norm)
# maFun(data.prun, perGroup = FALSE, postfix = "pruned")
# createQCPlots(data.prun, factors = factor, postfix = "pruned")
# # THE BOXplots are not quite normal now. Normalise again?
# data.prun.norm <- normalizeBetweenArrays(data.prun, method = "quantile")
# maFun(data.prun.norm, perGroup = FALSE, postfix = "prunedNormalised")
# createQCPlots(data.prun.norm, factors = factor, postfix = "prunedNormalised")

rm(list = setdiff(ls(), c("data", "data.b", "data.norm.log", "data.norm.ori")))

save.image(paste(c("~/Bachelour/R/data-dW-res-both-", as.character(Sys.Date()),".RData"), collapse = ''))

rm(list = ls())
#############################################################################################################

# CASE - CONTROL
#############################################################################################################
# CREATE A SINGLE DATAFRAME
load("~/Bachelour/R/data-rdyForExtraction.RData")

data <- cbind(Slide_1_Suicide_Case$Signal.Mean - Slide_2_Control_Case$Signal.Mean,
              Slide_6_Suicide_Case$Signal.Mean - Slide_3_Control_Case$Signal.Mean,
              Slide_7_Suicide_Case$Signal.Mean - Slide_4_Control_Case$Signal.Mean,
              Slide_8_Suicide_Case$Signal.Mean - Slide_5_Control_Case$Signal.Mean)

rownames(data) <- Slide_1_Suicide_Case$newName
colnames(data) <- rev(listDatVars[which((grepl("Case", listDatVars) & grepl("Suicide", listDatVars)))])


data.b <- data
data   <- log2(data)
data[which(is.nan(data))] <- 0

desFile <- createDesignFile(data.b)
factors <- c("suiVCtrl")

desFile$suiVCtrl <- factor(desFile$suiVCtrl,levels=c("Suicide"))
setwd('/home/lukekrishna/Bachelour/R/QC-substr-suiVCtrl')
# factor <- c(as.factor("oneFactor"))
createQCPlots(data, factors = factors, Table = desFile)
# The size of the bars in the boxplot is significantly affected by whether or not the substraction of background has been performed

# NORMALISATION

data.norm.log <- normalizeBetweenArrays(data,   method = "quantile")
data.norm.ori <- normalizeBetweenArrays(data.b, method = "quantile")
setwd('/home/lukekrishna/Bachelour/R/QC-substr-norm-suiVCtrl')
createQCPlots(data.norm.log, factors = factors, Table = desFile)
maFun(data.norm.log, perGroup = FALSE, postfix = "NormalisedLog")

# setwd('/home/lukekrishna/Bachelour/R/QC-prun')
# data.prun <- hateDuplicatesV4(data.norm)
# maFun(data.prun, perGroup = FALSE, postfix = "pruned")
# createQCPlots(data.prun, factors = factor, postfix = "pruned")
# # THE BOXplots are not quite normal now. Normalise again?
# data.prun.norm <- normalizeBetweenArrays(data.prun, method = "quantile")
# maFun(data.prun.norm, perGroup = FALSE, postfix = "prunedNormalised")
# createQCPlots(data.prun.norm, factors = factor, postfix = "prunedNormalised")

rm(list = setdiff(ls(), c("data", "data.b", "data.norm.log", "data.norm.ori")))

save.image(paste(c("~/Bachelour/R/data-dW-res-suiVCtrl-substr-", as.character(Sys.Date()),".RData"), collapse = ''))

rm(list = ls())
#############################################################################################################

# PARTICU - CASE ONLY
#############################################################################################################

# CREATE A SINGLE DATAFRAME
load("~/Bachelour/R/data-rdyForExtraction.RData")

data <- cbind(Slide_1_Suicide_Case$Signal.Mean,
              Slide_2_Control_Case$Signal.Mean,
              Slide_3_Control_Case$Signal.Mean,
              Slide_4_Control_Case$Signal.Mean,
              Slide_5_Control_Case$Signal.Mean,
              Slide_6_Suicide_Case$Signal.Mean,
              Slide_7_Suicide_Case$Signal.Mean,
              Slide_8_Suicide_Case$Signal.Mean)
# data <- cbind(Slide_1_Suicide_Case$Signal.Mean - Slide_1_Suicide_Refe$Signal.Mean,
#               Slide_2_Control_Case$Signal.Mean - Slide_2_Control_Refe$Signal.Mean,
#               Slide_3_Control_Case$Signal.Mean - Slide_3_Control_Refe$Signal.Mean,
#               Slide_4_Control_Case$Signal.Mean - Slide_4_Control_Refe$Signal.Mean,
#               Slide_5_Control_Case$Signal.Mean - Slide_5_Control_Refe$Signal.Mean,
#               Slide_6_Suicide_Case$Signal.Mean - Slide_6_Suicide_Refe$Signal.Mean,
#               Slide_7_Suicide_Case$Signal.Mean - Slide_7_Suicide_Refe$Signal.Mean,
#               Slide_8_Suicide_Case$Signal.Mean - Slide_8_Suicide_Refe$Signal.Mean)
rownames(data) <- Slide_1_Suicide_Case$newName
colnames(data) <- rev(listDatVars[which(grepl("Case", listDatVars))])


data.b <- data
data   <- log2(data)
data[which(is.nan(data))] <- 0

desFile <- createDesignFile(data.b)
factors <- c("suiVCtrl")

desFile$suiVCtrl <- factor(desFile$suiVCtrl,levels=c("Suicide","Control"))
setwd('/home/lukekrishna/Bachelour/R/QC-suiVCtrl')
# factor <- c(as.factor("oneFactor"))
createQCPlots(data, factors = factors, Table = desFile)
# The size of the bars in the boxplot is significantly affected by whether or not the substraction of background has been performed

# NORMALISATION

data.norm.log <- normalizeBetweenArrays(data,   method = "quantile")
data.norm.ori <- normalizeBetweenArrays(data.b, method = "quantile")
setwd('/home/lukekrishna/Bachelour/R/QC-norm-suiVCtrl')
createQCPlots(data.norm.log, factors = factors, Table = desFile)
maFun(data.norm.log, perGroup = FALSE, postfix = "NormalisedLog")

# setwd('/home/lukekrishna/Bachelour/R/QC-prun')
# data.prun <- hateDuplicatesV4(data.norm)
# maFun(data.prun, perGroup = FALSE, postfix = "pruned")
# createQCPlots(data.prun, factors = factor, postfix = "pruned")
# # THE BOXplots are not quite normal now. Normalise again?
# data.prun.norm <- normalizeBetweenArrays(data.prun, method = "quantile")
# maFun(data.prun.norm, perGroup = FALSE, postfix = "prunedNormalised")
# createQCPlots(data.prun.norm, factors = factor, postfix = "prunedNormalised")

rm(list = setdiff(ls(), c("data", "data.b", "data.norm.log", "data.norm.ori")))

save.image(paste(c("~/Bachelour/R/data-dW-res-suiVCtrl-", as.character(Sys.Date()),".RData"), collapse = ''))

rm(list = ls())
#############################################################################################################



# PARTICU - CASE - REFESIGN
#############################################################################################################

# CREATE A SINGLE DATAFRAME
load("~/Bachelour/R/data-rdyForExtraction.RData")

data <- cbind(Slide_1_Suicide_Case$Signal.Mean - Slide_1_Suicide_Refe$Signal.Mean,
              Slide_2_Control_Case$Signal.Mean - Slide_2_Control_Refe$Signal.Mean,
              Slide_3_Control_Case$Signal.Mean - Slide_3_Control_Refe$Signal.Mean,
              Slide_4_Control_Case$Signal.Mean - Slide_4_Control_Refe$Signal.Mean,
              Slide_5_Control_Case$Signal.Mean - Slide_5_Control_Refe$Signal.Mean,
              Slide_6_Suicide_Case$Signal.Mean - Slide_6_Suicide_Refe$Signal.Mean,
              Slide_7_Suicide_Case$Signal.Mean - Slide_7_Suicide_Refe$Signal.Mean,
              Slide_8_Suicide_Case$Signal.Mean - Slide_8_Suicide_Refe$Signal.Mean)
rownames(data) <- Slide_1_Suicide_Case$newName
colnames(data) <- rev(listDatVars[which(grepl("Case", listDatVars))])


data.b <- data
data   <- log2(data)
data[which(is.nan(data))] <- 0

desFile <- createDesignFile(data.b)
factors <- c("suiVCtrl")

desFile$suiVCtrl <- factor(desFile$suiVCtrl,levels=c("Suicide","Control"))
setwd('/home/lukekrishna/Bachelour/R/QC-case-minRefe')
# factor <- c(as.factor("oneFactor"))
createQCPlots(data, factors = factors, Table = desFile)
# The size of the bars in the boxplot is significantly affected by whether or not the substraction of background has been performed

# NORMALISATION

data.norm.log <- normalizeBetweenArrays(data,   method = "quantile")
data.norm.ori <- normalizeBetweenArrays(data.b, method = "quantile")
setwd('/home/lukekrishna/Bachelour/R/QC-norm-case-minRefe')
createQCPlots(data.norm.log, factors = factors, Table = desFile)
maFun(data.norm.log, perGroup = FALSE, postfix = "NormalisedLog")

# setwd('/home/lukekrishna/Bachelour/R/QC-prun')
# data.prun <- hateDuplicatesV4(data.norm)
# maFun(data.prun, perGroup = FALSE, postfix = "pruned")
# createQCPlots(data.prun, factors = factor, postfix = "pruned")
# # THE BOXplots are not quite normal now. Normalise again?
# data.prun.norm <- normalizeBetweenArrays(data.prun, method = "quantile")
# maFun(data.prun.norm, perGroup = FALSE, postfix = "prunedNormalised")
# createQCPlots(data.prun.norm, factors = factor, postfix = "prunedNormalised")

rm(list = setdiff(ls(), c("data", "data.b", "data.norm.log", "data.norm.ori")))

save.image(paste(c("~/Bachelour/R/data-dW-res-suiVCtrl-caseMinRefe", as.character(Sys.Date()),".RData"), collapse = ''))

rm(list = ls())
#############################################################################################################


# PARTICU - CASE - avgREFESIGN
##############################################################################################################

# CREATE A SINGLE DATAFRAME
load("~/Bachelour/R/data-rdyForExtraction.RData")
source('~/Bachelour/R/myAvg.R')


avg <- myAvg (
  cbind(Slide_1_Suicide_Refe$Signal.Mean,
        Slide_2_Control_Refe$Signal.Mean,
        Slide_3_Control_Refe$Signal.Mean,
        Slide_4_Control_Refe$Signal.Mean,
        Slide_5_Control_Refe$Signal.Mean,
        Slide_6_Suicide_Refe$Signal.Mean,
        Slide_7_Suicide_Refe$Signal.Mean,
        Slide_8_Suicide_Refe$Signal.Mean)
)
data <- cbind(Slide_1_Suicide_Case$Signal.Mean - avg,
              Slide_2_Control_Case$Signal.Mean - avg,
              Slide_3_Control_Case$Signal.Mean - avg,
              Slide_4_Control_Case$Signal.Mean - avg,
              Slide_5_Control_Case$Signal.Mean - avg,
              Slide_6_Suicide_Case$Signal.Mean - avg,
              Slide_7_Suicide_Case$Signal.Mean - avg,
              Slide_8_Suicide_Case$Signal.Mean - avg)
rownames(data) <- Slide_1_Suicide_Case$newName
colnames(data) <- rev(listDatVars[which(grepl("Case", listDatVars))])


data.b <- data
data   <- log2(data)
data[which(is.nan(data))] <- 0

desFile <- createDesignFile(data.b)
factors <- c("suiVCtrl")

desFile$suiVCtrl <- factor(desFile$suiVCtrl,levels=c("Suicide","Control"))
setwd('/home/lukekrishna/Bachelour/R/QC-case-AVGminRefe')
# factor <- c(as.factor("oneFactor"))
createQCPlots(data, factors = factors, Table = desFile)
# The size of the bars in the boxplot is significantly affected by whether or not the substraction of background has been performed

# NORMALISATION

data.norm.log <- normalizeBetweenArrays(data,   method = "quantile")
data.norm.ori <- normalizeBetweenArrays(data.b, method = "quantile")
setwd('/home/lukekrishna/Bachelour/R/QC-norm-case-AVGminRefe')
createQCPlots(data.norm.log, factors = factors, Table = desFile)
maFun(data.norm.log, perGroup = FALSE, postfix = "NormalisedLog")

# setwd('/home/lukekrishna/Bachelour/R/QC-prun')
# data.prun <- hateDuplicatesV4(data.norm)
# maFun(data.prun, perGroup = FALSE, postfix = "pruned")
# createQCPlots(data.prun, factors = factor, postfix = "pruned")
# # THE BOXplots are not quite normal now. Normalise again?
# data.prun.norm <- normalizeBetweenArrays(data.prun, method = "quantile")
# maFun(data.prun.norm, perGroup = FALSE, postfix = "prunedNormalised")
# createQCPlots(data.prun.norm, factors = factor, postfix = "prunedNormalised")

rm(list = setdiff(ls(), c("data", "data.b", "data.norm.log", "data.norm.ori")))

save.image(paste(c("~/Bachelour/R/data-dW-res-suiVCtrl-avgSubstract", as.character(Sys.Date()),".RData"), collapse = ''))

rm(list = ls())
##############################################################################################################



# PARTICU - REFE ONLY
##############################################################################################################

# CREATE A SINGLE DATAFRAME
load("~/Bachelour/R/data-rdyForExtraction.RData")

data <- cbind(Slide_1_Suicide_Refe$Signal.Mean,
              Slide_2_Control_Refe$Signal.Mean,
              Slide_3_Control_Refe$Signal.Mean,
              Slide_4_Control_Refe$Signal.Mean,
              Slide_5_Control_Refe$Signal.Mean,
              Slide_6_Suicide_Refe$Signal.Mean,
              Slide_7_Suicide_Refe$Signal.Mean,
              Slide_8_Suicide_Refe$Signal.Mean)
rownames(data) <- Slide_1_Suicide_Refe$newName
colnames(data) <- rev(listDatVars[which(grepl("Refe", listDatVars))])


data.b <- data
data   <- log2(data)
data[which(is.nan(data))] <- 0

desFile <- createDesignFile(data.b)
factors <- c("caseVRef")

desFile$caseVRef <- factor(desFile$caseVRef,levels=c("Case","Refe"))
setwd('/home/lukekrishna/Bachelour/R/QC-caseVRef')
# factor <- c(as.factor("oneFactor"))
createQCPlots(data, factors = factors, Table = desFile)
# The size of the bars in the boxplot is significantly affected by whether or not the substraction of background has been performed

# NORMALISATION

data.norm.log <- normalizeBetweenArrays(data,   method = "quantile")
data.norm.ori <- normalizeBetweenArrays(data.b, method = "quantile")
setwd('/home/lukekrishna/Bachelour/R/QC-norm-caseVRef')
createQCPlots(data.norm.log, factors = factors, Table = desFile)
maFun(data.norm.log, perGroup = FALSE, postfix = "NormalisedLog")

# setwd('/home/lukekrishna/Bachelour/R/QC-prun')
# data.prun <- hateDuplicatesV4(data.norm)
# maFun(data.prun, perGroup = FALSE, postfix = "pruned")
# createQCPlots(data.prun, factors = factor, postfix = "pruned")
# # THE BOXplots are not quite normal now. Normalise again?
# data.prun.norm <- normalizeBetweenArrays(data.prun, method = "quantile")
# maFun(data.prun.norm, perGroup = FALSE, postfix = "prunedNormalised")
# createQCPlots(data.prun.norm, factors = factor, postfix = "prunedNormalised")

rm(list = setdiff(ls(), c("data", "data.b", "data.norm.log", "data.norm.ori")))

save.image(paste(c("~/Bachelour/R/data-dW-res-caseVRef-", as.character(Sys.Date()),".RData"), collapse = ''))

rm(list = ls())


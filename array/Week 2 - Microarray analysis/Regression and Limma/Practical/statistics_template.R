###GENERIC SETTINGS###

#clear workspace
rm(list=ls())

# set directory
base.dir <- "C:/Users/lars/Documents/bigcat/onderwijs 2018-2019/MSB1006/skills/skills 4- limma"
setwd(base.dir)

#define reload() function to simplify reloading the ArrayAnalysis.org based functions when modified
reload <- function() {
  source("functions_ArrayAnalysis_v2.R")
}
reload()


###DATA###

#read normalised data
dat <- read.delim("GCRMANormData_E-GEOD-7806_data_0.txt",row.names=1,as.is=TRUE)

#gene name and description are automatically added by ArrayAnalysis.org, but biomaRt connection may not always work
#check whether the annotation columns have been added, otherwise add them now
if(!"description"%in%colnames(dat)) {
  library(biomaRt)
  mart <- useMart("ensembl","hsapiens_gene_ensembl")
  #listAttributes(mart)
  ann <- getBM(c("ensembl_gene_id","external_gene_name","description"),mart=mart)
  #order ann to have Ensembl IDs in increasing order
  ann <- ann[order(ann$ensembl_gene_id),]
  rownames(ann) <- ann$ensembl_gene_id
  ann <- ann[,-1]
} else {
  #separate annotation from data
  ann <- dat[,c("external_gene_name","description")]
  #ann <- dat[,c("external_gene_id","description")]
  dat <- dat[,-((dim(dat)[2]-1):dim(dat)[2])]
}

#make a matrix out of dat
dat <- as.matrix(dat)


###EXPERIMENTAL DESCRIPTION###

#read experimental annotations
desc <- read.delim("Description_file_extended.txt",as.is=TRUE)
desc$FactorValue <- as.factor(desc$FactorValue)
desc$Time <- factor(desc$Time, levels=c("t30","t65","t18"))
desc$Treatment <- factor(desc$Treatment, levels=c("c","no","er_u","er"))

#replace FactorValue by Group as column names
colnames(desc)[3] <- "Group"

#create short sample names as row names
rownames(desc) <- desc$Name


###PRE-PROCESSING AND FILTERING

#replace colnames in dat by SampleNames from desc
#check whether they are in the same order before doing so
sum(gsub("X","",colnames(dat))!=desc$SourceName)==0 #FALSE
# --> reorder first
desc <- desc[match(gsub("X","",colnames(dat)),desc$SourceName),]
#replace long column names in dat by short ones
colnames(dat) <- rownames(desc)


#are there NAs in dat?
sum(is.na(dat)) #0 -> no

#what is the range of the data?
range(dat) # 0.4853306 13.9984800 -> log scale data; there are no negative values

#create a histogram of dat
png("hist.png",width=960,height=500)
hist(dat, breaks=200, col="gold")
abline(v=3,lty=2, col="blue")
dev.off()

#create a filtered object of expressed probes
#by selecting for an average expression over all samples of at least 3
datF <- dat[rowMeans(dat)>=3,]


###QC PLOTS

#setup the list of factor variables to create the plots for
factors <- c("Group","Time","Treatment")

#call function from ArrayAnalysis.org based scripts for unfiltered data
createQCPlots(dat, factors, desc, normMeth="GCRMA", postfix="unfilt")
maFun(dat, perGroup=FALSE, normMeth="GCRMA", postfix="unfilt")

#call function from ArrayAnalysis.org based scripts for filtered data
createQCPlots(datF, factors, desc, normMeth="GCRMA", postfix="filt")
maFun(datF, perGroup=FALSE, normMeth="GCRMA", postfix="filt")

# --> there don't seem to be any outliers/low quality samples
# --> nothing has to be removed


#########################
##statistical modelling##
#########################

#load limma library
library(limma)

#model design: take group_ as a fixed effect for an intercept model
design <- model.matrix(~Group,data=desc)
colnames(design) <- gsub("[()]","",colnames(design))
#colnames(design) <- gsub(":","_x_",colnames(design))

#fit model
fit <- lmFit(datF,design)
#fit <- lmFit(datF,design,block=individual_,correlation=corfit$consensus)
fit <- eBayes(fit)

#extract resulting statistics based on the model, and save those in tables
#also create histograms of p-values and fold changes
#topTable(fit, adjust.method="BH", coef=2, number=dim(datF)[1], resort.by="P")
#files <- saveStatOutput(design,fit,postfix="filt",annotation=ann)

#create summary table of the model results
#createPvalTab(files,postfix="filt",html=TRUE)

#build the (contrast) matrix to compute some group differences of interest based on the model parameters
cont.matrix <- makeContrasts(
  er_vs_no_30 = Grouper30 - Groupno30,
  er_vs_no_65 = Grouper65 - Groupno65,
  er_vs_no_18 = Grouper18 - Groupno18,
  er_vs_no_65_18 = (Grouper65 + Grouper18)/2 - (Groupno65 + Groupno18)/2,
  levels = colnames(design)
)
#compute the contrast fits
contrast.fit <- contrasts.fit(fit, cont.matrix)
contrast.fit <- eBayes(contrast.fit)

#extract resulting contrasts based on the model, and save those in a table; also save some graphical representations
files.c <- saveStatOutput(cont.matrix,contrast.fit,postfix="filt",annotation=ann)

#create summary table of the contrast results
createPvalTab(files.c,postfix="filt_c",html=TRUE)


###########################
##statistical modelling 2##
###########################

###now, pretend that the replicate number is a grouping variable (which is not the case in this data set!)

#create a factor variable for the replicate_numbers
replicate_numbers2 <- as.factor(paste("rep",unlist(lapply(strsplit(desc$SourceName,"_"),function(l) l[length(l)])),sep=""))

#estimate the extra correlation between paired measurements
corfit <- duplicateCorrelation(datF,design,block=replicate_numbers2)
corfit$consensus
# --> -0.03877641
# --> there is no extra correlation, but remember it was not really paired

#fit model
fit2 <- lmFit(datF,design,block=replicate_numbers2,correlation=corfit$consensus)
fit2 <- eBayes(fit2)

#extract resulting statistics based on the model, and save those in tables
#also create histograms of p-values and fold changes
#topTable(fit2, adjust.method="BH", coef=2, number=dim(datF)[1], resort.by="P")
#files2 <- saveStatOutput(design,fit2,postfix="filt_paired",annotation=ann)

#create summary table of the model results
#createPvalTab(files2,postfix="filt_paired",html=TRUE)

#compute the contrast fits
contrast.fit2 <- contrasts.fit(fit2, cont.matrix)
contrast.fit2 <- eBayes(contrast.fit2)

#extract resulting contrasts based on the model, and save those in a table; also save some graphical representations
files.c2 <- saveStatOutput(cont.matrix,contrast.fit2,postfix="filt_paired",annotation=ann)

#create summary table of the contrast results
createPvalTab(files.c2,postfix="filt_paired_c",html=TRUE)

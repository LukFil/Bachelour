# load required packages
require("DESeq2")
require("ggplot2")
require("pheatmap")

# Setup your working directory
WORK.DIR <- "C:/Users/lars/Documents/bigcat/onderwijs 2018-2019/MSB1006/skills/skills 5 - DESeq"
setwd(WORK.DIR)

# read the raw data table
dataFile <- "gene_counts.txt"
mRNAtot <- read.delim(dataFile, header=TRUE, row.names=1, sep="\t")


## Read the metadata table
samplekey <- read.table("Metadata.txt", header=TRUE, row.names=1, sep="\t")
samplekey$Compound <- relevel(samplekey$Compound,ref="DMSO")

## Start the statistical analysis made on the Compounds variable from the metadata file. You could change this by modifying the Compound by another field from Metadata
dds <- DESeqDataSetFromMatrix(countData = round(mRNAtot),
                                colData = samplekey,
                                design = ~ Compound)

dds<-DESeq(dds)

#plot the sizeFactors
plot(sizeFactors(dds),type="h",lwd=10,lend=1,ylim=c(0,max(sizeFactors(dds))),col="gold",xaxt="n",xlab="",ylab="",main="sizeFactors")
axis(1,at=1:dim(dds)[2],labels=colnames(dds),las=2,cex.axis=0.6)

# perform the normalization of the read count 
norm_data <- counts(dds,normalized=TRUE)	

## Set the pvalue to 0.05
res <- results(dds, alpha=0.05)

## extract the differentially expressed genes passing FDR multiple testing
DEmRNA_fdr <-  subset(res,res$padj < 0.05)

## extract the differentially expressed genes with pvalue below 0.05 (then passing FDR or not)
DEmRNA_all <-  subset(res,res$pvalue < 0.05)

# save the normalized count table: 
write.table(norm_data,file="norm_counts.txt", sep="/t", quote=FALSE)

# save the pvalue and fdr corrected value for each gene: 
write.table(res,file="DE_Analysis.txt", sep="/t", quote=FALSE)

# perform a PCA plot. You can change the condition assessed by the pca plot by changing the value between [] from 1 to 3 (corresponding to the column number of the metadata file)
rld <- rlog(dds)
plotPCA(rld,intgroup=c(colnames(samplekey)[1]), ntop=nrow(500))

# perform a heat Map:
norm_data_heatmap <- subset(norm_data, rownames(norm_data) %in% rownames(DEmRNA_fdr))
norm_data_heatmap <- norm_data_heatmap + 0.01
pheatmap(log2(norm_data_heatmap), show_rownames=FALSE)	

# Look for the normalized read count of a gene. You can freely change the ensembl ID to plot your gene of interest
gene_to_plot <- "ENSG00000100263"
gene_count <- subset(norm_data, rownames(norm_data) == gene_to_plot)
barplot(gene_count, las=2, cex.names = 0.6)

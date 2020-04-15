setwd('/home/lukekrishna/Bachelour/results/linksets')

mirDIP <- read.table("mirDIPlinkset.csv", skip = 1)
name   <- read.table("mirDIPlinkset.csv", nrows =  1)
colnames(mirDIP) <- unlist(name)
colnames(mirDIP) <- gsub("-", replacement = "_", x = colnames(mirDIP))
colnames(mirDIP) <- gsub("\\.", replacement = "_", x = colnames(mirDIP))
rm(list = "name")

write.csv(mirDIP, file = "mirDIP-dat-neo4j.csv")

mirTAR <- read.table("mirTARlinkset.csv", skip = 1)
name   <- read.table("mirTARlinkset.csv", nrows =  1)
colnames(mirTAR) <- unlist(name)
colnames(mirTAR) <- gsub("-", replacement = "_", x = colnames(mirTAR))
colnames(mirTAR) <- gsub("\\.", replacement = "_", x = colnames(mirTAR))
rm(list = "name")

write.csv(mirTAR, file = "mirTAR-dat-neo4j.csv")

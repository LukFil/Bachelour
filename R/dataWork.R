  # R Script for Lukas Filipcik's thesis

  # Produces datafiles in .RData format ready for statistical analysis and further processing

  rm(list = ls())

    library(gcrma)
    library(limma)
  
    source('~/Bachelour/R/functions_ArrayAnalysis_v2.R')
    source('~/Bachelour/R/hateDuplicates.R')
    source('~/Bachelour/R/createDict.R')
    source('~/Bachelour/R/reannotate.R')
    source('~/Bachelour/R/rmBG.R')
    source('~/Bachelour/R/createDesignFile.R')
  
  
    #
    setwd("/home/lukekrishna/Bachelour/data/oriData")
    datDescript <- read.delim("E-GEOD-34120.sdrf.txt", as.is = TRUE)
    # Apparently the description file contains a lot of duplicates, therefore it needs to be pruned to avoid
    # duplication of data
  
    prunDescri <- subset(datDescript, FactorValue..INDIVIDUAL. != 'not specified')
    if (length(prunDescri$Array.Data.File) == length(unique(prunDescri$Array.Data.File))) {
      
    } else {
      warning('at least one datafile has been omitted from the original spread!')
    } 
    # If the two numbers produced are equal, it means that no datafile was omitted from loading
  
  
    setwd("/home/lukekrishna/Bachelour/data/oriData/raw")
  
    # Load Gene Expression
    # Remvoe spaces from values to be used as variable names
    prunDescri$Comment..Sample_title.   <- gsub(" ", "_", prunDescri$Comment..Sample_title.)
    prunDescri$FactorValue..INDIVIDUAL. <- gsub(" ", "_", prunDescri$FactorValue..INDIVIDUAL.)
  
    status <- character()
    status[ which(grepl("Hy3", prunDescri$Array.Data.File))] <- "Case"
    status[-which(grepl("Hy3", prunDescri$Array.Data.File))] <- "Refe"
    prunDescri <- cbind(prunDescri, status)
  
    # Create list of variable names for the dataset
    listDatVars <- character()
    # Automatised loading of dataSets
    for (n in 1:length(prunDescri$Source.Name)){
      datString <- character()
  
      datString <- c(prunDescri$Comment..Sample_title.[n], "_", as.character(prunDescri$status[n]),
                     " <- read.delim(\"", prunDescri$Array.Data.File[n], "\", as.is = TRUE, sep = \"\t\", skip = 85)")
      datString <- parse(text = paste(datString, collapse =''), keep.source=FALSE)
      eval(datString)
  
      # Populate listDataVars with the appropriate names
      listDatVars[n] <- paste(c(prunDescri$Comment..Sample_title.[n], "_", as.character(prunDescri$status[n])), collapse = '')
    }
  
    # Data is loaded
    
    setwd("/home/lukekrishna/Bachelour/R")
    providedData <- as.data.frame(cbind(Slide_1_Suicide_Case$Gene.ID, Slide_1_Suicide_Case$Name))
    colnames(providedData) <- c("Reporter", "Name")
    providedData <- subset(providedData, subset = Reporter != "")
    uniqDict <- createDict("uniq", providedDataStatus = TRUE, providedData = providedData)
    trueDict <- createDict("true", providedDataStatus = TRUE, providedData = providedData)
  
    # QUALITY TEST: VIRTUAL IMAGES TO BE IMPLEMENTED
  
  
    # Step 1: Remove the last 2 lines of each dataset, and keep only the useful collumns
    #         Collumns kept: Gene.ID, Name, Flag, Signal.Mean, Background.Mean, Signal.Median
    #                        Background.Median, Background.Mode, Signal.Area, Background.Area,
    #                        Signal.Total, Signal.Stdev, Background.Stdev, Shape.Regularity
    #         Further features to be removed:
    #           NameLess probes
    #           Name == "Hy3" (manufacturer's instructions)
    #
  
    for (n in 1:length(listDatVars)){
      expString <- character()
      expHold   <- character()
  
      expHold   <- c(
        "
        for (j in 1) {",
          listDatVars[n], "<- subset(", listDatVars[n], ", Name    != \"\" & Name    != \"Hy3\" & Name != \"Empty\",
          select =  c(Gene.ID, Name, Flag, Signal.Mean, Background.Mean, Signal.Median,
          Background.Median, Background.Mode, Signal.Area, Background.Area, Signal.Total,
          Signal.Stdev, Background.Stdev, Shape.Regularity))
        }
        "
      )
  
      expString <- parse(text = paste(expHold, collapse = ''), keep.source = FALSE)
      eval(expString)
    }
  
    # Data is now cleaned up, and ready for reannotation
    # Use home-grown function reannotate()
  
    for (n in 1:length(listDatVars)){
      expString <- character()
      expHold   <- character()
  
      expHold   <- c(
        listDatVars[n], " <- reannotate(", listDatVars[n],", uniqDict)"
      )
      expString <- parse(text = paste(expHold, collapse = ''), keep.source = FALSE)
      eval(expString)
    }
    
    # REMOVE ALL ENTRIES WITH newName being EMPTY
    for (n in 1:length(listDatVars)){
      expString <- character()
      expHold   <- character()
  
      expHold   <- c(
        "
        for (j in 1) {",
        listDatVars[n], "<- subset(", listDatVars[n], ", newName    != \"\")
        }
        "
      )
  
      expString <- parse(text = paste(expHold, collapse = ''), keep.source = FALSE)
      eval(expString)
    }
  
    # SAVE STEP INBETWEEN
    save.image(paste(c("~/Bachelour/results/data-Before.RData"), collapse = ''))
  
    # KEEP ONLY THE VERSION WITH THE HIGHEST EXPRESSION FOR EACH miRNA
    # This is beacause that likely means it's best hybridised
    # SUBTRACT background from the signal
    for (n in 1:length(listDatVars)){
      expString <- character()
      expHold   <- character()
  
      expHold   <- c(
        "
        for (j in 1) {",
        listDatVars[n], "<- hateDuplicatesV5(", listDatVars[n], ", 340)","
        }
        "
      )
  
      expString <- parse(text = paste(expHold, collapse = ''), keep.source = FALSE)
      eval(expString)
    }
  
    for (n in 1:length(listDatVars)){
      expString <- character()
      expHold   <- character()
  
      expHold   <- c(
        "
        for (j in 1) {",
        listDatVars[n], "<- rmBG(", listDatVars[n], ")","
        }
        "
      )
  
      expString <- parse(text = paste(expHold, collapse = ''), keep.source = FALSE)
      eval(expString)
    }
  
    save.image(c("~/Bachelour/results/data-rdyForExtraction.RData"))

# newReadExi
# ADAPTED from ExiMiR package

newReadExi <- function(
                        txtfile.path= getwd(),
                        galname= NULL,
                        description = NULL,
                        notes = '',
                        rm.background = FALSE,
                        verbose=TRUE, 
                        annotFile
                      ){
  
  # Check if the path is a directory
  if (!file.info(txtfile.path)[['isdir']])
    stop('txtfile.path given as argument is not folder!')
  
  if (isTRUE(rm.background)) {
    if (isTRUE(verbose)) {
      cat("rm.background argument is not supported in ReadExi anymore. See NormiR function for background correction\n")
    }
  }
  
  # For backward compatibility (using the sampleinfo.txt)
  # List files in this directory
  filenames <- list.files(txtfile.path)
  
  # Look if there is a samplesinfo.txt file
  sampleInfoIndex = which(regexpr("samplesinfo.txt", filenames) !=-1)
  
  if (length(sampleInfoIndex) == 0) {
    sampleInfoIndex = which(regexpr("Samplesinfo.txt", filenames) !=-1)
    if (length(sampleInfoIndex) == 0) {
      stop("Error: File 'Samplesinfo.txt' or 'samplesinfo.txt' not found!")
    }
  }
  
  is.h <- TRUE
  targets <- readTargets( file.path(path.expand(txtfile.path),'/samplesinfo.txt'))
  if (!all(c("Cy3","Cy5")%in%colnames(targets))) {
    if (!all(c("Hy3","Hy5")%in%colnames(targets))) {
      stop("Hy3 (or Cy3) and/or Hy5 (or Cy5) columns labels not found in sampleinfo.txt file")	
    } else {
      is.h <- TRUE
    }
  } else {
    is.h <- FALSE
  }
  
  if (is.h) {
    files <- targets[,c("Hy3","Hy5")]
  } else {
    files <- targets[,c("Cy3","Cy5")]
  }
  RG <- read.maimages(files, source="imagene", verbose=verbose, path=txtfile.path)
  
  # Read just one file for getting the annotations in case gal is not provided
  if (is.null(galname)) {
    names <- read.annotation.fromfile(path=txtfile.path, files=files[[1]][1],refIDs=RG$genes$'Gene ID')
    RG$genes <- cbind(RG$genes, names)
  } else {
    galfile.info.found <- TRUE
    # Retrieve the gal.info in the env
    galfile.env.name <- paste("galname.envfile", sep="")      ## THIS WAS CHANGED FROM galname, ".envfile", because paste hates environments
    if (exists(galfile.env.name)) {
      galfile.env <- get(galfile.env.name)
      if (exists("galfile.info", envir = galfile.env)) {
        galfile.info <- get("galfile.info", envir = galfile.env)
        if (!is.null(galfile.info$path) && !is.null(galfile.info$filename)) {
          RG$genes <- subset(annotFile, select = c(Block, Column, Row, ID, Name))
          RG$printer <-  getLayout(RG$genes)
        } else {
          galfile.info.found <- FALSE
        }		
      } else {
        galfile.info.found <- FALSE				
      }
    } else {
      galfile.info.found <- FALSE	
    }
    if (!isTRUE(galfile.info.found)) {
      cat(paste("Warning: No environment found for GAL file info related to", galname,". Annotation from raw files is used.\n"))
      names <- read.annotation.fromfile(path=txtfile.path, files=files[[1]][1],refIDs=RG$genes$'Gene ID')
      head(RG$genes)
      RG$genes <- cbind(RG$genes, names)
      head(RG$genes)
    }
  }
  RG$source <- "exiqon"
  if (!is.null(galname)) {
    if (galfile.info.found) {
      ab <- newCreateAB(RG,notes,description,galname = galname,verbose = verbose,env.overwrite=FALSE, ref.channel='R')
    } else {
      ab <- newCreateAB(RG,notes,description,galname = galname,verbose = verbose,env.overwrite=TRUE, ref.channel='R')
    }
  } else {
    ab <- newCreateAB(RG,notes,description,galname = NULL, verbose = verbose, ref.channel='R')
  }
  if (verbose) {
    cat("done.\n")
  }
  return(ab)
  
  
  
  
}


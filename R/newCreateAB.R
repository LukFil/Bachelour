# File: createAB.R
# ADAPTED from ExiMir Package
# HEAVILY DEPRECIATED


#########################################################################################

newCreateAB <- function(object,
                     verbose=TRUE,
                     ref.channel = "R",
                     genes.block=NULL,
                     genes.row=NULL,
                     genes.col=NULL,
                     genes.id=NULL,
                     genes.name=NULL,
                     galname=NULL,
                     env.overwrite = TRUE,
                     ...) {
  if (class(object)!="RGList" && class(object)!="MAList" && class(object)!="List" && class(object)!="EListRaw") {
    stop(paste("Object of class",class(object),"not supported"))
  }
  
  if (is.null(object$genes)) {
    stop("No genes field in specified Limma List object ")
  }
  obj <- object
  if (class(object)=="MAList") {
    obj <- new("RGList")
    obj$R <- object$A  + object$M/2
    obj$G <- object$A  - object$M/2
    obj$genes <- object$genes
    if (!is.null(object$printer)) {
      obj$printer <- object$printer
    }
  }
  if (is.null(obj$source)) {
    obj$source <- "other"
  }
  
  if (!all(ref.channel%in%c("G","R"))) {
    stop(paste(" ref.channel:", ref.channel, "not supported, use either 'R' (default) or 'G'"))
  }
  
  gal.env.ready <- FALSE
  if (!is.null(galname)) {
    if (TRUE) {                                               ## CHANGED FROM exists(galname) because exists hates environments
      if (!isTRUE(env.overwrite)) {
        if (isTRUE(verbose)) {
          cat(paste("Using existing environment: galname\n")) ## CHANGED cannot coerce environments into other variables
        }
        gal.env.ready <- TRUE
        galenv <- galname
      } else {
        if (isTRUE(verbose)) {
          cat(paste("Warning: Overwritting galname environment\n")) ## CHANGED cannot coerce environments into other variables
        }
      }
    }
  } else {
    galname = paste("galenv.", obj$source,".", format(Sys.time(), "%Y%m%d%H%M%S"),round(runif(1)*1e3),sep="")
  }
  
  is.dual <- TRUE
  
  if (!all(c("R", "G")%in%(names(obj)))) {
    if (all(c("E")%in%names(obj))) {
      is.dual <- FALSE
    } else {
      stop("RGList or EListRaw object specified does not contain R,G or E fields")
    }
  }
  has.bg <- TRUE
  if (!any(c("Rb","Gb","Eb")%in%names(obj))) {
    has.bg <- FALSE
  }
  
  has.rowcols <- FALSE
  
  if (is.dual) {
    filenames <- unlist(strsplit(x=colnames(obj$G),fixed=TRUE,split="."))
    if (length(filenames) > length(colnames(obj))) {
      if (length(filenames) == length(colnames(obj))*4) {
        filenames <- filenames[seq(from=1, to=length(filenames), by=2)]
      }
    }
  } else {
    filenames <- colnames(obj$E)
  }
  
  # Preparing arguments for initializing Affybatch
  dots <- list(...)
  
  if (is.dual) {
    if (obj$source == 'imagene' || obj$source == 'exiqon') {
      evens <- filenames[seq(from=2, to=length(filenames),by=2)]
      odds <- filenames[seq(from=1, to=length(filenames),by=2)]
      colnames(obj$G) <- odds
      colnames(obj$R) <- evens
      if (has.bg) {
        colnames(obj$Gb) <- odds
        colnames(obj$Rb) <- evens
      }
    }
    else {
      colnames(obj$G) <- filenames
      colnames(obj$R) <- filenames
    }
  }
  
  # Check annotation
  gal.read <- FALSE
  
  if (all(c("Block","Column","Row","ID","Name")%in%colnames(obj$genes))) {
    # Exiqon or Agilent with annotation given by GAL file
    gal.read <- TRUE
    IDS <- obj$genes$ID
    GNAMES <- obj$genes$Name
    BLOCKS <- obj$gene$Block
    COLS <- obj$gene$Column
    ROWS <- obj$gene$Row
    has.rowcols <- TRUE
  } else if (all(c("Field","Column","Row")%in%colnames(obj$genes)))	{
    # Exiqon or Agilent with default genes field
    if (!all(c("Gene ID","names")%in%colnames(obj$genes))) {
      # names and id of genes missing in genes field
      stop("genes field of given object does not contain any annotation")
    }
    cat('Warning: GAL file has not been provided:\n')
    cat("This might cause some functionalities not to work properly (e.g. AffyBatch image).\n")
    IDS <- obj$genes$'Gene ID'
    GNAMES <- obj$genes$names
    BLOCKS <- as.integer(gsub(" ", "",gsub("[^[:digit:]]", " ", obj$gene$Field)))
    ROWS <- as.integer(obj$gene$Row)
    COLS <- as.integer(obj$gene$Column)
    has.rowcols <- TRUE
  } else if (all(c("Row","Col","ProbeUID","GeneName")%in%colnames(obj$genes))) {
    # Agilent chip
    IDS <- obj$genes$ProbeUID
    GNAMES <- obj$genes$GeneName
    BLOCKS <- rep(1,length(obj$gene$Row))
    COLS <- obj$gene$Col
    ROWS <- obj$gene$Row
    BLOCKS <- rep(1, length(ROWS))
    has.rowcols <- TRUE
    NROWS <- max(ROWS)
    NCOLS <- max(COLS)
  } else {
    if (is.null(genes.id) || is.null(genes.name)) {
      stop("Genes field mapping are missing.")
    } else {
      if (!all(c(genes.id,genes.name)%in%colnames(obj$genes))){
        stop("Specified genes field mapping are not found in the specified RGList or EList object")
      }
      if (is.null(genes.row) || is.null(genes.col)) {
        if (!is.dual) {
          COLS <- rep(1, nrow(obj$E))
          ROWS <- 1:(nrow(obj$E))	
        } else {
          COLS <- rep(1, nrow(obj$G))
          ROWS <- 1:(nrow(obj$G))
        }
      } else {
        ROWS <- obj$genes[genes.row]
        COLS <- obj$genes[genes.col]
        has.rowcols <- TRUE
      }
      NROWS <- max(ROWS)
      NCOLS <- max(COLS)
      IDS <- obj$genes[genes.id]
      IDS <- IDS[,1]
      GNAMES <- obj$genes[genes.name]
      GNAMES <- GNAMES[,1]
      
      if (is.null(genes.block)) {
        BLOCKS <- rep(1, length(ROWS))
      } else {
        BLOCKS <- obj$genes[genes.block]
      }
    }
  }
  
  # Check printer
  if (is.null(obj$printer) && has.rowcols) {
    cat("Printer is not defined. Assumes that Row index and Col index correspond to the physical coordinates on the chip\n")
  } else if (!has.rowcols) {
    cat("Rows, Cols are not given, image method of the AffyBatch object won't be supported\n")
  }
  
  if (is.null(obj$printer)) {
    perm.list <- NULL
  } else {
    perm.list <- list()
    if (gal.read | (obj$source != 'exiqon' & obj$source !='imagene')) {
      # Can use printer
      perm.list$block.row <- obj$printer$ngrid.r
      perm.list$block.col <- obj$printer$ngrid.c
    } else {
      perm.list$block.row <- 12 #TODO put modulo
      perm.list$block.col <- 4
    }
    bi <- (BLOCKS-1) %/% perm.list$block.col  + 1
    bj <- (BLOCKS-1) %% perm.list$block.col + 1
    NROWS <- obj$printer$nspot.r
    NCOLS <- obj$printer$nspot.c
    perm.list$rindex <- ROWS + (bi-1) * NROWS
    perm.list$cindex <- COLS + (bj-1) * NCOLS
    perm.list$vect <- vector()
    perm.list$vect <- perm.list$rindex + (perm.list$cindex-1) * max(perm.list$rindex)
  }
  annotation.struct <- list(IDS=IDS, GNAMES=GNAMES, BLOCKS=BLOCKS, COLS=COLS, ROWS=ROWS, NROWS=NROWS, NCOLS=NCOLS)
  if (!gal.env.ready) {
    galenv <- create.gal.env(galname, struct = annotation.struct, perm=perm.list)
  }
  
  # Create Affybacth matrix for permutation
  if (!is.null(perm.list)) {
    file.rep = FALSE
    if (obj$source != 'imagene' & obj$source != 'exiqon') {
      file.rep = TRUE
      mR.temp <- matrix(NA, max(perm.list$rindex), max(perm.list$cindex))
      mG.temp <- matrix(NA, max(perm.list$rindex), max(perm.list$cindex))
      mbgR.temp <- matrix(NA, max(perm.list$rindex), max(perm.list$cindex))
      mbgG.temp <- matrix(NA, max(perm.list$rindex), max(perm.list$cindex))
      signal <- matrix(NA, length(ROWS), length(filenames)*2)
      bg <- matrix(NA, length(ROWS), length(filenames)*2)
    } else {
      m.temp <- matrix(NA, max(perm.list$rindex), max(perm.list$cindex))
      mbg.temp <- matrix(NA, max(perm.list$rindex), max(perm.list$cindex))
      signal <- matrix(NA, length(ROWS), length(filenames))
      bg <- matrix(NA, length(ROWS), length(filenames))
    }
    
    
    for(i in 1:length(filenames)) {
      for(j in 1:length(ROWS)) {
        if (is.dual) {
          if (!file.rep) {
            if (i <= length(filenames)/2) {
              if (ref.channel=="G")
                m.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$G[j,i]
              else
                m.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$R[j,i]
              if (has.bg)
                if (ref.channel=="G")
                  mbg.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$Gb[j,i]
                else
                  mbg.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$Rb[j,i]
            } else {
              if (ref.channel=="G")
                m.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$R[j,i-length(filenames)/2]
              else
                m.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$G[j,i-length(filenames)/2]
              if (has.bg)
                if (ref.channel=="G")
                  mbg.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$Rb[j,i-length(filenames)/2]
                else
                  mbg.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$Gb[j,i-length(filenames)/2]
            }
          } else { # NON AGILENT/EXIQON
            if (ref.channel=="G") {
              mG.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$G[j,i]
              mR.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$R[j,i]
            } else {
              mG.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$R[j,i]
              mR.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$G[j,i]
            }
            if (has.bg)
              if (ref.channel=="G") {
                mbgG.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$Gb[j,i]
                mbgR.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$Rb[j,i]
              } else {
                mbgG.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$Rb[j,i]
                mbgR.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$Gb[j,i]
              }
          }
        } else {
          m.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$E[j,i]
          if (has.bg)
            mbg.temp[perm.list$rindex[j],perm.list$cindex[j]] <- obj$Eb[j,i]
        }
      }
      #m.temp <- m.temp[,rev(1:max(perm.env$cindex))]
      if (file.rep) {
        mbgG.temp <- mbgG.temp[,(1:max(perm.list$cindex))]
        mbgR.temp <- mbgR.temp[,(1:max(perm.list$cindex))]
        signal[,i] <- as.vector(mG.temp)
        signal[,i+length(filenames)] <- as.vector(mR.temp)
      } else {
        m.temp <- m.temp[,(1:max(perm.list$cindex))]
        signal[,i] <- as.vector(m.temp)
      }
      if (has.bg) {
        if (file.rep) {
          mbgR.temp <- mbgR.temp[,(1:max(perm.list$cindex))]
          mbgG.temp <- mbgG.temp[,(1:max(perm.list$cindex))]
          bg[,i] <- as.vector(mbgG.temp)
          bg[,i+length(filenames)/2] <- as.vector(mbgR.temp)
        } else {
          mbg.temp <- mbg.temp[,(1:max(perm.list$cindex))]
          bg[,i] <- as.vector(mbg.temp)
        }
      }	
    }
  } else {
    if (has.bg)
      min.sig <- min(obj$Eb)
    else
      min.sig <- min(obj$E)
    signal <- matrix(min.sig,NROWS*NCOLS, length(filenames))
    bg <- matrix(min.sig, NROWS*NCOLS, length(filenames))
    msig <- matrix(min.sig, NROWS , NCOLS)
    mbg <-  matrix(min.sig, NROWS , NCOLS)
    for(j in 1:length(filenames)) {
      if (!is.dual) {
        for(i in 1:length(ROWS)) {
          msig[ROWS[i],COLS[i]] <- obj$E[i,j]
          if (has.bg)
            mbg[ROWS[i],COLS[i]] <- obj$Eb[i,j]
        }
      } else {
        if (j <= length(filenames)/2) {
          if (ref.channel=="G")
            msig[ROWS[i],COLS[i]] <- obj$G[i,j]
          else
            msig[ROWS[i],COLS[i]] <- obj$R[i,j]
          if (has.bg)
            if (ref.channel=="G")
              mbg[ROWS[i],COLS[i]] <- obj$Gb[i,j]
            else
              mbg[ROWS[i],COLS[i]] <- obj$Rb[i,j]
        } else {
          if (ref.channel=="G")
            msig[ROWS[i],COLS[i]] <- obj$R[i,j]
          else
            msig[ROWS[i],COLS[i]] <- obj$G[i,j]
          if (has.bg)
            if (ref.channel=="G")
              mbg[ROWS[i],COLS[i]] <- obj$Rb[i,j]
            else
              mbg[ROWS[i],COLS[i]] <- obj$Gb[i,j]
        }
      }
      signal[,j] <- as.vector(msig)
      bg[,j] <- as.vector(mbg)
    }
  }
  if (isTRUE(verbose))
    cat(paste("instantiating an AffyBatch (exprs matrix dimensions is", length(ROWS), "x", length(filenames), ")\n"))
  
  dots <- list(...)
  
  if (!"experimentData" %in% names(dots)) {
    experimentData <- new("MIAME")
  }
  if ("description" %in% names(dots)) {
    warning("use 'experimentData' rather than 'description' for experiment description")
  }
  if ("notes" %in% names(dots)) {
    ## warning("addding 'notes' to 'experimentData'")
    notes(experimentData) <- c(notes(experimentData), dots[["notes"]])
  }
  
  if (is.dual) {
    if (file.rep) {
      fnG <- paste(filenames,'_G', sep='')
      fnR <- paste(filenames,'_R', sep='')
      if (ref.channel=="G") {
        filenames <- c(fnG, fnR)
      } else {
        filenames <- c(fnR, fnG)
      }
      pdata <- data.frame(sample=1:length(filenames), row.names=filenames)
    } else {
      pdata <- data.frame(sample=1:length(filenames), row.names=c(filenames[seq(from=1,
                                                                                to=length(filenames),by=2)],filenames[seq(from=2, to=length(filenames),by=2)]))
    }
  } else {
    pdata <- data.frame(sample=1:length(filenames), row.names=filenames)
  }
  
  if (!"phenoData" %in% names(dots)) {
    phenoData <- new("AnnotatedDataFrame",
                     data=pdata,
                     varMetadata=data.frame(
                       labelDescription="arbitrary numbering",
                       row.names="sample"))
  } else {
    phenoData <- dots[["phenoData"]] 
    pData(phenoData) <- pdata
  }
  
  if (!"featureData" %in% names(dots)) {
    featureData = new("AnnotatedDataFrame")
  } else {
    featureData = dots[["featureData"]]
  }
  
  if (!"protocolData" %in% names(dots)) {
    protocolData = phenoData[,integer(0)]
  } else {
    protocolData = dots[["protocolData"]]
  }
  
  #notes(experimentData)$ExiMiR.channel <- c(notes(experimentData), "Created by ExiMiR")
  if (is.dual)
    notes(experimentData)$ExiMiR.channel <-  "Dual channel"
  else
    notes(experimentData)$ExiMiR.channel <- "Single channel"
  if (has.bg)
    notes(experimentData)$ExiMiR.bg <- "Contains background"
  else
    notes(experimentData)$ExiMiR.bg <- "No background"
  
  
  # Add a tag in notes slot
  if (obj$source == "imagene" || obj$source == "exiqon") {
    ab <- new("AffyBatch",
              exprs =signal,
              se.exprs = bg,
              cdfName = "galname",
              phenoData = phenoData,
              nrow = nrow(m.temp),
              ncol = ncol(m.temp),
              annotation = "galname",
              protocolData = protocolData,
              experimentData = experimentData)
  } else if (obj$source == 'genepix') {
    ab <- new("AffyBatch",
              exprs =signal,
              se.exprs = bg,
              cdfName = "galname",
              phenoData = phenoData,
              nrow = nrow(mG.temp),
              ncol = ncol(mR.temp),
              annotation = "galname",
              protocolData = protocolData,
              experimentData = experimentData)
  } else {
    ab <- new("AffyBatch",
              exprs =signal,
              se.exprs = bg,
              cdfName = "galname",
              phenoData = phenoData,
              nrow = NROWS,
              ncol = NCOLS,
              annotation = "galname",
              protocolData = protocolData,
              experimentData = experimentData)
  }
  return(ab)
}


get.bg.ab <- function(x, signature="AffyBacth") {
  ab <- new("AffyBatch",
            exprs =se.exprs(x),
            se.exprs = exprs(x),
            cdfName = cdfName(x),
            phenoData = phenoData(x),
            nrow = nrow(x),
            ncol = ncol(x),
            annotation = annotation(x),
            protocolData = protocolData(x),
            description= description(x),
            notes = notes(x))
  #nrows <- nrow(exprs(ab)) / 2
  #ncols <- ncol(exprs(ab)) 
  #exprs(ab) <- exprs(x)[(nrows+1):(nrows*2),]
  #se.exprs(ab) <- exprs(x)[(nrows+1):(nrows*2),]
  return(ab)
}


bg.image <- function(x, signature="AffyBacth") {
  image(x,type="se.exprs" )
}

bg.hist <- function(x, signature="AffyBacth") {
  ab <- get.bg.ab(x)
  hist(ab)
}

bg.boxplot <- function(x,signature="AffyBacth") {
  ab <- get.bg.ab(x)
  boxplot(ab)
}







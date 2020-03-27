## NEW make.gal.env
#  Adapted from ExiMIR


newMakeGalEnv <- function (df, filename = "filename" ,galname = "galname", gal.path = ""){
  source('~/Bachelour/bullShit/ExiMiR/R/make.gal.env.R')
  
  
  printer <-  getLayout(df)
  IDS <- df$ID
  GNAMES <- df$Name
  BLOCKS <- df$Block
  COLS <- df$Column
  ROWS <- df$Row
  
  perm.list <- list()
  perm.list$block.row <- printer$ngrid.r
  perm.list$block.col <- printer$ngrid.c
  bi <- (BLOCKS-1) %/% perm.list$block.col  + 1
  bj <- (BLOCKS-1) %% perm.list$block.col + 1
  NROWS <- printer$nspot.r
  NCOLS <- printer$nspot.c
  perm.list$rindex <- ROWS + (bi-1) * NROWS
  perm.list$cindex <- COLS + (bj-1) * NCOLS
  perm.list$vect <- vector()
  perm.list$vect <- perm.list$rindex + (perm.list$cindex-1) * max(perm.list$rindex)
  
  annotation.struct <- list(IDS=IDS, GNAMES=GNAMES, BLOCKS=BLOCKS, COLS=COLS, ROWS=ROWS, NROWS=NROWS, NCOLS=NCOLS)
  # if (isTRUE(verbose)) {
  #   cat(paste("Creating environment using name:", galname,"\n"))
  # }	
  create.gal.env(galname = galname, struct=annotation.struct, perm=perm.list)
  
  galfile.env <- new.env(hash=TRUE, parent=emptyenv())
  galfile.env.name <- paste(galname,".envfile", sep="")
  galfile.list <- list(path=gal.path, filename=filename)
  assign("galfile.info", galfile.list, galfile.env)
  assign(galfile.env.name, galfile.env, envir=globalenv())
}
getBlockLayout <- function(datAnnotOld){
  # LIMMA getLayout requires a single BLOCK collumn - so we're going to create it
  
  Block <- integer()
  for (n in 1:length(datAnnotOld$Block.Row)) {
    # Block[n] <- as.integer(paste(c(datAnnotOld$Block.Column[n],datAnnotOld$Block.Row[n]), collapse = ''))
    if (datAnnotOld$Block.Column[n] == 1){
      Block[n] <- as.integer(datAnnotOld$Block.Row[n])
    }
    else if(datAnnotOld$Block.Column[n] == 2){
      Block[n] <- as.integer(datAnnotOld$Block.Row[n]) + 8
    }
    else if(datAnnotOld$Block.Column[n] == 3){
      Block[n] <- as.integer(datAnnotOld$Block.Row[n]) + 16
    }
    else if(datAnnotOld$Block.Column[n] == 4){
      Block[n] <- as.integer(datAnnotOld$Block.Row[n]) + 24
    }
    
  }
  
  return (Block)
}
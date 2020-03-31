# Functions developed to remove duplicates from the dataset. V5 and V$ are working, on a different formatting of datasets

# Remove duplicates from the format before putting the signal values together, 
# Considers the background value and discards values that have values that far on the lower edge of the normal distribution
# which later allows to consider background area as a trustworthy value
hateDuplicatesV5 <- function(data, lessThan = 340){
  # Internal assistant functions
  hasBeenAdressed <- function(){
    # Has the miRNA been adressed already?
    val = FALSE
    if (length(outDF) == 0){
      # val is already FALSE, no need to change values
    } else if (sum(outDF %in% listOfmiR[n])){
      val = TRUE
    } else{
      # val is already FALSE
    }
    return(val)
  }
  whereBGALess <- function(data, lessThan = 340){
    var <- integer()
    
    for (n in 1:length(data$Background.Area)){
      if (data$Background.Area[n] > lessThan) {
        var[n] <- 1
      }
      else {
        var[n] <- 0
      }
    }
    return(var)
  }
  
  
  # BODY of the function itself
  listOfmiRB<- unique(data$Name)
  BGless    <- whereBGALess(data, lessThan)
  
  
  listOfmiR <- unique(data$Name)
  outDF     <- data[0, ]
  holdRow   <- integer()
  tempDF    <- data.frame()
  
  for(n in 1:length(listOfmiR)){
    if (listOfmiR[n] != listOfmiRB[n]){
      warning(c("A Whole MIRNA has been lost due to removal of low-background area entries! That miR being", listOfmiRB[n]))
    }
  }
  
  for (n in 1:length(listOfmiR)) {
    if (!hasBeenAdressed()){
      tempDF  <- subset(data, data$Name == listOfmiR[n])
      holdRow <- tempDF[which.max(tempDF$Signal.Mean), ]
      
      outDF              <- rbind(outDF, holdRow)
      rownames(outDF)[n] <- listOfmiR[n]
      holdRow <- integer()
      tempDF  <- data.frame()
    }
  }
  
  return (outDF)
}




# THIS ONE FUNCTIONS PROPERLY ON A data.frame WHICH HAS COLUMNS OF NUMERICAL VALUES, all SIGNAL. 
hateDuplicatesV4 <- function(data){
  # Internal assistant functions
  hasBeenAdressed <- function(){
    # Has the miRNA been adressed already?
    val = FALSE
    if (length(outDF) == 0){
      # val is already FALSE, no need to change values
    } else if (sum(outDF %in% listOfmiR[n])){
      val = TRUE
    } else{
      # val is already FALSE
    }
    return(val)
  }
  # THIS ONE IS SUPPOSED TO WORK ON A MULTIPLE-ARRAY MATRIX WITH ROWNAMES BEING THE miRNA IDENTIFIERS
  
  listOfmiR <- unique(rownames(data))
  outDF     <- data[0, ]
  holdRow   <- integer()
  tempDF    <- data.frame()
  
  for (n in 1:length(listOfmiR)) {
    if (!hasBeenAdressed()){
      tempDF = subset(data, rownames(data) == listOfmiR[n])
      
      for (m in 1:ncol(tempDF)) {
        holdRow[m] <- max(tempDF[, m])
      }
      outDF <- rbind(outDF, holdRow)
      rownames(outDF)[n] <- listOfmiR[n]
      holdRow <- integer()
      tempDF  <- data.frame()
    }
  }
  
  return (outDF)
  
  
}


hateDuplicatesV3 <- function(data){
  outDF   <- data.frame() 
  rowsVar <- rownames(data)
  
  colnames(outDF) <- colnames(data)
  
  
  for (n in length(data$Gene.ID)) {
    if (x()){
      
    }
  }
  
  #
  # Internal assistant functions
  x <- function(){
    
    val = FALSE
    if (length(outDF) == 0){
      # val is already FALSE, no need to change values
    }
    else{
      isContained <- unique(listID %in% data$Gene.ID[n])
      if (isContained[1] == TRUE | isContained[length(isContained)] == TRUE){
        val <- TRUE
      }
    }
    return(val)
  }
}





hateDuplicatesV2 <- function(data){
  # Integrated function to determine if an element is already adressed
  x <- function(){
    
    val = FALSE
    if (length(listID) == 0){
      # val is already FALSE, no need to change values
    }
    else{
      isContained <- unique(listID %in% data$Gene.ID[n])
      if (isContained[1] == TRUE | isContained[length(isContained)] == TRUE){
        val <- TRUE
      }
    }
    return(val)
  }
  
  # 
  cnt     <- 0
  holdSet <- integer()
  holdCol <- integer()
  listID  <- integer()
  listSD  <- integer()
  listAvg <- integer()
  for (n in 1:length(data$Gene.ID)){
    found <- integer()
    
    if (x()){
      # pos <- 1
      # for (m in 1:length(data$Gene.ID)) {
      #   if (data$Gene.ID[n] == data$Gene.ID[m]) {
      #     print(c("m: ", m))
      #     holdCol[n, pos]  <-  data$Signal.Mean[m]
      #     pos <- pos + 1
      #   }
      # }
    }
    else{
      
      # print(n)
      listID[length(listID) + 1] <-  apply(X      = data,
                                           MARGIN = c(which(data$Gene.ID %in% data$Gene.ID[n]), data$Signal.Mean),
                                           FUN    = mean 
                                          )
    }
  }
  
  print(listID)
}


hateDuplicates <- function(data){
  
  # Find duplicates
  x <- function(){
    
    val = FALSE
    if (length(listID) == 0){
      # val is already FALSE, no need to change values
    }
    else{
      isContained <- unique(listID %in% data$Gene.ID[n])
      if (isContained[1] == TRUE | isContained[length(isContained)] == TRUE){
        val <- TRUE
      }
    }
    return(val)
  }
  
  cnt     <- 0
  holdSet <- integer()
  holdCol <- integer()
  listID  <- integer()
  listSD  <- integer()
  listAvg <- integer()
  # :length(data$Gene.ID)
  for (n in 1:220){
    # print(length(data$Gene.ID))
    if (x()){
      match  <- which(data$Gene.ID %in% data$Gene.ID[n])
      tempH  <- integer()
      for (j in length(match)) {
        tempH[j] <- data$Signal.Mean[match[j]]
      }
      locusCore  <- which(listID %in% data$Gene.ID[n])
      listAvg[locusCore] <- mean(tempH)
      listSD[locusCore]  <-   sd(tempH)
      # holdCol[n] <- data$Signal.Mean[n]
      # holdSet[n] <- cnt
    }
    else{
      cnt        <- cnt + 1
      holdCol[n] <- data$Signal.Mean[n]
      holdSet[n] <- cnt
      listID[length(listID) + 1] <- data$Gene.ID[n] # This functions as intended
    }
  }
  
  # for (n in 1:cnt){
  #   listAvg <- mean(holdCol[which(holdSet %in% n)])
  #   listSD  <-   sd(holdCol[which(holdSet %in% n)])
  # # }
  # print(c("hold set is: ", holdSet))
  # print(c("hold col is: ", holdCol))
  return(cbind(listID, listAvg, listSD))
}

averageSpike <- function (data, signalList, spike){
  # Data: contains $Name and $
  # signal - median or mean, make it versatile
  #   print(spike)
  indices <- which(data$Name %in% spike)
  holdCol <- integer()
  for (n in 1:length(indices)){
    holdCol[n] <- signalList[indices[n]]
    # warning(signalList[indices[n]])
  }
  
  retVal <- mean(holdCol)
}
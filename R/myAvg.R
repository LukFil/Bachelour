myAvg <- function (data){
  outData <- integer()
  
  for (n in 1:length(data[, 1])){
    outData[n] <- mean(data[n, ])
  }
  
  return(outData)
}
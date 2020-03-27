getFC <- function(dataCond, dataCtrl){
  # Required characteristics of input
  
  # Characteristics of output
  FCmedian  <- number()
  FCmean    <- number()
  for (n in 1:length(dataCond$newName)){
    FCmedian[n] <- calcFC(dataCtrl$Signal.Median, dataCtrl$Signal.Area, dataCtrl$Background.Median, dataCtrl$Background.Area,
                          dataCond$Signal.Median, dataCond$Signal.Area, dataCond$Background.Median, dataCond$Background.Area)
    FCmean[n]   <- calcFC(dataCtrl$Signal.Mean, dataCtrl$Signal.Area, dataCtrl$Background.Mean, dataCtrl$Background.Area,
                          dataCond$Signal.Mean, dataCond$Signal.Area, dataCond$Background.Mean, dataCond$Background.Area)
  }
  
  output <- cbind(FCmedian, FCmean)
}

calcFC <- function(signalCtrl, signalAreaCtrl, backgroundCtrl, backgroundAreaCtrl,
                   signalCond, signalAreaCond, backgroundCond, backgroundAreaCond){
  # Required characteristics of input
  #   signalCtrl, signalAreaCtrl, backgroundCtrl, backgroundAreaCtrl
  #   signalCond, signalAreaCond, backgroundCond, backgroundAreaCond
  
  # Characteristics of output
  
  output <- number()
  output <- (
    ((signalCond / signalAreaCond) - (backgroundCond / backgroundAreaCond)) - ((signalCtrl / signalAreaCtrl) - (backgroundCtrl / backgroundAreaCtrl))
  )
}
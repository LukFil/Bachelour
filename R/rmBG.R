rmBG <- function(data){
  dataOut   <- data
  
  dataOut$Signal.Mean <- data$Signal.Mean - ((data$Background.Mean / data$Background.Area) * data$Signal.Area)
  # dataOut$Signal.Mean <- dataOut$Signal.Mean - dataOut$Background.Mean
  return (dataOut)
}
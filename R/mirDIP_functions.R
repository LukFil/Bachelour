  source('~/Bachelour/R/addFactorLevel.R')
  source('~/Bachelour/R/mirDIP_API.R')
  
  formatForMirDIP <- function(array){
    outArray <- character()
    for (n in 1:length(array)) {
      outArray <- paste(c(outArray,", ", as.character(array[n])), collapse = '')
    } 
    outArray <- sub(", ", "", outArray)
    return(outArray)
  }

  confusedStringIntoTibble <- function(character){
    require(tidyverse, quietly = TRUE)
    
    tbByRows <- map(character, function(x){
      tibble(text = unlist(str_split(x, pattern = "\\n")))
    })
    
    names <- unlist(str_split(tbByRows[[1]]$text[1], "\\t"))
    finDF <- data.frame(matrix(NA, nrow = length(tbByRows[[1]]$text) - 1, ncol = length(names)))
    colnames(finDF) <- names
    for (n in 1:length(tbByRows[[1]]$text)-1) {
      vectOfSplit <- character()
      vectOfSplit <- unlist(str_split(tbByRows[[1]]$text[n + 1], "\\t"))

      # finDF[n] <- addFactorLevel(finDF, vectOfSplit)      
      for (m in 1:length(vectOfSplit)) {
        finDF[n, m] <- addFactorLevel(finDF[n, m], vectOfSplit[m])
        finDF[n, m] <- vectOfSplit[m]
      }
      # finDF <- rbind(finDF, unlist(str_split(tbByRows[[1]]$text[n], "\\t"))))
      # finDF <- rbind(finDF, addFactorLevel(findDF[1:length], newLevel = unlist(str_split(tbByRows[[1]]$text[n], "\\t"))))
    }
    finDF <- finDF[-c(length(finDF[, 1])), ]
    return(finDF)
  }
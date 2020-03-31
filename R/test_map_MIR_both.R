# MAP miRNA wth MirTarBase and mirDIP

rm(list = ls())

source('~/Bachelour/R/mirTarBase_functions.R')
source('~/Bachelour/R/getPrunedList.R')

library(tidyverse)

setwd('/home/lukekrishna/Bachelour/result/resMap')

for (n in 1:6){
  list    <- getPrunedList(choice = n)
  result  <- mapMirTarBase(list)
  
  for (m in 1:length(result)) {
    write.table(result[[m]], file = paste(c("miRTarBase-Res-N", n, "M", m), collapse = ''))
  }
}
    


start <- as.character(unlist(list_map[["results"]]))

dat <- map(start, function(x){
  tibble(text = unlist(str_split(x, pattern = "\\n"))) %>% rowid_to_column(var = "line")
})

hold <- bind_rows(dat, .id = "page") %>% select(page, line, text)

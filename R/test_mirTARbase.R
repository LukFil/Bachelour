# TEST mirTARBase

rm(list = ls())

require(tidyverse)

source('~/Bachelour/R/mirTarBase_functions.R')
source('~/Bachelour/R/getPrunedList.R')

list <- getPrunedList(4)

hold <- list[[1]][1:10, ]


result <- lookAndMapMirTarBase(miRNAdf = hold, mTBase = getMirTarBase())
# getMirTarBase() %>% lookAndMapMirTarBase(miRNAdf = hold) %>% result
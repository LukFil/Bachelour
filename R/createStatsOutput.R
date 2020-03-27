# EXE Script
rm(list = ls())
source('~/Bachelour/R/statWork.R')

# to produce whole library of statistics outputs, of all possible permutations of the data

# Data includes both cases and references
statWork(datPath = '/home/lukekrishna/Bachelour/R',
         datFile = 'data-dW-res-both-2020-03-17.RData',
         outPath = '/home/lukekrishna/Bachelour/R/stats/stats-both')

# Data requires clarification (probably only references agaisnt each other?)
statWork(datPath = '/home/lukekrishna/Bachelour/R',
         datFile = 'data-dW-res-caseVRef-2020-03-17.RData',
         outPath = '/home/lukekrishna/Bachelour/R/stats/stats-caseVRef')

# Data includes only CASEs, suicide v Control
statWork(datPath = '/home/lukekrishna/Bachelour/R',
         datFile = 'data-dW-res-suiVCtrl-2020-03-19.RData',
         outPath = '/home/lukekrishna/Bachelour/R/stats/stats-suiVCtrl')

# Data includes CASEs with values of averaged references substracted
statWork(datPath = '/home/lukekrishna/Bachelour/R',
         datFile = 'data-dW-res-suiVCtrl-avgSubstract2020-03-17.RData',
         outPath = '/home/lukekrishna/Bachelour/R/stats/stats-case-minAvgRefe')

# Data includes CASEs with particular references substracted
statWork(datPath = '/home/lukekrishna/Bachelour/R',
         datFile = 'data-dW-res-suiVCtrl-caseMinRefe2020-03-17.RData',
         outPath = '/home/lukekrishna/Bachelour/R/stats/stats-case-minRefe')

# Data includes CASEs only, with Control substracted from Suicide
statWork(datPath = '/home/lukekrishna/Bachelour/R',
         datFile = 'data-dW-res-suiVCtrl-substr-2020-03-22.RData',
         outPath = '/home/lukekrishna/Bachelour/R/stats/stats-suiVCtrl-substr',
         coef    = NULL)
  
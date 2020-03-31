# EXE Script
rm(list = ls())
source('~/Bachelour/R/statWork.R')

# to produce whole library of statistics outputs, of all possible permutations of the data

# Data includes both cases and references
statWork(datPath = '/home/lukekrishna/Bachelour/results',
         datFile = 'data-dW-res-both-2020-03-30.RData',
         outPath = '/home/lukekrishna/Bachelour/results/stats/stats-both')

# Data requires clarification (probably only references agaisnt each other?)
statWork(datPath = '/home/lukekrishna/Bachelour/results',
         datFile = 'data-dW-res-caseVRef-2020-03-30.RData',
         outPath = '/home/lukekrishna/Bachelour/results/stats/stats-caseVRef')

# Data includes only CASEs, suicide v Control
statWork(datPath = '/home/lukekrishna/Bachelour/results',
         datFile = 'data-dW-res-suiVCtrl-2020-03-30.RData',
         outPath = '/home/lukekrishna/Bachelour/results/stats/stats-suiVCtrl')

# Data includes CASEs with values of averaged references substracted
statWork(datPath = '/home/lukekrishna/Bachelour/results',
         datFile = 'data-dW-res-suiVCtrl-avgSubstract2020-03-30.RData',
         outPath = '/home/lukekrishna/Bachelour/results/stats/stats-case-minAvgRefe')

# Data includes CASEs with particular references substracted
statWork(datPath = '/home/lukekrishna/Bachelour/results',
         datFile = 'data-dW-res-suiVCtrl-caseMinRefe2020-03-30.RData',
         outPath = '/home/lukekrishna/Bachelour/results/stats/stats-case-minRefe')

# Data includes CASEs only, with Control substracted from Suicide
statWork(datPath = '/home/lukekrishna/Bachelour/results',
         datFile = 'data-dW-res-suiVCtrl-substr-2020-03-30.RData',
         outPath = '/home/lukekrishna/Bachelour/results/stats/stats-suiVCtrl-substr',
         coef    = NULL)
  
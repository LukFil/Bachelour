addFactorLevel <- function (fac, newLevel){
  if(is.factor(fac)) return(factor(fac, levels = c(levels(fac), newLevel)))
  return(fac)
}
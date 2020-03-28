# Provide a factor which is to be extended, and a level by whoich it is to be extended

addFactorLevel <- function (fac, newLevel){
  if(is.factor(fac)) return(factor(fac, levels = c(levels(fac), newLevel)))
  return(fac)
}
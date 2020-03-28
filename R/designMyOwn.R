# Similiar to createDesignFile it is a recreation of functions that weren't' willing to play nice with 
# this dataformat. Created a custom, non-generalisable function specifically for this dataset. Return 
# a binary array representing the groupings of groups within the datasets

designMyOwn <- function(desc){
  getSize   <- length(desc[ , 1])
  intercept <- ones(getSize, 1)
  caseSuic  <- integer()
  caseCtrl  <- integer()
  refeSuic  <- integer()
  refeCtrl  <- integer()
  
  for (n in 1:getSize){
    caseSuic[n] <- 0
    caseCtrl[n] <- 0
    refeSuic[n] <- 0
    refeCtrl[n] <- 0
    
    if (desc$caseVRef[n] == "Case" & 
        desc$suiVCtrl[n] == "Suicide"){
      caseSuic[n] <- 1
    }
    if (desc$caseVRef[n] == "Case" & 
        desc$suiVCtrl[n] == "Control"){
      caseCtrl[n] <- 1
    }
    if (desc$caseVRef[n] == "Refe" & 
        desc$suiVCtrl[n] == "Suicide"){
      refeSuic[n] <- 1
    }
    if (desc$caseVRef[n] == "Refe" & 
        desc$suiVCtrl[n] == "Control"){
      refeCtrl[n] <- 1
    }
  }
  
  if (sum(caseSuic) == 0) {  caseSuic <- integer() }
  if (sum(caseCtrl) == 0) {  caseCtrl <- integer() }
  if (sum(refeSuic) == 0) {  refeSuic <- integer() }
  if (sum(refeCtrl) == 0) {  refeCtrl <- integer() }
  
  return(cbind(caseSuic, caseCtrl, refeSuic, refeCtrl))
}
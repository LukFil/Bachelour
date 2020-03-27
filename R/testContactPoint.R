# How is the annotation proces supposed to be executed

isMember = character()

for (n in 1:length(datRaw01$Name)){
  if (datRaw01$Name[n] %in% trueDict$miRBase12){
    isMember[n] = "FOUND"
  }
  else{
    isMember[n] = "notFOUND"
  }
}
unique(isMember)


isMemberID = character()

for (n in 1:length(datRaw01$Gene.ID)){
  if (datRaw01$Gene.ID[n] %in% trueDict$Reporter){
    isMemberID[n] = "FOUND"
  }
  else{
    isMemberID[n] = "notFOUND"
  }
}
unique(isMemberID)
indOfNotPresentTrue <- which(isMemberID %in% "notFOUND")

# These tests inform us that in order to properly map our miRNA, we need to use ID-Reporter matching, rather than Name-Name matching

# Coverage of full dictonary vs the coverage of truened (pruned) dictonary is compared

isMemberIDrefi = character()

for (n in 1:length(datRaw01$Gene.ID)){
  if (datRaw01$Gene.ID[n] %in% refiDict$Reporter){
    isMemberIDrefi[n] = "FOUND"
  }
  else{
    isMemberIDrefi[n] = "notFOUND"
  }
}
unique(isMemberIDrefi)
indOfNotPresentRefi <- which(isMemberIDrefi %in% "notFOUND")
# This is a repository containing all of the code and documnentation used to perform the workflow for Bachelour thesis of Lukas Peter Filipcik

To perform the workflow a certain number of setup actions need to be performed

## Setup
As a first step, it is important to establish the file structure within which the R scripts will operate. In order to do this, download the repository into a location that can be located to by R command
setwd('~/Bachelour')

Afterwards, run once the following script to construct required structure
'~/Bachelour/R/createFileStructure.R'

Subsequently, download and unpack the dataset into folder at '~/Bachelour/data/oriData', and download and unpack miRTarBase provided csv file of all miRNA-protein links into '~/Bachelour/data/miRTarBase'
It is of note that this csv file is not formatted in a way to be easily digested by R, and therefore will require some manual FILE AND REPLACE action to make sure that R can read the file properly. Refer to R documentation for requirements for read.table functions

As a part of setup for Neo4j-NodeJs analysis, it is important to have both NodeJs and Neo4j installed, as instructed by providers. Once a database is setup, create a '~/Bachelour/JS/src/variables.js' file, and module.export from it your Neo4j database URI, USERNAME, and PASSWORD as 'uri', 'username', and 'password'. Furthermore it is important to NPM install all packages found in 'package-lock.json' file

## R
In order to execute the complete R-based analysis from raw data to Neo4j-ready linksets, it is only necessary to execute '~/Bachelour/R/main.R' file.
It is of note that if executed this way, only a reproduction of the original results will be gained. Therefore if use for a different dataset is required, it is best to use components and functions developed, not the whole script as is.

Ability to create unified-yet-flexible script or function for the complete analysis is still in development

## NodeJs
In order to perform NodeJs-Neo4j component of the analysis, choose apropriate calls in '~/Bachelour/JS/src/index.js' and run it with node.
For apropriate inputs and comments on particular functions, refer to the in-code documentation

Jenkins Dashboard Server
========================
Provides an API for accessing Jenkins information.

How To Use
==========
[First install node on your local machine.](https://nodejs.org/en/download)

Checkout repository to your local machine. You can then use the following methods as defined
in [package.json](package.json)
 
 Use this if you are running things for the first time:
 ```
 npm bootup
 ```
 
 For regular development, run this:
 ```
 npm start
 ```
 
 When running in production (i.e. no down time due to file changes), run:
 ```
 npm prod
 ```
# nationalrail-access-crawler
This is the node js crawler for extracting accessibility information of national rail services


Crawler.js is mainly powered by a sets of node js modules, such as cheerio (a fast, flexible, and lean implementation of core JQuery designed specifically for the sever) for parsing and extracting the specified text from the html file, node-html-entities is Node js based a html entities library, which used for coding and encoding html entities.


There are some issues when parsing the html page from National rail. 
The tag <dt> and <dd> are not always appears in pairs, therefore, it is difficult to match the text into pairs. Using JQuery prev() and next() to match whether the text in both <dd> tags? If yes, use just one of content, if not ,using both of them for the current <dt> tag.


Short code for railway station is downloaded from national public transport access nodes (NaPTAN)

RailReferences Schema={
StationName:{type:String}
AtcoCode: {type: String}, //Full NaPTAN stop identifier that uniquely identifies the stop within the UK.
TiplocCode:{type:String}, //Datatype, id defined by NaPTAN Vocabulary
CrsCode:{type:String}, //Datatype, id defined by NaPTAN Vocabulary
StationName:{type:String},
//GridType: {type:String}, // Unknown
Easting: {type:Number},
Northing: {type:Number},
Detail Information: {


}
//CreationDateTime: {type:Date},
//ModificationDateTime: {type:Date},
//RevisionNumber: {type:Number},
//Modification: {type:String}
}
Data Structure of detail of station in National Rail Website:
Geodata: Easting and Northing osgb36 Grid point

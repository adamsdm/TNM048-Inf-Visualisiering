var fs = require('fs'); //fileSync, read file module

var jsonData = {
    detonations: []
}; 
var output = 'detonations.json';
var input  = 'data.txt';

fs.readFile(input, 'utf8', function (err,contents) {

    console.log("Reading data from " + input +"...");
    var data = contents;
    var lines = data.split('\n');

    // For each line
    // Skip first lines containing labels
    console.log("Treating data...");
    for(var i = 3;i < 1000/*lines.length*/; i++){
        var obj = {
            coords: {}
        };



        var line            = lines[i];
        obj.date            = "19"+line.substring(0, 6).replace(/ /g,'');
        obj.time            = line.substring(7, 15).replace(/ /g,'');
        obj.testingParty    = line.substring(16, 18).replace(/ /g,'');
        obj.site            = line.substring(18, 21).replace(/ /g,'');
        obj.subsite         = line.substring(21, 22).replace(/ /g,'');
        obj.type            = line.substring(23, 27).replace(/ /g,'');
        obj.bodyMagnitude   = line.substring(28, 31).replace(/ /g,'');
        obj.surfMagnitude   = line.substring(32, 35).replace(/ /g,'');
        obj.yieldKilotons   = line.substring(36, 41).replace(/ /g,'');

        /** TODO ***/
        // FORMAT COORDS according to
        // 33.675N = 33.675, 33.675S = -33.675
        // 106.475E = 106.475, 106.475W = -106.475
        obj.coords.lat      = line.substring(42, 49).replace(/ /g,'');
        obj.coords.lon      = line.substring(50, 58).replace(/ /g,'');

        obj.purpose         = line.substring(59, 61).replace(/ /g,'');
        obj.deviceType      = line.substring(61, 63).replace(/ /g,'');
        obj.name            = line.substring(68, 76).replace(/ /g,'');
        
        jsonData.detonations.push(obj);
    }

    // Sort data by date
    console.log("Sorting data by date...");
    jsonData.detonations.sort(function(a, b) {
        return parseFloat(a.date) - parseFloat(b.date);
    });

    // Write to file
    console.log("Writing to " + output +"...");
    fs.writeFile('detonations.json', JSON.stringify(jsonData, null, 4));
    console.log("Done!");
});





/*************/
/* DATA INFO */
/*************/
// COLUMNS 1-6: DATE=date
// COLUMNS 8-15: Time
// COLUMNS 17-18: TP=Testing Party
// COLUMNS 19-21: Test or explosion site.
// COLUMN 22: Test subsite
// COLUMNS 24-27: TYPE: AIRD=airdrop, ART =artillery shell...
// COLUMNS 29-31: Seismic body (P) wave magnitude, mb.
// COLUMNS 33-35: Seismic surface wave magnitude, Ms.
// COLUMNS 37-41: Explosive Yield in Kilotons. NOTE decimal points are not all lined up vertically.
// COLUMNS 43-49: Latitude in degrees and decimals of a degree.
// COLUMNS 51-58: Longitude in degrees and decimals of a degree. See comments about US shots under latitude.
// COLUMNS 60-61: PU=Purpose: WR=weapons related, **=war, WE=weapons effects, SF=safety,...
// COLUMNS 62-63: DT=Device Type: ...




// LINE 1-EXISTS FOR ONLY SOME TESTS----------------------------------------------

// COLUMNS 1-6:
// DATE=date (UTC time) yymmdd, yy=year-1900, mm=month, dd=day of month

// COLUMNS 8-15: Time of blast in GMT until 1971 DEC31, in UTC starting 1972 JAN
// 01. GMT was Greenwich Mean Time (which is not correct to use after 1971 JAN01).
// UTC is Universal Time Coordinated. The times are listed as hhmmss.d, where
// hh=hour(0 through 23), mm=minute, ss=second, d=decisecond. Although it can't
// be shown in this format, many US shot times have been released to the nearest
// 0.001 second.

// COLUMN  16    Always # on Line 1 if Line 1 exists for the test

// COLUMNS 17-44 Full name of test.

// COLUMNS 46-53 Depth of burial in meters below ground surface (below water level
//               for underwater tests). If figure is negative, it represents
//               elevation above land surface (ending in L) or above sea level
//               ending in S).

// COLUMNS 55-80 Free format comments. 



// LINE 2-EXISTS FOR ALL TESTS----------------------------------------------------

// COLUMNS 1-6:
// DATE=date (UTC time) yymmdd, yy=year-1900, mm=month, dd=day of month
 
// COLUMNS 8-15: Time of blast in GMT until 1971 DEC31, in UTC starting 1972 JAN
// 01. GMT was Greenwich Mean Time (which is not correct to use after 1971 JAN01).
// UTC is Universal Time Coordinated. The times are listed as hhmmss.d, where
// hh=hour(0 through 23), mm=minute, ss=second, d=decisecond. Although it can't
// be shown in this format, many US shot times have been released to the nearest
// 0.001 second.

// COLUMNS 17-18:
// TP=Testing Party: US=United States, GB=UK, CP=USSR, FR=France, IN=India
//                   PC=People's Republic of China
//                   IS=Israel, but the 790922 event is only putative

// COLUMNS 19-21: Test or explosion site. Note that the UK Christmas Island site
// has been used for some US atmospheric tests. In exchange, the US has allowed
// the UK to conduct underground tests at the Nevada Test Site.
//   ANM= Alamogordo, New Mexico, USA (US atmospheric test)
//   HRJ= Hiroshima, Japan (US/warfare)
//   NGJ= Nagasaki, Japan (US/warfare)
//   BKN= Bikini (US atmospheric tests)
//   ENW= Enwetak (US atmospheric tests)
//   CNV= Centra Nevada (US underground test)
//   NTS= Nevada Test Site, Nevada, USA (US atmospheric and underground and
//                                       UK underground tests)
//   FMT= Farmington, Colorado (US underground natural gas stimulation test)
//   MBI= Monte Bello Islands, Australia (UK atmospheric test)
//   EMU= Emu Field, 480 kilometers SW of Woomera, Australia (UK atmospheric tests)
//   PAC= Various Pacific Ocean sites
//   MAR= Maralinga, Australia (UK atmospheric tests)
//   CHR= Christmas Island (UK and US atmospheric tests)
//   NZ = Novaya Zemlya, USSR (USSR atmospheric and underground tests)
//   KTS= Eastern Kazakh or Semipalitinsk test site, USSR (USSR atmospheric and
//                                                         underground tests)
//   REG= Reggane Proving Grounds, Algeria (French Atmospheric Tests)
//   ECK= Ecker, Algeria (French Underground tests)
//   CLS= Carlsbad, New Mexico, USA (US underground test)
//   JON= Johnston Island (US atmospheric tests)
//   FAL= Fallon, Nevada, USA (US underground test)
//   LNR= Lop Nor, PRC (PRC atmospheric and underground tests)
//   AMC= Amchitka Island, Aleutians, Alaska, USA (US underground tests)
//   MUR= Muruora Is. (French atmospheric and underground tests)
//   FAN= Fangataufa Is. (French atmospheric and underground tests)
//   HTB= Hattiesburg, Mississippi, USA (US underground tests)
//   GRV= Grand Valley, Colorado, USA (US natural gas stimulation)
//   RAJ= Rajasthan Desert, India (Indian underground test)
//   IS?IN= Indian Ocean (putative Israeli Test)
//   RFL= Rifle, Colorado, USA (3x33kt simultaneous gas stimulation shots)
//   SAT= South Atlantic Ocean (three US tests, rocket to 482 kilometers altitude)
//   MAL= Malden Island (UK atmospheric tests)
//   KPY= Kapustin Yar (USSR)
//   SYS= Sary Shagan (USSR)

//   USSR sites other than NZ and KTS. A large number of blasts, some or many
//        of which were for engineering purposes (possibly similar to US
//        Plowshare tests) were fired underground at many locations. Latitude
//        and Longitude for most of these are given in the tables. These tests,
//        US plowshare tests, and the one Indian test, were announced by the
//        testing parties to be PNEs (Peaceful Nuclear Explosions). 

// COLUMN 22: Test subsite
//            NTS: P= Pahute Mesa
//                 Y= Yucca Mountain
//                 F= Frenchman Flat
//                 B= Buckboard Mesa
//            KTS: B= Balapan or Shagan River
//                 D= Degelen Mountain
//                 M= Murzhik
//            NZ:  N= (NTS) Northern Island
//                 S= Southern Island

  
// COLUMNS 24-27:
// TYPE: AIRD=airdrop
//       ART =artillery shell
//       ATMO=in or above the atmosphere
//       BALN=balloon
//       BARG=barge
//       CRAT=crater
//       RC  ="roman candle"=open vertical shaft
//       ROCK=rocket
//       SHFT=stemmed vertical shaft
//       SS1 =simultaneous shot in shaft 1
//       SS2 =simultaneous shot in shaft 2
//       SSn =simultaneous shot in shaft n
//            (If several simultaneous tests were in the same shaft [usually at
//             different depths] they will all be listed SS1. If three were shot 
//             simultaneously in three separate shafts they will be SS1, SS2, 
//             and SS3).
//       SURF=surface (unknown but probably not airdropped, near surface, includes
//                     tower and barge)
//       TOWR=tower
//       TUNN=tunnel
//       UNDW=underwater
 
// COLUMNS 29-31: Seismic body (P) wave magnitude, mb. Sources in this order of
//                preference. ISC mb, if ISC mb not available NEIS mb, if no
//                mb available an ML from PAS or BRK may be used. If the test
//                has known multiple explosions, mb refers to the entire test.

// COLUMNS 33-35: Seismic surface wave magnitude, Ms. If the test has known
//                multiple explosions, Ms refers to the entire test.

// COLUMNS 37-41: Explosive Yield in Kilotons. NOTE decimal points are not all
//                lined up vertically. This could be a problem in any machine
//                processing as could <, >, LOW, HIGH, -, SLIGHT, FIZZ.
//                Unless there is a single number
//                without a <, >, or - , assume the yield is unknown and very 
//                approximate.
//                FIZZ=fizzle or failure with extremely low yield. F followed by
//                a number, eg F300, is a test which had a smaller yield than
//                expected. Apparently some fizzles were two-stage devices in    
//                which the fusion stage produced little or no yield.

// COLUMNS 43-49: Latitude in degrees and decimals of a degree. Although it can't
//                be shown in this format, many US shots have coordinates
//                released to 0.1 or 0.01 seconds (0.00003 or 0.000003 degrees).

// COLUMNS 51-58: Longitude in degrees and decimals of a degree. See comments
//                about US shots under latitude.

// COLUMNS 60-61:
// PU=Purpose: WR=weapons related, **=war, WE=weapons effects, SF=safety
//             PS=Plowshare (US PNE engineering shots)
//             VU=US Vela Uniform-directed toward seismic detection of
//                underground shots
 
// COLUMNS 62-63:
// DT=Device Type: U=fission only with primarialy U235, or boosted or two
//                   stage with primarialy U235 primary (trigger, pit)
//                 P=fission only with primarialy Pu239, or boosted or two
//                   stage with primarialy Pu239 primary (trigger, pit)
//                 I=fission only, fission material mix unknown
//                 B="boosted", some fusion yield, perhaps from tritium
//                    although the boost is probably mainly to increase
//                    the fission yield.
//                 2=two stage, fusion second stage, possibly many or most of
//                   these will have a U238 fission "third" stage.
   

// Zero yield omitted: USDOE "Announced Nuclear Tests" with zero yield are not
//  included in this nuclear EXPLOSION catalog. Some of these are described
//  as being safety or storage-transportation tests.
 
// COLUMNS 64-67: For underground tests: Rock type at device emplacement point.
//                GR= granite
//                QP= quartz porphyrite
//                SA= sandstone
//                AL= aleurolite (siltstone)
//                PO= porphryte
//                QS= quartz syneite
//                GS= gritstone
//                AR= argillite (mudstone)
//                CO= conglomerate
//                TS= tuffaceous sandstone
//                SL= salt

// COLUMN 68: += device emplaced above water table
//            -= device emplaced below water table


// COLUMN 69-76:
// NAME=Name of explosion. All US announced, and a few French, and all UK
//      underground tests have a name. In early US atmospheric testing some
//      names were reused. When the names are too long for the table, any space
//      is first dropped, and second, the name is truncated, not abbreviated.
//      A few words appear often enough as the component of a name that they
//      are abberviated by a lower case letter as follows:
//          g=GERBOISE, m=MIST, y=MISTY, p=PRIME, d=DIAMOND
//      A * in the first column of the name indicates a putative nuclear test
//      (ie. not announced or acknowledged by the PRESUMED testing party).
//      A second * in the name column indicates some doubt about wheither the
//      event was a nuclear explosion. A number of US tests listed only by
//      N (NRDC), which have ** in the name column, may be cavity collapses from
//      previous tests, or earthquakes, but they may include some unannounced
//      nuclear explosions.

// COLUMNS 77-80: Generalized References
//         E= United States Department of Energy
//         N= Natural Resources Defense Council
//         B= Bolt "The Parted Veil: Nuclear Explosions and Earthquakes"
//         A= Bocharv, V. S., S. A. Zelentsov, and V. N. Mikhailov.
//            Characteristics of 96 underground nuclear explosions at the
//            Semipalatinsk test site, Atomnaya Energiya, 67, (3), 1989.
//         D= Dominion of New Zeland, Dept. of Scientific and Industrial Research
//         I= International Seismological Centre
//         C= United States Advanced Research Projects Agency/ Nuclear Monitoring
//            Research Office/ Center for Seismic Studies
//         L= U.S. Geological Survey, National Earthquake Information Service
//         S= Seismic Service of the Russian Federation Ministry of Defense
//         U= United Kingdom Atomic Weapons Research Establishment
//         F= Ronald Walters and Kenneth S. Zinn, The September 22, 1979 Mystery
//            Flash: Did South Africa Detonate a Nuclear Bomb? Report of the 
//            Washington Office on Africa Educational Fund, May 21,1985.
//         n= ARPA/NMRO/NORwegianSeismicARray (NORSAR)
//         G= GSETT3-Group of Scientific Experts Technical Test 3
//            REB-Reviewed Event Bulletin from IDC-International Data Center
//         Z= Australian Geological Survey Orginization Database of Nuclear
//            Explosions http://www.agso.gov.au/information/structure/isd/
//            database/nukexp_query.html
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
    for(var i = 3;i < lines.length; i++){
        var obj = {
            coords: []
        };
        var line            = lines[i];

        obj.date            = "19"+line.substring(0, 6).replace(/ /g,'');
        obj.time            = line.substring(7, 15).replace(/ /g,'');
        obj.testingParty    = getCountry(line.substring(16, 18).replace(/ /g,''));
        obj.site            = line.substring(18, 21).replace(/ /g,'');
        obj.subsite         = line.substring(21, 22).replace(/ /g,'');
        obj.type            = line.substring(22, 27).replace(/ /g,'');
        obj.bodyMagnitude   = line.substring(28, 31).replace(/ /g,'');
        obj.surfMagnitude   = line.substring(32, 35).replace(/ /g,'');
        obj.yieldKilotons   = formatYield(line.substring(36, 41).replace(/ /g,''));

        var lat             = line.substring(42, 49).replace(/ /g,'');
        var lon             = line.substring(50, 59).replace(/ /g,'');

        var coord           = formatCoord(lat, lon, obj.site);


        obj.coords          = coord;

        obj.purpose         = line.substring(59, 61).replace(/ /g,'');
        obj.deviceType      = line.substring(61, 63).replace(/ /g,'');
        obj.name            = line.substring(68, 76).replace(/ /g,'');



        // Only push if object has testing party or coordinate
        if(obj.testingParty && ( coord[0] && coord[1] ) )
            jsonData.detonations.push(obj);
    }

    // Sort data by date
    console.log("Sorting by date...");
    jsonData.detonations.sort(function(a, b) {
        return parseFloat(a.date) - parseFloat(b.date);
    });

    // Write to file
    console.log("Writing to " + output +"...");
    fs.writeFile('detonations.json', JSON.stringify(jsonData, null, 4));
    console.log("Done!");
});

function getCountry(party){
    var countries = {
        US: "United States",
        GB: "UK",
        CP: "USSR",
        FR: "France",
        IN: "India",
        PC: "People's Republic of China",
        IS: "Israel"
    }

    return countries[party];
}

function formatYield(yield){
    var newYield = yield;


    // If yield is defined
    if(newYield.length > 0){

        // If yield is in correct format
        if(parseFloat(newYield)){
            newYield = newYield.replace(/[-,+,?]/g,'');   // remove '-' signs ('150-200' => '200')

            return newYield;
        }
        else {
            // Check for '<' or '>' sign
            if( newYield.includes('>') || newYield.includes('<')){
                newYield = newYield.replace(/[<, >]/g,''); // Remove '<' and '>' chars ('>20' => '20')

                return newYield;
            }
            // If in format '10-20', return max number ( '10-20' => '20' )
            else if( newYield.includes('-') ){
                var v = newYield.split('-');

                return v[1];
            }

            // Strings -> 'FIZZ', 'LOW', 'HIGH', 'F200, F300'
            // 'F#00' = Smaller yield than expected
            else{
                return "";
            }
        }
    };

    return newYield;
}



function formatCoord(lat, lon, site){

    var newLat = lat.toUpperCase();
    var newLon = lon.toUpperCase();

    // If data for both lat and lon exists
    if(lat.length > 0 && lon.length >0 ){
        var sInd = newLat.indexOf("S");
        var nInd = newLat.indexOf("N");
        var wInd = newLon.indexOf("W");
        var eInd = newLon.indexOf("E");

        // If 'S' or 'W' is found in string
        if(sInd != -1 ){
            newLat = "-" + newLat;  // Add '-'
        }
        if(wInd != -1){
            newLon = "-" + newLon;  // Add '-'
        }

        // Remove 'N', 'S', 'E', 'W'
        newLat = newLat.replace(/[^\d.-]/g, '');
        newLon = newLon.replace(/[^\d.-]/g, '');

        var coord = [newLon, newLat];
        return coord;
    }

    // "lat": "",
    // "lon": "255NTS0"
    else if (lat.length==0 && lon.length >0){
        // if NTS format
        if (lon.indexOf("NTS") != -1)
        {
            var ntsArea = parseFloat(lon.substring(lon.indexOf("NTS")+3)); //number code of the nts area
            var coord = [];
            switch(ntsArea){
                case 1:
                    coord = [-116.059, 37.008];
                    break;
                case 2:
                    coord = [-116.073, 37.138];
                    break;
                case 3:
                    coord = [-116.024, 37.044];
                    break;
                case 4:
                    coord = [-116.086, 37.080];
                    break;
                case 6:
                    coord = [-116.04, 36.8988];
                    break;
                case 12:
                    coord = [-116.199, 37.193];
                    break;
                case 30:
                    coord = [-116.371, 37.007];
                    break;
                default:
                    coord = [-116, 37]; //default coordinates for sites that we couldn't find the location of
            }
            //console.log(lon);
            return coord;
        }
        else if (lon.indexOf("RIFLE") != -1)
        {
            var coord = [39.5, -108.2]; //rifle site coordinates
            return coord;
        }
    }
    // else check if a site tag exists then use those coords
    else {
        var coord = [];
        switch(site){
            case 'ANM':
                coord = [-106.475, 33.677];
                break;
            case 'HRJ':
                coord = [132.455, 34.385 ];
                break;
            case 'NGJ':
                coord = [129.866, 32.783];
                break;
            case 'BKN':
                coord = [-165.50, 11.59, ];
                break;
            case 'ENW':
                coord = [162.333, 11.50];
                break;
            case 'CNV': case 'NTS':
                coord = [-116.05, 37.116];
                break;
            case 'FMT':
                coord = [-107.209, 36.678];
                break;
            case 'MBI':
                coord = [115.554, -20.407];
                break;
            case 'EMU':
                coord = [132.371, -28.667];
                break;
            case 'MAR':
                coord = [131.624, -29.881,];
                break;
            case 'CHR':
                coord = [-157.233, 1.678];
                break;
            case 'NZ':
                coord = [54.0, 73.7];
                break;
            case 'KTS':
                coord = [78.43, 50.07];
                break;
            case 'REG':
                coord = [-0.057, 26.311];
                break;
            case 'ECK':
                coord = [5.056, 24.065];
                break;
            case 'CLS':
                coord = [-103.865, 32.262];
                break;
            case 'JON':
                coord = [-169.525, 16.733];
                break;
            case 'FAL':
                coord = [-118.381, 39.200];
                break;
            case 'LNR':
                coord = [90.583, 40.166];
                break;
            case 'AMC':
                coord = [178.992, 51.542];
                break;
            case 'MUR':
                coords = [-138.842, -21.842];
                break;
            case 'FAN':
                coords = [-138.75, -22.25];
                break;
            case 'HTB':
                coords = [-89.570, 31.141];
                break;
            case 'GRV':
                coords = [-108.725, 39.192];
                break;
            case 'RAJ':
                coords = [71.92, 26.92];
                break;
            case 'RFL':
                coords = [-108.2, 39.5];
                break;
            case 'SAT':
                coords = [-8.2, -49.5];
                break;
            case 'MAL':
                coords = [-154.933, -4.016];
                break;
            case 'KPY':
                coords = [45.72, 48.586];
                break;
            case 'SYS':
                coords = [72.866, 46.383];
                break;
            default:
                coord = [lon, lat]; //no site no coords, return (0, 0)
                break;
        }

        return coord;
    }

    //
    // Else return empty string array
    return [lon,lat];
}



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

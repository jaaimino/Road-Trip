/* global MAP */

MAP = {}; //Global namespace for our object

MAP.STATES = {};

MAP.toKM = 1 / (35 / 100); //Map scale to km scale (Multiply straight line distance by this)
MAP.kmToMiles = 0.621371; //Conversion constant for KM to miles (Multiply km by this)
MAP.distanceScale = 0.5; //Scale all distances down by this amount cause they are way too long

MAP.stategraph = new Graph();

MAP.lookup = []; //Lookup array to convert from id to state


MAP.initialize = function () {
    MAP.STATES.DELAWARE = {name: "Delaware", x: 811.1465833945629, y: 219.70948180815876};
    MAP.STATES.NEW_JERSEY = {name: "New Jersey", x: 819.0819250551066, y: 187.95644983461963};
    MAP.STATES.MARYLAND = {name: "Maryland", x: 783.3728875826598, y: 216.4018743109151};
    MAP.STATES.MAINE = {name: "Maine", x: 856.7747979426892, y: 63.590407938258};
    MAP.STATES.NEW_HAMPSHIRE = {name: "New Hampshire", x: 838.9202792064659, y: 109.89691289966923};
    MAP.STATES.MASSACHUSETTS = {name: "Massachusetts", x: 833.6300514327701, y: 135.03472987872107};
    MAP.STATES.CONNECTICUT = {name: "Connecticut", x: 835.613886847906, y: 152.23428886438808};
    MAP.STATES.VERMONT = {name: "Vermont", x: 819.7432035268185, y: 103.94321940463065};
    MAP.STATES.NEW_YORK = {name: "New York", x: 791.9695077149155, y: 136.35777287761852};
    MAP.STATES.PENNSYLVANIA = {name: "Pennsylvania", x: 765.5183688464365, y: 193.2486218302095};
    MAP.STATES.RHODE_ISLAND = {name: "Rhode Island", x: 854.7909625275533, y: 140.32690187431092};
    MAP.STATES.OHIO = {name: "Ohio", x: 682.1972814107274, y: 226.3246968026461};
    MAP.STATES.WEST_VIRGINIA = {name: "West Virginia", x: 725.180382072006, y: 248.15490628445423};
    MAP.STATES.VIRGINIA = {name: "Virginia", x: 767.5022042615724, y: 261.3853362734289};
    MAP.STATES.NORTH_CAROLINA = {name: "North Carolina", x: 761.5506980161646, y: 301.0766262403528};
    MAP.STATES.SOUTH_CAROLINA = {name: "South Carolina", x: 747.6638501102132, y: 344.0755237045204};
    MAP.STATES.GEORGIA = {name: "Georgia", x: 706.6645848640705, y: 383.1052921719956};
    MAP.STATES.FLORIDA = {name: "Florida", x: 748.9864070536371, y: 455.8726571113561};
    MAP.STATES.ALABAMA = {name: "Alabama", x: 640.5367376928729, y: 387.074421168688};
    MAP.STATES.TENNESSEE = {name: "Tennessee", x: 635.2465099191771, y: 323.5683572216097};
    MAP.STATES.KENTUCKY = {name: "Kentucky", x: 659.0525349008083, y: 283.87706725468576};
    MAP.STATES.MICHIGAN = {name: "Michigan", x: 643.1818515797208, y: 176.04906284454245};
    MAP.STATES.INDIANA = {name: "Indiana", x: 629.9562821454813, y: 242.86273428886437};
    MAP.STATES.ILLINOIS = {name: "Illinois", x: 581.0216752387951, y: 246.17034178610805};
    MAP.STATES.WISCONSIN = {name: "Wisconsin", x: 558.5382072005879, y: 163.48015435501654};
    MAP.STATES.MISSISSIPPI = {name: "Mississippi", x: 590.9408523144747, y: 393.6896361631753};
    MAP.STATES.MINNESOTA = {name: "Minnesota", x: 483.15246142542253, y: 137.01929437706724};
    MAP.STATES.IOWA = {name: "Iowa", x: 508.2810433504776, y: 219.70948180815876};
    MAP.STATES.MISSOURI = {name: "Missouri", x: 530.1032329169728, y: 293.79988974641674};
    MAP.STATES.ARKANSAS = {name: "Arkansas", x: 536.0547391623807, y: 361.27508269018745};
    MAP.STATES.LOUISIANA = {name: "Louisiana", x: 542.6675238795004, y: 429.4117971334068};
    MAP.STATES.NORTH_DAKOTA = {name: "North Dakota", x: 393.87986774430567, y: 113.2045203969129};
    MAP.STATES.SOUTH_DAKOTA = {name: "South Dakota", x: 399.8313739897135, y: 177.3721058434399};
    MAP.STATES.NEBRASKA = {name: "Nebraska", x: 407.7667156502572, y: 236.9090407938258};
    MAP.STATES.KANSAS = {name: "Kansas", x: 428.9276267450404, y: 295.1229327453142};
    MAP.STATES.OKLAHOMA = {name: "Oklahoma", x: 451.4110947832476, y: 353.33682469680264};
    MAP.STATES.TEXAS = {name: "Texas", x: 424.2986774430566, y: 435.3654906284454};
    MAP.STATES.NEW_MEXICO = {name: "New Mexico", x: 288.7365907421014, y: 370.53638368246965};
    MAP.STATES.COLORADO = {name: "Colorado", x: 305.9298310066128, y: 283.21554575523703};
    MAP.STATES.WYOMING = {name: "Wyoming", x: 280.1399706098457, y: 197.8792723263506};
    MAP.STATES.MONTANA = {name: "Montana", x: 266.2531227038942, y: 116.51212789415655};
    MAP.STATES.IDAHO = {name: "Idaho", x: 170.36774430565762, y: 170.09536934950384};
    MAP.STATES.UTAH = {name: "Utah", x: 205.41550330639237, y: 267.33902976846747};
    MAP.STATES.ARIZONA = {name: "Arizona", x: 196.1576047024247, y: 363.92116868798234};
    MAP.STATES.CALIFORNIA = {name: "California", x: 66.5470242468773, y: 296.4459757442117};
    MAP.STATES.NEVADA = {name: "Nevada", x: 120.11058045554739, y: 246.17034178610805};
    MAP.STATES.OREGON = {name: "Oregon", x: 75.80492285084497, y: 144.95755237045205};
    MAP.STATES.WASHINGTON = {name: "Washington", x: 101.59478324761206, y: 76.82083792723263};

    MAP.assignIndexes();

    //Maine
    MAP.stategraph.set(MAP.STATES.MAINE.id, MAP.STATES.NEW_HAMPSHIRE.id);

//New Hampshire
    MAP.stategraph.set(MAP.STATES.NEW_HAMPSHIRE.id, MAP.STATES.MAINE.id);
    MAP.stategraph.set(MAP.STATES.NEW_HAMPSHIRE.id, MAP.STATES.VERMONT.id);
    MAP.stategraph.set(MAP.STATES.NEW_HAMPSHIRE.id, MAP.STATES.MASSACHUSETTS.id);

//Vermont
    MAP.stategraph.set(MAP.STATES.VERMONT.id, MAP.STATES.NEW_HAMPSHIRE.id);
    MAP.stategraph.set(MAP.STATES.VERMONT.id, MAP.STATES.NEW_YORK.id);
    MAP.stategraph.set(MAP.STATES.VERMONT.id, MAP.STATES.MASSACHUSETTS.id);

//Massachusetts
    MAP.stategraph.set(MAP.STATES.MASSACHUSETTS.id, MAP.STATES.RHODE_ISLAND.id);
    MAP.stategraph.set(MAP.STATES.MASSACHUSETTS.id, MAP.STATES.NEW_HAMPSHIRE.id);
    MAP.stategraph.set(MAP.STATES.MASSACHUSETTS.id, MAP.STATES.CONNECTICUT.id);
    MAP.stategraph.set(MAP.STATES.MASSACHUSETTS.id, MAP.STATES.VERMONT.id);
    MAP.stategraph.set(MAP.STATES.MASSACHUSETTS.id, MAP.STATES.NEW_YORK.id);

//Rhode Island
    MAP.stategraph.set(MAP.STATES.RHODE_ISLAND.id, MAP.STATES.MASSACHUSETTS.id);
    MAP.stategraph.set(MAP.STATES.RHODE_ISLAND.id, MAP.STATES.CONNECTICUT.id);

//Connecticut
    MAP.stategraph.set(MAP.STATES.CONNECTICUT.id, MAP.STATES.RHODE_ISLAND.id);
    MAP.stategraph.set(MAP.STATES.CONNECTICUT.id, MAP.STATES.MASSACHUSETTS.id);
    MAP.stategraph.set(MAP.STATES.CONNECTICUT.id, MAP.STATES.NEW_YORK.id);

//New York
    MAP.stategraph.set(MAP.STATES.NEW_YORK.id, MAP.STATES.VERMONT.id);
    MAP.stategraph.set(MAP.STATES.NEW_YORK.id, MAP.STATES.MASSACHUSETTS.id);
    MAP.stategraph.set(MAP.STATES.NEW_YORK.id, MAP.STATES.CONNECTICUT.id);
    MAP.stategraph.set(MAP.STATES.NEW_YORK.id, MAP.STATES.NEW_JERSEY.id);
    MAP.stategraph.set(MAP.STATES.NEW_YORK.id, MAP.STATES.PENNSYLVANIA.id);

//New Jersey
    MAP.stategraph.set(MAP.STATES.NEW_JERSEY.id, MAP.STATES.PENNSYLVANIA.id);
    MAP.stategraph.set(MAP.STATES.NEW_JERSEY.id, MAP.STATES.NEW_YORK.id);
    MAP.stategraph.set(MAP.STATES.NEW_JERSEY.id, MAP.STATES.DELAWARE.id);

//Pennsylvania
    MAP.stategraph.set(MAP.STATES.PENNSYLVANIA.id, MAP.STATES.NEW_YORK.id);
    MAP.stategraph.set(MAP.STATES.PENNSYLVANIA.id, MAP.STATES.NEW_JERSEY.id);
    MAP.stategraph.set(MAP.STATES.PENNSYLVANIA.id, MAP.STATES.DELAWARE.id);
    MAP.stategraph.set(MAP.STATES.PENNSYLVANIA.id, MAP.STATES.MARYLAND.id);
    MAP.stategraph.set(MAP.STATES.PENNSYLVANIA.id, MAP.STATES.WEST_VIRGINIA.id);
    MAP.stategraph.set(MAP.STATES.PENNSYLVANIA.id, MAP.STATES.OHIO.id);

//Delaware
    MAP.stategraph.set(MAP.STATES.DELAWARE.id, MAP.STATES.NEW_JERSEY.id);
    MAP.stategraph.set(MAP.STATES.DELAWARE.id, MAP.STATES.PENNSYLVANIA.id);
    MAP.stategraph.set(MAP.STATES.DELAWARE.id, MAP.STATES.MARYLAND.id);

//Maryland
    MAP.stategraph.set(MAP.STATES.MARYLAND.id, MAP.STATES.DELAWARE.id);
    MAP.stategraph.set(MAP.STATES.MARYLAND.id, MAP.STATES.PENNSYLVANIA.id);
    MAP.stategraph.set(MAP.STATES.MARYLAND.id, MAP.STATES.VIRGINIA.id);
    MAP.stategraph.set(MAP.STATES.MARYLAND.id, MAP.STATES.WEST_VIRGINIA.id);

//Virginia
    MAP.stategraph.set(MAP.STATES.VIRGINIA.id, MAP.STATES.MARYLAND.id);
    MAP.stategraph.set(MAP.STATES.VIRGINIA.id, MAP.STATES.WEST_VIRGINIA.id);
    MAP.stategraph.set(MAP.STATES.VIRGINIA.id, MAP.STATES.KENTUCKY.id);
    MAP.stategraph.set(MAP.STATES.VIRGINIA.id, MAP.STATES.TENNESSEE.id);
    MAP.stategraph.set(MAP.STATES.VIRGINIA.id, MAP.STATES.NORTH_CAROLINA.id);

//West Virginia
    MAP.stategraph.set(MAP.STATES.WEST_VIRGINIA.id, MAP.STATES.VIRGINIA.id);
    MAP.stategraph.set(MAP.STATES.WEST_VIRGINIA.id, MAP.STATES.MARYLAND.id);
    MAP.stategraph.set(MAP.STATES.WEST_VIRGINIA.id, MAP.STATES.PENNSYLVANIA.id);
    MAP.stategraph.set(MAP.STATES.WEST_VIRGINIA.id, MAP.STATES.OHIO.id);
    MAP.stategraph.set(MAP.STATES.WEST_VIRGINIA.id, MAP.STATES.KENTUCKY.id);

//North Carolina
    MAP.stategraph.set(MAP.STATES.NORTH_CAROLINA.id, MAP.STATES.VIRGINIA.id);
    MAP.stategraph.set(MAP.STATES.NORTH_CAROLINA.id, MAP.STATES.KENTUCKY.id);
    MAP.stategraph.set(MAP.STATES.NORTH_CAROLINA.id, MAP.STATES.TENNESSEE.id);
    MAP.stategraph.set(MAP.STATES.NORTH_CAROLINA.id, MAP.STATES.SOUTH_CAROLINA.id);
    //MAP.stategraph.set(MAP.STATES.NORTH_CAROLINA.id, MAP.STATES.GEORGIA.id);

//South Carolina
    MAP.stategraph.set(MAP.STATES.SOUTH_CAROLINA.id, MAP.STATES.NORTH_CAROLINA.id);
    MAP.stategraph.set(MAP.STATES.SOUTH_CAROLINA.id, MAP.STATES.GEORGIA.id);

//Georgia
    MAP.stategraph.set(MAP.STATES.GEORGIA.id, MAP.STATES.SOUTH_CAROLINA.id);
    MAP.stategraph.set(MAP.STATES.GEORGIA.id, MAP.STATES.NORTH_CAROLINA.id);
    MAP.stategraph.set(MAP.STATES.GEORGIA.id, MAP.STATES.TENNESSEE.id);
    MAP.stategraph.set(MAP.STATES.GEORGIA.id, MAP.STATES.ALABAMA.id);
    MAP.stategraph.set(MAP.STATES.GEORGIA.id, MAP.STATES.FLORIDA.id);

//Florida
    MAP.stategraph.set(MAP.STATES.FLORIDA.id, MAP.STATES.GEORGIA.id);
    MAP.stategraph.set(MAP.STATES.FLORIDA.id, MAP.STATES.ALABAMA.id);

//Alabama
    MAP.stategraph.set(MAP.STATES.ALABAMA.id, MAP.STATES.FLORIDA.id);
    MAP.stategraph.set(MAP.STATES.ALABAMA.id, MAP.STATES.GEORGIA.id);
    MAP.stategraph.set(MAP.STATES.ALABAMA.id, MAP.STATES.TENNESSEE.id);
    MAP.stategraph.set(MAP.STATES.ALABAMA.id, MAP.STATES.MISSISSIPPI.id);

//Tennessee
    MAP.stategraph.set(MAP.STATES.TENNESSEE.id, MAP.STATES.NORTH_CAROLINA.id);
    MAP.stategraph.set(MAP.STATES.TENNESSEE.id, MAP.STATES.VIRGINIA.id);
    MAP.stategraph.set(MAP.STATES.TENNESSEE.id, MAP.STATES.KENTUCKY.id);
    MAP.stategraph.set(MAP.STATES.TENNESSEE.id, MAP.STATES.MISSOURI.id);
    MAP.stategraph.set(MAP.STATES.TENNESSEE.id, MAP.STATES.ARKANSAS.id);
    MAP.stategraph.set(MAP.STATES.TENNESSEE.id, MAP.STATES.MISSISSIPPI.id);
    MAP.stategraph.set(MAP.STATES.TENNESSEE.id, MAP.STATES.ALABAMA.id);
    MAP.stategraph.set(MAP.STATES.TENNESSEE.id, MAP.STATES.GEORGIA.id);

//Kentucky
    MAP.stategraph.set(MAP.STATES.KENTUCKY.id, MAP.STATES.TENNESSEE.id);
    MAP.stategraph.set(MAP.STATES.KENTUCKY.id, MAP.STATES.VIRGINIA.id);
    MAP.stategraph.set(MAP.STATES.KENTUCKY.id, MAP.STATES.WEST_VIRGINIA.id);
    MAP.stategraph.set(MAP.STATES.KENTUCKY.id, MAP.STATES.OHIO.id);
    MAP.stategraph.set(MAP.STATES.KENTUCKY.id, MAP.STATES.INDIANA.id);
    MAP.stategraph.set(MAP.STATES.KENTUCKY.id, MAP.STATES.ILLINOIS.id);
    MAP.stategraph.set(MAP.STATES.KENTUCKY.id, MAP.STATES.MISSOURI.id);

//Ohio
    MAP.stategraph.set(MAP.STATES.OHIO.id, MAP.STATES.WEST_VIRGINIA.id);
    MAP.stategraph.set(MAP.STATES.OHIO.id, MAP.STATES.PENNSYLVANIA.id);
    MAP.stategraph.set(MAP.STATES.OHIO.id, MAP.STATES.MICHIGAN.id);
    MAP.stategraph.set(MAP.STATES.OHIO.id, MAP.STATES.INDIANA.id);
    MAP.stategraph.set(MAP.STATES.OHIO.id, MAP.STATES.KENTUCKY.id);

//Michigan
    MAP.stategraph.set(MAP.STATES.MICHIGAN.id, MAP.STATES.OHIO.id);
    MAP.stategraph.set(MAP.STATES.MICHIGAN.id, MAP.STATES.INDIANA.id);

//Indiana
    MAP.stategraph.set(MAP.STATES.INDIANA.id, MAP.STATES.KENTUCKY.id);
    MAP.stategraph.set(MAP.STATES.INDIANA.id, MAP.STATES.OHIO.id);
    MAP.stategraph.set(MAP.STATES.INDIANA.id, MAP.STATES.MICHIGAN.id);
    MAP.stategraph.set(MAP.STATES.INDIANA.id, MAP.STATES.ILLINOIS.id);

//Illinois
    MAP.stategraph.set(MAP.STATES.ILLINOIS.id, MAP.STATES.KENTUCKY.id);
    MAP.stategraph.set(MAP.STATES.ILLINOIS.id, MAP.STATES.INDIANA.id);
    MAP.stategraph.set(MAP.STATES.ILLINOIS.id, MAP.STATES.WISCONSIN.id);
    MAP.stategraph.set(MAP.STATES.ILLINOIS.id, MAP.STATES.IOWA.id);
    MAP.stategraph.set(MAP.STATES.ILLINOIS.id, MAP.STATES.MISSOURI.id);

//Missouri
    MAP.stategraph.set(MAP.STATES.MISSOURI.id, MAP.STATES.TENNESSEE.id);
    MAP.stategraph.set(MAP.STATES.MISSOURI.id, MAP.STATES.KENTUCKY.id);
    MAP.stategraph.set(MAP.STATES.MISSOURI.id, MAP.STATES.ILLINOIS.id);
    MAP.stategraph.set(MAP.STATES.MISSOURI.id, MAP.STATES.IOWA.id);
    MAP.stategraph.set(MAP.STATES.MISSOURI.id, MAP.STATES.NEBRASKA.id);
    MAP.stategraph.set(MAP.STATES.MISSOURI.id, MAP.STATES.KANSAS.id);
    MAP.stategraph.set(MAP.STATES.MISSOURI.id, MAP.STATES.OKLAHOMA.id);
    MAP.stategraph.set(MAP.STATES.MISSOURI.id, MAP.STATES.ARKANSAS.id);

//Arkansas
    MAP.stategraph.set(MAP.STATES.ARKANSAS.id, MAP.STATES.LOUISIANA.id);
    MAP.stategraph.set(MAP.STATES.ARKANSAS.id, MAP.STATES.MISSISSIPPI.id);
    MAP.stategraph.set(MAP.STATES.ARKANSAS.id, MAP.STATES.TENNESSEE.id);
    MAP.stategraph.set(MAP.STATES.ARKANSAS.id, MAP.STATES.MISSOURI.id);
    MAP.stategraph.set(MAP.STATES.ARKANSAS.id, MAP.STATES.OKLAHOMA.id);
    MAP.stategraph.set(MAP.STATES.ARKANSAS.id, MAP.STATES.TEXAS.id);

//Mississippi
    MAP.stategraph.set(MAP.STATES.MISSISSIPPI.id, MAP.STATES.ALABAMA.id);
    MAP.stategraph.set(MAP.STATES.MISSISSIPPI.id, MAP.STATES.TENNESSEE.id);
    MAP.stategraph.set(MAP.STATES.MISSISSIPPI.id, MAP.STATES.ARKANSAS.id);
    MAP.stategraph.set(MAP.STATES.MISSISSIPPI.id, MAP.STATES.LOUISIANA.id);

//Louisiana
    MAP.stategraph.set(MAP.STATES.LOUISIANA.id, MAP.STATES.MISSISSIPPI.id);
    MAP.stategraph.set(MAP.STATES.LOUISIANA.id, MAP.STATES.ARKANSAS.id);
    MAP.stategraph.set(MAP.STATES.LOUISIANA.id, MAP.STATES.TEXAS.id);

//Texas
    MAP.stategraph.set(MAP.STATES.TEXAS.id, MAP.STATES.LOUISIANA.id);
    MAP.stategraph.set(MAP.STATES.TEXAS.id, MAP.STATES.ARKANSAS.id);
    MAP.stategraph.set(MAP.STATES.TEXAS.id, MAP.STATES.OKLAHOMA.id);
    MAP.stategraph.set(MAP.STATES.TEXAS.id, MAP.STATES.NEW_MEXICO.id);

//Oklahoma
    MAP.stategraph.set(MAP.STATES.OKLAHOMA.id, MAP.STATES.ARKANSAS.id);
    MAP.stategraph.set(MAP.STATES.OKLAHOMA.id, MAP.STATES.MISSOURI.id);
    MAP.stategraph.set(MAP.STATES.OKLAHOMA.id, MAP.STATES.KANSAS.id);
    MAP.stategraph.set(MAP.STATES.OKLAHOMA.id, MAP.STATES.COLORADO.id);
    MAP.stategraph.set(MAP.STATES.OKLAHOMA.id, MAP.STATES.NEW_MEXICO.id);
    MAP.stategraph.set(MAP.STATES.OKLAHOMA.id, MAP.STATES.TEXAS.id);

//Kansas
    MAP.stategraph.set(MAP.STATES.KANSAS.id, MAP.STATES.OKLAHOMA.id);
    MAP.stategraph.set(MAP.STATES.KANSAS.id, MAP.STATES.MISSOURI.id);
    MAP.stategraph.set(MAP.STATES.KANSAS.id, MAP.STATES.NEBRASKA.id);
    MAP.stategraph.set(MAP.STATES.KANSAS.id, MAP.STATES.COLORADO.id);

//Nebraska
    MAP.stategraph.set(MAP.STATES.NEBRASKA.id, MAP.STATES.MISSOURI.id);
    MAP.stategraph.set(MAP.STATES.NEBRASKA.id, MAP.STATES.IOWA.id);
    MAP.stategraph.set(MAP.STATES.NEBRASKA.id, MAP.STATES.WYOMING.id);
    MAP.stategraph.set(MAP.STATES.NEBRASKA.id, MAP.STATES.COLORADO.id);
    MAP.stategraph.set(MAP.STATES.NEBRASKA.id, MAP.STATES.KANSAS.id);

//Iowa
    MAP.stategraph.set(MAP.STATES.IOWA.id, MAP.STATES.MISSOURI.id);
    MAP.stategraph.set(MAP.STATES.IOWA.id, MAP.STATES.ILLINOIS.id);
    MAP.stategraph.set(MAP.STATES.IOWA.id, MAP.STATES.WISCONSIN.id);
    MAP.stategraph.set(MAP.STATES.IOWA.id, MAP.STATES.MINNESOTA.id);
    MAP.stategraph.set(MAP.STATES.IOWA.id, MAP.STATES.SOUTH_DAKOTA.id);
    MAP.stategraph.set(MAP.STATES.IOWA.id, MAP.STATES.NEBRASKA.id);

//Wisconsin
    MAP.stategraph.set(MAP.STATES.WISCONSIN.id, MAP.STATES.MINNESOTA.id);
    MAP.stategraph.set(MAP.STATES.WISCONSIN.id, MAP.STATES.IOWA.id);
    MAP.stategraph.set(MAP.STATES.WISCONSIN.id, MAP.STATES.ILLINOIS.id);

//Minnesota
    MAP.stategraph.set(MAP.STATES.MINNESOTA.id, MAP.STATES.WISCONSIN.id);
    MAP.stategraph.set(MAP.STATES.MINNESOTA.id, MAP.STATES.IOWA.id);
    MAP.stategraph.set(MAP.STATES.MINNESOTA.id, MAP.STATES.SOUTH_DAKOTA.id);
    MAP.stategraph.set(MAP.STATES.MINNESOTA.id, MAP.STATES.NORTH_DAKOTA.id);

//North Dakota
    MAP.stategraph.set(MAP.STATES.NORTH_DAKOTA.id, MAP.STATES.MINNESOTA.id);
    MAP.stategraph.set(MAP.STATES.NORTH_DAKOTA.id, MAP.STATES.SOUTH_DAKOTA.id);
    MAP.stategraph.set(MAP.STATES.NORTH_DAKOTA.id, MAP.STATES.MONTANA.id);

//South Dakota
    MAP.stategraph.set(MAP.STATES.SOUTH_DAKOTA.id, MAP.STATES.NEBRASKA.id);
    MAP.stategraph.set(MAP.STATES.SOUTH_DAKOTA.id, MAP.STATES.IOWA.id);
    MAP.stategraph.set(MAP.STATES.SOUTH_DAKOTA.id, MAP.STATES.MINNESOTA.id);
    MAP.stategraph.set(MAP.STATES.SOUTH_DAKOTA.id, MAP.STATES.NORTH_DAKOTA.id);
    MAP.stategraph.set(MAP.STATES.SOUTH_DAKOTA.id, MAP.STATES.MONTANA.id);
    MAP.stategraph.set(MAP.STATES.SOUTH_DAKOTA.id, MAP.STATES.WYOMING.id);

//Colorado
    MAP.stategraph.set(MAP.STATES.COLORADO.id, MAP.STATES.NEW_MEXICO.id);
    MAP.stategraph.set(MAP.STATES.COLORADO.id, MAP.STATES.OKLAHOMA.id);
    MAP.stategraph.set(MAP.STATES.COLORADO.id, MAP.STATES.KANSAS.id);
    MAP.stategraph.set(MAP.STATES.COLORADO.id, MAP.STATES.NEBRASKA.id);
    MAP.stategraph.set(MAP.STATES.COLORADO.id, MAP.STATES.WYOMING.id);
    MAP.stategraph.set(MAP.STATES.COLORADO.id, MAP.STATES.UTAH.id);

//New Mexico
    MAP.stategraph.set(MAP.STATES.NEW_MEXICO.id, MAP.STATES.TEXAS.id);
    MAP.stategraph.set(MAP.STATES.NEW_MEXICO.id, MAP.STATES.OKLAHOMA.id);
    MAP.stategraph.set(MAP.STATES.NEW_MEXICO.id, MAP.STATES.COLORADO.id);
    MAP.stategraph.set(MAP.STATES.NEW_MEXICO.id, MAP.STATES.ARIZONA.id);

//Arizona
    MAP.stategraph.set(MAP.STATES.ARIZONA.id, MAP.STATES.NEW_MEXICO.id);
    MAP.stategraph.set(MAP.STATES.ARIZONA.id, MAP.STATES.UTAH.id);
    MAP.stategraph.set(MAP.STATES.ARIZONA.id, MAP.STATES.NEVADA.id);
    MAP.stategraph.set(MAP.STATES.ARIZONA.id, MAP.STATES.CALIFORNIA.id);

//Utah
    MAP.stategraph.set(MAP.STATES.UTAH.id, MAP.STATES.ARIZONA.id);
    MAP.stategraph.set(MAP.STATES.UTAH.id, MAP.STATES.COLORADO.id);
    MAP.stategraph.set(MAP.STATES.UTAH.id, MAP.STATES.WYOMING.id);
    MAP.stategraph.set(MAP.STATES.UTAH.id, MAP.STATES.IDAHO.id);
    MAP.stategraph.set(MAP.STATES.UTAH.id, MAP.STATES.NEVADA.id);

//Wyoming
    MAP.stategraph.set(MAP.STATES.WYOMING.id, MAP.STATES.COLORADO.id);
    MAP.stategraph.set(MAP.STATES.WYOMING.id, MAP.STATES.NEBRASKA.id);
    MAP.stategraph.set(MAP.STATES.WYOMING.id, MAP.STATES.SOUTH_DAKOTA.id);
    MAP.stategraph.set(MAP.STATES.WYOMING.id, MAP.STATES.MONTANA.id);
    MAP.stategraph.set(MAP.STATES.WYOMING.id, MAP.STATES.IDAHO.id);
    MAP.stategraph.set(MAP.STATES.WYOMING.id, MAP.STATES.UTAH.id);

//Montana
    MAP.stategraph.set(MAP.STATES.MONTANA.id, MAP.STATES.NORTH_DAKOTA.id);
    MAP.stategraph.set(MAP.STATES.MONTANA.id, MAP.STATES.SOUTH_DAKOTA.id);
    MAP.stategraph.set(MAP.STATES.MONTANA.id, MAP.STATES.WYOMING.id);
    MAP.stategraph.set(MAP.STATES.MONTANA.id, MAP.STATES.IDAHO.id);

//Idaho
    MAP.stategraph.set(MAP.STATES.IDAHO.id, MAP.STATES.UTAH.id);
    MAP.stategraph.set(MAP.STATES.IDAHO.id, MAP.STATES.WYOMING.id);
    MAP.stategraph.set(MAP.STATES.IDAHO.id, MAP.STATES.MONTANA.id);
    MAP.stategraph.set(MAP.STATES.IDAHO.id, MAP.STATES.WASHINGTON.id);
    MAP.stategraph.set(MAP.STATES.IDAHO.id, MAP.STATES.OREGON.id);
    MAP.stategraph.set(MAP.STATES.IDAHO.id, MAP.STATES.NEVADA.id);

//Washington
    MAP.stategraph.set(MAP.STATES.WASHINGTON.id, MAP.STATES.IDAHO.id);
    MAP.stategraph.set(MAP.STATES.WASHINGTON.id, MAP.STATES.OREGON.id);

//Oregon
    MAP.stategraph.set(MAP.STATES.OREGON.id, MAP.STATES.IDAHO.id);
    MAP.stategraph.set(MAP.STATES.OREGON.id, MAP.STATES.WASHINGTON.id);
    MAP.stategraph.set(MAP.STATES.OREGON.id, MAP.STATES.CALIFORNIA.id);
    MAP.stategraph.set(MAP.STATES.OREGON.id, MAP.STATES.NEVADA.id);

//Nevada
    MAP.stategraph.set(MAP.STATES.NEVADA.id, MAP.STATES.UTAH.id);
    MAP.stategraph.set(MAP.STATES.NEVADA.id, MAP.STATES.ARIZONA.id);
    MAP.stategraph.set(MAP.STATES.NEVADA.id, MAP.STATES.CALIFORNIA.id);
    MAP.stategraph.set(MAP.STATES.NEVADA.id, MAP.STATES.OREGON.id);
    MAP.stategraph.set(MAP.STATES.NEVADA.id, MAP.STATES.IDAHO.id);

//California
    MAP.stategraph.set(MAP.STATES.CALIFORNIA.id, MAP.STATES.ARIZONA.id);
    MAP.stategraph.set(MAP.STATES.CALIFORNIA.id, MAP.STATES.NEVADA.id);
    MAP.stategraph.set(MAP.STATES.CALIFORNIA.id, MAP.STATES.OREGON.id);

    MAP.setRandomSpeeds();
};

MAP.assignIndexes = function () {
    var i = 0;
    for (var property in MAP.STATES) {
        if (MAP.STATES.hasOwnProperty(property)) {
            var obj = MAP.STATES[property];
            obj.id = i;
            MAP.lookup[i] = obj;
            i++;
        }
    }
};

MAP.setRandomSpeeds = function () {

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    for (var i = 0; i < MAP.lookup.length; i++) {
        var adj = MAP.stategraph.adj(i);
        for (var j = 0; j < adj.length; j++) {
            MAP.stategraph.set(i, adj[j], 50);
        }
    }
};

function lineDistance(x1, y1, x2, y2) {
    var xs = 0;
    var ys = 0;

    xs = x2 - x1;
    xs = xs * xs;

    ys = y2 - y1;
    ys = ys * ys;

    return Math.sqrt(xs + ys) * MAP.distanceScale;
}

function RGBtoHEX(r, g, b) {

    return r << 16 | g << 8 | b;
}


/**
 * Is state2 adjacent to state 1
 * @param {type} state1
 * @param {type} state2
 * @returns {undefined}
 */
function isAdjacentState(state1, state2) {
    for (var i in MAP.stategraph.adj(state1.id)) {
        //console.log(i);
        if (Number(i) === state2.id) {
            return true;
        }
    }
    return false;
}

function kmtoMiles(km) {
    return km * MAP.kmToMiles;
}

MAP.initialize();

/* Tests
 console.log(Math.round((1 / ratio) * lineDistance(states[1].x, states[1].y, states[2].x, states[2].y)));
 
 for (var i in stategraph.adj(MAP.STATES.NEW_HAMPSHIRE.id)) {
 console.log(lookup[i].name);
 }
 */
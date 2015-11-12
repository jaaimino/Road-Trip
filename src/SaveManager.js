/* 
 * Will manage saving game data. Will probably use a JSON object to store save data in one string.
 * JSON is somewhat portable, and could save to a database potentially.
 * Will use localStorage for now. Won't persist across cookie clears
 * 
 * DON'T USE THIS CLASS. IT HASN'T BEEN COMPLETELY IMPLEMENTED
 */
/* global SHARED_DATA, MAP */

SaveManager = {};
SaveManager.saveSharedData = function () {
    SHARED_DATA.mapbitmapdata = null;
    var savestring = JSON.stringify(JSON.decycle(SHARED_DATA));
    localStorage.setItem('savedata', savestring);
};

SaveManager.loadSharedData = function () {
    SHARED_DATA = JSON.parse(JSON.retrocycle(localStorage.getItem('savedata')));
};

/*
SaveManager.saveSharedData = function () {
    var savestring = JSON.stringify(new SaveData());
    localStorage.setItem('savedata', savestring);
};
*/

/**
 * Check localstorage for save data. If it's null, no save, 
 * else, set input variable to it
 * @returns {undefined}
 */
/*
SaveManager.loadSharedData = function () {
    var data = JSON.parse(localStorage.getItem('savedata'));
    
    SHARED_DATA.money = data.money; 
    SHARED_DATA.gas = data.gas;
    SHARED_DATA.food = data.food;
    SHARED_DATA.water = data.water;
    SHARED_DATA.karma = data.karma;
    SHARED_DATA.fun = data.fun;
    SHARED_DATA.carChoice = data.carChoice;
    
    SHARED_DATA.destinationState = MAP.lookup[data.destinationState]; //Convert back to state objects
    SHARED_DATA.startState = MAP.lookup[data.startState]; //Convert back to state objects
    SHARED_DATA.currentState = MAP.lookup[data.currentState]; //Convert back to state objects
    
    //SHARED_DATA.mapbitmapdata = data.mapbitmapdata;
    SHARED_DATA.sawMapTutorial = data.sawMapTutorial;
    SHARED_DATA.sawStoreTutorial = data.sawStoreTutorial;
    SHARED_DATA.sawDrivingTutorial = data.sawDrivingTutorial;
    SHARED_DATA.sawGasTutorial = data.sawGasTutorial;
    SHARED_DATA.sawSetupTutorial = data.sawSetupTutorial;
    SHARED_DATA.sawChickenChasingTutorial = data.sawChickenChasingTutorial;
    SHARED_DATA.sawSnowboardingTutorial = data.sawSnowboardingTutorial;
};
*/

SaveManager.deleteSharedData = function() {
    localStorage.removeItem('savedata');
};

/**
 * SaveData constructor
 * @returns {SaveData}
 */
function SaveData(){
    this.money = SHARED_DATA.money;
    this.gas = SHARED_DATA.gas;
    this.food = SHARED_DATA.food;
    this.water = SHARED_DATA.water;
    this.karma = SHARED_DATA.karma;
    this.fun = SHARED_DATA.fun;
    
    //this.carChoice = SHARED_DATA.carChoice;
    
    this.destinationState = SHARED_DATA.destinationState.id; //Needed to use int here
    this.startState = SHARED_DATA.startState.id; //Needed to use int here
    this.currentState = SHARED_DATA.currentState.id; //Needed to use int here
    
    //this.mapbitmapdata = SHARED_DATA.mapbitmapdata; //Dunno about this one
   
    this.sawMapTutorial = SHARED_DATA.sawMapTutorial;
    this.sawStoreTutorial = SHARED_DATA.sawStoreTutorial;
    this.sawDrivingTutorial = SHARED_DATA.sawDrivingTutorial;
    this.sawGasTutorial = SHARED_DATA.sawGasTutorial;
    this.sawSetupTutorial = SHARED_DATA.sawSetupTutorial;
    this.sawChickenChasingTutorial = SHARED_DATA.sawChickenChasingTutorial;
    this.sawSnowboardingTutorial = SHARED_DATA.sawSnowboardingTutorial;
};




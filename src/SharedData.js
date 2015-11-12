/* global MAP */

/**
 * Constructor for shared data object
 * @returns {new shared data}
 */
SHARED_DATA = new SharedData();

function SharedData(){
    this.score = 0;
    
    //Customization
    this.startState = null;
    this.destinationState = null;
    this.carChoice = null; //Will be car object
    
    //Resources
    this.gas = 5;
    this.food = 4;
    this.water = 4;
    this.money = 20;
    this.karma = 0; //Neutral
    this.fun = 0; //Neutral
    
    //Store
    this.shoppingFor = null;
    
    //Map
    this.currentState = null;
    this.mapbitmapdata = null;
    this.targetState = null;
    this.distanceToTargetState = null;
    this.offeredMiniGame = false;
    
    //Tutorials
    this.sawMapTutorial = false;
    this.sawStoreTutorial = false;
    this.sawDrivingTutorial = false;
    this.sawGasTutorial = false;
    this.sawSetupTutorial = false;
    this.sawChickenChasingTutorial = false;
    this.sawSnowboardingTutorial = false;
    
    //Driving/Out of Resources
    this.ranOutOfGas = false;
    this.ranOutOfFood = false;
    this.ranOutOfWater = false;
}

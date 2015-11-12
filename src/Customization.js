/* global MAP */
CUSTOM = {};

CUSTOM.CARS = [];
//CUSTOM.CARS.push(new Car("Blue Car", 'car_blue', 0.8, 10, 10));
//CUSTOM.CARS.push(new Car("Green Car", 'car_green', 0.8, 10, 10));
//CUSTOM.CARS.push(new Car("Orange Car", 'car_orange', 0.8, 10, 10));
//CUSTOM.CARS.push(new Car("Purple Car", 'car_purple', 0.8, 10, 10));
//CUSTOM.CARS.push(new Car("Yellow Car", 'car_yellow', 0.8, 10, 10));

CUSTOM.CARS.push(new Car("Blue Mini", 'mini_blue', 1.2, 9, 12));
CUSTOM.CARS.push(new Car("Green Mini", 'mini_green', 1.2, 9, 12));
CUSTOM.CARS.push(new Car("White Mini", 'mini_white', 1.2, 9, 12));
CUSTOM.CARS.push(new Car("Red Mini", 'mini_red', 1.2, 8, 12));
CUSTOM.CARS.push(new Car("Yellow Mini", 'mini_yellow', 1.2, 9, 12));

CUSTOM.CARS.push(new Car("Black Sedan", 'sedan_black', 1.5, 9, 11));
CUSTOM.CARS.push(new Car("Gray Sedan", 'sedan_gray', 1.5, 9, 11));
CUSTOM.CARS.push(new Car("Green Sedan", 'sedan_green', 1.5, 9, 11));
CUSTOM.CARS.push(new Car("Red Sedan", 'sedan_red', 1.5, 9, 11));
CUSTOM.CARS.push(new Car("Yellow Sedan", 'sedan_yellow', 1.5, 9, 11));

CUSTOM.CARS.push(new Car("Blue Sport", 'sports_blue', 1.5, 8, 14));
CUSTOM.CARS.push(new Car("Green Sport", 'sports_green', 1.5, 8, 14));
CUSTOM.CARS.push(new Car("Orange Sport", 'sports_orange', 1.5, 8, 14));
CUSTOM.CARS.push(new Car("Red Sport", 'sports_red', 1.5, 8, 14));
CUSTOM.CARS.push(new Car("Yellow Sport", 'sports_yellow', 1.5, 8, 14));

CUSTOM.CARS.push(new Car("Black Truck", 'truck_black', 1.8, 15, 8));
CUSTOM.CARS.push(new Car("Green Truck", 'truck_green', 1.8, 15, 8));
CUSTOM.CARS.push(new Car("Orange Truck", 'truck_orange', 1.8, 15, 8));
CUSTOM.CARS.push(new Car("Red Truck", 'truck_red', 1.8, 15, 8));
CUSTOM.CARS.push(new Car("Yellow Truck", 'truck_yellow', 1.8, 15, 8));

CUSTOM.CARS.push(new Car("Red Racer", 'player_car_small', 0.87, 8, 10));
CUSTOM.CARS.push(new Car("Bright Green Racer", 'racer_bgreen', 0.87, 8, 10));
CUSTOM.CARS.push(new Car("Dark Blue Racer", 'racer_dblue', 0.87, 8, 10));
CUSTOM.CARS.push(new Car("Dark Green Racer", 'racer_green', 0.87, 8, 10));
CUSTOM.CARS.push(new Car("Light Blue Racer", 'racer_lblue', 0.87, 8, 10));
CUSTOM.CARS.push(new Car("Orange Racer", 'racer_orange', 0.87, 8, 10));
CUSTOM.CARS.push(new Car("Pink Racer", 'racer_pink', 0.87, 8, 10));
CUSTOM.CARS.push(new Car("Purple Racer", 'racer_purple', 0.87, 8, 10));
CUSTOM.CARS.push(new Car("Turquoise Racer", 'racer_turquoise', 0.87, 8, 10));
CUSTOM.CARS.push(new Car("Yellow Racer", 'racer_yellow', 0.87, 8, 10));

CUSTOM.CARS.push(new Car("Red Racer", 'player_car_small', 0.87, 5, 20));
CUSTOM.CARS.push(new Car("Bright Green Racer", 'racer_bgreen', 0.87, 5, 20));
CUSTOM.CARS.push(new Car("Dark Blue Racer", 'racer_dblue', 0.87, 5, 20));
CUSTOM.CARS.push(new Car("Dark Green Racer", 'racer_green', 0.87, 5, 20));
CUSTOM.CARS.push(new Car("Light Blue Racer", 'racer_lblue', 0.87, 5, 20));
CUSTOM.CARS.push(new Car("Orange Racer", 'racer_orange', 0.87, 5, 20));
CUSTOM.CARS.push(new Car("Pink Racer", 'racer_pink', 0.87, 5, 20));
CUSTOM.CARS.push(new Car("Purple Racer", 'racer_purple', 0.87, 5, 20));
CUSTOM.CARS.push(new Car("Turquoise Racer", 'racer_turquoise', 0.87, 5, 20));
CUSTOM.CARS.push(new Car("Yellow Racer", 'racer_yellow', 0.87, 5, 20));


CUSTOM.ROUTES = [];
CUSTOM.ROUTES.push(new Route("East Coast Tour", MAP.STATES.MAINE, MAP.STATES.FLORIDA));
CUSTOM.ROUTES.push(new Route("Reverse East Coast Tour", MAP.STATES.FLORIDA, MAP.STATES.MAINE));
CUSTOM.ROUTES.push(new Route("Cross Country", MAP.STATES.DELAWARE, MAP.STATES.CALIFORNIA));
CUSTOM.ROUTES.push(new Route("Reverse Cross Country", MAP.STATES.CALIFORNIA, MAP.STATES.DELAWARE));
CUSTOM.ROUTES.push(new Route("Oregon Trail", MAP.STATES.MISSOURI, MAP.STATES.OREGON));
CUSTOM.ROUTES.push(new Route("Reverse Oregon Trail", MAP.STATES.OREGON, MAP.STATES.MISSOURI));
CUSTOM.ROUTES.push(new Route("Southern States Road Trip", MAP.STATES.GEORGIA, MAP.STATES.TEXAS));
CUSTOM.ROUTES.push(new Route("Reverse Southern States Road Trip", MAP.STATES.TEXAS, MAP.STATES.GEORGIA));
//CUSTOM.ROUTES.push(new Route("Super Secret Test Route", MAP.STATES.MASSACHUSETTS, MAP.STATES.RHODE_ISLAND));


function Car(name, imageName, scale, tankSize, mpg) {
    this.name = name;
    this.imageName = imageName;
    this.scale = scale;
    this.tankSize = tankSize;
    this.mpg = mpg;
}

/**
 * @param {string} name
 * @param {State} state1
 * @param {State} state2
 * @returns {Route}
 */
function Route(name, state1, state2) {
    this.name = name;
    this.state1 = state1;
    this.state2 = state2;
}



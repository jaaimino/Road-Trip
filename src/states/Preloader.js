/* global RoadTrip, MAP, Phaser */

RoadTrip.Preloader = function (game) {
    this.timer = null;
};

RoadTrip.Preloader.prototype = {
    preload: function () {
        this.stage.backgroundColor = '#4176A3'; //Change background color here

        //var pb = this.preloadBar = this.add.sprite(this.world.centerX, this.world.height - 50, 'preloaderBar');
        //pb.scale.set(1.3, 1.0);
        //pb.anchor.set(0.5, 0.5);
        //this.load.setPreloadSprite(this.preloadBar);

        var titlestyle = {font: "bold 55pt Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};

        var titleText = this.game.add.text(this.game.world.centerX, 50, "The Brogrammers", titlestyle);
        titleText.anchor.set(0.5, 0.5);
        titleText.alpha = 0;

        this.game.add.tween(titleText).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        var brogrammershadow = this.game.add.sprite(this.world.centerX + 8, this.world.centerY + 8, 'brogrammer');
        brogrammershadow.scale.set(0.8);
        brogrammershadow.anchor.set(0.5, 0.5);
        brogrammershadow.tint = 0x000000;
        brogrammershadow.alpha = 0;

        this.game.add.tween(brogrammershadow).to({alpha: 0.6}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        var brogrammer = this.add.sprite(this.world.centerX, this.world.centerY, 'brogrammer');
        brogrammer.scale.set(0.8);
        brogrammer.alpha = 0;
        brogrammer.anchor.set(0.5, 0.5);

        this.game.add.tween(brogrammer).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        var loadingstyle = {font: "bold 20pt Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};

        var loading = this.game.add.text(this.game.world.centerX, this.world.height - 50, "Loading...", loadingstyle);
        loading.anchor.set(0.5, 0.5);
        loading.alpha = 0;

        this.game.add.tween(loading).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        //Main Menu
        this.load.image('cityscape', 'assets/mainmenu/cityscape.png');
        this.load.image('newyork', 'assets/mainmenu/newyork.png');
        this.load.image('carprev', 'assets/mainmenu/carprev.png');

        this.load.image('sky_day', 'assets/mainmenu/sky_day.png');
        this.load.image('sky_sunset', 'assets/mainmenu/sky_sunset.png');
        this.load.image('sky_night', 'assets/mainmenu/sky_night.png');

        //Map
        this.load.image('map', 'assets/map/map.png');
        this.load.image('pushpin', 'assets/map/pushpin.png');
        this.load.image('pushpin_green', 'assets/map/pushpingreen.png');
        this.load.image('help', 'assets/gui/help.png');

        this.load.audio('theme', ['assets/music/theme.mp3', 'assets/music/theme.ogg']);

        // load spritesheets
        this.load.spritesheet('buttons_long', 'assets/gui/buttons_grey.png', 218, 67);

        //store
        this.load.image('shelf', 'assets/store/shelf.png');
        this.load.image('water', 'assets/store/water.png');
        this.load.image('priceTag', 'assets/store/pricetag.png');
        this.load.image('banana', 'assets/store/banana.png');
        this.load.image('gas', 'assets/store/gascan.png');
        this.load.image('backdrop', 'assets/store/store.png');
        this.load.image('money', 'assets/store/money.png');

        this.load.image('money2', 'assets/store/money2.png');
        this.load.image('food', 'assets/store/grocery-bag.png');

        //driving
        this.load.image('background', 'assets/driving/background.png');
        this.load.image('highway_sign', 'assets/driving/highway_sign.png');
        this.load.image('road_line', 'assets/driving/road_line.png');
        this.load.image('car_blue', 'assets/driving/car_blue.png');
        this.load.image('car_green', 'assets/driving/car_green.png');
        this.load.image('car_orange', 'assets/driving/car_orange.png');
        this.load.image('car_purple', 'assets/driving/car_purple.png');
        this.load.image('car_yellow', 'assets/driving/car_yellow.png');
        this.load.image('player_car_small', 'assets/driving/player_car_small.png');
        this.load.image('spedo', 'assets/driving/speedometer.png');

        //Vehicles
        this.load.image('mini_blue', 'assets/driving/mini_blue.png');
        this.load.image('mini_green', 'assets/driving/mini_green.png');
        this.load.image('mini_white', 'assets/driving/mini_white.png');
        this.load.image('mini_red', 'assets/driving/mini_red.png');
        this.load.image('mini_yellow', 'assets/driving/mini_yellow.png');

        this.load.image('sedan_black', 'assets/driving/sedan_black.png');
        this.load.image('sedan_gray', 'assets/driving/sedan_gray.png');
        this.load.image('sedan_green', 'assets/driving/sedan_green.png');
        this.load.image('sedan_red', 'assets/driving/sedan_red.png');
        this.load.image('sedan_yellow', 'assets/driving/sedan_yellow.png');

        this.load.image('sports_blue', 'assets/driving/sports_blue.png');
        this.load.image('sports_green', 'assets/driving/sports_green.png');
        this.load.image('sports_orange', 'assets/driving/sports_orange.png');
        this.load.image('sports_red', 'assets/driving/sports_red.png');
        this.load.image('sports_yellow', 'assets/driving/sports_yellow.png');

        this.load.image('truck_black', 'assets/driving/truck_black.png');
        this.load.image('truck_green', 'assets/driving/truck_green.png');
        this.load.image('truck_orange', 'assets/driving/truck_orange.png');
        this.load.image('truck_red', 'assets/driving/truck_red.png');
        this.load.image('truck_yellow', 'assets/driving/truck_yellow.png');

        this.load.image('racer_bgreen', 'assets/driving/racer_bgreen.png');
        this.load.image('racer_dblue', 'assets/driving/racer_dblue.png');
        this.load.image('racer_green', 'assets/driving/racer_green.png');
        this.load.image('racer_lblue', 'assets/driving/racer_lblue.png');
        this.load.image('racer_orange', 'assets/driving/racer_orange.png');
        this.load.image('racer_pink', 'assets/driving/racer_pink.png');
        this.load.image('racer_purple', 'assets/driving/racer_purple.png');
        this.load.image('racer_turquoise', 'assets/driving/racer_turquoise.png');
        this.load.image('racer_yellow', 'assets/driving/racer_yellow.png');

        //gas station
        this.load.image('gas_pump', 'assets/gas_station/gas_pump.png');
        this.load.image('buyBtn', 'assets/gas_station/buy_now_button.png');
        this.load.image('plus', 'assets/gas_station/plus.png');
        this.load.image('minus', 'assets/gas_station/minus.png');
        this.load.image('gas_station_background', 'assets/gas_station/background.png');
        this.load.image('test', 'assets/gas_station/petrol-pump.png');

        //rafting
        this.load.image('player_boat', 'assets/rafting/boat.png');
        this.load.image('water_background', 'assets/rafting/tex_Water.png');
        this.load.image('rock', 'assets/rafting/rock.png');
        this.load.image('boat_big', 'assets/rafting/ship_large_body.png');
        this.load.image('bridgeSection', 'assets/rafting/bridge.png');

        //chicken chasing
        this.load.image('chicken_player', 'assets/chicken_chasing/player_boy.png');
        this.load.image('chicken', 'assets/chicken_chasing/chicken.png');
        this.load.image('chicken_bg', 'assets/chicken_chasing/background.png');

        //Skiing
        this.load.image('snowscape', 'assets/snowboarding/snowscape.png');
        this.load.image('snow_drift', 'assets/snowboarding/snow_drift.png');
        this.load.image('ramp', 'assets/snowboarding/ramp.png');
        this.load.image('snowboarder', 'assets/snowboarding/snowboarder.png');
        this.load.image('board', 'assets/snowboarding/board.png');
        this.load.image('coordinate_plane', 'assets/snowboarding/coordinate_plane.png');

        //Music
        this.load.audio('theme', ['assets/music/theme.mp3', 'assets/music/theme.ogg']);
    },
    update: function () {
        //console.log("Test");
    },
    create: function () {
        this.timer = this.game.time.create(this.game);
        this.timer.add(2000, this.startGame, this);
        this.timer.start();
    },
    startGame: function () {
        this.state.start('MainMenu');
    }
};
/* global RoadTrip, CUSTOM, SHARED_DATA */

RoadTrip.Setup = function (game) {
    this.instructionText;
    this.carGroup;
    this.nCar;
    this.nRoute;
};

RoadTrip.Setup.prototype = {
    preload: function () {
        this.load.script('labelbutton.js', 'src/widgets/labelbutton.js');
    },
    create: function () {

        function randRange(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }

        this.stage.backgroundColor = '#4176A3'; //Change background color here
        this.nCar = randRange(0, CUSTOM.CARS.length - 1);
        this.nRoute = randRange(0, CUSTOM.ROUTES.length - 1);

        this.instructionText = this.game.add.text(this.game.world.centerX, 50, "Plan Your Trip", {font: "bold 50pt Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5});
        this.instructionText.anchor.set(0.5);

        var desctextstyle = {font: "bold 28pt Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
        var subdesctextstyle = {font: "bold 18pt Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};

        /* Car Chooser */
        var cardesc = this.game.add.text(200, 120, "Vehicle Choice", desctextstyle);
        cardesc.anchor.set(0.5, 0.5);
        
        var carname = this.game.add.text(200, this.game.world.centerY + 190, CUSTOM.CARS[this.nCar].name, subdesctextstyle);
        carname.anchor.set(0.5, 0.5);
        
        var carmpg = this.game.add.text(200, this.game.world.centerY + 220, "Miles Per Gallon: " + CUSTOM.CARS[this.nCar].mpg, subdesctextstyle);
        carmpg.anchor.set(0.5, 0.5);
        
        var cartanksize = this.game.add.text(200, this.game.world.centerY + 250, "Tank Size: " + CUSTOM.CARS[this.nCar].tankSize, subdesctextstyle);
        cartanksize.anchor.set(0.5, 0.5);

        this.carGroup = this.add.group();
        for (var i = 0; i < CUSTOM.CARS.length; i++) {
            var car = CUSTOM.CARS[i];
            car.image = this.carGroup.create(200, this.game.world.centerY + 10, car.imageName);
            car.image.anchor.set(0.5, 0.5);
            car.image.scale.set(car.scale);
        }
        this.carGroup.setAll('visible', false);
        CUSTOM.CARS[this.nCar].image.visible = true;

        this.addArrow("<", 50, this.game.world.centerY - 40, function () {
            CUSTOM.CARS[this.nCar].image.visible = false;
            this.nCar--;
            if (this.nCar < 0) {
                this.nCar = CUSTOM.CARS.length - 1;
            } else if (this.nCar > CUSTOM.CARS.length) {
                this.nCar = 0;
            }
            carname.setText(CUSTOM.CARS[this.nCar].name);
            carmpg.setText("Miles Per Gallon: " + CUSTOM.CARS[this.nCar].mpg);
            cartanksize.setText("Tank Size: " + CUSTOM.CARS[this.nCar].tankSize);
            CUSTOM.CARS[this.nCar].image.visible = true;
        });
        this.addArrow(">", 300, this.game.world.centerY - 40, function () {
            CUSTOM.CARS[this.nCar].image.visible = false;
            this.nCar++;
            if (this.nCar < 0) {
                this.nCar = CUSTOM.CARS.length - 1;
            }
            if (this.nCar > CUSTOM.CARS.length - 1) {
                this.nCar = 0;
            }
            carname.setText(CUSTOM.CARS[this.nCar].name);
            carmpg.setText("Miles Per Gallon: " + CUSTOM.CARS[this.nCar].mpg);
            cartanksize.setText("Tank Size: " + CUSTOM.CARS[this.nCar].tankSize);
            CUSTOM.CARS[this.nCar].image.visible = true;
        });

        /* Route Chooser */
        var routedesc = this.game.add.text(665, 120, "Route Choice", desctextstyle);
        routedesc.anchor.set(0.5, 0.5);

        var routetextstyle = {font: "bold 18pt Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};

        var routechoicetext = this.game.add.text(685, this.game.world.centerY + 15, CUSTOM.ROUTES[this.nRoute].name, routetextstyle);
        routechoicetext.anchor.set(0.5, 0.5);
        routechoicetext.wordWrap = true;
        routechoicetext.wordWrapWidth = 220; //790 and 10 above to try do some padding
        
        var routestatenames = this.game.add.text(685, this.game.world.centerY + 105, "(" + CUSTOM.ROUTES[this.nRoute].state1.name + " to " +
        CUSTOM.ROUTES[this.nRoute].state2.name + ")", subdesctextstyle);
        routestatenames.anchor.set(0.5, 0.5);
        routestatenames.wordWrap = true;
        routestatenames.wordWrapWidth = 400;

        this.addArrow("<", 500, this.game.world.centerY - 40, function () {
            this.nRoute--;
            if (this.nRoute < 0) {
                this.nRoute = CUSTOM.ROUTES.length - 1;
            } else if (this.nRoute > CUSTOM.ROUTES.length) {
                this.nRoute = 0;
            }
            routestatenames.setText("(" + CUSTOM.ROUTES[this.nRoute].state1.name + " to " + CUSTOM.ROUTES[this.nRoute].state2.name + ")");
            routechoicetext.setText(CUSTOM.ROUTES[this.nRoute].name);

        });
        this.addArrow(">", 800, this.game.world.centerY - 40, function () {
            this.nRoute++;
            if (this.nRoute < 0) {
                this.nRoute = CUSTOM.ROUTES.length - 1;
            }
            if (this.nRoute > CUSTOM.ROUTES.length - 1) {
                this.nRoute = 0;
            }
            routestatenames.setText("(" + CUSTOM.ROUTES[this.nRoute].state1.name + " to " + CUSTOM.ROUTES[this.nRoute].state2.name + ")");
            routechoicetext.setText(CUSTOM.ROUTES[this.nRoute].name);
        });

        var button = new LabelButton(this, this.world.centerX, 560, 0.75, "buttons_long", "Ready",
                function () {
                    SHARED_DATA.carChoice = CUSTOM.CARS[this.nCar];
                    SHARED_DATA.gas = SHARED_DATA.carChoice.tankSize;
                    SHARED_DATA.startState = CUSTOM.ROUTES[this.nRoute].state1;
                    SHARED_DATA.destinationState = CUSTOM.ROUTES[this.nRoute].state2;
                    this.state.start('Map');
                    //this.state.start('ChickenChasing');
                    //this.state.start('Snowboarding');
                    //this.state.start('Rafting');
                }, this, 0, 1, 2);

        //this.showTutorial();
    },
    /**
     * 
     * @param {string} dir
     * @param {int} x
     * @param {int} y
     * @param {Function} fun
     * @returns {Text Object} text
     */
    addArrow: function (dir, x, y, fun) {
        var arrowstyle = {font: "bold 64pt Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
        var text = this.game.add.text(x, y, dir, arrowstyle);
        text.inputEnabled = true;
        text.input.useHandCursor = true;
        text.events.onInputDown.add(fun, this);
        return text;
    },
    showTutorial: function () {
        this.alert("Test", "Continue", this, function () {
            SHARED_DATA.sawSetupTutorial = true;
        });
    },
    alert: function (string, buttonstring, phaserstate, callBack, cancelable, cancelCallback) {
        var bg = this.drawRectangle(100, 80, 500, 300, "#000000");
        bg.alpha = 0.95;
        var text = this.game.add.text(this.game.world.centerX, 270, string);
        text.anchor.set(0.5, 0.5);
        text.font = 'Georgia';
        //text.fontWeight = 'bold';
        text.fontSize = 20;
        text.wordWrap = true;
        text.wordWrapWidth = 460; //790 and 10 above to try do some padding
        text.fill = 'white';
        text.align = 'center';
        text.setShadow(2, 5, 'rgba(0,0,0,0.5)', 0);
        var button = new LabelButton(this, this.game.world.centerX, 420, 0.75, "buttons_long", buttonstring,
                function () {
                    bg.destroy();
                    text.destroy();
                    button.kill();
                    callBack(phaserstate);
                }, this, 0, 1, 2);
        if (cancelable) {
            button.x = this.game.world.centerX - 100;
            var cancelbutton = new LabelButton(this, this.game.world.centerX + 100, 420, 0.75, "buttons_long", "Cancel",
                    function () {
                        bg.destroy();
                        text.destroy();
                        button.kill();
                        cancelbutton.kill();
                        cancelCallback(phaserstate);
                    }, this, 0, 1, 2);
        }
    },
    drawRectangle: function (x, y, width, height, color) {
        var bmd = this.game.add.bitmapData(width + x, height + y);
        bmd.ctx.beginPath();
        bmd.ctx.rect(x, y, width, height);
        bmd.ctx.fillStyle = color;
        bmd.ctx.fill();
        return this.game.add.image(x, y, bmd);
    }
};
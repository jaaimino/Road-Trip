/* global RoadTrip, MAP, STATES, SHARED_DATA, Phaser, MINIGAMES, SaveManager */

RoadTrip.Game = function (game) {
    //Groups
    this.thumbTackGroup;
    this.lineGroup;

    //Map lines
    this.mapbmd;
    this.mapsprite;

    //Hud count texts
    this.gascounttext;
    this.foodcounttext;
    this.watercounttext;
    this.moneycounttext;

    this.currentStateText;
    this.tutorialOpen;
    this.destinationSelected;
    this.timer;
    this.gasBlink = false;
    this.pinAlpha = 0.85;
};

RoadTrip.Game.prototype = {
    create: function () {
        this.stage.backgroundColor = '#4176A3'; //Change background color here

        this.add.sprite(0, 0, 'map');

        //Help pages
        this.tutorialOpen = false;
        this.destinationSelected = false;
        this.gasBlink = false;
        this.timer = 0;

        if (SHARED_DATA.currentState === null) {
            SHARED_DATA.currentState = SHARED_DATA.startState;
        }

        if (SHARED_DATA.mapbitmapdata === null) {
            SHARED_DATA.mapbitmapdata = this.game.add.bitmapData(900, 600);
        }

        //Line Group
        this.lineGroup = this.game.add.group();
        this.lineGroup.z = 0;

        this.mapsprite = this.lineGroup.create(0, 0, SHARED_DATA.mapbitmapdata);

        //Thumb Tack Group
        this.thumbTackGroup = this.game.add.group();
        this.thumbTackGroup.z = 1;

        //Create all thumbtacks
        for (var i = 0; i < MAP.lookup.length; i++) {
            if (MAP.lookup[i] !== SHARED_DATA.destinationState) {
                state = MAP.lookup[i];
                this.createStateThumbTack(MAP.lookup[i]);
                sprite = MAP.lookup[i].sprite;
            } else {
                this.createDestinationThumbTack();
            }
        }

        this.createHUD();

        //Progress gameplay
        if (SHARED_DATA.targetState !== null && !SHARED_DATA.ranOutOfGas && !SHARED_DATA.ranOutOfFood && !SHARED_DATA.ranOutOfWater) {
            this.setCurrentState(SHARED_DATA.targetState);
        } else {
            this.setCurrentState(SHARED_DATA.currentState);
            SHARED_DATA.targetState = null;
        }

        //Win condition :)
        if (SHARED_DATA.currentState === SHARED_DATA.destinationState) {
            this.winGame();
        }

        //Add lose condition here :(
        if ((SHARED_DATA.water <= 0 || SHARED_DATA.food <= 0 || SHARED_DATA.gas <= 0) && SHARED_DATA.money <= 5) {
            this.loseGame();
        }

        if (SHARED_DATA.targetState !== null && SHARED_DATA.targetState !== SHARED_DATA.destinationState) {
            if (!SHARED_DATA.offeredMiniGame) {
                SHARED_DATA.offeredMiniGame = true;
                string = "Welcome to " + SHARED_DATA.targetState.name + "!";
                var gameN = this.randRange(0, MINIGAMES.length - 1);
                string += "\n You can play " + MINIGAMES[gameN].name + " to earn some extra money.";
                this.alert(string, "Yes", this, function (state) {
                    this.game.state.start(MINIGAMES[gameN].stateName);
                }, true, "No", function (state) {
                });
            }
        }

        //Reset run out stuff
        SHARED_DATA.ranOutOfFood = false;
        SHARED_DATA.ranOutOfWater = false;
        SHARED_DATA.ranOutOfGas = false;

        //Show tutorial if they haven't seen it already
        if (!SHARED_DATA.sawMapTutorial) {
            this.showTutorial();
        }
    },
    winGame: function () {
        winstring = "You successfully completed your cross country trip to " + SHARED_DATA.destinationState.name + ". Way to go!";
        if (SHARED_DATA.karma > 0) {
            winstring += " You also managed to be a great person on the way :)";
        }
        this.alert(winstring, "Play Again", this, function () {
            SHARED_DATA = new SharedData();
            this.game.state.start('MainMenu');
        });
    },
    loseGame: function () {
        var winstring = "You have run out of supplies, and don't have enough money or gas to continue. You'll have to start over and try again.";
        if (SHARED_DATA.karma > 0) {
            winstring += " You managed to be a great person along the way :)";
        }
        this.alert(winstring, "Play Again", this, function () {
            SHARED_DATA = new SharedData();
            this.game.state.start('MainMenu');
        });
    },
    createHUD: function () {
        //Draw top and bottom rectangles
        var topRect = this.drawRectangle(0, 0, 900, 35, "#000000");
        topRect.alpha = 0.7;
        var bottomRect = this.drawRectangle(0, 283, 900, 35, "#000000");
        bottomRect.alpha = 0.7;
        var topTextStyle = {font: "30px Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};

        this.currentStateText = this.add.text(5, 0, "", topTextStyle);

        var countTextStyle = {font: "30px Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
        var money = this.add.image(10, 564, 'money');
        money.scale.set(0.07);
        this.moneycounttext = this.add.text(money.x + money.width + 10, 563, "$" + SHARED_DATA.money.toFixed(2), countTextStyle);

        var countTextStyle = {font: "30px Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
        var food = this.add.image(220, 567, 'food');
        food.scale.set(0.3);
        food.inputEnabled = true;
        food.input.useHandCursor = true;
        food.events.onInputDown.add(function () {
            if (!this.destinationSelected) {
                SHARED_DATA.shoppingFor = "Food";
                this.state.start('Store');
            }
        }, this);
        this.foodcounttext = this.add.text(food.x + food.width + 10, 563, "x" + SHARED_DATA.food, countTextStyle);

        var water = this.add.image(340, 567, 'water');
        water.scale.set(0.09);
        water.inputEnabled = true;
        water.input.useHandCursor = true;
        water.events.onInputDown.add(function () {
            if (!this.destinationSelected) {
                SHARED_DATA.shoppingFor = "Water";
                this.state.start('Store');
            }
        }, this);
        this.watercounttext = this.add.text(water.x + water.width + 5, 563, "x" + SHARED_DATA.water, countTextStyle);

        var gas = this.add.image(475, 569, 'gas');
        gas.scale.set(0.11);
        gas.inputEnabled = true;
        gas.input.useHandCursor = true;
        gas.events.onInputDown.add(function () {
            if (!this.destinationSelected) {
                this.state.start('GasStation');
            }
        }, this);

        var GasTextStyle;
        if (SHARED_DATA.gas <= SHARED_DATA.carChoice.tankSize / 4) {
            GasTextStyle = {font: "30px Georgia", fill: "red", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = true;
        }
        else if (SHARED_DATA.gas <= SHARED_DATA.carChoice.tankSize / 3) {
            GasTextStyle = {font: "30px Georgia", fill: "orange", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = true;
        } else {
            GasTextStyle = {font: "30px Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
        }
        this.gascounttext = this.add.text(gas.x + gas.width + 10, 560, SHARED_DATA.gas + "/" + SHARED_DATA.carChoice.tankSize, GasTextStyle);

        var help = this.add.image(860, 562, 'help');
        help.scale.set(0.3);
        help.inputEnabled = true;
        help.input.useHandCursor = true;
        help.events.onInputDown.add(function () {
            this.showTutorial();
        }, this);

    },
    showStatePicture: function () {
        var bg = this.drawRectangle(100, 80, 500, 300, "#000000");
        bg.alpha = 0.7;
        var image = this.game.add.image(this.game.world.centerX, 270, 'money');
        var text = this.game.add.text(this.game.world.centerX, 270, "Test");
        text.anchor.set(0.5, 0.5);
        text.font = 'Georgia';
        //text.fontWeight = 'bold';
        text.fontSize = 25;
        text.wordWrap = true;
        text.wordWrapWidth = 450; //790 and 10 above to try do some padding
        text.fill = 'white';
        text.align = 'center';
        text.setShadow(2, 5, 'rgba(0,0,0,0.5)', 0);
        var button = new LabelButton(this, this.game.world.centerX, 420, 0.75, "buttons_long", "Close",
                function () {
                    bg.destroy();
                    image.destroy();
                    text.destroy();
                    button.kill();
                }, this, 0, 1, 2);
    },
    showAdjacentPathes: function (state) {
        for (var i in MAP.stategraph.adj(state.id)) {
            MAP.lookup[i].sprite.visible = true;
            //bmdsprite.kill();
        }
    },
    hideAdjacentPathes: function (state) {
        for (var i in MAP.stategraph.adj(state.id)) {
            /*
             if (!MAP.lookup[i].visited) {
             MAP.lookup[i].sprite.visible = false;
             }
             */
            MAP.lookup[i].sprite.visible = false;
            //bmdsprite.kill();
        }
    },
    createStateThumbTack: function (state) {
        var sprite = this.thumbTackGroup.create(state.x, state.y, 'pushpin');
        state.visited = false;
        state.sprite = sprite;
        sprite.state = state;
        sprite.alpha = this.pinAlpha;
        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;
        sprite.visible = false;
        //sprite.input.enableDrag(true);
        //sprite.events.onDragStop.add(this.onDragStop, this);
        sprite.events.onInputDown.add(this.onInputDown, this);
        sprite.events.onInputOver.add(this.onMouseOver, this);
        sprite.events.onInputOut.add(this.onMouseOff, this);
    },
    createDestinationThumbTack: function () {
        var state = SHARED_DATA.destinationState;
        var sprite = this.thumbTackGroup.create(state.x, state.y, 'pushpin_green');
        state.visited = false;
        state.sprite = sprite;
        sprite.state = state;
        sprite.alpha = this.pinAlpha;
        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;
        sprite.visible = true;
        //sprite.input.enableDrag(true);
        //sprite.events.onDragStop.add(this.onDragStop, this);
        sprite.events.onInputDown.add(this.onInputDown, this);
        sprite.events.onInputOver.add(this.onMouseOver, this);
        sprite.events.onInputOut.add(this.onMouseOff, this);
    },
    update: function () {
        if (this.gasBlink) {
            this.timer += this.time.elapsed; //this is in ms, not seconds.
            if (this.timer >= 1000) {
                this.timer -= 1000;
                this.gascounttext.visible = !this.gascounttext.visible;
            }
        }
    },
    onInputDown: function (sprite, pointer) {
        if (SHARED_DATA.destinationState === sprite.state && !isAdjacentState(SHARED_DATA.currentState, sprite.state)) {
            if (!this.tutorialOpen) {
                this.tutorialOpen = true;
                this.alert(SHARED_DATA.destinationState.name + " is your destination! Try to road trip your way here.",
                        "OK", this, function (state) {
                            state.tutorialOpen = false;
                        });
            }
        }
        if (isAdjacentState(SHARED_DATA.currentState, sprite.state)) {
            var targetStateName = sprite.state.name;
            var distance = Math.round(kmtoMiles(lineDistance(sprite.state.x, sprite.state.y, SHARED_DATA.currentState.x, SHARED_DATA.currentState.y)));
            if (SHARED_DATA.gas < 1 || SHARED_DATA.food < 1 || SHARED_DATA.water < 1) {
                var outofstring = "";
                if (SHARED_DATA.gas < 1)
                    outofstring += "You're out of gas. ";
                if (SHARED_DATA.food < 1)
                    outofstring += "You're out of food. ";
                if (SHARED_DATA.water < 1)
                    outofstring += "You're out of water. ";
                this.alert(outofstring + "Buy some more before you can travel.", "Continue", this, function () {
                });
            } else {

                if (!this.destinationSelected) {
                    this.destinationSelected = true;
                    var string = "You're about to drive to " + targetStateName + ".";
                    if (SHARED_DATA.gas < distance / SHARED_DATA.carChoice.mpg) {
                        string += " You might want to get more gas before you go.";
                    } else {
                        string += " Get ready to hit the road!";
                    }
                    if (!this.tutorialOpen) {
                        this.tutorialOpen = true;
                        this.alert(string, "Go", this, function () {
                            SHARED_DATA.targetState = sprite.state;
                            //console.log(distance);
                            SHARED_DATA.distanceToTargetState = distance;
                            this.game.state.start('Driving');
                            //this.game.state.start('ChickenChasing');
                        }, true, "Cancel", function (state) {
                            state.destinationSelected = false;
                            state.tutorialOpen = false;

                        });
                    }
                }
            }
        }
    },
    alert: function (string, buttonstring, phaserstate, callBack, cancelable, canceltext, cancelCallback) {
        var bg = this.drawRectangle(100, 70, 500, 330, "#000000");
        bg.alpha = 0;
        this.add.tween(bg).to({alpha: 0.8}, 300, Phaser.Easing.Linear.None, true).start();

        var textstyle = {font: "14pt Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
        var text = this.game.add.text(this.game.world.centerX, 280, string, textstyle);
        text.anchor.set(0.5, 0.5);
        text.wordWrap = true;
        text.wordWrapWidth = 460; //790 and 10 above to try do some padding
        text.alpha = 0;
        this.add.tween(text).to({alpha: 1.0}, 300, Phaser.Easing.Linear.None, true).start();
        
        var cancelbutton = null;
        var button = new LabelButton(this, this.game.world.centerX, 435, 0.75, "buttons_long", buttonstring,
                function () {
                    text.destroy();
                    button.kill();
                    if(cancelbutton !== null){
                        cancelbutton.kill();
                    }
                    var alerttween = this.game.add.tween(bg);
                    alerttween.to({alpha: 0}, 300);
                    alerttween.start();
                    alerttween.onComplete.add(function () {
                        bg.destroy();
                        callBack(phaserstate);
                    }, this);
                }, this, 0, 1, 2);
        button.alpha = 0;
        this.add.tween(button).to({alpha: 1.0}, 300, Phaser.Easing.Linear.None, true).start();
        
        if (cancelable) {
            button.x = this.game.world.centerX - 100;
            var cancelbutton = new LabelButton(this, this.game.world.centerX + 100, 435, 0.75, "buttons_long", canceltext,
                    function () {
                        text.destroy();
                        button.kill();
                        cancelbutton.kill();
                        var alerttween = this.game.add.tween(bg);
                        alerttween.to({alpha: 0}, 500);
                        alerttween.start();
                        alerttween.onComplete.add(function () {
                            bg.destroy();
                            cancelCallback(phaserstate);
                        }, this);
                    }, this, 0, 1, 2);
            cancelbutton.alpha = 0;
            this.add.tween(cancelbutton).to({alpha: 1.0}, 300, Phaser.Easing.Linear.None, true).start();
        }
    },
    onMouseOver: function (sprite, pointer) {
        this.add.tween(sprite).to({alpha: 1.0, x: sprite.state.x + 3, y: sprite.state.y - 3}, 100, Phaser.Easing.Linear.None, true).start();
        if (isAdjacentState(SHARED_DATA.currentState, sprite.state)) {
            var state = sprite.state;
            var speed = MAP.stategraph.get(state.id, SHARED_DATA.currentState.id);
            //console.log(speed);
            var distance = Math.round(kmtoMiles(lineDistance(state.x, state.y, SHARED_DATA.currentState.x, SHARED_DATA.currentState.y)));
            this.currentStateText.setText("Travel To: " + sprite.state.name + " (Distance: " + distance + " miles)");
        }
    },
    onMouseOff: function (sprite, pointer) {
        this.add.tween(sprite).to({alpha: this.pinAlpha, x: sprite.state.x, y: sprite.state.y}, 100, Phaser.Easing.Linear.None, true).start();
        this.currentStateText.setText("Current State: " + SHARED_DATA.currentState.name);
    },
    showTutorial: function () {
        if (!this.tutorialOpen) {
            this.tutorialOpen = true;
            this.alert("You begin your trip to " + SHARED_DATA.destinationState.name + " starting out in " + SHARED_DATA.startState.name + ". " +
                    "Click on a push pin to travel to a nearby state. You will use food, water, and gas as you travel. If you run out of food or water, you will lose. You can go " + SHARED_DATA.carChoice.mpg +
                    " miles per gallon, so plan accordingly. If you run out of fuel, you'll be sent back to where you came from. " +
                    "You can visit a shop to buy more supplies by clicking on one of the supply icons below.", "Continue", this, function (state) {
                        SHARED_DATA.sawMapTutorial = true;
                        state.tutorialOpen = false;
                    });
        }
    },
    setCurrentState: function (state) {
        if (SHARED_DATA.currentState !== null) {
            SHARED_DATA.currentState.sprite.input.useHandCursor = true;
            SHARED_DATA.currentState.sprite.tint = RGBtoHEX(255, 255, 255);
            this.hideAdjacentPathes(SHARED_DATA.currentState);
            if (SHARED_DATA.currentState !== state) {
                this.drawLine(SHARED_DATA.currentState.x, SHARED_DATA.currentState.y + 21, state.x, state.y + 21, "black");
            }
        }
        state.sprite.input.useHandCursor = false;
        state.visited = true;
        state.sprite.visible = true;
        this.showAdjacentPathes(state);
        SHARED_DATA.currentState = state;
        SHARED_DATA.currentState.sprite.tint = RGBtoHEX(10, 10, 10);
        this.currentStateText.setText("Current State: " + SHARED_DATA.currentState.name);
    },
    onDragStop: function (sprite, pointer) {
        //console.log(" dropped at x:" + (pointer.x - 9.5) + " y: " + (pointer.y - 10.5));
    },
    drawRectangle: function (x, y, width, height, color) {
        var bmd = this.game.add.bitmapData(width + x, height + y);
        bmd.ctx.beginPath();
        bmd.ctx.rect(x, y, width, height);
        bmd.ctx.fillStyle = color;
        bmd.ctx.fill();
        return this.game.add.image(x, y, bmd);
    },
    /**
     * Don't use in other states please. Relies on some shared constants
     * that would break if you borrowed this.
     * @param {type} x1
     * @param {type} y1
     * @param {type} x2
     * @param {type} y2
     * @param {type} color
     * @returns {undefined}
     */
    drawLine: function (x1, y1, x2, y2, color) {
        if (this.mapsprite !== null) {
            this.mapsprite.kill();
        }
        //Should make this global/shared
        SHARED_DATA.mapbitmapdata.ctx.beginPath();
        SHARED_DATA.mapbitmapdata.ctx.moveTo(x1, y1);
        SHARED_DATA.mapbitmapdata.ctx.lineTo(x2, y2);
        SHARED_DATA.mapbitmapdata.ctx.lineWidth = "2";
        SHARED_DATA.mapbitmapdata.ctx.strokeStyle = color;
        SHARED_DATA.mapbitmapdata.ctx.setLineDash([5, 6]);
        SHARED_DATA.mapbitmapdata.ctx.stroke();
        SHARED_DATA.mapbitmapdata.ctx.closePath();
        this.mapsprite = this.lineGroup.create(0, 0, SHARED_DATA.mapbitmapdata);
    },
    randRange: function randRange(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
};
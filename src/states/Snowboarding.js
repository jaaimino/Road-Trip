/* global RoadTrip, SHARED_DATA, Phaser */
/*
 * "Designed by Freepik.com"
 */

RoadTrip.Snowboarding = function (game) {
    this.snowboarder;
    this.board;
    this.pointText1 = null;
    this.pointText2 = null;
    this.x1Text;
    this.y1Text;
    this.coordinateplane;
    this.slopeText;
    this.point1 = {x: 0, y: 0};
    this.point2 = {x: 0, y: 0};
    this.targetPoint = {x: 0, y: 0};
    this.tutorialOpen = false;
    this.timer = null;
    this.timeLeft = 60;
    this.paused = false;
    this.timeText = null;
    this.pauseText = null;
    this.messageText = null;

    this.snowboardersHelped = 0;
    this.helpReward = 8;
};
RoadTrip.Snowboarding.prototype = {
    preload: function () {
        this.load.script('labelbutton.js', 'src/widgets/labelbutton.js');
    },
    create: function () {
        this.stage.backgroundColor = '#4176A3'; //Change background color here

        this.tutorialOpen = false;
        this.timeLeft = 60;
        this.paused = false;

        this.snowboardersHelped = 0;

        this.createNewQuestion();

        var background = this.add.image(this.game.world.centerX, this.game.world.centerY, 'snowscape');
        background.scale.set(0.8);
        background.anchor.set(0.5, 0.5);

        var checkbutton = new LabelButton(this, this.game.world.centerX, 300, 0.75, "buttons_long", "Check",
                function () {
                    if (this.messageText !== null) {
                        this.messageText.destroy();
                    }
                    this.messageText = this.add.text(this.world.centerX, 450, "", {font: "40px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
                    this.messageText.anchor.set(0.5);

                    var testslope = this.calcSlope(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
                    if (Math.abs(testslope - this.slope) < 0.0001) {
                        this.messageText.setText("Correct! Nice job!");
                        this.add.tween(this.messageText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
                        //console.log("got em");
                        this.snowboardersHelped++;
                        SHARED_DATA.money += this.helpReward;
                        this.moneycounttext.text = "$" + SHARED_DATA.money.toFixed(2);
                        this.animateGainAndLoss('money', this.helpReward, true);

                        this.doAnimation();
                        this.createNewQuestion();
                        this.updatePoint1Text();
                        this.updatePoint2Text();
                        this.updateSlopeText();
                    } else {
                        this.messageText.setText("Sorry, that's not correct.");
                        this.add.tween(this.messageText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
                    }
                }, this, 0, 1, 2);
        checkbutton.anchor.set(0.5, 0.5);

        //Set up keys
        this.cursors = this.input.keyboard.createCursorKeys();

        this.pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.pauseKey.onDown.add(this.pressedPauseKey, this);

        this.pauseText = this.add.text(this.world.centerX, this.world.centerY, "", {font: "40px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.pauseText.anchor.set(0.5);

        this.pointText1 = this.add.text(this.world.centerX, 150, "", {font: "30pt Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.pointText1.anchor.set(0.5, 0.5);

        this.updatePoint1Text();

        this.pointText2 = this.add.text(this.world.centerX, 100, "", {font: "30pt Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.pointText2.anchor.set(0.5, 0.5);

        this.updatePoint2Text();

        this.slopeText = this.add.text(this.world.centerX, 40, "Slope: ", {font: "30pt Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.slopeText.anchor.set(0.5, 0.5);

        this.x1Text = this.add.text(this.world.centerX - 70, 220, "x1", {font: "30pt Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.x1Text.anchor.set(0.5, 0.5);

        this.y1Text = this.add.text(this.world.centerX + 75, 220, "y1", {font: "30pt Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.y1Text.anchor.set(0.5, 0.5);

        this.updateSlopeText();

        this.addArrow("+", this.world.centerX - 30, 220, function () {
            if (!this.paused) {
                this.point1.x++;
                this.updatePoint1Text();
                this.updateBoard();
            }
        });

        this.addArrow("-", this.world.centerX - 110, 220, function () {
            if (!this.paused) {
                this.point1.x--;
                this.updatePoint1Text();
                this.updateBoard();
            }
        });

        this.addArrow("+", this.world.centerX + 110, 220, function () {
            if (!this.paused) {
                this.point1.y++;
                this.updatePoint1Text();
                this.updateBoard();
            }
        });


        this.addArrow("-", this.world.centerX + 35, 220, function () {
            if (!this.paused) {
                this.point1.y--;
                this.updatePoint1Text();
                this.updateBoard();
            }
        });

        this.board = this.add.image(this.game.world.centerX + 30, this.game.world.height - 100, 'ramp');
        this.board.scale.set(0.4);
        this.board.anchor.set(0.5, 0.5);

        this.updateBoard();

        this.snowboarder = this.add.image(0 - 100, this.game.world.height - 100, 'snowboarder');
        this.snowboarder.scale.set(0.2);
        this.snowboarder.anchor.set(0.5, 1);

        this.createHUD();

        this.timer = this.game.time.create(this.game);
        this.timer.loop(Phaser.Timer.SECOND, this.timerCallback, this);
        this.timer.start();

        this.timeText = this.add.text(10, 10, "Time Left: " + this.timeLeft, {font: "20px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});

        if (!SHARED_DATA.sawSnowboardingTutorial) {
            SHARED_DATA.sawSnowboardingTutorial = true;
            this.showTutorial();
        }
    },
    updatePoint1Text: function () {
        this.pointText1.setText("(x1, y1) = (" + this.point1.x + "," + this.point1.y + ")");
    },
    updatePoint2Text: function () {
        this.pointText2.setText("(x2, y2) = (" + this.point2.x + "," + this.point2.y + ")");
    },
    updateSlopeText: function () {
        this.slopeText.setText("Slope: " + (this.point2.y - this.targetPoint.y) + "/" + (this.point2.x - this.targetPoint.x));
    },
    updateBoard: function () {
        //var rotation = Math.atan(Math.abs(this.point2.y - this.point1.y) / Math.abs(this.point2.x - this.point1.x));
        var slope = this.calcSlope(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
        angle = -Math.atan(slope);
        this.board.rotation = 0.2 * angle;
        //console.log(slope + " " + this.slope);
        //console.log(this.point1.x + " " + this.point1.y + ", " + this.point2.x + " " + this.point2.y);
    },
    timerCallback: function () {
        this.timeLeft -= 1;
        this.timeText.text = "Time Left: " + this.timeLeft;
        if (this.timeLeft <= 0) {
            this.pause();
            this.tutorialOpen = true;
            //this.timer.destroy();

            this.alert("Time's up! You managed to help " + this.snowboardersHelped + " snowboarder" + (this.snowboardersHelped === 1 ? "" : "s")
                    + " and earned " + this.snowboardersHelped * this.helpReward + " dollars. Good job!", "Back to map", this, function (state) {
                        state.game.state.start('Map');
                    });
        }
    },
    calcSlope: function (x, y, x2, y2) {
        return (y2 - y) / (x2 - x);
    },
    randRange: function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    },
    doAnimation: function () {
        var tween = this.game.add.tween(this.snowboarder);
        tween.to({x: this.board.x, rotation: this.board.rotation}, 1000);
        tween.start();

        tween.onComplete.add(function () {
            tween = this.game.add.tween(this.snowboarder);
            tween.to({rotation: this.board.rotation}, 100);
            tween.start();
            tween.onComplete.add(function () {
                tween = this.game.add.tween(this.snowboarder);
                tween.to({x: this.game.world.width + this.snowboarder.width, y: 100}, 1000);
                tween.start();
                tween.onComplete.add(function () {
                    //console.log("completed");
                    this.snowboarder.rotation = 0;
                    this.snowboarder.x = -100;
                    this.snowboarder.y = this.game.world.height - 100;
                    this.updateBoard();
                }, this);
            }, this);
        }, this);
    },
    createNewQuestion: function () {
        this.point1.x = 0;
        this.point1.y = 0;
        do {
            this.point2.x = this.randRange(0, 20);
            this.point2.y = this.randRange(0, 20);
            this.targetPoint.x = this.randRange(0, 10);
            this.targetPoint.y = this.randRange(0, 10);
            this.slope = this.calcSlope(this.targetPoint.x, this.targetPoint.y, this.point2.x, this.point2.y);
        } while (this.slope <= 0 || (this.point2.x - this.targetPoint.x) === 0);
    },
    /**
     * @param {string} dir
     * @param {int} x
     * @param {int} y
     * @param {Function} fun
     * @returns {Text Object} text
     */
    addArrow: function (dir, x, y, fun) {
        var arrowstyle = {font: "30pt Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5};
        var text = this.game.add.text(x, y, dir, arrowstyle);
        text.setShadow(2, 5, 'rgba(0,0,0,0.5)', 0);
        text.anchor.set(0.5, 0.5);
        text.inputEnabled = true;
        text.input.useHandCursor = true;
        text.events.onInputDown.add(fun, this);
        return text;
    },
    showTutorial: function () {
        if (!this.paused) {
            this.pause();
        }
        this.tutorialOpen = true;
        this.alert("Some snowboarders need help setting up their ramps. Adjust point 1 so the points make a slope matching the target slope. Remember: " +
                "\n slope = (y2 - y1) / (x2 - x1)", "Go!", this, function (state) {
                    state.pauseText.test = "";
                    state.pause();
                    state.tutorialOpen = false;
                });
    },
    pause: function () {
        this.paused = !this.paused;
        if (this.paused) {
            this.timer.pause();
        } else {
            this.timer.resume();
        }
    },
    pressedPauseKey: function () {
        if (!this.tutorialOpen) {
            this.pause();
            if (this.paused) {
                this.pauseText.text = "Paused";
            } else {
                this.pauseText.text = "";
            }
        }
    },
    createHUD: function () {
        var bottomRect = this.drawRectangle(0, 283, 900, 35, "#000000");
        bottomRect.alpha = 0.7;

        var countTextStyle = {font: "30px Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
        var money = this.add.image(10, 564, 'money');
        money.scale.set(0.07);
        this.moneycounttext = this.add.text(money.x + money.width + 10, 563, "$" + SHARED_DATA.money.toFixed(2), countTextStyle);

        var food = this.add.image(250, 567, 'food');
        food.scale.set(0.3);
        this.foodcounttext = this.add.text(food.x + food.width + 10, 563, "x" + SHARED_DATA.food, countTextStyle);

        var water = this.add.image(365, 567, 'water');
        water.scale.set(0.09);
        this.watercounttext = this.add.text(water.x + water.width + 5, 563, "x" + SHARED_DATA.water, countTextStyle);

        var gas = this.add.image(475, 569, 'gas');
        gas.scale.set(0.11);

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
        this.gascounttext = this.add.text(gas.x + gas.width + 10, 563, SHARED_DATA.gas + "/" + SHARED_DATA.carChoice.tankSize, GasTextStyle);

        var help = this.add.image(860, 562, 'help');
        help.scale.set(0.3);
        help.inputEnabled = true;
        help.input.useHandCursor = true;
        help.events.onInputDown.add(function () {
            if (!this.tutorialOpen) {
                this.showTutorial();
            }
        }, this);
    },
    drawRectangle: function (x, y, width, height, color) {
        var bmd = this.game.add.bitmapData(width + x, height + y);
        bmd.ctx.beginPath();
        bmd.ctx.rect(x, y, width, height);
        bmd.ctx.fillStyle = color;
        bmd.ctx.fill();
        return this.game.add.image(x, y, bmd);
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
        var button = new LabelButton(this, this.game.world.centerX, 425, 0.75, "buttons_long", buttonstring,
                function () {
                    text.destroy();
                    button.kill();
                    if (cancelbutton !== null) {
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
            var cancelbutton = new LabelButton(this, this.game.world.centerX + 100, 425, 0.75, "buttons_long", canceltext,
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
    animateGainAndLoss: function (type, amount, gain) {
        amount = Math.abs(amount);
        var floatText;
        if (type === 'money') {
            if (gain) {
                floatText = this.add.text(this.moneycounttext.x, 525, "+ $" + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(this.moneycounttext.y, 525, "- $" + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        }
        var floatTween = this.add.tween(floatText).to({alpha: 0, y: 500}, 1500, Phaser.Easing.Linear.None, true);
        floatTween.onComplete.add(function () {
                floatText.destroy();
            });
        floatTween.start();
    }
};
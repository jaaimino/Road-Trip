/* global SHARED_DATA, RoadTrip, Phaser, CUSTOM */

RoadTrip.Driving = function (game) {
    this.cursors = null;

    this.baseSpeed = 60;
    this.overallSpeed;
    this.minimumSpeed = 0.4;
    this.overallSpeedChange = .1;
    this.overallSpeedText = null;
    this.distanceText = null;
    this.distanceToGo = 0;
    this.nextDistanceUpdateTime = 0;
    this.distanceUpdateSpacing = 1000;
    this.distanceTraveledGas = 0;
    this.distancePerGas;
    this.distanceTraveledSupplies = 0;
    this.distancePerSupplies = 500;

    this.lineSpeed = 8;
    this.nextLinesTime = 0;
    this.lineSpacing = 7500;
    this.lineXScale = .5;
    this.lineYScale = 2;
    this.lineWidth = 20;
    this.lineHeight = 50;
    this.lines = null;

    this.playerCar = null;
    this.playerCarXScale = .45;
    this.playerCarYScale = .45;
    this.playerCarWidth = 150;
    this.playerCarHeight = 300;

    this.otherCars = null;
    this.otherCarSpeed = 4;
    this.nextOtherCarTime = 0;
    this.otherCarSpacing = 2000;
    this.otherCarXScale = .45;
    this.otherCarYScale = .45;
    this.otherCarWidth = 155;
    this.otherCarHeight = 324;
    this.otherCarTypes = [];
    this.otherCarPenalty = -3;

    this.leftDenominator;
    this.leftNumerator;
    this.rightDenominator;
    this.solution;
    this.problemText = null;

    this.answers = null;
    this.answerSpeed = 5;
    this.nextAnswerTime = 0;
    this.answerSpacing = 1750;
    this.answerWidth = 20;
    this.answerHeight = 30;
    this.possibleAnswers = new Array(3);
    this.correctAnswerReward = 3;

    this.userInterface = null;
    this.moneyText = null;
    this.waterText = null;
    this.foodText = null;
    this.gasText = null;
    this.gasAmountSprite = null;
    this.timer = null;
    this.gasBlink = false;
    this.isBlinking = false;

    this.paused = false;
    this.pauseKey = null;
    this.tutorialOpen = false;
    this.pauseTime = 0;
    this.pauseText = null;

    this.messageText = null;
};

RoadTrip.Driving.prototype = {
    create: function () {
        this.stage.backgroundColor = '#26AB2E';
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.add.image(0, 0, 'background');

        for (var i = 0; i < CUSTOM.CARS.length; i++) {
            this.otherCarTypes.push(CUSTOM.CARS[i].imageName);
        }

        this.lines = this.add.group();
        this.lines.enableBody = true;
        this.physics.arcade.enable(this.lines);

        for (var i = 0; i < 3; i++) {
            this.lines.create(100 * i + 350 - this.lineWidth * this.lineXScale * .5, -1 * this.lineHeight * this.lineYScale + 450, 'road_line');
        }
        this.lines.setAll('scale.x', this.lineXScale);
        this.lines.setAll('scale.y', this.lineYScale);

        this.otherCars = this.add.group();
        this.otherCars.enableBody = true;
        this.physics.arcade.enable(this.otherCars);

        this.playerCar = this.add.sprite(400, 470, SHARED_DATA.carChoice.imageName);
        this.playerCar.scale.set(SHARED_DATA.carChoice.scale * 0.55);
        this.playerCar.anchor.set(0.5, 0.5);
        this.playerCar.enableBody = true;
        this.physics.arcade.enable(this.playerCar);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.left.onDown.add(this.moveLeft, this);
        this.cursors.right.onDown.add(this.moveRight, this);
        this.cursors.up.onDown.add(this.moveUp, this);
        this.cursors.down.onDown.add(this.moveDown, this);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.pauseKey.onDown.add(this.pressedPauseKey, this);

        this.answers = this.add.group();
        this.answers.enableBody = true;
        this.physics.arcade.enable(this.answers);

        this.setUpVars();
        this.createHUD();
        this.generateProblem();

        if (!SHARED_DATA.sawDrivingTutorial) {
            this.showTutorial();
        }


    },
    update: function () {
        if (!this.paused) {
            this.physics.arcade.overlap(this.playerCar, this.otherCars, this.hitCar, null, this);
            this.physics.arcade.overlap(this.playerCar, this.answers, this.hitAnswer, null, this);
            if (this.time.now > this.nextLinesTime) {
                this.makeLines();
            }
            if (this.time.now > this.nextOtherCarTime) {
                this.makeCar();
            }
            if (this.time.now > this.nextAnswerTime) {
                this.makeAnswer();
            }
            if (this.time.now > this.nextDistanceUpdateTime) {
                this.updateDistance();
            }
            this.moveLines();
            this.moveOtherCars();
            this.moveAnswers();
        }
    },
    createHUD: function () {
        countTextStyle = {font: "24px Georgia", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5};
        var bottomRect = this.drawRectangle(0, 280, 900, 40, "#000000");
        bottomRect.alpha = 0.7;

        var highwaysign = this.add.image(950, 100, 'highway_sign');
        highwaysign.alpha = 1.0;
        highwaysign.scale.set(0.3);
        highwaysign.anchor.set(1.0, 0.5);

        this.problemText = this.add.text(755, 100, '', {font: '32px Georgia', fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.problemText.anchor.set(0.5, 0.5);

        money = this.add.image(10, 565, 'money');
        money.width = 30;
        money.height = 30;
        this.moneyText = this.add.text(40, 565, ' $' + SHARED_DATA.money.toFixed(2), countTextStyle);

        waterAmountSprite = this.add.image(160, 565, 'water');
        waterAmountSprite.height = 30;
        waterAmountSprite.width = 30;
        this.waterText = this.add.text(waterAmountSprite.x + waterAmountSprite.width + 10, waterAmountSprite.y + (waterAmountSprite.height / 2), " x " + SHARED_DATA.water, countTextStyle);
        this.waterText.anchor.set(0.5);

        foodAmountSprite = this.add.image(260, 565, 'food');
        foodAmountSprite.height = 30;
        foodAmountSprite.width = 30;
        this.foodText = this.add.text(foodAmountSprite.x + foodAmountSprite.width + 20, foodAmountSprite.y + (foodAmountSprite.height / 2), " x " + SHARED_DATA.food, countTextStyle);
        this.foodText.anchor.set(0.5);

        this.gasAmountSprite = this.add.image(370, 565, 'gas');
        this.gasAmountSprite.height = 30;
        this.gasAmountSprite.width = 30;
        this.gasText = this.add.text(this.gasAmountSprite.x + 70, this.gasAmountSprite.y + (this.gasAmountSprite.height / 2), SHARED_DATA.gas + "/" + SHARED_DATA.carChoice.tankSize, countTextStyle);
        this.gasText.anchor.set(0.5);
        this.updateGas();

        var help = this.add.image(860, 560, 'help');
        help.scale.set(0.3);
        help.inputEnabled = true;
        help.input.useHandCursor = true;
        help.events.onInputDown.add(function () {
            if (!this.tutorialOpen) {
                this.showTutorial();
            }
        }, this);

        this.pauseText = this.add.text(this.world.centerX, 200, "", {font: "40px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.pauseText.anchor.set(0.5);


        spedo = this.add.image(655, 300, 'spedo');
        spedo.scale.set(.4);


        distTextLabel = this.add.text(spedo.x + .5 * spedo.width - 2, spedo.y + .5 * spedo.height + 50, "Distance:", {font: '14px Georgia', fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        distTextLabel.anchor.set(0.5, 0.5);

        this.distanceText = this.add.text(spedo.x + .5 * spedo.width, spedo.y + .5 * spedo.height + 70, '' + this.distanceToGo / 100 + " mi. ", {font: '16px Georgia', fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5}); //Again x/100 so it's in miles
        this.distanceText.anchor.set(0.5, 0.5);
        this.overallSpeedText = this.add.text(spedo.x + .5 * spedo.width, spedo.y + .5 * spedo.height, Math.floor(this.baseSpeed * this.overallSpeed) + " MPH", {font: '32px Georgia', fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});


        this.overallSpeedText.anchor.set(0.5, 0.5);
    },
    setUpVars: function () {
        this.overallSpeed = 0.7;
        this.distancePerGas = SHARED_DATA.carChoice.mpg * 100;
        this.distanceToGo = SHARED_DATA.distanceToTargetState * 100;
        this.nextDistanceUpdateTime = this.time.now;

        this.nextLinesTime = this.time.now;

        this.nextOtherCarTime = this.time.now;

        this.nextAnswerTime = this.time.now;
        this.possibleAnswers = new Array(3);

        this.timer = null;
        this.gasBlink = false;
        this.isBlinking = false;

        this.paused = false;
        this.tutorialOpen = false;
        this.pauseTime = 0;
    },
    quitGame: function () {
        //this.state.start('MainMenu');
    },
    moveLeft: function () {
        if (!this.paused) {
            if (this.playerCar.x > 300) {
                this.playerCar.x -= 100;
            }
        }
    },
    moveRight: function () {
        if (!this.paused) {
            if (this.playerCar.x < 600) {
                this.playerCar.x += 100;
            }
        }
    },
    moveUp: function () {
        if (!this.paused) {
            if (this.playerCar.y > 300) {
                this.playerCar.y -= 100;
            }
        }
    },
    moveDown: function () {
        if (!this.paused) {
            if (this.playerCar.y < 480) {
                this.playerCar.y += 100;
            }
        }
    },
    makeLines: function () {
        for (var i = 0; i < 3; i++) {
            this.lines.create(100 * i + 350 - this.lineWidth * this.lineXScale * .5, -1 * this.lineHeight * this.lineYScale, 'road_line');
        }
        this.lines.setAll('scale.x', this.lineXScale);
        this.lines.setAll('scale.y', this.lineYScale);
        this.nextLinesTime = this.time.now + this.lineSpacing / (this.lineSpeed * this.overallSpeed);
    },
    moveLines: function () {
        var children = this.lines.children;
        for (var i = 0; i < children.length; i++) {
            var line = children[i];
            line.y += this.lineSpeed * this.overallSpeed;
            if (line.y > 600 + this.lineHeight * this.lineYScale) {
                line.kill();
            }
        }
    },
    makeCar: function () {
        var i = Math.floor(Math.random() * 4);
        var type = Math.floor(Math.random() * (CUSTOM.CARS.length - 1));
        var car = this.game.add.sprite(100 * i + 300, -1 * this.otherCarHeight * this.otherCarYScale, this.otherCarTypes[type]);
        this.otherCars.add(car);
        car.scale.set(CUSTOM.CARS[type].scale * 0.55);
        car.anchor.set(0.5, 0.5);
        this.nextOtherCarTime = this.time.now + this.otherCarSpacing / this.overallSpeed;
    },
    moveOtherCars: function () {
        var children = this.otherCars.children;
        for (var i = 0; i < children.length; i++) {
            var car = children[i];
            car.y += this.otherCarSpeed * this.overallSpeed;
            if (car.y > 600 + this.otherCarHeight * this.otherCarYScale) {
                car.kill();
            }
        }
    },
    hitCar: function (playerCar, otherCar) {
        otherCar.kill();
        SHARED_DATA.money += this.otherCarPenalty; //Should always add. Can make penalty negative
        if (SHARED_DATA.money < 0) {
            SHARED_DATA.money = 0;
        }
        this.moneyText.text = ' $' + SHARED_DATA.money.toFixed(2);
        this.animateGainAndLoss('money', this.otherCarPenalty, false);

        //Also decrese speed if you hit someone else
        this.overallSpeed -= this.overallSpeedChange;
        if (this.overallSpeed < this.minimumSpeed) {
            this.overallSpeed = this.minimumSpeed;
        }
        this.overallSpeedText.text = Math.floor(this.baseSpeed * this.overallSpeed) + " MPH";
    },
    generateProblem: function () {
        do {
            this.leftDenominator = Math.floor(Math.random() * 9 + 1);
            this.leftNumerator = Math.floor(Math.random() * 9 + 1);
            var scaleFactor = Math.floor(Math.random() * 9 + 1);
            this.rightDenominator = this.leftDenominator * scaleFactor;
            this.solution = this.leftNumerator * scaleFactor;
        }
        while (this.leftDenominator === this.rightDenominator)

        this.possibleAnswers[0] = this.solution;
        for (var i = 1; i < this.possibleAnswers.length; i++) {
            var num;
            do {
                num = Math.floor(Math.random() * 9 + 1);
            } while (this.possibleAnswers.indexOf(num * this.leftNumerator) !== -1);
            this.possibleAnswers[i] = this.leftNumerator * num;
        }

        this.problemText.text = this.leftNumerator + '/' + this.leftDenominator + ' = X/' + this.rightDenominator;

    },
    makeAnswer: function () {
        var i = Math.floor(Math.random() * 4);
        var answer = this.add.sprite(100 * i + 300 - this.answerWidth * .5, -1 * this.answerHeight);
        var value = this.possibleAnswers[Math.floor(Math.random() * this.possibleAnswers.length)];
        answer.text = this.add.text(100 * i + 300 - this.answerWidth * .5, -1 * this.answerHeight, value.toString(), {fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.answers.add(answer);
        this.nextAnswerTime = this.time.now + this.answerSpacing / this.overallSpeed;
    },
    moveAnswers: function () {
        var children = this.answers.children;
        for (var i = 0; i < children.length; i++) {
            var answer = children[i];
            answer.y += this.answerSpeed * this.overallSpeed;
            answer.text.y += this.answerSpeed * this.overallSpeed;
            if (answer.y > 600 - this.answerHeight) {
                answer.text.destroy(false);
                answer.kill();
            }
        }
    },
    hitAnswer: function (playerCar, answer) {
        if (this.messageText !== null) {
            this.messageText.destroy();
        }
        this.messageText = this.add.text(this.world.centerX, 450, "", {font: "40px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.messageText.anchor.set(0.5);

        if (answer.text.text === this.solution.toString()) {
            this.overallSpeed += this.overallSpeedChange;
            SHARED_DATA.money += this.correctAnswerReward;
            this.animateGainAndLoss('money', this.correctAnswerReward, true);
            this.moneyText.text = ' $' + SHARED_DATA.money.toFixed(2);
            this.messageText.setText("Correct!");
            this.time.events.add(1500, function () {
                this.add.tween(this.messageText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
            }, this);
        }
        else {
            this.overallSpeed -= this.overallSpeedChange;
            if (this.overallSpeed < this.minimumSpeed) {
                this.overallSpeed = this.minimumSpeed;
            }
            this.messageText.setText("Sorry, but that wasn't it.");
            this.time.events.add(1500, function () {
                this.add.tween(this.messageText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
            }, this);
        }
        this.overallSpeedText.text = Math.floor(this.baseSpeed * this.overallSpeed) + " MPH";
        answer.text.destroy(false);
        answer.kill();
        this.generateProblem();
    },
    updateGas: function () {
        var GasTextStyle;
        if (SHARED_DATA.gas <= SHARED_DATA.carChoice.tankSize / 4) {
            this.gasText.destroy();
            GasTextStyle = {font: "24px Georgia", fill: "red", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = true;
        }
        else if (SHARED_DATA.gas <= SHARED_DATA.carChoice.tankSize / 3) {
            this.gasText.destroy();
            GasTextStyle = {font: "24px Georgia", fill: "orange", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = true;
        }
        else {
            this.gasText.destroy();
            GasTextStyle = {font: "24px Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = false;
        }
        this.gasText = this.add.text(this.gasAmountSprite.x + 70, this.gasAmountSprite.y + (this.gasAmountSprite.height / 2), SHARED_DATA.gas + "/" + SHARED_DATA.carChoice.tankSize, GasTextStyle);
        this.gasText.anchor.set(0.5);
    },
    updateDistance: function () {
        this.distanceToGo -= Math.floor(this.baseSpeed * this.overallSpeed);
        this.distanceTraveledGas += Math.floor(this.baseSpeed * this.overallSpeed);
        this.distanceTraveledSupplies += Math.floor(this.baseSpeed * this.overallSpeed);
        if (this.distanceTraveledGas >= this.distancePerGas) {
            this.distanceTraveledGas = 0;
            SHARED_DATA.gas -= 1;
            this.animateGainAndLoss('gas', 1, false);
            this.gasText.text = SHARED_DATA.gas + "/" + SHARED_DATA.carChoice.tankSize;
            if (SHARED_DATA.gas < 1) {
                if (!this.paused) {
                    this.pause();
                }
                this.tutorialOpen = true;
                this.alert("You ran out of gas. You'll have to go back and get more.", "Continue", this, function (state) {
                    SHARED_DATA.ranOutOfGas = true;
                    state.game.state.start('Map');
                    state.tutorialOpen = false;
                });
            }
        }
        if (this.distanceTraveledSupplies >= this.distancePerSupplies) {
            this.distanceTraveledSupplies = 0;
            var supplyToDecrease = Math.floor(Math.random() * 2);
            if (supplyToDecrease === 0) {
                SHARED_DATA.food -= 1;
                this.animateGainAndLoss('food', 1, false);
                this.foodText.text = " x " + SHARED_DATA.food;
                if (SHARED_DATA.food < 1) {
                    if (!this.paused) {
                        this.pause();
                    }
                    this.tutorialOpen = true;
                    this.alert("Oh no, you have no food left! You'll have to go back and get more.", "Continue", this, function (state) {
                        SHARED_DATA.ranOutOfFood = true;
                        state.game.state.start('Map');
                        state.tutorialOpen = false;
                    });
                }
            } else {
                SHARED_DATA.water -= 1;
                this.animateGainAndLoss('water', 1, false);
                this.waterText.text = " x " + SHARED_DATA.water;
                if (SHARED_DATA.water < 1) {
                    if (!this.paused) {
                        this.pause();
                    }
                    this.tutorialOpen = true;
                    this.alert("Oh no, you have no water left! You'll have to go back and get more.", "Continue", this, function (state) {
                        SHARED_DATA.ranOutOfWater = true;
                        state.game.state.start('Map');
                        state.tutorialOpen = false;
                    });
                }
            }

        }
        this.distanceText.text = '' + this.distanceToGo / 100 + " mi."; //So it's in miles
        if (this.distanceToGo <= 0) {
            this.distanceToGo = 0;
            this.distanceText.text = '' + this.distanceToGo / 100 + " mi."; //So it's in miles
            if (!this.paused) {
                this.pause();
            }
            this.tutorialOpen = true;
            this.alert("You made it to " + SHARED_DATA.targetState.name + "!", "Continue", this, function (state) {
                if (!state.paused) {
                    state.pause();
                }
                this.game.state.start('RandomEvent');
            });
        }
        this.nextDistanceUpdateTime = this.time.now + this.distanceUpdateSpacing;
        this.updateGas();
    },
    showTutorial: function () {
        if (!this.paused) {
            this.pause();
        }
        this.tutorialOpen = true;
        this.alert("Use the arrow keys to move your car. Collect the correct answers to the displayed problem to earn money. "
                + "Watch out for other cars though or you'll lose money! "
                + "You can also use the spacebar to pause the game so that you can solve the problems. ", "Go!", this, function (state) {
                    SHARED_DATA.sawDrivingTutorial = true;
                    state.pauseText.text = "";
                    state.pause();
                    state.tutorialOpen = false;
                });
    },
    pause: function () {
        this.paused = this.paused ? false : true;
        if (this.paused) {
            this.pauseTime = this.time.now;
        } else {
            this.nextLinesTime = this.time.now + (this.nextLinesTime - this.pauseTime);
            this.nextOtherCarTime = this.time.now + (this.nextOtherCarTime - this.pauseTime);
            this.nextAnswerTime = this.time.now + (this.nextAnswerTime - this.pauseTime);
            this.nextDistanceUpdateTime = this.time.now + (this.nextDistanceUpdateTime - this.pauseTime);
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
                floatText = this.add.text(55, 525, "+ $" + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(55, 525, "- $" + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        } else if (type === 'food') {
            if (gain) {
                floatText = this.add.text(300, 525, "+ " + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(300, 525, "- " + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        } else if (type === 'water') {
            if (gain) {
                floatText = this.add.text(190, 525, "+ " + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(190, 525, "- " + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        } else if (type === 'gas') {
            if (gain) {
                floatText = this.add.text(425, 525, "+ " + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(425, 525, "- " + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        }
        var floatTween = this.add.tween(floatText).to({alpha: 0, y: 500}, 1500, Phaser.Easing.Linear.None, true);
        floatTween.onComplete.add(function () {
                floatText.destroy();
            });
        floatTween.start();
    }
};
/* global SHARED_DATA, Phaser, RoadTrip */

/**
 * Mike Boch
 */

RoadTrip.ChickenChasing = function (game) {
    this.cursors = null;
    this.player = null;
    this.speed = 200;
    this.deterioration = .9;
    this.numberOfChickens = 10;
    this.chickens = null;
    this.timeLeft = 30;
    this.paused = false;
    this.tutorialOpen = false;
    this.pauseText = null;
    this.timeText = null;
    this.screenWidth = 900;
    this.screenHeight = 600;
    this.maxSpeed = 100;
    this.minSpeed = 25;
    this.timer = null;

    this.moneyText = null;
    this.foodText = null;
    this.gasText = null;
    this.gasAmountSprite = null;
    this.gasBlink = false;

    this.problemText = null;
    this.problems = [];
    this.currentProblem = 0;
    this.correctAnswerReward = 8;
    this.wrongAnswerPenalty = -3;
    this.correctAnswers = 0;
    this.messageText = null;
    this.moneyFloatText = null;
};

RoadTrip.ChickenChasing.prototype = {
    create: function () {
        this.stage.backgroundColor = '#26AB2E';
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, 900, 560);

        this.add.image(0, 0, 'chicken_bg');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.up.onDown.add(this.moveUp, this);
        this.cursors.down.onDown.add(this.moveDown, this);
        this.cursors.left.onDown.add(this.moveLeft, this);
        this.cursors.right.onDown.add(this.moveRight, this);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.pauseKey.onDown.add(this.pressedPauseKey, this);

        this.problems = [];
        for (var i = 0; i < this.numberOfChickens; i++) {
            this.makeProblem();
        }

        this.chickens = this.add.group();
        this.chickens.enableBody = true;
        this.physics.arcade.enable(this.chickens);
        for (var i = 0; i < this.numberOfChickens; i++) {
            var xPos = Math.floor((Math.random() * 850) + 50);
            var yPos = Math.floor((Math.random() * 500) + 50);
            var xVel = Math.floor((Math.random() * (this.maxSpeed - this.minSpeed)) + this.minSpeed);
            var yVel = Math.floor((Math.random() * (this.maxSpeed - this.minSpeed)) + this.minSpeed);

            //Place the chickens away from you at the start
            if (xPos > 400 && xPos < 450) {
                xPos -= 50;
            } else if (xPos > 450 && xPos < 500) {
                xPos += 50;
            }
            if (yPos > 200 && yPos < 300) {
                yPos -= 100;
            } else if(yPos > 300 && yPos < 400) {
                yPos += 100;
            }

            //Have the chickens move away from you at the start
            xVel *= xPos < this.world.centerX ? -1 : 1;
            yVel *= yPos < this.world.centerY ? -1 : 1;

            var chicken = this.chickens.create(xPos, yPos, 'chicken');
            chicken.anchor.set(0.5, 0.5);
            chicken.scale.set(0.075);

            chicken.body.collideWorldBounds = true;

            chicken.body.bounce.y = this.deterioration;
            chicken.body.bounce.x = this.deterioration;

            chicken.body.velocity.x = xVel;
            chicken.body.velocity.y = yVel;

            chicken.value = this.problems[i].solution;
            chicken.problemNumber = i;

            //console.log(i + " " + chicken.value);

            chicken.text = this.add.text(chicken.x, chicken.y + 10, chicken.value, {font: "18px Georgia", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 4});
            chicken.text.anchor.set(0.5, 0.5);
        }

        this.player = this.add.sprite(this.world.centerX, this.world.centerY, 'chicken_player');
        this.player.anchor.set(0.5, 0.5);
        this.player.scale.set(0.25);
        this.physics.arcade.enable(this.player);
        this.player.enableBody = true;
        this.player.body.collideWorldBounds = true;

        this.initVars();
        this.initUI();

        this.timer = this.game.time.create(this.game);
        this.timer.loop(Phaser.Timer.SECOND, this.timerCallback, this);
        this.timer.start();

        if (!SHARED_DATA.sawChickenChasingTutorial) {
            this.showTutorial();
        }
    },
    initVars: function () {
        this.timeLeft = 30;
        this.tutorialOpen = false;
        this.paused = false;
        this.gasBlink = false;
        this.correctAnswers = 0;
        this.currentProblem = 0;
    },
    initUI: function () {
        countTextStyle = {font: "24px Georgia", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5};
        var bottomRect = this.drawRectangle(0, 280, 900, 40, "#000000");
        bottomRect.alpha = 0.7;

        money = this.add.image(10, 565, 'money');
        money.width = 30;
        money.height = 30;
        this.moneyText = this.add.text(40, 565, ' $' + SHARED_DATA.money, countTextStyle);

        waterAmountSprite = this.add.image(110, 565, 'water');
        waterAmountSprite.height = 30;
        waterAmountSprite.width = 30;
        this.waterText = this.add.text(waterAmountSprite.x + waterAmountSprite.width + 10, waterAmountSprite.y + (waterAmountSprite.height / 2), " x " + SHARED_DATA.water, countTextStyle);
        this.waterText.anchor.set(0.5);

        foodAmountSprite = this.add.image(210, 565, 'food');
        foodAmountSprite.height = 30;
        foodAmountSprite.width = 30;
        this.foodText = this.add.text(foodAmountSprite.x + foodAmountSprite.width + 20, foodAmountSprite.y + (foodAmountSprite.height / 2), " x " + SHARED_DATA.food, countTextStyle);
        this.foodText.anchor.set(0.5);

        this.gasAmountSprite = this.add.image(310, 565, 'gas');
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

        this.timeText = this.add.text(10, 10, "Time Left: " + this.timeLeft, {font: "20px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});

        this.problemText = this.add.text(800, 30, '', {font: '32px Georgia', fill: 'white', stroke: "#000000", strokeThickness: 5});
        this.problemText.anchor.set(0.5, 0.5);
        var problem = this.problems[0];
        this.problemText.text = problem.leftNumerator + '/' + problem.leftDenominator + ' = X/' + problem.rightDenominator;
    },
    update: function () {
        if (!this.paused) {
            this.physics.arcade.overlap(this.player, this.chickens, this.hitChicken, null, this);
            var children = this.chickens.children;
            for (var i = 0; i < children.length; i++) {
                var chicken = children[i];
                chicken.text.x = chicken.x;
                chicken.text.y = chicken.y + 10;
            }

        }
    },
    moveUp: function () {
        if (!this.paused) {
            this.player.body.velocity.y = -1 * this.speed;
            this.player.body.velocity.x = 0;
        }
    },
    moveDown: function () {
        if (!this.paused) {
            this.player.body.velocity.y = this.speed;
            this.player.body.velocity.x = 0;
        }
    },
    moveLeft: function () {
        if (!this.paused) {
            this.player.body.velocity.x = -1 * this.speed;
            this.player.body.velocity.y = 0;
        }
    },
    moveRight: function () {
        if (!this.paused) {
            this.player.body.velocity.x = this.speed;
            this.player.body.velocity.y = 0;
        }
    },
    hitChicken: function (player, chicken) {
        if (this.messageText !== null) {
            this.messageText.destroy();
        }
        this.messageText = this.add.text(this.world.centerX, 450, "", {font: "40px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.messageText.anchor.set(0.5);

        if (chicken.problemNumber === this.currentProblem) {
            //Right answer
            SHARED_DATA.money += this.correctAnswers * this.correctAnswerReward;
            this.moneyText.text = ' $' + SHARED_DATA.money;
            this.animateMoney(this.correctAnswerReward, true);

            this.messageText.setText("You got the correct chicken!");
            this.time.events.add(1500, function () {
                this.add.tween(this.messageText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
            }, this);

            this.correctAnswers++;

            this.problems[this.currentProblem].solved = true;
            
            while (this.currentProblem < this.problems.length) {
                if (!this.problems[this.currentProblem].solved) {
                    break;
                }
                this.currentProblem++;
            }

            if (this.currentProblem === this.problems.length) {
                //Got all chickens
                chicken.text.destroy();
                chicken.destroy();
                this.pause();
                this.tutorialOpen = true;

                this.alert("You managed to collect " + this.correctAnswers + " chickens and earned " + this.correctAnswers * this.correctAnswerReward + " money. Good job!", "Back to map", this, function (state) {
                    state.game.state.start('Map');
                });
            } else {
                var problem = this.problems[this.currentProblem];
                this.problemText.text = problem.leftNumerator + '/' + problem.leftDenominator + ' = X/' + problem.rightDenominator;
            }
        } else {
            SHARED_DATA.money += this.wrongAnswerPenalty;
            if (SHARED_DATA.money < 0) {
                SHARED_DATA.money = 0;
            }
            this.moneyText.text = ' $' + SHARED_DATA.money;
            this.animateMoney(this.wrongAnswerPenalty, false);

            this.messageText.setText("That wasn't the right chicken.");
            this.time.events.add(1500, function () {
                this.add.tween(this.messageText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
            }, this);
            
            this.problems[chicken.problemNumber].solved = true;
        }

        chicken.text.destroy();
        chicken.destroy();
    },
    makeProblem: function () {
        var duplicate;
        do {
            var leftDenominator = Math.floor(Math.random() * 9 + 1);
            var leftNumerator = Math.floor(Math.random() * 9 + 1);
            var scaleFactor = Math.floor(Math.random() * 9 + 1);
            var rightDenominator = leftDenominator * scaleFactor;
            var solution = leftNumerator * scaleFactor;
            while (leftDenominator == rightDenominator) {
                var leftDenominator = Math.floor(Math.random() * 9 + 1);
                var leftNumerator = Math.floor(Math.random() * 9 + 1);
                var scaleFactor = Math.floor(Math.random() * 9 + 1);
                var rightDenominator = leftDenominator * scaleFactor;
                var solution = leftNumerator * scaleFactor;
            }
            duplicate = false;
            for (var i = 0; i < this.problems.length; i++) {
                if (solution === this.problems[i].solution) {
                    duplicate = true;
                    break;
                }
            }
        } while (duplicate);
        this.problems.push(new Problem(leftDenominator, leftNumerator, rightDenominator, solution));
    },
    timerCallback: function () {
        console.log("Test");
        this.timeLeft -= 1;
        this.timeText.text = "Time Left: " + this.timeLeft;
        if (this.timeLeft <= 0) {
            if (!this.paused) {
                this.pause();
            }
            this.tutorialOpen = true;
            //this.timer.destroy();
            this.alert("Time's up! You managed to collect " + this.correctAnswers + " chicken" + (this.correctAnswers === 1 ? "" : "s")
                    + " and earned " + this.correctAnswers * this.correctAnswerReward + " dollars. Good job!", "Back to map", this, function (state) {
                        state.game.state.start('Map');
                    });
        }
    },
    showTutorial: function () {
        if (!this.paused) {
            this.pause();
        }
        this.tutorialOpen = true;
        this.alert("A local farmer has offered to pay you some money if you can help catch his escaped chickens. "
                + "Be sure to only catch the correct chicken by answering his hint in the top right. "
                + "Use the arrow keys to move and the spacebar to pause. You have 30 seconds.", "Go!", this, function (state) {
                    SHARED_DATA.sawChickenChasingTutorial = true;
                    state.pause();
                    state.pauseText.text = "";
                    state.tutorialOpen = false;
                });
    },
    pause: function () {
        this.paused = this.paused ? false : true;
        this.physics.arcade.isPaused = this.paused;
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
    updateGas: function () {

        this.gasText.destroy();
        var GasTextStyle;

        if (SHARED_DATA.gas <= SHARED_DATA.carChoice.tankSize / 4) {
            GasTextStyle = {font: "24px Georgia", fill: "red", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = true;
        }
        else if (SHARED_DATA.gas <= SHARED_DATA.carChoice.tankSize / 3) {
            GasTextStyle = {font: "24px Georgia", fill: "orange", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = true;
        }
        else {
            GasTextStyle = {font: "24px Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = false;
        }

        this.gasText = this.add.text(this.gasAmountSprite.x + this.gasAmountSprite.width + 40, 580, SHARED_DATA.gas + "/" + SHARED_DATA.carChoice.tankSize, GasTextStyle);
        this.gasText.anchor.set(0.5);

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
    animateMoney: function (amount, gain) {
        amount = Math.abs(amount);
        if (this.moneyFloatText !== null) {
            this.moneyFloatText.destroy();
        }
        if (gain) {
            this.moneyFloatText = this.add.text(55, 525, "+ $" + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
        }
        else {
            this.moneyFloatText = this.add.text(55, 525, "- $" + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
        }
        var moneyTween = this.add.tween(this.moneyFloatText).to({alpha: 0, y: 500}, 1500, Phaser.Easing.Linear.None, true);
        moneyTween.start();
    }
};

function Problem(leftDenominator, leftNumerator, rightDenominator, solution) {
    this.leftDenominator = leftDenominator;
    this.leftNumerator = leftNumerator;
    this.rightDenominator = rightDenominator;
    this.solution = solution;
    this.solved = false;
}
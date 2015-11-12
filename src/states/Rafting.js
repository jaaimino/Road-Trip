/* global RoadTrip, Phaser */

RoadTrip.Rafting = function (game) {
};

var cursors;

var lives = 5;
var livesText;

var score = 0;
var scoreText;

var nextRockTime = 0;
var rockSpeed = 20;
var rockSpacing = 1700;
var rock;

var playerBoat;
var playerBoatXScale = .85;
var playerBoatYScale = .85;

var bridgeGroup;
var bridgeSpeed = 3;
var nextBridgeTime = 0;
var bridgeSpacing = 4000;

var answers;
var playerAnswer = 0;

var solution;
var boatHeight = 0;
var heightText; //the actual sprite displaying boat height
var hit = false;
var problemText;
var possibleAnswers = new Array(3);

var answerSpeed = 7;
var nextAnswerTime = 0;
var answerSpacing = 1750;
var answerWidth = 20;
var answerHeight = 30;
var counter = 45;

this.paused = false;
this.pauseKey = null;
this.tutorialOpen = false;
this.pauseTime = 0;
this.pauseText = null;
this.timer = null;
this.timerText = null;
this.numRight = 0;
this.messageText = null;

RoadTrip.Rafting.prototype = {
    create: function () {
        this.stage.smoothed = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.stage.backgroundColor = '#4176A3';
        this.add.image(0, 0, 'water_background');

        rockGroup = this.add.group();
        rockGroup2 = this.add.group();

        playerBoat = this.add.sprite(442, 475, 'player_boat');
        playerBoat.scale.x = playerBoatXScale;
        playerBoat.scale.y = playerBoatYScale;
        playerBoat.enableBody = true;
        this.physics.arcade.enable(playerBoat);

        answers = this.add.group();
        boatHeight = this.rnd.integerInRange(1, 10);

        heightText = this.add.sprite(463, 519);
        heightText.text = this.add.text(460, 510, boatHeight.toString(), {font: "12px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        heightText.anchor.set(0.5, 0.15);
        heightText.x -= 9;
        heightText.text.x -= 9;
        heightText.enableBody = true;
        this.physics.arcade.enable(heightText);

        bridgeGroup = this.add.group();
        bridgeGroup.enableBody = true;
        this.physics.arcade.enable(bridgeGroup);

        cursors = this.input.keyboard.createCursorKeys();
        cursors.left.onDown.add(this.moveLeft, this);
        cursors.right.onDown.add(this.moveRight, this);

        scoreText = this.add.text(5, 5, 'Score: ' + score, {font: "22px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        livesText = this.add.text(810, 5, 'Lives: ' + lives, {font: "22px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});

        this.createHUD();
        this.spawnBridge();

        this.pauseText = this.add.text(this.world.centerX, 200, "", {font: "40px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.pauseText.anchor.set(0.5);

        this.pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.pauseKey.onDown.add(this.pressedPauseKey, this);

        this.numRight = 0;

        this.initTimer();
        this.showTutorial();
        //}
    },
    update: function () {
        //console.log(this.paused);
        if (!this.paused) {
            this.physics.arcade.overlap(playerBoat, bridgeGroup, this.hitBridge, null, this);
            if (this.time.now > nextRockTime) {
                this.spawnrock();
            }

            if (this.time.now > nextBridgeTime) {
                this.spawnBridge();
            }

            this.moverock();
            this.moveAnswers();
            this.moveBridge();

            heightText.x = playerBoat.x;

            heightText.text.setText(boatHeight.toString());
        }
        if (counter === 0 || lives === 0) {
            if(this.numRight < 0) {
                this.numRight = 0;
            }
            console.log(this.numRight);
            SHARED_DATA.money += this.numRight;
            this.end();
        }
        if (score < 0) {
            score = 0;
        }
    },
    initTimer: function () {
        this.timerText = this.add.text(this.game.world.centerX, 25, 'Time Remaining: 0', {font: "22px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.timerText.anchor.set(0.5, 0.5);
        this.timer = this.game.time.create(this.game);
        this.timer.loop(Phaser.Timer.SECOND, this.updateTimer, this);
        this.timer.start();
    },
    updateTimer: function () {
        if (!this.paused) {
            counter--;
        }
        this.timerText.setText('Time Remaining: ' + counter.toString());
    },
    createHUD: function () {
        countTextStyle = {font: "24px Georgia", fill: "white", align: "center"};
        var bottomRect = this.drawRectangle(0, 280, 900, 40, "#000000");
        bottomRect.alpha = 0.7;

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
    },
    moveLeft: function () {
        if (!this.paused) {
            if (playerBoat.x > 225) {
                playerBoat.x -= 300;
                heightText.x -= 300;
                heightText.text.x -= 300;
            }
        }
    },
    moveRight: function () {
        if (!this.paused) {
            if (playerBoat.x < 655) {
                playerBoat.x += 300;
                heightText.x += 300;
                heightText.text.x += 300;
            }
        }
    },
    spawnrock: function () {
        rockGroup.create(0, 0, 'rock');
        rockGroup.create(853, 0, 'rock');
        nextRockTime = this.time.now + rockSpacing * 5 / (bridgeSpeed);
    },
    moverock: function () {
        if (!this.paused) {
            var rocks = rockGroup.children;
            var rocks2 = rockGroup2.children;
            for (var i = 0; i < rocks.length; i++) {
                var rockTile = rocks[i];
                rockTile.y += bridgeSpeed;
                if (rockTile.y > 600) {
                    rockTile.kill();
                }
            }
            for (var i = 0; i < rocks2.length; i++) {
                var rockTile = rocks2[i];
                rockTile.y += bridgeSpeed;
                if (rockTile.y > 600) {
                    rockTile.kill();
                }
            }
        }
    },
    hitBoat: function (playerBoat, enemyBoat) {
        enemyBoat.kill();
        //console.log('hit');
        lives--;
        livesText.text = 'Lives: ' + lives;
        if (lives === 0) {
            this.state.start('GameOver');
        }
    },
    generateProblem: function () {
        var str = "";
        possibleAnswers = new Array(3);
        for (var i = 0; i < 3; i++) {
            m = this.rnd.integerInRange(-10, 10);
            b = this.rnd.integerInRange(1, 12);
            str = 'y = ' + m + 'x' + ' + ' + b;
            possibleAnswers[i] = str;
        }
        var last = boatHeight;
        boatHeight = this.rnd.integerInRange(3, 10);
        
        while (last === boatHeight) {
            boatHeight = this.rnd.integerInRange(3, 10);
        }
        
        //If there is a right answer, this will be true
        var posAnswer = false;
        
        //If all of the answers are right, then this will be true
        var allRight = true;
        
        for (var i = 0; i < 3; i++) {
            var solved = this.solve(possibleAnswers[i]);
            
            if(boatHeight > solved) {
                allRight = false;
            }
            
            else if(boatHeight <= solved) {
                posAnswer = true;
            }
            
        }
        
        if(!posAnswer || allRight) {
            this.generateProblem();
        }
       
        /*
         if(boatHeight > 9) {
         heightText.x = playerBoat.x;
         heightText.text.x = playerBoat.x;
         }
         else {
         heightText.x = playerBoat.x + 15;
         heightText.text.x = playerBoat.x + 15;
         }
         */
    },
    spawnBridge: function () {
        this.generateProblem();
        bridgeGroup.create(0, -120, 'bridgeSection');
        bridgeGroup.create(300, -120, 'bridgeSection');
        bridgeGroup.create(600, -120, 'bridgeSection');

        var bridges = bridgeGroup.children;
        for (var i = 0; i < bridges.length; i++) {
            var bridge = bridges[i];
            bridge.scale.x = .46;
            bridge.scale.y = .25;
        }

        this.spawnAnswer(47, -120, possibleAnswers[0]);
        this.spawnAnswer(347, -120, possibleAnswers[1]);
        this.spawnAnswer(647, -120, possibleAnswers[2]);
        hit = false;
        nextBridgeTime = this.time.now + bridgeSpacing * 5 / (bridgeSpeed);
    },
    moveBridge: function () {
        var bridges = bridgeGroup.children;
        for (var i = 0; i < bridges.length; i++) {
            var bridge = bridges[i];
            bridge.y += bridgeSpeed;
            if (bridge.y > 600) {
                bridge.kill();
            }
        }
    },
    hitBridge: function (playerBoat, bridge) {
        if (!hit) {
            if (playerBoat.x > 0 && playerBoat.x < 300) {
                solution = this.solve(possibleAnswers[0]);
            }

            else if (playerBoat.x > 200 && playerBoat.x < 600) {
                solution = this.solve(possibleAnswers[1]);
            }

            else if (playerBoat.x > 400 && playerBoat.x < 900) {
                solution = this.solve(possibleAnswers[2]);
            }
            
            if (this.messageText !== null) {
                //this.messageText.destroy();
            }
            this.messageText = this.add.text(this.world.centerX, 450, "", {font: "40px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
            this.messageText.anchor.set(0.5);
            
            //CORRECT
            if (boatHeight <= solution) {
                this.messageText.setText("Correct! Nice job!");
                this.add.tween(this.messageText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
                score += 100;
                SHARED_DATA.money += 3;
                this.moneyText.text = "$" + SHARED_DATA.money.toFixed(2);
                this.animateGainAndLoss('money', 3, true);
            }
            
            //NOT CORRECT
            else if (boatHeight > solution) {
                this.messageText.setText("Sorry, that's not correct.");
                this.add.tween(this.messageText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
                score -= 100;
                lives--;
                SHARED_DATA.money += -3;
                this.moneyText.text = "$" + SHARED_DATA.money.toFixed(2);
                this.animateGainAndLoss('money', 3, false);
                livesText.text = 'Lives: ' + lives;
                if (lives === 0) {
                    this.state.start('GameOver');
                }
            }
            scoreText.setText('Score: ' + score);
            hit = true;
        }
    },
    pause: function () {
        this.paused = this.paused ? false : true;
        this.physics.arcade.isPaused = this.paused;
        if (this.paused) {
            this.pauseTime = this.time.now;
        } else {
            nextBridgeTime = this.time.now + (nextBridgeTime - this.pauseTime);
            nextRockTime = this.time.now + (nextRockTime - this.pauseTime);
            //this.nextDistanceUpdateTime = this.time.now + (this.nextDistanceUpdateTime - this.pauseTime);
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
    spawnAnswer: function (x, y, val) {
        x = x + 45;
        y = y + 5;
        var answer = this.add.sprite(x, y);
        answer.text = this.add.text(x, y, val.toString(), {font: "17px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        answers.add(answer);
        nextAnswerTime = this.time.now + answerSpacing;
    },
    moveAnswers: function () {
        var children = answers.children;
        for (var i = 0; i < children.length; i++) {
            var answer = children[i];
            answer.y += bridgeSpeed;
            answer.text.y += bridgeSpeed;
            if (answer.y > 900) {
                answer.text.destroy(false);
                answer.kill();
            }
        }
    },
    //Solves for the y-intercept
    solve: function (equation) {
        var str = equation.toString();
        var len = str.length;
        if (str.charAt(len - 2) === " ") {
            return parseInt(str.slice(-1));
        }
        else {
            return parseInt(str.slice(-2));
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
    showTutorial: function () {
        if (!this.paused) {
            this.pause();
        }
        this.tutorialOpen = true;
        this.alert("Use the left and right arrow keys to move your boat. Travel under the bridge whose equation has a high enough y-intercept for you to pass safely underneath."
                + "You can also use the spacebar to pause the game so that you can solve the problems. ", "Go!", this, function (state) {
                    //SHARED_DATA.sawRaftingTutorial = true;
                    state.pause();
                    state.tutorialOpen = false;
                });
    },
    alert: function (string, buttonstring, phaserstate, callBack) {
        var bg = this.drawRectangle(100, 50, 500, 350, "#000000");
        bg.alpha = 0.7;
        this.add.tween(bg).to({alpha: 0.8}, 300, Phaser.Easing.Linear.None, true).start();
        
        var text = this.game.add.text(this.game.world.centerX, 245, string, {font: "14pt Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        text.anchor.set(0.5, 0.5);
        text.wordWrap = true;
        text.wordWrapWidth = 450; //790 and 10 above to try do some padding
        text.setShadow(2, 5, 'rgba(0,0,0,0.5)', 0);
        this.add.tween(text).to({alpha: 1.0}, 300, Phaser.Easing.Linear.None, true).start();
        
        var button = new LabelButton(this, this.game.world.centerX, 425, 0.75, "buttons_long", buttonstring,
                function () {
                    text.destroy();
                    button.kill();
                    
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
        
    },
    animateGainAndLoss: function (type, amount, gain) {
        amount = Math.abs(amount);
        var floatText;
        if (type === 'money') {
            if (gain) {
                floatText = this.add.text(this.moneyText.x, 525, "+ $" + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(this.moneyText.x, 525, "- $" + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        }
        var floatTween = this.add.tween(floatText).to({alpha: 0, y: 500}, 1500, Phaser.Easing.Linear.None, true);
        floatTween.onComplete.add(function () {
                floatText.destroy();
            });
        floatTween.start();
    },
    end: function () {
        this.state.start('Map');
    }
};
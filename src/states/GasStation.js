/* global RoadTrip, SHARED_DATA, Phaser */

RoadTrip.GasStation = function () {
    this.messageText;
    this.directionsText;
    this.moneyText;
    this.gasText;
    this.messageText;
    this.gas;
    this.pump = null;
    this.timer = 0;
    this.gasBlink = false;
    this.pumpPPG = 2;
    this.timer;
    this.difficulty = 0.05;
    this.canSetPrice = false;
    this.storeAdjectives = ["Quality", "Value", "Ye Olde", "Extreme"];
    this.moneyFloatText = null;
};

RoadTrip.GasStation.prototype = {
    preload: function () {
    },
    showTutorial: function () {
        this.alert("Oh no! The gas pump is broken and can't display the correct price per gallon. To buy gas, use your math skills to fix the pump so it " + 
                "shows the correct price per gallon.", "Ok", this, function () {
            SHARED_DATA.sawGasTutorial = true;
        });
    },
    create: function () {

        this.stage.backgroundColor = '#4176A3'; //Change background color here
        img = this.add.image(0, 0, 'test');
        img.scale.set(0.75);

        pumpTextTitle = {font: "14px Arial", fill: "#FFFFFF", align: "center"};
        pumpTextAmount = {font: "18px Arial", fill: "#FFFFFF", align: "center"};


        this.pump = this.add.sprite(465, 200, 'gas_pump');
        this.pump.scale.set(.4);
        this.pump.width = this.pump.width * 1.28;
        this.add.text(this.pump.x + 70, this.pump.y + 28, "Price", pumpTextTitle);
        this.pump.priceText = this.add.text(this.pump.x + 75, this.pump.y + 40, "$0", pumpTextAmount);
        this.add.text(this.pump.x + 125, this.pump.y + 28, "Amount", pumpTextTitle);
        this.pump.amountText = this.add.text(this.pump.x + 125, this.pump.y + 40, "gal.", pumpTextAmount);
        this.add.text(this.pump.x + 135, this.pump.y + 73, "$/gal.", pumpTextAmount);
        this.pump.ppgText = this.add.text(this.pump.x + 80, this.pump.y + 73, "???", pumpTextAmount);

        this.pump.plus = this.add.sprite(this.pump.x + 150, this.pump.y + 160, 'plus');
        this.pump.plus.scale.set(0.04);
        this.pump.plus.inputEnabled = true;
        this.pump.plus.input.useHandCursor = true;
        this.pump.plus.events.onInputDown.add(this.incppg, this);

        this.pump.minus = this.add.sprite(this.pump.x + 65, this.pump.y + 173, 'minus');
        this.pump.minus.scale.set(0.04);
        this.pump.minus.inputEnabled = true;
        this.pump.minus.input.useHandCursor = true;
        this.pump.minus.events.onInputDown.add(this.decppg, this);
        this.pump.minus.belongsTo = 2;

        this.createHUD();

        this.messageText = this.add.text(this.world.centerX, 425, "", {font: "40px Arial", fill: "#FFFFFF", align: "center"});
        this.messageText.anchor.set(0.5);

        if (!SHARED_DATA.sawGasTutorial) {
            this.showTutorial();
        }

        this.makeGas();
    },
    createHUD: function () {


        var topRect = this.drawRectangle(0, 0, 900, 35, "#000000");
        topRect.alpha = 0.7;

        var bottomRect = this.drawRectangle(0, 275, 900, 50, "#000000");
        bottomRect.alpha = 0.7;

        var topTextStyle = {font: "30px Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};

        var adjString = this.storeAdjectives[this.randRange(0, this.storeAdjectives.length - 1)];
        this.currentStateText = this.add.text(5, 0, adjString + " " + SHARED_DATA.currentState.name + " Gasoline", topTextStyle);

        var countTextStyle = {font: "30px Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};

        var money = this.add.image(10, 555, 'money');
        money.scale.set(0.08);
        this.moneyText = this.add.text(money.x + money.width + 10, 555, "$" + SHARED_DATA.money.toFixed(2), countTextStyle);

        this.gas = this.add.image(275, 560, 'gas');
        this.gas.scale.set(0.15);


        this.gasText = this.add.text(this.gas.x + this.gas.width + 15, 555, SHARED_DATA.gas + "/" + SHARED_DATA.carChoice.tankSize, countTextStyle);
        this.updateGasText();

        var help = this.add.image(860, 562, 'help');
        help.scale.set(0.3);
        help.inputEnabled = true;
        help.input.useHandCursor = true;
        help.events.onInputDown.add(function () {
            this.showTutorial();
        }, this);

        var backbutton = new LabelButton(this, 785, 575, 0.5, "buttons_long", "Back To Map",
                function () {
                    this.state.start('Map');
                }, this, 0, 1, 2);

    },
    makeGas: function () {

        this.canSetPrice = false;

        randomAmount = Math.floor((Math.random() * 1.5 / this.diffuculty) + 2);
        randomPrice = 0;
        while (randomPrice <= 1 || ((randomPrice / randomAmount) % this.difficulty).toFixed(3) != this.difficulty || (randomAmount == randomPrice)) {
            randomAmount = Math.floor((Math.random() * 15) + 2);
            randomPrice = Math.floor((Math.random() * randomAmount) + (Math.random() * 10));
        }
        this.pump.cost = randomPrice;
        this.pump.amount = randomAmount;
        this.pump.priceText.text = "$" + randomPrice;
        this.pump.amountText.text = randomAmount + " gal.";

        return randomAmount;
    },
    updateGasText: function () {

        this.gasText.destroy();
        var GasTextStyle;

        if (SHARED_DATA.gas <= SHARED_DATA.carChoice.tankSize / 4) {
            GasTextStyle = {font: "30px Arial", fill: "red", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = true;
        }
        else if (SHARED_DATA.gas <= SHARED_DATA.carChoice.tankSize / 3) {
            GasTextStyle = {font: "30px Arial", fill: "orange", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = true;
        }
        else {
            GasTextStyle = {font: "30px Arial", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
            this.gasBlink = false;
        }

        this.gasText = this.add.text(this.gas.x + this.gas.width + 40, 580, SHARED_DATA.gas + "/" + SHARED_DATA.carChoice.tankSize, GasTextStyle);
        this.gasText.anchor.set(0.5);

    },
    update: function () {
        if (this.gasBlink) {
            this.timer += this.time.elapsed; //this is in ms, not seconds.
            if (this.timer >= 1000) {
                this.timer -= 1000;
                this.gasText.visible = !this.gasText.visible;
            }
        }
    },
    incppg: function (sprite) {

        if (this.canSetPrice == false) {
            this.canSetPrice = true;
            this.pump.buybutton = new LabelButton(this, this.pump.x + 125, this.pump.y + 250, 0.65, "buttons_long", "Set Price",
                    function () {
                        this.checkPrice()
                    }, this, 0, 1, 2);
        }

        num = this.pumpPPG + this.difficulty;
        this.pumpPPG = num
        this.pump.ppgText.setText((this.pumpPPG).toFixed(2));

    },
    decppg: function (sprite) {

        if (this.canSetPrice == false) {
            this.canSetPrice = true;
            this.pump.buybutton = new LabelButton(this, this.pump.x + 125, this.pump.y + 250, 0.65, "buttons_long", "Set Price",
                    function () {
                        this.checkPrice()
                    }, this, 0, 1, 2);
        }

        num = this.pumpPPG - this.difficulty;
        this.pumpPPG = num;
        this.pump.ppgText.setText((this.pumpPPG).toFixed(2));

    },
    checkPrice: function (pump) {

        ppg = 0;

        amount = this.pump.amount;
        cost = this.pump.cost;
        ppg = cost / amount;
        if (this.pumpPPG.toFixed(2) == ppg.toFixed(2)) {
            this.displayMessage("The pump has been fixed!");
            this.pump.buybutton.destroy();
            this.pump.buybutton = new LabelButton(this, this.pump.x + 125, this.pump.y + 250, 0.65, "buttons_long", "Buy",
                    function () {
                        this.buy(ppg);
                    }, this, 0, 1, 2);
        }
        else {
            this.displayMessage("Whoops! Try again.");
            SHARED_DATA.money -= 1;
            this.animateGainAndLoss('money', 1, false);
        }


        if (SHARED_DATA.money < 0) {
            this.SHARED_DATA.money = 0;
        }
        this.moneyText.setText(' $' + SHARED_DATA.money.toFixed(2));
        this.gasText.setText(" " + SHARED_DATA.gas + "/" + SHARED_DATA.carChoice.tankSize);

    },
    buy: function (ppg) {
        if (SHARED_DATA.money - ppg > 0) {
            if (SHARED_DATA.gas < SHARED_DATA.carChoice.tankSize) {
                SHARED_DATA.gas += 1;
                SHARED_DATA.money -= ppg;
                this.animateGainAndLoss('money', ppg, false);
                this.animateGainAndLoss('gas', 1, true);
                this.moneyText.setText(' $' + SHARED_DATA.money.toFixed(2));
                this.updateGasText();
                //this.displayMessage("You bought 1 gallon for $" + ppg.toFixed(2));
                this.pump.buybutton.destroy();
                this.pump.ppgText.setText("???");
                this.pumpPPG = 2;
                this.makeGas();
            }
            else {
                this.displayMessage("Tank is full!");
            }
        }
        else {
            this.displayMessage("You cant afford that right now.");
        }



    },
    displayMessage: function (message) {
        this.messageText.setText("");
        this.messageText.destroy();
        this.messageText = this.add.text(this.world.centerX, 525, "", {font: "40px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.messageText.anchor.set(0.5);
        this.messageText.setText(message);
        this.add.tween(this.messageText).to({alpha: 1}, 10, Phaser.Easing.Linear.None, true);
        this.time.events.add(1500, function () {
            this.add.tween(this.messageText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
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
    randRange: function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    },
    animateGainAndLoss: function (type, amount, gain) {
        amount = Math.abs(amount);
        var floatText;
        if (type === 'money') {
            if (gain) {
                floatText = this.add.text(95, 510, "+ $" + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(95, 510, "- $" + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        } else if (type === 'gas') {
            if (gain) {
                floatText = this.add.text(325, 510, "+ " + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(325, 510, "- " + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        }
        var floatTween = this.add.tween(floatText).to({alpha: 0, y: 485}, 1500, Phaser.Easing.Linear.None, true);
        floatTween.onComplete.add(function () {
                floatText.destroy();
            });
        floatTween.start();
    }
};
 
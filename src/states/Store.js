/* global SHARED_DATA, RoadTrip, Phaser */

/**
 * Ben Gotthold 3/19/15
 */

RoadTrip.Store = function () {
    this.food = [];
    this.water = [];
    this.messageText;
    this.directionsText;
    this.moneyText;
    this.waterText;
    this.foodText;
    this.gasText;
    this.priceText1;
    this.priceText2;
    this.priceText3;
    this.bestDeal;
    this.worstDeal;
    this.tutorialOpen = false;
};

RoadTrip.Store.prototype = {
    create: function () {

        var bottomRect = this.drawRectangle(0, 255, 900, 90, "#000000");
        bottomRect.alpha = 0.7;

        this.food = [];
        this.water = [];
        this.stage.backgroundColor = '#4176A3'; //Change background color here

        bg = this.add.image(0, 0, 'backdrop');
        bg.width = 900;
        bg.height = 600;


        shelf = this.add.image(210, 100, 'shelf');
        shelf.width = 530;
        shelf.height = 260;

        countTextStyle = {font: "30px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5};


        Money = this.add.image(10, 525, 'money');
        Money.width = 75;
        Money.height = 75;
        this.moneyText = this.add.text(100, 550, ' $' + SHARED_DATA.money.toFixed(2), countTextStyle);


        waterAmountSprite = this.add.sprite(275, 525, 'water');
        waterAmountSprite.height = 75;
        waterAmountSprite.width = 75;
        waterAmountSprite.inputEnabled = true;
        waterAmountSprite.input.useHandCursor = true;
        waterAmountSprite.events.onInputDown.add(function () {
            console.log(this.tutorialOpen);
            if (!this.tutorialOpen) {
                SHARED_DATA.shoppingFor = "Water";
                this.switchProduct();
            }
        }, this);
        this.waterText = this.add.text(waterAmountSprite.x + 1.2 * waterAmountSprite.width, waterAmountSprite.y + (waterAmountSprite.height / 2), " x " + SHARED_DATA.water, countTextStyle);
        this.waterText.anchor.set(0.5);

        foodAmountSprite = this.add.sprite(475, 525, 'food');
        foodAmountSprite.height = 75;
        foodAmountSprite.width = 75;
        foodAmountSprite.inputEnabled = true;
        foodAmountSprite.input.useHandCursor = true;
        foodAmountSprite.events.onInputDown.add(function () {
            if (!this.tutorialOpen) {
                SHARED_DATA.shoppingFor = "Food";
                this.switchProduct();
            }
        }, this);
        this.foodText = this.add.text(foodAmountSprite.x + 1.5 * foodAmountSprite.width, foodAmountSprite.y + (foodAmountSprite.height / 2), " x " + SHARED_DATA.food, countTextStyle);
        this.foodText.anchor.set(0.5);


        priceTag1 = this.add.sprite(700, 90 + 32, 'priceTag');
        priceTag1.height = 40;
        priceTag1.width = 100;
        this.priceText1 = this.add.text(priceTag1.x + (0.5 * priceTag1.width), priceTag1.y + (0.15 * priceTag1.height), "$", {font: "20px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});

        priceTag2 = this.add.sprite(700, 170 + 32, 'priceTag');
        priceTag2.height = 40;
        priceTag2.width = 100;
        this.priceText2 = this.add.text(priceTag2.x + (0.5 * priceTag2.width), priceTag2.y + (0.15 * priceTag2.height), "$", {font: "20px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});

        priceTag3 = this.add.sprite(700, 248 + 32, 'priceTag');
        priceTag3.height = 40;
        priceTag3.width = 100;
        this.priceText3 = this.add.text(priceTag3.x + (0.5 * priceTag3.width), priceTag3.y + (0.15 * priceTag3.height), "$", {font: "20px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});



        this.messageText = this.add.text(this.world.centerX, 400, "", {font: "40px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.messageText.anchor.set(0.5);

        var backbutton = new LabelButton(this, 730, 560, 0.75, "buttons_long", "Back To Map",
                function () {
                    this.state.start('Map');
                }, this, 0, 1, 2);



        var help = this.add.image(845, 535, 'help');
        help.scale.set(0.4);
        help.inputEnabled = true;
        help.input.useHandCursor = true;
        help.events.onInputDown.add(function () {
            this.showTutorial();
        }, this);


        //this.build();
        this.switchProduct();

        if (!SHARED_DATA.sawStoreTutorial) {
            this.showTutorial();
        }

    },
    showTutorial: function () {
        this.tutorialOpen = true;
        this.alert("Click on the icons below to display that item in the store. Click on the shelves to buy all the item on that shelf. Be sure to choose the best deal!",
                "Shop", this, function (state) {
                    SHARED_DATA.sawStoreTutorial = true;
                    state.tutorialOpen = false;
                    //console.log(state.tutorialOpen);
                });
    },
    switchProduct: function () {
        if (SHARED_DATA.shoppingFor === "Food") {
            for (var i = 0; i < this.water.length; i++) {
                this.water[i].visible = false;

            }
            if (this.food.length !== 0) {
                for (var i = 0; i < this.food.length; i++) {
                    this.food[i].visible = true;
                    if (this.food[i].y < 100) {
                        this.priceText1.setText("$" + this.food[i].cost);
                    }
                    else if (this.food[i].y < 200) {
                        this.priceText2.setText("$" + this.food[i].cost);
                    }
                    else {
                        this.priceText3.setText("$" + this.food[i].cost);
                    }

                }
            }
            else {
                this.build();
            }

        }
        else if (SHARED_DATA.shoppingFor === "Water") {
            for (var i = 0; i < this.food.length; i++) {
                this.food[i].visible = false;
            }
            if (this.water.length !== 0) {
                for (var i = 0; i < this.water.length; i++) {
                    this.water[i].visible = true;
                    if (this.water[i].y < 100) {
                        this.priceText1.setText("$" + this.water[i].cost);
                    }
                    else if (this.water[i].y < 200) {
                        this.priceText2.setText("$" + this.water[i].cost);
                    }
                    else {
                        this.priceText3.setText("$" + this.water[i].cost);
                    }
                }
            }
            else {
                this.build();
            }

        }

    },
    build: function () {

        this.bestDeal = 0;
        this.worstDeal = 1000;
        if (SHARED_DATA.shoppingFor === "Food") {
            for (var i = 0; i < this.food.length; i++) {
                this.food[i].kill();
            }
            this.food = [];
            amount1 = this.makeFood(90);
            amount2 = this.makeFood(170);
            amount3 = this.makeFood(248);

            if (amount1 === amount2 || amount1 === amount3 || amount2 === amount3) {
                this.build();
            }

        }
        else if (SHARED_DATA.shoppingFor === "Water") {
            for (var i = 0; i < this.water.length; i++) {
                this.water[i].kill();
            }

            this.water = [];
            amount1 = this.makeWater(90);
            amount2 = this.makeWater(170);
            amount3 = this.makeWater(248);

            if (amount1 === amount2 || amount1 === amount3 || amount2 === amount3) {
                this.build();
            }
        }



    },
    makeWater: function (height) {

        randomAmount = Math.floor((Math.random() * 10) + 2);
        randomPrice = 0;
        while (randomPrice <= 1 || ((randomAmount / randomPrice) === this.bestDeal) || ((randomAmount / randomPrice) === this.worstDeal)) {
            randomAmount = Math.floor((Math.random() * 10) + 2);
            randomPrice = Math.floor((Math.random() * randomAmount) + randomAmount / 2);
        }
        if ((randomAmount / randomPrice) > this.bestDeal) {
            this.bestDeal = randomAmount / randomPrice;
        }
        if ((randomAmount / randomPrice) < this.worstDeal) {
            this.worstDeal = randomAmount / randomPrice;
        }




        for (var i = 0; i < randomAmount; i++) {

            var water = this.add.sprite(240 + i * 35, height, 'water');
            water.height = 65;
            water.width = 75;
            water.inputEnabled = true;
            water.input.useHandCursor = true;
            water.cost = randomPrice;
            water.amount = randomAmount;
            water.type = "water";
            water.events.onInputDown.add(this.buyObject, this);
            this.water.push(water);


        }
        if (height < 100) {
            this.priceText1.setText("$" + randomPrice);
        }
        else if (height < 200) {
            this.priceText2.setText("$" + randomPrice);
        }
        else {
            this.priceText3.setText("$" + randomPrice);
        }
        return randomAmount;


    },
    makeFood: function (height) {

        randomAmount = Math.floor((Math.random() * 5) + 1);
        randomPrice = 0;
        randomPrice = 0;
        while (randomPrice <= 1 || ((randomAmount / randomPrice) === this.bestDeal) || ((randomAmount / randomPrice) === this.worstDeal)) {
            randomAmount = Math.floor((Math.random() * 5) + 1);
            randomPrice = Math.floor((Math.random() * randomAmount) + (Math.random() * 10));
        }
        if ((randomAmount / randomPrice) > this.bestDeal) {
            this.bestDeal = randomAmount / randomPrice;
        }
        if ((randomAmount / randomPrice) < this.worstDeal) {
            this.worstDeal = randomAmount / randomPrice;
        }

        for (var i = 0; i < randomAmount; i++) {

            var food = this.add.sprite(250 + i * 75, height, 'food');
            food.height = 65;
            food.width = 75;
            food.inputEnabled = true;
            food.input.useHandCursor = true;
            food.cost = randomPrice;
            food.amount = randomAmount;
            food.type = "food";
            food.events.onInputDown.add(this.buyObject, this);
            this.food.push(food);


        }
        if (height < 100) {
            this.priceText1.setText("$" + randomPrice);
        }
        else if (height < 200) {
            this.priceText2.setText("$" + randomPrice);
        }
        else {
            this.priceText3.setText("$" + randomPrice);
        }
        return randomAmount;

    },
    update: function () {

    },
    buyObject: function (sprite) {

        if (SHARED_DATA.money - sprite.cost >= 0) {
            SHARED_DATA.money = SHARED_DATA.money - sprite.cost;
            this.animateGainAndLoss('money', sprite.cost, false);
            this.moneyText.setText(' $' + SHARED_DATA.money.toFixed(2));
            if (sprite.type === "water") {
                SHARED_DATA.water = SHARED_DATA.water + sprite.amount;
                this.animateGainAndLoss('water', sprite.amount, true);
                this.waterText.setText(" x " + SHARED_DATA.water);
                if (sprite.amount / sprite.cost === this.bestDeal) {
                    this.displayMessage("Great Buy!");
                }

                else {
                    this.displayMessage("There was probably a better deal..");
                }
            }

            else {
                SHARED_DATA.food = SHARED_DATA.food + sprite.amount;
                this.animateGainAndLoss('food', sprite.amount, true);
                this.foodText.setText(" x " + SHARED_DATA.food);
                if (sprite.amount / sprite.cost === this.bestDeal) {
                    this.displayMessage("Great Buy!");
                }

                else {
                    this.displayMessage("There was probably a better deal..");
                }
            }
            this.build();

        }
        else {
            this.displayMessage("You don't have enough money for that.");
        }

    },
    displayMessage: function (message) {
        this.messageText.setText("");
        this.messageText.destroy();
        this.messageText = this.add.text(this.world.centerX, 425, "", {font: "40px Arial", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
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
                floatText = this.add.text(125, 475, "+ $" + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(125, 475, "- $" + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        } else if (type === 'food') {
            if (gain) {
                floatText = this.add.text(572, 475, "+ " + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(572, 475, "- " + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        } else if (type === 'water') {
            if (gain) {
                floatText = this.add.text(350, 475, "+ " + amount, {font: "24px Georgia", fill: "#00FF00", align: "center", stroke: "#000000", strokeThickness: 5});
            }
            else {
                floatText = this.add.text(350, 475, "- " + amount, {font: "24px Georgia", fill: "#FF0000", align: "center", stroke: "#000000", strokeThickness: 5});
            }
        }
        var floatTween = this.add.tween(floatText).to({alpha: 0, y: 450}, 1500, Phaser.Easing.Linear.None, true);
        floatTween.onComplete.add(function () {
                floatText.destroy();
            });
        floatTween.start();
    }
};
 
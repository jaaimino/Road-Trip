/* global SHARED_DATA, RoadTrip, EVENTS */

RoadTrip.RandomEvent = function () {
    this.yesbutton;
    this.nobutton;
    this.continuebutton;
    this.titletext;
    this.eventtext;
    this.event;
};
RoadTrip.RandomEvent.prototype = {
    preload: function () {
        this.load.script('labelbutton.js', 'src/widgets/labelbutton.js');
    },
    create: function () {
        this.stage.backgroundColor = '#4176A3'; //Change background color here

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        var rand = getRandomInt(0, EVENTS.length - 1);

        //console.log(rand);

        this.event = EVENTS[rand];

        this.titletext = this.game.add.text(this.game.world.centerX, 100, "Trip Decision", {font: "bold 65px Georgia", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5});
        this.titletext.anchor.set(0.5);

        this.eventText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.event.text, {font: "bold 35px Georgia", fill: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5, wordWrap: true, wordWrapWidth: 790});
        this.eventText.anchor.set(0.5, 0.5);

        this.yesbutton = new LabelButton(this, this.world.centerX - 100, 500, 0.75, "buttons_long", "Yes",
                function () {
                    this.makechoice(true);
                }, this, 0, 1, 2);

        this.nobutton = new LabelButton(this, this.world.centerX + 100, 500, 0.75, "buttons_long", "No",
                function () {
                    this.makechoice(false);
                }, this, 0, 1, 2);

        this.continuebutton = new LabelButton(this, this.world.centerX, 500, 0.75, "buttons_long", "Continue",
                function () {
                    SHARED_DATA.offeredMiniGame = false;
                    this.state.start('Map');
                }, this, 0, 1, 2);
        this.continuebutton.visible = false;
    },
    makechoice: function (choice) {
        if (choice) {
            this.eventText.setText(this.event.yestext);
            for (var i = 0; i < this.event.yesmodifiers.length; i++) {
                SHARED_DATA[this.event.yesmodifiers[i].resource] += this.event.yesmodifiers[i].amount;
                if (SHARED_DATA[this.event.yesmodifiers[i].resource] < 0) {
                    SHARED_DATA[this.event.yesmodifiers[i].resource] = 0;
                }
            }
        } else {
            this.eventText.setText(this.event.notext);
            for (var i = 0; i < this.event.nomodifiers.length; i++) {
                SHARED_DATA[this.event.nomodifiers[i].resource] += this.event.nomodifiers[i].amount;
                if (SHARED_DATA[this.event.yesmodifiers[i].resource] < 0) {
                    SHARED_DATA[this.event.yesmodifiers[i].resource] = 0;
                }
            }
        }
        //console.log(SHARED_DATA.karma);
        this.yesbutton.visible = false;
        this.nobutton.visible = false;
        this.continuebutton.visible = true;
    }
};
/* global RoadTrip, SaveManager, SHARED_DATA, Phaser */
/*
 * "Designed by Freepik.com"
 */

RoadTrip.MainMenu = function (game) {
    this.skyGroup = null;
    this.skies = [];
    this.timer = null;
    this.currSky = 0;
};
RoadTrip.MainMenu.prototype = {
    preload: function () {
        this.load.script('labelbutton.js', 'src/widgets/labelbutton.js');
    },
    create: function () {
        this.stage.backgroundColor = '#4176A3'; //Change background color here

        this.skygroup = this.add.group();

        var sunset2 = this.add.image(this.world.centerX, this.world.centerY, 'sky_sunset');
        sunset2.anchor.set(0.5, 0.5);
        this.skygroup.add(sunset2);

        var night = this.add.image(this.world.centerX, this.world.centerY, 'sky_night');
        night.anchor.set(0.5, 0.5);
        this.skygroup.add(night);


        var sunset = this.add.image(this.world.centerX, this.world.centerY, 'sky_sunset');
        sunset.anchor.set(0.5, 0.5);
        this.skygroup.add(sunset);

        var sky = this.add.image(this.world.centerX, this.world.centerY, 'sky_day');
        sky.anchor.set(0.5, 0.5);
        this.skygroup.add(sky);

        this.skies.push(sky);
        this.skies.push(sunset);
        this.skies.push(night);
        this.skies.push(sunset2);

        this.timer = this.game.time.create(this.game);
        this.timer.loop(5000, this.timerCallback, this);
        this.timer.start();

        var cityscape = this.add.image(-6, this.game.world.height - 342, 'cityscape');

        this.sprite = this.game.add.sprite(-100, this.game.world.height - 75, "carprev");
        this.game.add.tween(this.sprite).to({
            x: this.game.world.width + 100
        }, 5000, Phaser.Easing.Default, true, 0, Number.MAX_VALUE, false);

        //Background music setup
        //music = this.add.audio('theme');
        //music.play();

        this.instructionText = this.game.add.text(this.game.world.centerX, 100, "Road Trip", {font: "bold 65px Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5});

        //  Centers the text
        this.instructionText.anchor.set(0.5);

        var startbutton = new LabelButton(this, this.world.centerX, 450, 0.75, "buttons_long", "New Game",
                function () {
                    this.game.state.start('Setup');
                    //this.game.state.start('Snowboarding');
                }, this, 0, 1, 2);

        /*
         var contbutton = new LabelButton(this, this.world.centerX, 480, 0.75, "buttons_long", "Continue",
         function () {
         SaveManager.loadSharedData();
         if (SHARED_DATA.carChoice !== null) {
         this.game.state.start('Map');
         } else {
         }
         }, this, 0, 1, 2);
         */
    },
    /**
     * Sky fading. So pretty
     */
    timerCallback: function () {
        if (this.currSky === this.skies.length - 1) {
            var sky = this.skies[0];
            var skytween = this.add.tween(this.skies[0]).to({alpha: 1.0}, 2000, Phaser.Easing.Linear.None, true).start();
            skytween.onComplete.add(function () {
                skygroup.setAll("alpha", 1.0);
            });
        } else {
            var sky = this.skies[this.currSky];
            this.add.tween(sky).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true).start();
        }
        var skygroup = this.skygroup;
        this.currSky++;
        if (!(this.currSky < this.skies.length)) {
            this.currSky = 0;

        }
    },
    alert: function (string, buttonstring, phaserstate, callBack, cancelable, canceltext, cancelCallback) {
        var bg = this.drawRectangle(100, 70, 500, 330, "#000000");
        bg.alpha = 0.8;
        var textstyle = {font: "14pt Georgia", fill: "white", align: "center", stroke: "#000000", strokeThickness: 5};
        var text = this.game.add.text(this.game.world.centerX, 280, string, textstyle);
        text.anchor.set(0.5, 0.5);
        text.wordWrap = true;
        text.wordWrapWidth = 460; //790 and 10 above to try do some padding
        var button = new LabelButton(this, this.game.world.centerX, 425, 0.75, "buttons_long", buttonstring,
                function () {
                    bg.destroy();
                    text.destroy();
                    button.kill();
                    callBack(phaserstate);
                }, this, 0, 1, 2);
        if (cancelable) {
            button.x = this.game.world.centerX - 100;
            var cancelbutton = new LabelButton(this, this.game.world.centerX + 100, 425, 0.75, "buttons_long", canceltext,
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
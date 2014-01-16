
;window.clock = new(function() {
    "use strict";

    // constants
    var CANVAS_HEIGHT = 300;
    var CANVAS_WIDTH  = 400;
    var RADIUS        = 230 / 2;

    // public varibles

    // private varibles
    var _self         = this;
    var _canvas;
    var _stage;

    // $DOM


    // Public Methods ____________________________________________________

    this.initialize = function() {
        // set references
        _canvas = document.getElementById('clock');
        _stage  = new createjs.Stage(_canvas);

        // create
        _createClock();

        return this;
    };

    this.startRender = function() {
        createjs.Ticker.useRAF = true;
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", _onRenderTick);
    };


    // Private Methods ___________________________________________________

    function _createClock() {
        _createFace();
        _createTicks();
        _createBorder();
        _createNumbers();
        _createHands();
    };

    function _createBorder() {
        var obj, x, y;

        x = CANVAS_WIDTH / 2;
        y = CANVAS_HEIGHT / 2;

        // background
        obj = new createjs.Shape().set({ x: x, y: y })
        obj.graphics
            .ss(10)
            .ls(['#242a32', '#3c434c'], [1, 0], 0, -RADIUS, 0, RADIUS - 50)
            .dc(0, 0, RADIUS - 5);
        obj.shadow = new createjs.Shadow("rgba(0, 0, 0, 0.4)", 0, 3, 5);
        _stage.addChild(obj);


        // highlight 1
        obj = new createjs.Shape().set({ x: x, y: y })
        obj.graphics
            .ls(['#525860', '#1e252e'], [0, 1], 0, -RADIUS, 0, RADIUS - 50)
            .dc(0, 0, RADIUS - 2);
        _stage.addChild(obj);

        // highlight 2
        obj = new createjs.Shape().set({ x: x, y: y })
        obj.graphics
            .ls(['#525860', '#1e252e'], [1, 0], 0, -RADIUS, 0, RADIUS - 50)
            .dc(0, 0, RADIUS - 8);
        _stage.addChild(obj);
    };

    function _createFace() {
        var obj, x, y;

        x = CANVAS_WIDTH / 2;
        y = CANVAS_HEIGHT / 2;

        // white
        obj = new createjs.Shape().set({ x: x, y: y })
        obj.graphics
            .f('#eaecef')
            .dc(0, 0, RADIUS - 10);
        _stage.addChild(obj);
    };

    function _createTicks() {
        var i, l, obj, tickSize, x, y;

        x = CANVAS_WIDTH / 2;
        y = CANVAS_HEIGHT / 2;

        for (i = 0, l = 60; i < l; i++) {
            tickSize = i % 5 === 0 ? 10 : 5;

            switch (i) {
                case 59: case 0: case 1:
                case 14: case 15: case 16:
                case 29: case 30: case 31:
                case 44: case 45: case 46:
                    tickSize = 0;
            };

            obj = new createjs.Shape().set({
                regY    : 95,
                rotation: (360 / 60) * i,
                x       : x,
                y       : y
            });
            obj.graphics
                .f('#ccc')
                .dr(0, 10 - tickSize, 1, tickSize);

            _stage.addChild(obj);
        };
    };

    function _createNumbers() {
        var color, font, obj, text, x, y;

        color = "#333";
        font  = "100 20px Helvetica";
        x     = CANVAS_WIDTH / 2;
        y     = CANVAS_HEIGHT / 2;

        _stage.addChild(new createjs.Text("12", font, color).set({
            x: x - 12,
            y: y - 100
        }));

        _stage.addChild(new createjs.Text("3", font, color).set({
            x: x + 85,
            y: y - 10
        }));

        _stage.addChild(new createjs.Text("6", font, color).set({
            x: x - 5,
            y: y + 80
        }));

        _stage.addChild(new createjs.Text("9", font, color).set({
            x: x - 95,
            y: y - 10
        }));
    };

    function _createHands() {
        var i, l, obj, tickSize, x, y;

        x = CANVAS_WIDTH / 2;
        y = CANVAS_HEIGHT / 2;

        // hours
        _self.hours = new createjs.Shape().set({
            regY    : 70 - 15,
            x       : x,
            y       : y
        });
        _self.hours.graphics
            .f('#3f4851')
            .dr(-2.5, 0, 5, 70);
        _self.hours.shadow = new createjs.Shadow("rgba(0, 0, 0, 0.3)", 0, 4, 5);

        _stage.addChild(_self.hours);

        // minutes
        _self.minutes = new createjs.Shape().set({
            regY    : 85 - 15,
            x       : x,
            y       : y
        });
        _self.minutes.graphics
            .f('#3f4851')
            .dr(-2, 0, 4, 85);
        _self.minutes.shadow = new createjs.Shadow("rgba(0, 0, 0, 0.3)", 0, 4, 5);

        _stage.addChild(_self.minutes);

        // seconds
        _self.seconds = new createjs.Container().set({
            regY    : 95 - 15,
            x       : x,
            y       : y
        });
            obj = new createjs.Shape();
            obj.graphics
                .f('#eb2f41')
                .dr(0, 0, 1, 95);
            _self.seconds.addChild(obj);

            obj = new createjs.Shape().set({ x: 1, y: 30 });
            obj.graphics
                .f('#eb2f41')
                .dc(0, 0, 5);
            _self.seconds.addChild(obj);
        _self.seconds.shadow = new createjs.Shadow("rgba(0, 0, 0, 0.3)", 0, 4, 5);

        _stage.addChild(_self.seconds);

        // button
        obj = new createjs.Shape().set({ x: x, y: y });
        obj.graphics
            .f('#fff').dc(0, 0, 4)
            .f('#999').dc(-5, 0, 4)
            .f('#999').dc(5, 0, 4)
            .f('#666').dr(-1, 0, 3, 1);
        obj.mask = new createjs.Shape().set({ x: x, y: y });
        obj.mask.graphics
            .f('#000').dc(0, 0, 4);
        _stage.addChild(obj);
    };

    // Event Handlers ____________________________________________________

    function _onRenderTick() {
        var date;

        date                   = new Date();
        _self.hours.rotation   = 360 / 12 * date.getHours();
        _self.minutes.rotation = 360 / 60 * date.getMinutes();
        _self.seconds.rotation = 360 / 60 * date.getSeconds();

        _stage.update();
    };

})();
(function (window) {
    'use strict';

    /**
     * Canvas settings
     * @param canvasId
     * @param width
     * @param height
     **/

    function Canvas(canvasId, width, height) {
        this.canvasId = canvasId;
        this.el = document.getElementById(canvasId);
        if(!this.el){
            throw new Error('Must provide a right canvas id.');
        }
        this.context = this.el.getContext('2d');
        this.width = width || window.innerWidth;
        this.height = height || window.innerHeight;

        this._init();
    }

    Canvas.prototype = {
        constructor: Canvas,
        _init: function () {
            this.el.width = this.width;
            this.el.height = this.height;
        },
        clear: function (fromX, fromY, toX, toY) {
            fromX = fromX || 0;
            fromY = fromY || 0;
            toX = toX || this.width;
            toY = toY || this.height;

            this.context.clearRect(fromX, fromY, toX, toY);
        },
        drawText: function (text, x, y) {
            this.clear(0,0);
            this.context.font = 'bold 20px Arial';
            this.context.fillStyle = 'white';
            this.context.textAlign = 'center';
            this.context.fillText(text, x === undefined ? (this.width / 2) : x , y === undefined ? 45 : y);

        }
    };

    window.Canvas = Canvas;
})(window);

(function (window) {
    'use strict';

    function Board(gameInst) {
        this.gameInst = gameInst;
        this.blockSize = 30;
        this.rows = TetrisConfig.rows;
        this.cols = TetrisConfig.cols;
        this.canvas = new Canvas('c_game_main',this.cols * this.blockSize, this.rows * this.blockSize);
        this.context = this.canvas.context;
        this.boderList = [];
        this.shape = new  window.Shape();


        this._init();

        var b = ResourceManager.getResource('blocks');
    }

    Board.prototype = {
        constructor: Board,
        _init:function () {
            this._buildGridData();
            this._initGrid();

            this.shape.draw(this.context);
            var self = this;
            setTimeout(function () {
                self._buildNextShape();
            });


        },
        _buildNextShape: function () {
            this.nextShape = new window.Shape();
            this.nextShape.setPosition(this.gameInst.nextshape.cols, this.gameInst.nextshape.rows);
            this.gameInst.nextshape.render(this.nextShape);
        },
        _buildGridData(){
            var i, j;
            for (i = 0; i < this.rows; i++){
                this.boderList[i] = [];
                for(j = 0; j < this.cols; j++){
                    this.boderList[i][j] = 0;
                }
            }

            //console.log(this.boderList);
        },
        _initGrid(){
            var i;
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 0.5;

            //绘制线条笔记
            for (i =0; i <= this.rows; i++){
                this.context.moveTo(0, i * this.blockSize);
                this.context.lineTo(this.canvas.width,i * this.blockSize);
            }
            for (i = 0; i <= this.cols; i++){
                this.context.moveTo(i * this.blockSize, 0);
                this.context.lineTo(i * this.blockSize, this.canvas.height);
            }
            //绘制线条
            this.context.stroke();

            //缓存画布数据
            this.gridImageData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
        },
        trick: function () {
            if(this.validMove(0,1)){
                this.shape.y += 1;
            }else{
                this.addShapeToBoardList();
                if(this.gameInst._state === 'over'){
                    this.gameInst.endGame();
                    return;
                }
                this.clearFullRows();
                this.shape = this.nextShape;
                this.shape.setPosition(this.cols, this.rows, true);
                this._buildNextShape();
            }


            this.refresh();
            this.shape.draw(this.context);
        },
        refresh: function () {
            this.canvas.clear();
            this.context.putImageData(this.gridImageData, 0, 0);
            this.drawBlocks();
        },
        validMove: function (moveX, moveY) {
            //下一步位置
            var nextX = this.shape.x + moveX;
            var nextY = this.shape.y + moveY;
            for(var y = 0; y < this.shape.layout.length; y++){
                for(var x = 0; x < this.shape.layout[y].length; x++){
                    if(this.shape.layout[y][x]){
                        if(typeof this.boderList[nextY + y] === 'undefined'//找不到行
                            || typeof this.boderList[nextY + y][nextX + x] === 'undefined'//找不到列
                            || this.boderList[nextY + y][nextX + x]//当前位置已有方块
                            || nextX + x < 0//超出左边界
                            || nextX + x >= this.cols//超出右边界
                            || nextY + y >= this.rows//超出底部
                        ){
                            return false;

                        }
                    }
                }
            }
            return true;
        },
        addShapeToBoardList: function () {
            for(var y = 0; y < this.shape.layout.length; y++){
                for(var x = 0; x < this.shape.layout[y].length; x++) {
                    if(this.shape.layout[y][x]){
                        //console.log('x-' + x + '---y-' + y + '---sx-' + this.shape.x + '---sy-' + this.shape.y);

                        var boardX = this.shape.x + x;
                        var boardY = this.shape.y + y;

                        //console.log(boardX + ' | ' + boardY);
                        if(this.boderList[boardY][boardX]){
                            //todo game over
                            this.gameInst._state = 'over';
                            return;
                        }else{
                            this.boderList[boardY][boardX] = this.shape.blockType;
                        }
                    }
                }
            }
        },
        drawBlocks: function () {
            for(var y = 0; y < this.rows; y++) {
                for (var x = 0; x < this.cols; x++) {
                    if(this.boderList[y][x]){
                        this.shape.block.draw(this.context, x, y, this.boderList[y][x]);
                    }
                }
            }
        },
        createEmptyRow: function(){
            var emptArr = [];
            for(var i = 0; i < this.cols; i++){
                emptArr.push(0);
            }
            return emptArr;
        },
        clearFullRows: function () {
            var self = this;
            var clearSoundCheck = false;
            var lines = 0;
            for(var y = this.rows - 1; y >= 0; y--){
                var filled = this.boderList[y].filter(function (item) {
                    return item > 0;
                }).length === this.cols;
                if(filled && y){
                    this.boderList.splice(y,1);
                    this.boderList.unshift(this.createEmptyRow());
                    y++;
                    lines++;
                    clearSoundCheck = true;
                }
            }
            if (clearSoundCheck){
                this.clearRowMusic();
            }
            var score = lines * 100 * lines; // 清除的行数 * 单行得分 * 倍数
            var totalScore = this.gameInst.score.addScore(score);
            var currentLevel = this.gameInst.level.checkedLevel(totalScore);
            if(currentLevel){
                window.TetrisConfig.speed = Math.floor(window.TetrisConfig.constSpeed * (1 - (currentLevel - 1) / 10));
                this.gameInst.pause();
                setTimeout(function () {
                    window.alert('Your are Leveling up!');
                    self.gameInst.resumeWithoutBgm();

                })
            }


        },
        clearRowMusic: function () {

            var self = this;

            //播放消除行音效
            self.gameInst._clearRow.play();

            //暂停主音效
            self.gameInst._sound.pause();

            //延时3秒后再次播放主音效
            setTimeout(function(){
                self.gameInst._sound.play();
            },3000);
        }


    };
    window.Board = Board;
})(window);


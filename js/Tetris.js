(function (window) {
    'use strict';

    var speed = TetrisConfig.speed;

    function Tetris() {
        var self = this;
        this.board = new Board(self);
        this.score = new Score();
        this.timer = new Timer();
        this.level = new Level();
        this.nextshape = new NextShape();

        this._sound;
        this._clearRow;
        this._gameOver;
        this._state = 'playing';
        (new Keyboard()).init(this.board);

    }

    Tetris.prototype = {
      constructor: Tetris,
      _initAudio: function () {
          this._sound = new Howl({
              src: ['audio/Tetris_bgm.ogg'],
              autoplay: true,
              loop: true,
              volume: 0.5,
              onend: function() {
                  console.log('Finished!');
              }
          });

          this._clearRow = new Howl({
              src: ['audio/Tetris_full_row.ogg'],
              loop: false,
              volume: 1,
              onend: function() {
                  console.log('Nice Job!');
              }
          });

          this._gameOver = new Howl({
              src: ['audio/Tetris_Game_Over.ogg'],
              loop: false,
              volume: 0.5,
              onend: function() {
                  console.log('Game Over!');
              }
          });

          this._sound.play();
      },
      _startTick(){
          var self = this;
          window.TetrisConfig.intervalId = window.setInterval(function () {
              self.board.trick();
          },speed);
      },
      _stopTick(){
          window.clearInterval(window.TetrisConfig.intervalId);
      },
      startGame: function () {
          this._startTick();
          this._initAudio();
      },
      endGame: function () {
          //停止声音播放
          this._sound.stop();

          //停止trick
          this._stopTick();

          //播放游戏结束音乐
          this._gameOver.play();

          //停止计时
          this.timer.stop();
      },
      pause: function () {
          if(this._state === 'over'){
              return;
          }
          //暂停播放音乐
          this._sound.pause();
          //暂停事件响应
          this._state = 'pause';
          //取消trick
          this._stopTick();
          //暂停计算器
          this.timer.pause();

      },
      resume: function () {
          if(this._state === 'over'){
              return;
          }
          this._sound.play();
          this._state = 'playing';
          this._startTick();
          this.timer.resume();
      },
      resumeWithoutBgm: function () {
          if(this._state === 'over'){
              return;
          }
          this._state = 'playing';
          this._startTick();
          this.timer.resume();
      }
    };
    window.Tetris = Tetris;
})(window);
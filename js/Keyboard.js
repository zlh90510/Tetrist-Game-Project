(function (window) {
    'use strict';

    var keys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'

    };
    function Keyboard() {
        this.board;
    }


    Keyboard.prototype = {
      constructor:Keyboard,
      init: function (board) {
          var self = this;

          self.board = board;

          document.addEventListener('keydown', function (evt) {
              self.processKeyDown(evt);
          });

      },
      processKeyDown: function (evt) {
          if(this.board.gameInst._state !== 'playing'){
              return;
          }

          if(keys[evt.keyCode]){
             this.press(keys[evt.keyCode]);

          }
      },
      press: function (key) {
          //console.log(key);
          var refresh = false;
          switch (key){
              case 'left':
                  if(this.board.validMove(-1,0)){
                      this.board.shape.x -= 1;
                  }

                  break;

              case 'up':

                  if(this.board.validMove(0,0)){
                      this.board.shape.rotate();
                      refresh = true;
                  }
                  break;

              case 'right':
                  if(this.board.validMove(1,0)){
                      this.board.shape.x += 1;
                      refresh = true;
                  }

                  break;

              case  'down':
                  if(this.board.validMove(0,1)){
                      this.board.shape.y += 1;
                      refresh = true;
                  }
                  break;
          }
          if(refresh){
              this.board.refresh();
              this.board.shape.draw(this.board.context);
              if(key === 'down'){
                  var self = this;
                  window.clearInterval(TetrisConfig.intervalId);
                  TetrisConfig.intervalId = window.setInterval(function () {
                      self.board.trick();
                  },TetrisConfig.speed);
              }

          }

      }

    };


    window.Keyboard = Keyboard;
})(window);
(function (document) {

    var gameInst;
    function DomObject(dom) {
        this.dom = dom;

    }
    DomObject.prototype.get = function () {
        return this.dom;
    };

    DomObject.prototype.on =function (eventName,eventHandler){
        this.get().addEventListener(eventName,eventHandler);
    };

    DomObject.prototype.css = function (styleKey,styleValue) {
        this.get().style[styleKey] = styleValue;
    };

    function $(selector,context){
        return new DomObject((context || document).querySelector(selector));

    }
    
    function startGame() {
        ResourceManager.onResourceLoaded = function () {
            gameInst = new Tetris();
            gameInst.startGame();
        };
        ResourceManager.init();

    }

    function _init() {
        $('#btn-start').on('click',function (ev) {
            $('.start-container').css('display','none');
            $('.game-container').css('display','block');
            startGame();
        });
        $('#btn-setting').on('click',function () {
            alert('You clicked the setting button.');
        });
        $('#btn-game-pause').on('click',function (evt) {
            var el = evt.target;
            if(el.innerText === 'PAUSE'){
                el.innerText = 'RESUME';
                gameInst.pause();
            }else{
                el.innerText = 'PAUSE';
                gameInst.resume();
            }
        });
    }

    document.addEventListener('DOMContentLoaded',function (ev) {
        _init();
    });

})(document);
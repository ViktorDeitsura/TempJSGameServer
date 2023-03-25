
    var Main = {};

    var windowGame = null;

    try {
        window.PIXI = PIXI;

        window.pixiApplication = new PIXI.Application( {
            width  : 400,
            height : 485,
            backgroundColor : 0xE6E6FA,
            autoResize: true,
            resolution : 1,
        } );

        var wrapper = document.createElement('div');
        wrapper.id = 'wrapper';
        wrapper.appendChild( pixiApplication.view );
        document.body.appendChild( wrapper );

        windowGame = new PIXI.Container();//create new Container
        pixiApplication.stage.addChild( windowGame );//Add container on stage
        windowGame.zIndex = GameData.zIndex++;
        windowGame.sortableChildren = true;
        Main.windowGame = windowGame;

        ScorePanel.init( windowGame );
        Main.game = new Game( windowGame );//create game object
        Main.game.init();

    } catch (err) {
        console.log( err.message + " " + err.stack );
    }

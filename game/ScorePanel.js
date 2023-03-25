    var ScorePanel = {};

    ScorePanel.init = function ( _windowGameGroup ) {
        var group = new PIXI.Container();//create new Container
        _windowGameGroup.addChild( group );//Add container on stage
        group.zIndex = GameData.zIndex++;
        group.sortableChildren = true;

        this.showSprites( GameData.sprites.countBackgr, group );
        this.scoreSprites = [];

        var textNumGroup = new PIXI.Container();//create new Container
        group.addChild( textNumGroup );//Add container on stage
        textNumGroup.zIndex = GameData.zIndex++;
        textNumGroup.sortableChildren = true;
        this.textNumGroup = textNumGroup;
    };

    ScorePanel.showSprites = function( _spriteParams, _container ) {//create textute sprite with the given parameters
        var texture = PIXI.Texture.from( _spriteParams.imagePath );
        var sprite = PIXI.Sprite.from( texture );

        sprite.zIndex = GameData.zIndex++;
        sprite.x = _spriteParams.x;
        sprite.y = _spriteParams.y;

        _container.addChild( sprite );
        return sprite;
    };

    Object.defineProperty( ScorePanel, "countScore", {
        get: function() { return this._countScore; },
        set: function( val ) {

            this._countScore = val;
            var oldTextNum = this.scoreSprites;

            this.scoreSprites = this.addSpriteToScore( val );

            if ( oldTextNum.length > 0 ) {
                this.destroySpriteToScore( oldTextNum );
            }
        }
    });

    ScorePanel.addSpriteToScore = function( _val ) {//create sprites for score
        console.log(_val);
        var valString = _val+"";
        var arrForImage = [];

        var shiftX = 18;
        for ( var i = 0; i < valString.length; i++ ) {
            var num = valString[i];
            var sprite = this.showSprites( GameData.fontSprites[num], this.textNumGroup );
            sprite.x = sprite.x + shiftX * i;
            arrForImage.push( sprite );
        }

        return arrForImage;
    };

    ScorePanel.destroySpriteToScore = function( _spritesArr ) {//destroy count number sprite
        for ( var i = 0; i < _spritesArr.length; i++ ) {
            _spritesArr[i].removeChildren();
            _spritesArr[i].visible = false;
        }
    };

    var Game = function( _windowGameGroup ) {
        var group = new PIXI.Container();//create new Container
        _windowGameGroup.addChild( group );//Add container on stage
        group.zIndex = GameData.zIndex++;
        group.sortableChildren = true;

        this.group = group;
        this.tilesOnField = [
                                [null, null, null, null],
                                [null, null, null, null],
                                [null, null, null, null],
                                [null, null, null, null]
                            ];
        this.tilesObj = [];
        this.spawnTileSys = false;
        this.animation = false;
        this.countScore = 0;
    };

    Game.prototype.init = function() {
        var self = this;
        this.showSprites( GameData.sprites.background, this.group );

        var tileBackX = Consts.TILE_COORD_X;
        var tileBackY = Consts.TILE_COORD_Y;
        //add tiles backgrounds sprites
        for ( var j = 0; j < 4; j++ ) {
            for ( var i = 0; i < 4; i++ ) {
                var tileParams = GameData.sprites.tileBackgr;
                tileParams.x = tileBackX + Consts.DISTANCE_BETWEEN_TILES * i;
                tileParams.y = tileBackY + Consts.DISTANCE_BETWEEN_TILES * j;
                this.showSprites( tileParams, this.group );
            }
        }

        var groupTiles = new PIXI.Container();//create new Container
        this.group.addChild( groupTiles );//Add container on stage
        groupTiles.zIndex = GameData.zIndex++;
        groupTiles.sortableChildren = true;
        this.tilesGroup = groupTiles;

        for ( var i = 0; i < 2; i++ ) {
            var tileIndex = this.searchFreePlaceForTile();
            this.addTileToField( tileIndex );
        }

        this.group.buttonMode = true;
        this.group.interactive = true;
        this.group.on( "pointerdown", function(e){ self.onClickDown(e); } );
        this.group.on( "pointerup",   function(e){ self.onClickUp  (e); } );
    };

    Game.prototype.showSprites = function( _spriteParams, _container ) {//create textute sprite with the given parameters
        var texture = PIXI.Texture.from( _spriteParams.imagePath );
        var sprite = PIXI.Sprite.from( texture );

        sprite.zIndex = GameData.zIndex++;
        sprite.x = _spriteParams.x;
        sprite.y = _spriteParams.y;

        _container.addChild( sprite );
        return sprite;
    };

    Game.prototype.searchFreePlaceForTile = function() {
        var freePlace = [];
        for ( var j = 0; j < 4; j++ ) {
            for ( var i = 0; i < 4; i++ ) {
                if ( this.tilesOnField[j][i] == null ) {
                    var pos = j+""+i;
                    freePlace.push(pos)
                }
            }
        }

        for ( var i = freePlace.length - 1; i > 0; i-- ) {
            var j = Math.floor( Math.random() * (i + 1)) ;
            var temp = freePlace[i];
            freePlace[i] = freePlace[j];
            freePlace[j] = temp;
        }

        var randomIndex = Math.floor( Math.random() * freePlace.length );

        return freePlace[randomIndex];
    };

    Game.prototype.addTileToField = function( _tileIndex ) {
        var x = Consts.TILE_COORD_X + Consts.DISTANCE_BETWEEN_TILES * _tileIndex[1];
        var y = Consts.TILE_COORD_Y + Consts.DISTANCE_BETWEEN_TILES * _tileIndex[0];
        var tile = new Tile( this.tilesGroup, x, y, _tileIndex )
        this.tilesOnField[_tileIndex[0]][_tileIndex[1]] = tile;
        this.tilesObj.push( tile );
        this.checkGameOver();
    };

    Game.prototype.onClickDown = function( _evt ) {
        if ( this.animation ) {
            return;
        }
        this.eventClickX = Math.floor( _evt.data.global.x );
        this.eventClickY = Math.floor( _evt.data.global.y );
    };

    Game.prototype.onClickUp = function( _evt ) {
        if ( this.animation ) {
            return;
        }
        var x = Math.floor( _evt.data.global.x );
        var y = Math.floor( _evt.data.global.y );
        var diffX = Math.abs( this.eventClickX - x );
        var diffY = Math.abs( this.eventClickY - y );

        if ( diffX > diffY && diffX > Consts.DISTANCE_BETWEEN_TILES/2 ) {
            if ( x > this.eventClickX ) {//moveRight
                this.makeStep( Consts.STEP_DIRECTION_RIGHT );
            } else {//moveLeft
                this.makeStep( Consts.STEP_DIRECTION_LEFT );
            }
        } else if ( diffY > diffX && diffY > Consts.DISTANCE_BETWEEN_TILES/2 ) {
            if ( y > this.eventClickY ) {//moveDown
                this.makeStep( Consts.STEP_DIRECTION_DOWN );
            } else {//moveUp
                this.makeStep( Consts.STEP_DIRECTION_UP );
            }
        }

    };

    Game.prototype.makeStep = function( _direction ) {
        if ( _direction == Consts.STEP_DIRECTION_LEFT ) {
            for ( var j = 0; j < this.tilesOnField.length; j++ ) {
                for ( var i = 0; i < this.tilesOnField[j].length; i++ ) {
                    var tile = this.tilesOnField[j][i];
                    if ( tile != null && i != 0 ) {
                        this.tileHandlerLeft( tile, this.tilesOnField[j], i );
                    }
                }
            }
        } else if ( _direction == Consts.STEP_DIRECTION_RIGHT ) {
            for ( var j = 0; j < this.tilesOnField.length; j++ ) {
                for ( var i = this.tilesOnField[j].length-1; i >= 0; i-- ) {
                    var tile = this.tilesOnField[j][i];
                    if ( tile != null && i != 3 ) {
                        this.tileHandlerRight( tile, this.tilesOnField[j], i );
                    }
                }
            }
        } else if ( _direction == Consts.STEP_DIRECTION_DOWN ) {
            for ( var j = 0; j < this.tilesOnField.length; j++ ) {
                for ( var i = this.tilesOnField.length-1; i >= 0; i-- ) {
                    var tile = this.tilesOnField[i][j];
                    if ( tile != null && i != 3 ) {
                        this.tileHandlerDown( tile, this.tilesOnField, i, j );
                    }
                }
            }
        } else if ( _direction == Consts.STEP_DIRECTION_UP ) {
            for ( var j = 0; j < this.tilesOnField.length; j++ ) {
                for ( var i = 0; i < this.tilesOnField.length; i++ ) {
                    var tile = this.tilesOnField[i][j];
                    if ( tile != null && i != 0 ) {
                        this.tileHandlerUp( tile, this.tilesOnField, i, j );
                    }
                }
            }
        }
    };

    Game.prototype.tileHandlerLeft = function( _tile, _arr, _numpos ) {
        this.spawnTileSys = true;
        var moveTo = true;
        var x = 0;
        for ( var i = _numpos-1; i >= 0; i-- ) {
            if ( _arr[i] == null ) {
                x -= Consts.DISTANCE_BETWEEN_TILES;
                _arr[i] = _tile;
                _arr[i+1] = null;
            } else {
                if ( _tile.count == _arr[i].count && !_tile.merge && !_arr[i].merge ) {
                    x -= Consts.DISTANCE_BETWEEN_TILES;
                    _tile = this.mergeTiles( _arr[i], _tile, x, null );//new tile continues handling
                    _arr[i] = _tile;
                    _arr[i+1] = null;
                    x = 0;//reset value
                    moveTo = true;
                } else {
                    break;
                }
            }
        }
        if ( moveTo && x != 0 ) {
            x = _tile.x + x;
            _tile.move( x );
        }
    };

    Game.prototype.tileHandlerRight = function( _tile, _arr, _numpos ) {
        this.spawnTileSys = true;
        var moveTo = true;
        var x = 0;
        for ( var i = _numpos+1; i < _arr.length; i++ ) {
            if ( _arr[i] == null ) {
                x += Consts.DISTANCE_BETWEEN_TILES;
                _arr[i] = _tile;
                _arr[i-1] = null;
            } else {
                if ( _tile.count == _arr[i].count && !_tile.merge && !_arr[i].merge ) {
                    x += Consts.DISTANCE_BETWEEN_TILES;
                    _tile = this.mergeTiles( _arr[i], _tile, x, null );//new tile continues handling
                    _arr[i] = _tile;
                    _arr[i-1] = null;
                    x = 0;//reset value
                    moveTo = false;
                } else {
                    break;
                }
            }
        }
        if ( moveTo && x != 0 ) {
            x = _tile.x + x;
            _tile.move( x );
        }
    };

    Game.prototype.tileHandlerDown = function( _tile, _arr, _numpos, _columnNum ) {
        this.spawnTileSys = true;
        var moveTo = true;
        var y = 0;
        for ( var i = _numpos+1; i < _arr.length; i++ ) {
            if ( _arr[i][_columnNum] == null ) {
                y += Consts.DISTANCE_BETWEEN_TILES;
                _arr[i][_columnNum] = _tile;
                _arr[i-1][_columnNum] = null;
            } else {
                if ( _tile.count == _arr[i][_columnNum].count && !_tile.merge && !_arr[i][_columnNum].merge ) {
                    y += Consts.DISTANCE_BETWEEN_TILES;
                    _tile = this.mergeTiles( _arr[i][_columnNum] ,_tile, null, y );//new tile continues handling
                    _arr[i][_columnNum] = _tile;
                    _arr[i-1][_columnNum] = null;
                    y = 0;//reset value
                    moveTo = false;
                } else {
                    break;
                }
            }
        }
        if ( moveTo && y != 0 ) {
            y = _tile.y + y;
            _tile.move( null, y );
        }
    };

    Game.prototype.tileHandlerUp = function( _tile, _arr, _numpos, _columnNum ) {
        this.spawnTileSys = true;
        var moveTo = true;
        var y = 0;
        for ( var i = _numpos-1; i >= 0; i-- ) {
            if ( _arr[i][_columnNum] == null ) {
                y -= Consts.DISTANCE_BETWEEN_TILES;
                _arr[i][_columnNum] = _tile;
                _arr[i+1][_columnNum] = null;
            } else {
                if ( _tile.count == _arr[i][_columnNum].count && !_tile.merge && !_arr[i][_columnNum].merge ) {
                    y -= Consts.DISTANCE_BETWEEN_TILES;
                    _tile = this.mergeTiles( _arr[i][_columnNum] ,_tile, null, y );//new tile continues handling
                    _arr[i][_columnNum] = _tile;
                    _arr[i+1][_columnNum] = null;
                    y = 0;//reset value
                    moveTo = false;
                } else {
                    break;
                }
            }
        }
        if ( moveTo && y != 0 ) {
            y = _tile.y + y;
            _tile.move( null, y );
        }
    };

    Game.prototype.mergeTiles = function( _absorbe, _infuse, _x, _y ) {
        _absorbe.merge = true;
        _infuse.merge = true;
        _absorbe.count = _infuse.count + _absorbe.count;//write new count in tile

        var onMoveComplete = function() {//destroy old tile and show new tile
            _infuse.destroy();//destroy tile sprite
            _absorbe.show();//update tile sprite
        };
        _infuse.count = null;
        _infuse.position = null;
        _y = _infuse.y + _y;
        _x = _infuse.x + _x;
        _infuse.move( _x, _y, null, onMoveComplete );
        this.countScore += _absorbe.count;//adds the value of the tiles to the score
        return _absorbe;
    };

    Game.prototype.renewalObjectTiles = function() {
        for ( var i = 0; i < this.tilesObj.length; i++ ) {
            if ( this.tilesObj[i].sprite == null && this.tilesObj[i].count == null ) {
                this.tilesObj.splice( i, 1 );
                i--;
            } else if ( this.tilesObj[i].merge ) {
                this.tilesObj[i].merge = false;
                if ( this.tilesObj[i].count == Consts.WIN_COUNT_NUMBER ) {
                    window.alert("Уровень пройден");
                    this.startNewGame();
                    break;
                }
            }
        }
    };

    Game.prototype.checkGameOver = function() {
        var gameOver = true;
        for ( var j = 0; j < this.tilesOnField.length; j++ ) {
            if ( !gameOver ) {
                break;
            }
            for ( var i = 0; i < this.tilesOnField.length; i++ ) {
                if ( this.tilesOnField[j][i] == null ) {
                    gameOver = false
                    break;
                }
                if ( i < 3 && this.tilesOnField[j][i] != null && this.tilesOnField[j][i+1] != null
                    && this.tilesOnField[j][i].count == this.tilesOnField[j][i+1].count ) {
                    gameOver = false
                    break;
                }
            }
        }

        if ( gameOver ) {
            for ( var j = 0; j < this.tilesOnField.length; j++ ) {
                if ( !gameOver ) {
                    break;
                }
                for ( var i = 0; i < this.tilesOnField.length; i++ ) {
                    if ( i < 3 && this.tilesOnField[i][j] != null && this.tilesOnField[i+1][j] != null
                        && this.tilesOnField[i][j].count == this.tilesOnField[i+1][j].count ) {
                        gameOver = false
                        break;
                    }
                }
            }
        }

        if ( gameOver ) {
            window.alert("Нельзя сделать ход");
            this.startNewGame();
        }
    };

    Game.prototype.startNewGame = function() {
        this.group.removeChildren();
        this.tilesOnField = [
                                [null, null, null, null],
                                [null, null, null, null],
                                [null, null, null, null],
                                [null, null, null, null]
                            ];
        this.tilesObj = [];
        this.spawnTileSys = false;
        this.animation = false;
        this.countScore = 0;

        this.init();
    };

    Object.defineProperty( Game.prototype, "countScore", {
        get: function() { return ScorePanel.countScore; },
        set: function( val ) {
			ScorePanel.countScore = val;
        }
    });

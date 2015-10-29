(function($){
	var TILE_SIZE = 256;

	function Map(dom){
		this.map = $('#map');
	    this.level = 1;

	    this.mouseWhellHanlder = null;
	    this.bound = [0, 0, 0, 0];
	    this.screenBound = [];

	    this.initTile();
	    this.bindEvent();
	}

	Map.prototype.initTile = function(){
		var map = this.map, level = this.level;

		var tileCount = Math.pow(4, level);
	    var row = Math.pow(2, level),
	    	col = Math.pow(2, level);
	    	rowCount = Math.ceil(map.height()/TILE_SIZE),
	    	celCount = Math.ceil(map.width()/TILE_SIZE);

	    var minRow = Math.min(row, rowCount);
	    var minCol = Math.min(col, celCount);

	    this.bound = [0, 0, minRow, minCol];
	    this.screenBound = [0, 0, rowCount, celCount];

	    this.draw();
	};

	Map.prototype.bindEvent = function(){
		var me = this;
		$('body').on('mousewheel', function(e){
            if(me.mouseWhellHanlder){
                clearTimeout(me.mouseWhellHanlder);
            }
            me.mouseWhellHanlder = setTimeout(function(){
                if(e.originalEvent.wheelDelta > 0){
                    if(me.level < 18){
                        me.level++;
                    }
                }else{
                    if(me.level > 0){
                        me.level--;
                    }
                }
                var tar = e.target, $tar = $(tar);
	            var mat = tar.id.match(/tile_(\d+)_(\d+)/);
	            if(mat){

	            }
                me.draw();
            }, 100);
        });
	};

	Map.prototype.addTile = function(row, cel, url){
	    var tile = '<span class="tile"><img width="256" heigth="256" src="'+ url +'"/></span>';
	    $tile = $(tile);
	    $tile.attr('id', this.getTileId(row, cel));
	    $tile.css(this.toScreen(cel*256, row*256));
	    $tile.append('<div class="tip"></div>');
	    $tile.find('.tip').text(this.level + '/' + row + '/' + cel);
	    this.map.append($tile);
	}

	Map.prototype.draw = function(){
		var level = this.level, bound = this.bound, screenBound = this.screenBound;

	    var tileCount = Math.pow(4, level);
	    var row = Math.pow(2, level), col = Math.pow(2, level);
	    
	    for(var i=bound[0]; i<bound[2]; i++){
	        for(var j=bound[1]; j<bound[3]; j++){
	            var tid = this.getTileId(i, j);
	            var tile = $('#'+tid);
	            if(tile.length > 0){
	                tile.find('img')[0].src = this.getImage(level, i, j);
	                tile.find('.tip').text(level + '/' + i + '/' + j);
	            }else{
	            	this.addTile(i, j, this.getImage(level, i, j));
	            }
	        }
	    }
	    if(bound[2] < screenBound[2]){
	        for(var i=bound[2]; i< screenBound[2]; i++){
	            for(var j=0; j< screenBound[3]; j++){
	                var tid = this.getTileId(i, j);
	                var tile = $('#'+tid);
	                if(tile.length > 0){
	                    tile.find('img')[0].src = '';
	                    tile.find('.tip').text(level + '/' + i + '/' + j);
	                }
	            }
	        }
	    }
	    if(bound[3] < screenBound[3]){
	        for(var i=0; i< screenBound[2]; i++){
	            for(var j= bound[3]; j< screenBound[3]; j++){
	                var tid = this.getTileId(i, j);
	                var tile = $('#'+tid);
	                if(tile.length > 0){
	                    tile.find('img')[0].src = '';
	                    tile.find('.tip').text(level + '/' + i + '/' + j);
	                }
	            }
	        }
	    }
	};

	Map.prototype.getTileId = function(r, c){
	    return 'tile_'+ r + '_' + c;
	}
	Map.prototype.getImage = function (l, r, c){
	    var src = 'http://4.maps.nlp.nokia.com.cn/maptile/2.1/maptile/1749f3edf5/satellite.day/{level}/{col}/{row}/256/jpg?lg=CHI&app_id=90oGXsXHT8IRMSt5D79X&token=JY0BReev8ax1gIrHZZoqIg&xnlp=CL_JSMv2.5.3.2';
	    var data = {level:l, row:r, col:c};
	    return src.replace(/\{(.*?)\}/g, function(s0, s1){
	        return data[s1];
	    });
	}
	Map.prototype.toScreen = function (x, y){
	    return {left: x, top: y};
	}

	window.Map = Map;

})(jQuery);
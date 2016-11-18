$(function() {
	// コントローラの元となるオブジェクトを作成
	var baloonController = {
		_air : 100,
		_capacity : 450000,
		_bangSound : null,
		_WAITTIME : 1000,

		__name : 'pump.controller.BaloonController',
		__construct : function() {
			this.log.info('{0}を実行', '__construct');
		},
		__init : function() {
			this.log.info('{0}を実行', '__init');
		},
		__ready : function() {
			this.log.info('{0}を実行', '__ready');
			var $pumpPicContainer = this.$find('#pumpPicContainer');
			var tiedY = $pumpPicContainer.offset().top
					+ $pumpPicContainer.height() - 20;
			var tiedX = $pumpPicContainer.offset().left
					+ ($pumpPicContainer.width() * 0.25) + 20;
			this.tie(tiedX, tiedY);
            this._bangSound = document.getElementById('bangSound');
		},

		'{document} pump' : function(context, $el) {
			this._air += context.evArg.blow;
			this._drawLine();
			if (this._air > this._capacity) {
				this.bang();
				return;
			}
			var r = this._squareRt(this._air);
			var $baloon = this.$find('.baloon');
			this.log.debug('baloonの半径を{0}に設定', r);
			$baloon.css({
				width : r * 2,
				height : r * 2
			});
		},

		tie : function(x, y) {
			this._isTied = true;
			this._tiedX = x;
			this._tiedY = y;
			this._drawLine();
		},

		_drawLine : function() {
			var $baloon = this.$find('.baloon');
            if(!$baloon[0])
                return;
			var tiedX = 10;
			var tiedY = 400;
			var x = 50;
			var y = 0;
			var $line = this.$find("#stringSvg #string");
			this.log.debug('from({0}, {1}) to({2}, {3})', x, y, tiedX, tiedY);

			$line.attr('x1', x);
			$line.attr('y1', y);
			$line.attr('x2', tiedX);
			$line.attr('y2', tiedY);
		},

		_cubeRt : function(v) {
			return Math.pow(v * 0.75, 1 / 3);
		},
		_squareRt : function(v) {
			return Math.pow(v / (Math.PI * 2), 1 / 2);
		},

		bang : function() {
			this.$find('.baloon').remove();
			if (this._bangSound.readyState !== 4) {
				this._bangSound.load();
			}
			this._bangSound.play();

			this.$find('#string').css({visibility: "hidden"});

			this._air = 100;
			setTimeout(this.own(function() {
				this.$find('.baloonContainer').append(
						'<div class="baloon"></div>');
			    this.$find('#string').css({visibility: "visible"});
                this._drawLine();
			}), this._WAITTIME);
            this.trigger('bang');
		}
	};

	h5.core.expose(baloonController);
	// baloonControllerを要素にバインド
	h5.core.controller('#container', baloonController);
});

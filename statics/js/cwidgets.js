/**
 * @author Administrator
 */
//延迟加载
//统一处理url前缀
$(function(){
	var urlSolver = {
		defaultRoot : '/MrLiu',
		getAbsolutePath : function(path){
			return this.defaultRoot + path;
		},
		rewriteSrc : function(selector){
			var eles = $(selector);
			var self = this;
			eles.each(function(idx, ele){
				var jq = $(ele);
				if(jq.attr("src").match(/^\/\w+/))
				{
					jq.attr('src', self.getAbsolutePath(jq.attr('src')));
				}
			});
		}
	};
	if(!window['urlSolver'])
	{
		window['urlSolver'] = urlSolver;
	}
	
});
/**
 * 滚动字幕效果
 * 参数：
 * value: 要显示的内容。default: "default roll text"
 * direction: 移动方向，left或者right。default： left
 * speed：移动速度，0~100。default：5
 * frequence：重复频率，数字越大重复越快1~100。default: 20
 */
$.widget('fatyang.rolltext', {
	vars: {
			win: null,
			content: null,
			intervalId: null,
	},
	options: {
		value: 'default roll text.',
		direction: 'left',
		speed: 5,
		frequence: 20,
	},
	_create: function(){
		var win = $("<div/>").appendTo(this.element);
		var content = $("<div/>").appendTo(win);
		this.vars.content = content;
		this.vars.win = win;
		win.addClass('fatyang_rolltext_window');
		content.addClass('fatyang_rolltext_content');
		content.text(this.options.value);
		var self = this;
		this._move();
	},
	_move: function(){
		var isLeft = this.options.direction == 'left'; 
		var leftPos = isLeft ? this.vars.win.width(): -this.vars.content.width();
		var length = this.vars.win.width() + this.vars.content.width();
		var duration = length * 100/this.options.speed;
		var self = this;
		isLeft ? length*=-1 : 0;
		this.vars.content.css('left', leftPos);
		this.vars.content.animate({left: ('+=' + length)}, duration, 'linear', function(){self._repeatMove();});
	},
	_repeatMove: function(){
		if(true)//repeat
		{
			var self = this;
			var fun = function(){
				self._move();
			};
			setTimeout(fun, 10000/this.options.frequence);
		}
	}
});
$.widget('fatyang.submenuTab', {
	vars: {
		
	},
	options: {
		value: "<p>put on your text!</p>"
	},
	_create: function(){
		var container = $("#fatyang_submenuTab_container");
		var tabContent = null;
		var self = this;
		if(container.length)
		{
			tabContent = container.children(".fatyang_submenuTab_content");
		}
		else
		{
			container = $("<div id='fatyang_submenuTab_container'/ >").addClass("fatyang_submenuTab_container").hide().appendTo($("body"));
			container.on({
				'mouseenter': function(){
					$(this).data('mouseenter', true);
				},
				'mouseleave': function(event){
					$(this).data('mouseenter', false);
					$(this).data('self')._close(event, self);
				}
			});
			tabContent = $("<div/ >").addClass("fatyang_submenuTab_content").appendTo(container);
		}
		this.tabContent = tabContent;
		this.container = container;
		this.element.on("mouseenter", function(event){
			self.timeoutId = setTimeout(self._display, 500, event, self);
		});
		this.element.mouseleave(function(event){
			self._delay(
				function(){
					if(!self.container.data('mouseenter'))
					{
						self._close(event, self);
					}
				}
			);
			
		});
	},
	_display: function(event, self){
			self.tabContent.html(self.options.value);
			self.container.finish().hide();
			self.container.slideDown();
			self.container.position({
				my: "left top",
				at: "left bottom",
				of: event.currentTarget
			});
			self.container.data('self', self);
	},
	_close: function(event, self){
		clearTimeout(self.timeoutId);
		self.container.slideUp();
	}
});
$.widget('fatyang.rollableAccordion', $.ui.accordion, {
	options : {
		delay : 0,
		duration : 0,
		datas : [],
		itemSize : 5,
		autoClose: false,
		customRender : null,
	},
	_create : function(){
		if(this.options.delay > 0)
		{
			this.options.disabled = true;
			var delay = this.options.delay;
			this.element.find( this.options.header ).each(function(index, item){
				$(item).on({
						mouseenter: function(event){
							var timeoutId = setTimeout(function(){
								$("#accordion").rollableAccordion('option', 'active', index);
								$(event.currentTarget).data('timeoutId', null);
							}, delay);
							$(event.currentTarget).data('timeoutId', timeoutId);
						},
						mouseleave: function(event){
							var currentTarget = $(event.currentTarget);
							if(currentTarget.data('timeoutId'))
							{
								clearTimeout(currentTarget.data('timeoutId'));
								currentTarget.data('timeoutId', null);
							}
						},
					});
			});
		}
		this._super();
		if(this.options.datas.length > 1)
		{
			this.setTimer();
		}
	},
	refreshData: function(data){
		this.element.fadeOut(function(){
			$(this).data("fatyang-rollableAccordion")._refreshData(data);
			$(this).data("fatyang-rollableAccordion").element.fadeIn();
		});
	},
	_refreshData : function(data){
		var headers = this.element.find(this.options.header);
		var render = this.options.customRender;
		if(render)
		{
			headers.each(function(idx, element){
				var head = $(element);
				var body = head.next();
				render(idx, head, body, data);
			});
		}
		else
		{
			headers.each(function(idx, element){
				$(element).text(data[idx]['head']);
				$(element).next().text(data[idx]['body']);
			});
		}
	},
	setTimer : function(){
		var self = this;
		var timeoutId = setTimeout(function(){
			var dataIdx = self.element.data("dataIndex");
			if(!dataIdx)
			{
				dataIdx = 0;
			}
			dataIdx ++;
			dataIdx = dataIdx % self.options.datas.length;
			self.refreshData(self.options.datas[dataIdx]);
			self.element.data('dataIndex', dataIdx);
			self.setTimer();
		}, this.options.duration);
		this.element.data('timeoutId', timeoutId);
		
		//cancle
		if(!this.element.data('timeEventSet'))
		{
			this.element.one('mouseenter', function(event){
				$(event.currentTarget).data('timeEventSet', false);
				$(event.currentTarget).data("fatyang-rollableAccordion").clearTimer();
			});
			this.element.data('timeEventSet', true);
		}
	},
	clearTimer : function(){
		var timeoutId = this.element.data('timeoutId');
		var self = this;
		clearTimeout(timeoutId);
		if(!this.element.data('timeEventSet'))
		{
			this.element.one('mouseleave', function(event){
				$(event.currentTarget).data('fatyang-rollableAccordion').setTimer();
				$(event.currentTarget).data('fatyang-rollableAccordion').closeAll();
			});
		}
	},
	closeAll: function(){
		this.option("active", false);
	}
});
$.widget("fatyang.showbox", {
	options: {
		active: 0,
	},
	_create: function(){
		this.element.addClass("ui-images");
		var containers = this.element.children("div");
		var displayPanel = $(containers[0]);
		// var detailPanel = containers[1];
		var listPanel = this.element.children("ul");
		if(displayPanel  && listPanel)
		{
			var detailPanel = this._processDetail(this.element);
			this._processDisplay(displayPanel);
			this._processList(listPanel);
			listPanel.trigger("select", listPanel.children()[this.options.active]);
			
		}
	},
	_processDisplay: function(displayPanel){
		displayPanel.addClass("ui-images-display");
		displayPanel.on({
			mouseenter: function(event){
				var displayPanel = $(event.currentTarget);
				var detailPanel = displayPanel.siblings(".ui-images-detail");
				detailPanel.show();
				//
				detailPanel.position({
					my: "left top",
					at: "right+10 top",
					of: detailPanel.parent(),
				});
				
			},
			mouseleave: function(event){
				var displayPanel = $(event.currentTarget);
				var detailPanel = displayPanel.siblings(".ui-images-detail");
				detailPanel.hide();
			},
			mousemove: function(event){
				var displayPanel = $(event.currentTarget);
				var parentOffset = displayPanel.offset();
				var relX = event.pageX - parentOffset.left;
				var relY = event.pageY - parentOffset.top;
				var imgPanel = displayPanel.parent().find(".ui-images-detail > img");
				
				var rate = -2;
				var left = relX * rate;
				var top = relY * rate;
				imgPanel.css({
					left: left+ 'px',
					top:  top + 'px',
				});
			},
		});
	},
	_processList: function(listPanel){
		listPanel.addClass("ui-images-list");
		listPanel.children("li").each(function(index, item){
			var li = $(item);
			li.addClass("ui-images-item");
			li.children("a").addClass("ui-images-archor");
			li.on({
				click: function(event){
					var target = $(event.currentTarget);
					target.parent().trigger("select", target);
					event.preventDefault();
				},
			});
		});
		listPanel.on({
			select: function(event, selectEle){
				var listPanel = $(event.currentTarget);
				var target = $(selectEle);
				var imgTargetId = target.find("a").attr("href");
				var imgTarget = listPanel.siblings(".ui-images-display").find(imgTargetId);
				var detailImgSrc = listPanel.parent().showbox("option", 'imgmaps')[imgTargetId.match(/\w+/)]; 
				listPanel.children().each(function(idx, item){
					$(item).removeClass("ui-images-active");
				});
				listPanel.siblings(".ui-images-display").children().each(function(idx, item){
					$(item).hide();
				});
				
				target.addClass("ui-images-active");
				imgTarget.show();
				listPanel.parent().find(".ui-images-detail > img").attr("src", detailImgSrc);
			}
		});
	},
	_processDetail: function(parent){
		var detailPanel = $("<div>").addClass("ui-images-detail").appendTo(parent).hide();
		var img = detailPanel.append("<img>").find("img");
		img.addClass("ui-images-detail-img");
		return detailPanel;
	},
	
});
$.widget("fatyang.crumb", {
	options: {
	},
	_create: function(){
		this.element.addClass("ui-crumb");
		var array = window.location.href.substr(this.options.root.length).match(/\w+\//g);
		var self = this;
		array.unshift('main');
		this.options['current'] && array.push(this.options.current);
		$.each(array, function(idx, key){
			key = key.match(/[\u4e00-\u9fa5,\w]+/)[0];
			if(self.options.ignores && !$.inArray(key, self.options.ignores))
			{
				return;
			}
			self._crumb(array, idx, key);
		});
		this.element.children(":last-child").addClass("ui-crumb-last").children("a").removeAttr("href");
	},
	_crumb: function(array, idx, key) {
		var crumb = this._appendElement(key);
		this._appendPointer(array.length, idx);
	},
	_getVal: function(key){
		return this.options.maps[key] ? this.options.maps[key]['name'] : key;
	},
	_getUrl: function(key){
		return this.options.maps[key] ? this.options.maps[key]['url'] : "#";
	},
	_appendElement: function(key) {
		var html = "<span class='ui-crumb-crumb'><a href='" + this._getUrl(key) + "'>" + this._getVal(key) + "</a></span>";
		return $(html).appendTo(this.element);
	},
	_appendPointer: function(length, idx){
		if(idx < length -1)
		{
			$("<span class='ui-crumb-crumb ui-crumb-pointer'>></span>").appendTo(this.element);
		}
	},
});

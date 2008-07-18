// -*- Mode: MooTools; tab-width: 4; -*-
ShellScript.implement({
	button:null,
	
	hide: function(){
		this.button.setStyle('display','none');
		return this;
	},
	
	draw_menu: function(command){
		if(!$('choosr')){
			new Element('select',{id:'choosr'})
			.adopt([
				new Element('option',{value:'0',text:''}),
			])
			.inject('toolbar')
			.store('script',{});
			
			(function(){
			$('choosr').addEvents({
				'change': function(event){
					if (this.value){
						this.retrieve('script')[this.value].run();
						this.value=0;
					}
					event.stop();
				},
			}).focus();
			}).delay(1);
		};
		var e = new Element('option',{
			value:command,
			text: command
		});
		
		if(this.button && this.button.accessKey)
			e.set('text', e.get('text').replace(RegExp(this.button.accessKey), ''+this.button.accessKey.toUpperCase()+'') );
		
		$('choosr').adopt([
			e
		]).retrieve('script')[command]=this;
		return this;
	},
	draw: function(name){
		this.button = new Element('input',{
			type:'button', 
			value: name, 
			accesskey: $$('[accesskey="'+ name[0] +'"]').length ? name[1] : name[0],
		});
		
		this.button.store('script',this);
		
		this.button.addEvent('click', function(){ if( this.value == name) this.retrieve('script').run() });
		// this.button.addEvent('click', function(){ console.log('click'); });
		// this.button.addEvent('click delay', function(){ console.log('click delay'); });
		// this.button.addEvent('click', function(){ setTimeout(function(){ this.fireEvent('click delay') }.bind(this), 1 *1000); });
		// this.button.addEvent('click', function(){ setTimeout(function(){ this.fireEvent('click delay') }.bind(this), 2 *1000); });
		// this.button.addEvent('click', function(){ setTimeout(function(){ this.fireEvent('click delay') }.bind(this), 3 *1000); });
		// this.button.addEvent('click', function(){ setTimeout(function(){ this.fireEvent('click delay') }.bind(this), 4 *1000); });
		
		this.draw_menu(name);
		
		this.button.inject('toolbar');
	},
});

function GUI(command, options) {
	options = $merge({
		logElement:$$('#log .log')[0],
		errElement:$$('#log .errors')[0]
	}, options);
	
	cmd = new ShellScript('"$TM_BUNDLE_SUPPORT/'+ $GUI$ +'.gui.rb" '+command, options);
	cmd.draw(command);
	
	return cmd;
}

function GUI_info(command, options) {
	return GUI(command, $merge({
		logElement:$$('#info .server')[0],
		errElement:$$('#info .server')[0],
		nobusy:true
	}, options));
}

function ShellScriptResult(command) {
	result = '';
	result += TextMate.system(command,null).outputString;
	return result;
}

function cache_info(command) {
	// $try( $(command).destroy() );
	c=$(command); if(c) return c.get('html');
	
	GUI_info(command,{
		logElement: new Element('div',{'id':command, 'class':'data', 
		'text':ShellScriptResult(command)
		}).inject(document.body)
	}).run().hide();
	
	return $(command).get('html');
}

function browse(url){
	try{
		$('browser').destroy();
	}catch(e){};
	
	new Element('iframe', {'id':'browser', 'class': "browser", src: url, 'html':'' }).inject(document.body, 'top');
}

function GUI_toggle(name, ele, mode) {
	button = new Element('input',{
		type:'button', 
		value: name, 
		accesskey: name[0],
	}).inject('toolbar');
	
	if(mode==  'class'){
		button.addEvent('click', function(e){
			e = $(ele);
			if(e.hasClass('on')){
				e.removeClass('on');
				e.addClass('off');
			}else{
				e.removeClass('off');
				e.addClass('on');
			};
		});
	};
	
	// button.value=
	
	return button
	
}

window.addEvent('domready',function(){
	try{
		$GUI$ = 'git'
		// var fred1 = GUI_info('default').run().hide();
		// cache_info('browse_url');
		
		GUI('status');
		GUI('log').hide();
		
		GUI('diff');
		GUI('nub').hide();
		
		GUI('addall!').hide();
		GUI('commit');
		GUI('commit_all!').hide();
		
		GUI('push!');
		GUI('stage!').hide();
		
		GUI('default').hide().run();
		
		$('context').set('html','<h2>'+ShellScriptResult('echo "$TM_PROJECT_DIRECTORY"').replace(/^.*(?=\/.*?\/)/,'…')+'</h2>');
		
	}catch(e){
		$$('#log .errors')[0].innerHTML+=e.message+'\n';
	};
});

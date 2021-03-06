// -*- Mode: MooTools; tab-width: 4; -*-
// requires 'TextMate.system.js'
// requires 'mootools.js'

ShellScript.implement({
	button:null,
	
	hide: function(){
		this.button.setStyle('display','none');
		return this;
	},
	
	onreadoutput : function(output){
		if (!output) return;
		var outputs = output.split('/**/');
		
		outputs.each(function(o){
			if (!o) return;
			console.log(o);
				
			try{
				var json = JSON.decode(o);
				if (json.message) {
					GUI_context.MESSAGE(json.message);
					return delete json.message;
				}
				
				return this.logElement.innerHTML += pp( json );
				
			}catch(e){
				console.log(e)
				this.logElement.innerHTML += o;
			};
			
		}.bind(this));
		
	},
	
	draw_menu: function(command){
		if(!$('choosr')){
			new Element('select',{id:'choosr',title:'The first uppercase character in the option is the ctrl shortcut'})
			.adopt([
				new Element('option',{value:'0',text:' Commands'})
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
				}
			}).focus();
			}).delay(1);
		};
		var e = new Element('option',{
			value:command,
			text: command
		});
		
		if(this.button && this.button.accessKey)
			e.set('text', '⌃'+ this.button.accessKey.toUpperCase() +'    '+ e.get('text').capitalize() );
		
		$('choosr').adopt([
			e
		]).retrieve('script')[command]=this;
		return this;
	},
	key: function(name){
		try{
			return $$('[accesskey="'+ name[0] +'"]').length ? this.key( name.substring(1) ) : name[0];
		}catch(e){
			return false;
		};
	},
	draw: function(name){
		this.button = new Element('input',{
			type:'button', 
			value: name, 
			accesskey: this.key(name),
			title: "⌃"+this.key(name)
		});
		
		this.button.store('script',this);
		
		this.button.addEvent('click', function(){ if( this.value == name) this.retrieve('script').run(); });
		// this.button.addEvent('click', function(){ console.log('click'); });
		// this.button.addEvent('click delay', function(){ console.log('click delay'); });
		// this.button.addEvent('click', function(){ setTimeout(function(){ this.fireEvent('click delay') }.bind(this), 1 *1000); });
		// this.button.addEvent('click', function(){ setTimeout(function(){ this.fireEvent('click delay') }.bind(this), 2 *1000); });
		// this.button.addEvent('click', function(){ setTimeout(function(){ this.fireEvent('click delay') }.bind(this), 3 *1000); });
		// this.button.addEvent('click', function(){ setTimeout(function(){ this.fireEvent('click delay') }.bind(this), 4 *1000); });
		
		this.draw_menu(name);
		
		this.button.inject('toolbar');
	}
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
		accesskey: ShellScript.key(name)
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
	
	return button;
}

var GUI_context = {
	MESSAGE: function(message){
		$('context').set('html','<h2>'+ message +'</h2>');
	}
};

function pp(object){
	switch ($type(object)){
	case 'object':
		object = $H(object);
		
		var h = '<table>';
		object.each(function(value, key){
			h += '<tr><th> {key} </th><td> {value} </td></tr>'.substitute({key:key, value: pp(value) })
		})
		h += '</table>'
		return h
		
		break;
	case 'array':
		object = $A(object);
		
		var h = '';
		object.each(function(value, key){
			h += '<div> {value} </div>'.substitute({value: pp(value) })
		})
		return h
		
		break;
	case false: return 'false'; break;
	case 'string':
	case 'number':
	case 'boolean':
	case 'date':
	default: return object.toString();
	}
	
};

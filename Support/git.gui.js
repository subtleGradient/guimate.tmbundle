// -*- Mode: MooTools; tab-width: 4; -*-
// requires 'gui.js'

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
		accesskey: ShellScript.key(name),
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

// -*- Mode: MooTools; tab-width: 4; -*-
// requires 'gui.js'

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
		GUI('commit_all!');
		
		GUI('push!');
		GUI('stage!').hide();
		
		GUI('default').hide().run();
		
		$('context').set('html','<h2>'+ShellScriptResult('echo "$TM_PROJECT_DIRECTORY"').replace(/^.*(?=\/.*?\/)/,'…')+'</h2>');
		
	}catch(e){
		$$('#log .errors')[0].innerHTML+=e.message+'\n';
	};
});

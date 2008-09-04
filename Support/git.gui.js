// -*- Mode: MooTools; tab-width: 4; -*-
// requires 'gui.js'

window.addEvent('domready',function(){
	try{
		$GUI$ = 'git';
		// var fred1 = GUI_info('default').run().hide();
		// cache_info('browse_url');
		
		GUI('status');
		GUI('log').hide();
		GUI('ls_files').hide();
		
		GUI('diff');
		GUI('nub').hide();
		
		GUI('add_remove!').hide();
		GUI('commit');
		GUI('commit_all!');
		GUI('x_fast_commit!').hide();
		
		GUI('push!');
		GUI('stage!').hide();
		GUI('pull!').hide();
		GUI('pull_stage!').hide();
		
		GUI('fetch').hide();
		
		GUI('default').hide().run();
		
	}catch(e){
		$$('#log .errors')[0].innerHTML+=e.message+'\n';
	};
});

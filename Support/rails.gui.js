ShellScript.implement({
	button:null,
	
	hide: function(){
		this.button.setStyle('display','none');
		return this;
	},
	
	draw: function(name){
		
		this.button = new Element('input',{
			type:'button', 
			value: name, 
			accesskey: name[0],
		});
		
		this.button.addEvent('click', this.run);
		this.button.addEvent('click', function(){ console.log('click'); });
		this.button.addEvent('after click', function(){ console.log('after click'); });
		this.button.addEvent('click', function(){ setTimeout(function(){ this.fireEvent('after click') }.bind(this), 2 *1000); });
		
		this.button.inject('toolbar');
		
	},
});

function GUI(command, options) {
	options = $merge({
		logElement:$$('#log .log')[0],
		errElement:$$('#log .errors')[0]
	}, options);
	
	cmd = new ShellScript('"$TM_BUNDLE_SUPPORT/rails.gui.rb" '+command, options);
	cmd.draw(command);
	
	return cmd;
}

function GUI_info(command, options) {
	return GUI(command, $merge({
		logElement:$$('#info .server')[0],
		errElement:$$('#info .server')[0]
	}, options));
}

try{

	var fred1 = GUI_info('default').run().hide()
	var fred2 = GUI_info('server info');
	
	GUI('server start').button.addEvent('after click',fred2.run);
	GUI('server stop').button.addEvent('after click',fred2.run);

	$('context').set('html','<h2>'+TextMate.system('echo "$TM_PROJECT_DIRECTORY"',null).outputString.replace('','')+'</h2>');

}catch(e){
	$$('#log .errors')[0].set('html','run '+e);
};

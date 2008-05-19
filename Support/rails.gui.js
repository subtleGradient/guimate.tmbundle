toolbar = document.querySelector('#toolbar');

var GUI={
	options:{ 
		logElement: document.querySelector('#log .log'), 
		errElement: document.querySelector('#log .errors')
	},
	DO:{},
	def: function(command, options){
		try{
			// Catch Errors Early
			if (!command) throw('No Command');
			
			// Handle Options
			if(!options) options = GUI.options;
			if(!options.logElement) options.logElement = GUI.options.logElement;
			if(!options.errElement) options.errElement = GUI.options.errElement;
			
			// Create the script
			GUI.DO[command] = GUI.DO[command] || new ShellScript('"$TM_BUNDLE_SUPPORT/rails.gui.rb" '+command, options);
			if(options.hide) return GUI.DO[command];
			
			// Hook into the UI
			options.key = command[0];
			toolbar.innerHTML += '<input '+
			                     ' accesskey="'+( options.key || command[0] )+'"'+
			                     ' value="'+ command +'"'+
			                     ' onclick="GUI.DO[\''+ command +'\'].run()"'+
			                     ' type="button" />\n';
			
			return GUI.DO[command];
		}catch(e){
			GUI.options.errElement.innerText += command + '\n' + e + '\n';
		};
	}
};

// =======
// = Def =
// =======
GUI.DO['stop_all']={run: function(){
	for (var _do in GUI.DO) {
		try{ GUI.DO[_do].cancel(); }catch(e){};
	};
}};
GUI.def('stop_all');

// GUI.DO['log']=new ShellScript('cd "$TM_PROJECT_DIRECTORY"; tail -f ./log/development.log', GUI.options);

GUI.def('server start');
GUI.def('log');
GUI.def('server stop');

// toolbar.innerHTML+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

// GUI.def('default',{hide:true}).run();

document.querySelector('#context').innerHTML = ('<h2>'+TextMate.system('echo "$TM_PROJECT_DIRECTORY"',null).outputString.replace('','')+'</h2>');

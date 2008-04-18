toolbar = document.querySelector('#toolbar');

// =======
// = GUI =
// =======
var GUI={
	options:{ 
		logElement: document.querySelector('#log .log'), 
		errElement: document.querySelector('#log .errors')
	},
	DO:{}
	// def: function(command, options){
	// 	try{
	// 		// Catch Errors Early
	// 		if (!command) throw('No Command');
	// 		
	// 		// Handle Options
	// 		if(!options) options = GUI.options;
	// 		if(!options.logElement) options.logElement = GUI.options.logElement;
	// 		if(!options.errElement) options.errElement = GUI.options.errElement;
	// 		
	// 		// Create the script
	// 		GUI.DO[command] = new ShellScript('"$TM_BUNDLE_SUPPORT/htmledit.gui.rb" '+command, options);
	// 		if(options.hide) return GUI.DO[command];
	// 		
	// 		// Hook into the UI
	// 		options.key = command[0];
	// 		toolbar.innerHTML += '<input '+
	// 		                     ' accesskey="'+( options.key || command[0] )+'"'+
	// 		                     ' value="'+ command.replace('"','') +'"'+
	// 		                     ' onclick="GUI.DO[\''+ command +'\'].run()'+ (options.write1?'.write()':'') +'"'+
	// 		                     ' type="button" />\n';
	// 		
	// 		return GUI.DO[command];
	// 	}catch(e){
	// 		GUI.options.errElement.innerText += command + '\n' + e + '\n';
	// 	};
	// }
};

// =======
// = Def =
// =======
document.getElementById('edit').innerHTML = TextMate.system('"$TM_BUNDLE_SUPPORT/htmledit.gui.rb" default',null).outputString;

var insert = new ShellScript('"$TM_BUNDLE_SUPPORT/htmledit.gui.rb" insert', GUI.options);
insert.click = function(){insert.run().write(document.getElementById('edit').innerHTML).close();};
toolbar.innerHTML += '<input '+
                     ' accesskey="i"'+
                     ' value="Insert HTML"'+
                     ' onclick="insert.click()"'+
                     ' type="button" />\n';

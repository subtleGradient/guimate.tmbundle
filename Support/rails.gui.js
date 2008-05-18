toolbar = document.querySelector('#toolbar');

// =======
// = Git =
// =======
var Git={
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
			if(!options) options = Git.options;
			if(!options.logElement) options.logElement = Git.options.logElement;
			if(!options.errElement) options.errElement = Git.options.errElement;
			
			// Create the script
			Git.DO[command] = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" '+command, options);
			if(options.hide) return Git.DO[command];
			
			// Hook into the UI
			options.key = command[0];
			toolbar.innerHTML += '<input '+
			                     ' accesskey="'+( options.key || command[0] )+'"'+
			                     ' value="'+ command +'"'+
			                     ' onclick="Git.DO[\''+ command +'\'].run()"'+
			                     ' type="button" />\n';
			
			return Git.DO[command];
		}catch(e){
			Git.options.errElement.innerText += command + '\n' + e + '\n';
		};
	}
};

// =======
// = Def =
// =======
Git.def('log');

Git.def('status');
Git.def('diff');
// Git.def('nub');

toolbar.innerHTML+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
Git.def('addall!');
Git.def('commit');

toolbar.innerHTML+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
Git.def('push!');
Git.def(' stage!');

Git.def('default',{hide:true}).run();

document.querySelector('#context').innerHTML = ('<h2>'+TextMate.system('echo "$TM_PROJECT_DIRECTORY"',null).outputString.replace('','')+'</h2>');

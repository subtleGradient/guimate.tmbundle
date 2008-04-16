try{if(TextMate && TextMate.system){

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
			
			// Create the script
			Git.DO[command] = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" '+command, options);
			if (options == 'noui') return Git.DO[command];
			
			// Hook into the UI
			options.key = command[0];
			toolbar.innerHTML += '<input accesskey="'   + (options.key || command[0])
			                  +  '" value="'            + command
			                  +  '" onclick="Git.DO[\'' + command
			                  +  '\'].run()" type="button" />\n';
			
			return Git.DO[command];
		}catch(e){
			Git.options.errElement.innerText += command + '\n' + e + '\n';
		};
	}
};

// =======
// = Def =
// =======
Git.def('diff');
Git.def('addall!');
Git.def('default','noui').run();


// =======
// = Old =
// =======
// COMMANDS
// TODO: Add a nice way to add a button for a command in the Class itself
// document.querySelector('#context').innerHTML = ('<h2>'+TextMate.system('echo "$TM_PROJECT_DIRECTORY"',null).outputString.replace('','')+'</h2>');
// 
// var edit   = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" edit',     { logElement: errElement, errElement: errElement });
// toolbar.innerHTML += ('<input type="button" value="edit" onclick="edit.run().close()" />');
// 
// var hash = { logElement: logElement, errElement: errElement };
// 
// // Git commands
// toolbar.innerHTML += (' Info:');
// var diff = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" diff', { logElement: errElement, errElement: errElement });
// toolbar.innerHTML += ('<input accesskey="d" type="button" value="[D]iff" onclick="diff.run().close()" />');
// var st = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" status', hash );
// toolbar.innerHTML += ('<input accesskey="s" type="button" value="[S]tatus" onclick="st.clear();st.run()" />');
// var GitNub = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" nub', { logElement: errElement, errElement: errElement } );
// toolbar.innerHTML += ('<input accesskey="n" type="button" value="Git[N]ub" onclick="GitNub.run().close()" />');
// toolbar.innerHTML += ('<input accesskey="k" type="button" value="[K]ill Log" onclick="st.clear();" />');
// 
// toolbar.innerHTML += (' Commit:');
// var addall = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" addall!', hash );
// toolbar.innerHTML += ('<input accesskey="a" type="button" value="[A]dd * " onclick="addall.clear();addall.run()" />');
// var ci = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" commit', hash );
// toolbar.innerHTML += ('<input accesskey="c" type="button" value="[C]ommit…" onclick="ci.clear();ci.run()" />');
// 
// toolbar.innerHTML += (' Push:');
// var push = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" push!', hash );
// toolbar.innerHTML += ('<input accesskey="u" type="button" value="P[u]sh to origin" onclick="push.clear();push.run()" />');
// var stage = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" stage!', hash );
// toolbar.innerHTML += ('<input type="button" value="Push to \'stage\'" onclick="stage.clear();stage.run()" />');
// 
// // diff.run();
// st.run();
// new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" default', hash ).run();

/*
${10:diff}   = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" method_name',     hash);
toolbar.innerHTML += ('<input type="button" value="$10"  onclick="$10.clear();$10.run().close()" />')
*/


}else{document.write('This script requires TextMate.system');};}catch(e){ document.write(e); };

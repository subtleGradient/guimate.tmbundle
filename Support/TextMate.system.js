var ShellScript = function(command, options){this.initialize(command, options);};
// TODO: Add support for multiple scripts at once
// ShellScript.begin = function(script){
// 	ShellScript.scripts = this.scripts || [];
// 	ShellScript.scripts.push(script);
// };
// ShellScript.end   = function(script){};
ShellScript.prototype = {
	
	initialize: function(script, options){
		this.script = script;
		
		window.logElement = document.body;
		window.errElement = document.body;
		
		if (options){
			if (options.logElement){
				window.logElement = options.logElement;
				window.errElement = options.logElement;
			}
			if (options.errElement) window.errElement = options.errElement;
			
			if (options && options.endHandler  ) this.endHandler   = options.endHandler;
			if (options && options.onreadoutput) this.onreadoutput = options.onreadoutput;
			if (options && options.onreaderror ) this.onreaderror  = options.onreaderror;
		}
		
		return this;
	},
	
	clear: function(){
		// document.body.removeChild(window.logElement);
		// document.body.removeChild(window.errElement);
		// window.logElement = document.createElement('div'); logElement.setAttribute('id','log'); document.body.appendChild(window.logElement);
		// window.errElement = document.createElement('div'); errElement.setAttribute('id','err'); document.body.appendChild(window.errElement);
		window.logElement.innerHTML='';
		window.errElement.innerHTML='';
	},
	
	run: function(){
		this.command = null;
		this.command = TextMate.system(this.script, this.endHandler);
		this.command.onreadoutput = this.onreadoutput;
		this.command.onreaderror  = this.onreaderror;
		this.resetTimeout();
		TextMate.isBusy = true;
		return this;
	},
	
	endHandler   : function(output){TextMate.isBusy = false; 
	                                if (output) window.logElement.innerHTML+= output;},
	onreadoutput : function(output){if (output) window.logElement.innerHTML+= output;},
	onreaderror  : function(output){if (output) window.errElement.innerHTML+= output;},
	
	resetTimeout : function(time){
		if (this.timeout) clearTimeout(this.timeout);
		// this.timeout = setTimeout(this.cancel, 10*1000);
	},
	
	write  : function(string){
		if (!this.command) return false;
		this.resetTimeout();
		this.command.write(string+"\n");
		return this;
	},
	
	cancel : function(){ if (!this.command) return false; this.command.cancel(); return this;},
	close  : function(){ if (!this.command) return false; this.command.close();  return this;},
	
	status : function(){ if (!this.command) return null;  return this.command.status; }
};

base = document.getElementById('tm_webpreview_content') || document;
baseelement = document.getElementById('tm_webpreview_content') || document;

logElement = document.createElement('pre'); logElement.appendChild(document.createTextNode('')); logElement.setAttribute('id','log'); baseelement.appendChild(logElement);
errElement = document.createElement('pre'); errElement.appendChild(document.createTextNode('')); errElement.setAttribute('id','err'); baseelement.appendChild(errElement);

// { logElement: document.getElementById('log'), errElement: document.getElementById('err') }

// # escape text for use in an AppleScript string
function e_ash(str){ return str.replace(/(?=['"\\])/g, '\\'); }
function e_as(str) { return str.replace(/(?=["\\\n])/g, '\\'); }
function e_sh(str) { return str.replace(/(?=[^a-zA-Z0-9_.\/\-\x7F-\xFF\n])/g, '\\').replace(/\n/g, "'\n'").replace(/^$/, "''"); }

// document.write(e_as('"this text rocks"'))
// document.write(e_ash("'\"this text rocks\"'"))
// document.write(e_as(document.body.innerHTML))
// document.write(e_sh(document.body.innerHTML))
// document.write(e_ash(document.body.innerHTML))

 // document.body.innerHTML = '<pre>'+ (document.body.innerHTML) +'</pre>'
// e_js()

// new ShellScript('cat').run().write('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.').close();
// new ShellScript('cat').run().write(document.body.innerText).close();

// say_hi = new ShellScript('osascript -e \'tell the application "TextMate" to insert "'+e_sh(document.body.innerHTML)+'"\'').run();
// say_hi = new ShellScript('osascript -e \'tell the application "TextMate" to insert "'+e_ash(document.body.innerHTML)+'"\'',{ endHandler:function(){self.close();} }).run();




// command = new ShellScript('irb').run();
// // document.write('<form onsubmit="void( command.write(\'ls\') ); return false"><input id="input" type="text" value="ls" /></form>');
// 
// // command.write('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
// 
// document.write('<input type="button" value="run"  onclick="command.run()" />');
// document.write('<input type="text" value="write_value" />');
// document.write('<input type="submit" value="write" onclick="command.write(document.getElementById(\'write_value\').value)" />');
// document.write('<input type="button" value="close"  onclick="command.close()" />');
// document.write('<input type="button" value="cancel" onclick="command.cancel()" />');
// 
// document.write('<input type="button" value="say_hi"  onclick="say_hi.runhi()" />');
// 
// new ShellScript('open http://developer.apple.com/documentation/AppleApplications/Reference/Dashboard_Ref/GadgetObj/chapter_2_section_3.html#//apple_ref/doc/uid/TP40001339-CH203-SW16').run();

// http://developer.apple.com/documentation/AppleApplications/Reference/Dashboard_Ref/GadgetObj/chapter_2_section_3.html#//apple_ref/doc/uid/TP40001339-CH203-SW16

/*
// TextMate.system(command, endHandler)
command = TextMate.system("ls", function(output){document.body.innerHTML+=output});
// command.onreadoutput = function(output){document.body.innerHTML+=output};
// command.onreaderror  = function(output){document.body.innerHTML+=output};
// command.write(string);
// command.cancel();
// command.close();
// command.status;

// document.write(command.outputString);

// Inline Synchronous Use
var output = TextMate.system("/usr/bin/id -un", null).outputString;
document.write(output);
var error  = TextMate.system("ls sdfsdf", null).errorString;
document.write(error);
var status = TextMate.system("/usr/bin/d -un", null).status;
document.write(status);

// Object Synchronous Use
var command = TextMate.system("ls / kjhsdkfhj", null);
document.write('<span style="color:green">'+command.outputString);
document.write('<span style="color:red"  >'+command.errorString);
document.write('<span style="color:blue" >'+command.status);




// myCommand = TextMate.system('echo "INSERT YOUR SHELL SCRIPT HERE"', null);

// Property
// The current string written to stdout (standard output) by the command.
command.outputString

// Property
// The current string written to stderr (standard error output) by the command.
command.errorString

// Property
// The command’s exit status, as defined by the command.
command.status

// Event Handler
// A function called whenever the command writes to stdout. The handler must accept a single argument; when called, the argument contains the current string placed on stdout.
command.onreadoutput

// Event Handler
// A function called whenever the command writes to stderr. The handler must accept a single argument; when called, the argument contains the current string placed on stderr.
command.onreaderror

// Method
// Cancels the execution of the command.
command.cancel()

// Method
// Writes a string to stdin (standard input).
command.write(string)

// Method
// Closes stdin (EOF).
command.close()
*/
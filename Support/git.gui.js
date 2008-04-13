try{if(TextMate && TextMate.system){


baseelement = document.body;
logElement = document.createElement('pre'); logElement.appendChild(document.createTextNode('')); logElement.setAttribute('id','log'); baseelement.appendChild(logElement);
errElement = document.createElement('pre'); errElement.appendChild(document.createTextNode('')); errElement.setAttribute('id','err'); baseelement.appendChild(errElement);

// COMMANDS
// TODO: Add a nice way to add a button for a command in the Class itself
document.write('<h2>'+TextMate.system('echo "$TM_PROJECT_DIRECTORY"',null).outputString.replace('','')+'</h2>');

var edit   = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" edit',     { logElement: errElement, errElement: errElement });
document.write('<input type="button" value="edit" onclick="edit.run().close()" style="position:absolute;top:10px;right:10px;z-index:9999" />');

var hash = { logElement: logElement, errElement: errElement };

// Git commands
document.write(' Info:');
var diff   = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" diff', { logElement: errElement, errElement: errElement });document.write('<input accesskey="d" type="button" value="[D]iff" onclick="diff.run().close()" />');
var st     = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" status', hash                                                                   );document.write('<input accesskey="i" type="button" value="Status [i]" onclick="st.clear();st.run()" style="font-size:2em;" />');
var GitNub = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" nub', { logElement: errElement, errElement: errElement }        );document.write('<input accesskey="n" type="button" value="Git[N]ub" onclick="GitNub.run().close()" />');
document.write('<input accesskey="k" type="button" value="[K]ill Log"  onclick="st.clear();" style="font-size:0.5em" />');

document.write(' Commit:');
var addall = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" addall', hash );document.write('<input accesskey="a" type="button" value="[A]dd * " onclick="addall.clear();addall.run()" />');
var ci     = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" commit', hash );document.write('<input accesskey="s" type="button" value="[s] Commit…" onclick="ci.clear();ci.run()" />');

document.write(' Push:');
var push   = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" push!', hash );document.write('<input accesskey="u" type="button" value="P[u]sh to origin" onclick="push.clear();push.run()" />');
var stage  = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" stage!',  hash );document.write('<input type="button" value="Push to \'stage\'" onclick="stage.clear();stage.run()" />');

// diff.run();
new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" default', hash ).run();

/*
${10:diff}   = new ShellScript('"$TM_BUNDLE_SUPPORT/git.gui.rb" method_name',     hash);
document.write('<input type="button" value="$10"  onclick="$10.clear();$10.run().close()" />')
*/


}else{document.write('This script requires TextMate.system');};}catch(e){ document.write(e); };

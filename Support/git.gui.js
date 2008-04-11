if(TextMate && TextMate.system){

// Require
eval(TextMate.system('cat "$TM_BUNDLE_SUPPORT/TextMate.system.js"',null).outputString);

// COMMANDS
// TODO: Add a nice way to add a button for a command in the Class itself
document.write('<h2>'+TextMate.system('echo "$TM_PROJECT_DIRECTORY"',null).outputString.replace('','')+'</h2>');

var edit   = new ShellScript('open "$TM_BUNDLE_SUPPORT/../GuiMate.tmproj"; mate "$TM_BUNDLE_SUPPORT/git.gui.js" &>/dev/null &',     { logElement: errElement, errElement: errElement });
document.write('<input type="button" value="edit" onclick="edit.run().close()" style="position:absolute;top:10px;right:10px;z-index:9999" />');

var hash = { logElement: logElement, errElement: errElement };

// Git commands
document.write(' Info:');
var diff   = new ShellScript('cd "$TM_PROJECT_DIRECTORY"; git diff|mate &>/dev/null &', { logElement: errElement, errElement: errElement });document.write('<input accesskey="d" type="button" value="[D]iff" onclick="diff.run().close()" />');
var st     = new ShellScript('cd "$TM_PROJECT_DIRECTORY"; git status', hash                                                                   );document.write('<input accesskey="i" type="button" value="Status [i]" onclick="st.clear();st.run()" style="font-size:2em;" />');
var GitNub = new ShellScript('cd "$TM_PROJECT_DIRECTORY"; nub . &>/dev/null &', { logElement: errElement, errElement: errElement }        );document.write('<input accesskey="n" type="button" value="Git[N]ub" onclick="GitNub.run().close()" />');
document.write('<input accesskey="k" type="button" value="[K]ill Log"  onclick="st.clear();" style="font-size:0.5em" />');

document.write('<br /> Commit:');
var addall = new ShellScript('cd "$TM_PROJECT_DIRECTORY"; git add *; git st', hash );document.write('<input accesskey="a" type="button" value="[A]dd * " onclick="addall.clear();addall.run()" />');
var ci     = new ShellScript('cd "$TM_PROJECT_DIRECTORY"; git commit -v', hash );document.write('<input accesskey="s" type="button" value="[s] Commit…" onclick="ci.clear();ci.run()" />');

document.write('<br /> Push:');
var push   = new ShellScript('cd "$TM_PROJECT_DIRECTORY"; git push origin', hash );document.write('<input accesskey="u" type="button" value="P[u]sh Master to origin" onclick="push.clear();push.run()" />');
var stage  = new ShellScript('cd "$TM_PROJECT_DIRECTORY"; git push stage',  hash );document.write('<input type="button" value="Push Master to \'stage\'" onclick="stage.clear();stage.run()" />');




// diff.run();
new ShellScript('cd "$TM_PROJECT_DIRECTORY"; git commit -v -a && git status', hash ).run();

/*
${10:diff}   = new ShellScript('cd "\$TM_PROJECT_DIRECTORY"; ${20:ls -lap}',     hash);
document.write('<input type="button" value="$10"  onclick="$10.clear();$10.run().close()" />')
*/

}else{document.write('This script requires TextMate.system');};

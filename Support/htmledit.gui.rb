#!/usr/bin/env ruby
require ENV['TM_SUPPORT_PATH']+'/lib/escape'

TM_BUNDLE_SUPPORT    = ENV['TM_BUNDLE_SUPPORT']    || File.expand_path('~/Library/Application Support/TextMate/Bundles/GuiMate.tmbundle/Support')
TM_PROJECT_DIRECTORY = ENV['TM_PROJECT_DIRECTORY']

module HTMLEditGUI
  class << self
    
    
    alias :really_send :send 
    def send(*args)
      # puts '<pre>'
      self.really_send(*args)
      # puts '</pre>'
    end
    
    def edit
      `open "#{File.expand_path TM_BUNDLE_SUPPORT + '/../GuiMate.tmproj'}"; mate "#{TM_BUNDLE_SUPPORT}/htmledit.gui.js" &>/dev/null &`
    end
    
    def insert(string)
      insert_text(string)
    end
    
    def default
      print ENV['TM_SELECTED_TEXT'] || `cat '#{ENV['TM_FILEPATH']}'`
    end
    
    private
    def insert_text(string)
      file='/tmp/insert.htmledit.gui.txt'
      # `cat >'#{file}' <<EOF\n#{string}\nEOF`
      File.open(file,'w'){|f| f<<string}
      cmd = %{osascript -e 'tell the application "TextMate" to insert (do shell script "cat #{file}" without altering line endings)'}
      # print  cmd
      system cmd
    end
  end
end
if __FILE__ == $0
  if ARGV[0] == 'insert'
    HTMLEditGUI::send ARGV[0], STDIN.read.chomp
  else
    HTMLEditGUI::send ARGV[0]
  end
#   HTMLEditGUI::insert <<-HTML
# <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
# <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
#   HTML
end

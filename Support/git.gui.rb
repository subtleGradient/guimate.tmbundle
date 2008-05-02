#!/usr/bin/env ruby

TM_BUNDLE_SUPPORT    = ENV['TM_BUNDLE_SUPPORT']    || File.expand_path('~/Library/Application Support/TextMate/Bundles/GuiMate.tmbundle/Support')
TM_PROJECT_DIRECTORY = ENV['TM_PROJECT_DIRECTORY']

module GitGUI
  class << self
    
    
    alias :really_send :send 
    def send(*args)
      # puts '<pre>'
      self.really_send(*args)
      # puts '</pre>'
    end
    
    def edit
      `open "#{File.expand_path TM_BUNDLE_SUPPORT + '/../GuiMate.tmproj'}"; mate "#{TM_BUNDLE_SUPPORT}/git.gui.js" &>/dev/null &`
    end
    
    def diff
      print "Opening Diff to TextMate…"
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git diff|mate &>/dev/null &`
    end
    
    def log
      puts "Log"
      @log = `cd "#{TM_PROJECT_DIRECTORY}"; git log`
      @log.gsub!(/\[#(\d+).*\]/){|r|
        %{<a href="http://#{ ENV['TM_LH_ACCOUNT'] }.lighthouseapp.com/projects/#{ ENV['TM_LH_PROJECT_ID'] }/tickets/#{$1}">#{r}</a>}
      }
      puts @log
    end
    
    def status
      puts "Status"
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git status`
    end
    
    def nub
      puts `cd "#{TM_PROJECT_DIRECTORY}"; nub . &>/dev/null &`
    end
    
    def addall!
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git add *; git st`
    end
    
    def commit
      puts "Committing…"
      ENV['GIT_EDITOR'] ||= 'mate -w'
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git commit -v`
    end
    
    def push!
      print "Pushing to origin…"
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git push origin`
    end
    
    def stage!
      puts "Pushing to stage…"
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git push stage`
    end
    
    def default
      status
    end
    
  end
end

if __FILE__ == $0
  abort %Q{This only works with projects, not individual files :(} unless TM_PROJECT_DIRECTORY
  GitGUI::send ARGV[0]
end

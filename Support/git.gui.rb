#!/usr/bin/env ruby

TM_BUNDLE_SUPPORT    = ENV['TM_BUNDLE_SUPPORT']    || File.expand_path('~/Library/Application Support/TextMate/Bundles/GuiMate.tmbundle/Support')
TM_PROJECT_DIRECTORY = ENV['TM_PROJECT_DIRECTORY'] || Dir[TM_BUNDLE_SUPPORT + '/../']

module GitGUI
  class << self
    def edit
      puts `open "#{File.expand_path TM_BUNDLE_SUPPORT + '/../GuiMate.tmproj'}"; mate "#{TM_BUNDLE_SUPPORT}/git.gui.js" &>/dev/null &`
    end
    def diff
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git diff|mate &>/dev/null &`
    end
    def status
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
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git commit -v`
    end
    def push!
      puts "Pushing to origin…"
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git push origin`
    end
    def stage!
      puts "Pushing to stage…"
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git push stage`
    end
    def default
      puts `cd "#{TM_PROJECT_DIRECTORY}"; echo "Committing…"; git commit -v -a && echo ""; echo "Status"; git status`
    end
  end
end

if __FILE__ == $0
  GitGUI::send ARGV[0]
end

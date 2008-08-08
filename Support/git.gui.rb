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
      message "Opening Diff to TextMate…"
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git diff|mate &>/dev/null &`
    end
    
    def log
      message "Log", "\n"
      @log = `cd "#{TM_PROJECT_DIRECTORY}"; git log -100`
      @log.gsub!(/\[#(\d+).*\]/){|r|
        %{<a href="http://#{ ENV['TM_LH_ACCOUNT'] }.lighthouseapp.com/projects/#{ ENV['TM_LH_PROJECT_ID'] }/tickets/#{$1}">#{r}</a>}
      }
      puts replace_hash_with_html(@log)
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
      message "Committing…"
      ENV['GIT_EDITOR'] ||= 'mate -w'
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git commit -v`
    end
    
    def commit_all!
      message "Committing…"
      ENV['GIT_EDITOR'] ||= 'mate -w'
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git commit -va`
    end
    
    def push!
      message "Pushing #{branch?} to Origin…"
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git push origin #{branch?}`
    end
    
    def stage!
      message "Pushing #{branch?} to Stage…"
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git push stage #{branch?}`
    end
    
    def pull!
      message "Pulling #{branch?} from Origin…"
      puts `cd "#{TM_PROJECT_DIRECTORY}"; git pull origin #{branch?}`
    end
    
    def default
      status
    end
    
    private
    def branch?
      @ref ||= File.read(TM_PROJECT_DIRECTORY + '/.git/HEAD').chomp.match(/ref: (.*)/)[1]
      @ref.split('/').last
    end
    
    def message(txt,donetxt=" Done\n")
      print txt
      $stdout.flush
      print donetxt
    end
    
    def hash_to_hex_colors(hash)
      hash.scan(/[0-9a-fA-F]{6}/).map { |c| "##{c}" }
    end

    def hash_to_html(hash)
      hash_to_hex_colors(hash).map do |c|
        "<span style='color:#{c};'>#{c.sub('#','')}</span>"
      end.join("")
    end

    def replace_hash_with_html(text)
      text.gsub(/[0-9a-fA-F]{6}/){|h| hash_to_html(h)}
    end

  end
end

if __FILE__ == $0
  abort %Q{This only works with projects, not individual files :(} unless TM_PROJECT_DIRECTORY
  GitGUI::send ARGV[0]
end

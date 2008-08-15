#!/usr/bin/env ruby
require 'rubygems'
require 'json'

TM_BUNDLE_SUPPORT    = ENV['TM_BUNDLE_SUPPORT']    || File.expand_path('~/Library/Application Support/TextMate/Bundles/GuiMate.tmbundle/Support')
PROJECT_PATH = ENV['GIT_PROJECT_DIRECTORY'] || ENV['TM_PROJECT_DIRECTORY']

def j(result, wait=false)
  STDOUT.flush
  print result.to_json
  print '/**/'
  STDOUT.flush unless wait
end

module GitGUI
  class << self
    
    
    # alias :really_send :send 
    # def send(*args)
    #   # puts '<pre>'
    #   self.really_send(*args)
    #   # puts '</pre>'
    # end
    
    def edit
      `open "#{File.expand_path TM_BUNDLE_SUPPORT + '/../GuiMate.tmproj'}"; mate "#{TM_BUNDLE_SUPPORT}/git.gui.js" &>/dev/null &`
    end
    
    def diff
      message "Opening Diff to TextMate…"
      `cd "#{PROJECT_PATH}"; git diff|mate &>/dev/null &`
    end
    
    def log
      message "Log", "\n"
      @log = `cd "#{PROJECT_PATH}"; git log -100`
      @log = link_lighthouse @log
      replace_hash_with_html(@log)
    end
    
    def status
      message 'Status'
      j ls_files(%w[modified deleted unmerged others killed])
      `cd "#{PROJECT_PATH}"; git status`
    end
    
    def nub
      `cd "#{PROJECT_PATH}"; nub . &>/dev/null &`
    end
    
    def add_remove!
      j ls_files(%w[modified deleted unmerged others])
      j `cd "#{PROJECT_PATH}"; git ls-files --deleted|xargs git rm`
      `cd "#{PROJECT_PATH}"; git add .; git st`
    end
    
    def commit
      message "Committing…"
      ENV['GIT_EDITOR'] ||= 'mate -w'
      `cd "#{PROJECT_PATH}"; git commit -v`
    end
    
    def commit_all!
      message "Committing…"
      ENV['GIT_EDITOR'] ||= 'mate -w'
      `cd "#{PROJECT_PATH}"; git commit -va`
    end
    
    def push!
      message "Pushing #{branch?} to Origin…"
      `cd "#{PROJECT_PATH}"; git push origin #{branch?}`
    end
    
    def stage!
      message "Pushing #{branch?} to Stage…"
      `cd "#{PROJECT_PATH}"; git push stage #{branch?}`
    end
    
    def pull!
      message "Pulling #{branch?} from Origin…"
      `cd "#{PROJECT_PATH}"; git pull origin #{branch?}`
    end
    
    def ls_files(types=%w[modified deleted unmerged cached others stage killed])
      @ls_files = {}
      types.each do |kind|
        result = `cd "#{PROJECT_PATH}"; git-ls-files --directory --#{kind}`.split("\n")
        @ls_files[kind] = result if result and not result.empty?
      end
      @ls_files
    end
    
    def default
      message 'Loading…'
      status
    end
    
    def message(txt, donetxt=' Done')
      j({'message' => txt})
      j({'message' => PROJECT_PATH}, true)
    end
    
    private
    def branch?
      @ref ||= File.read(PROJECT_PATH + '/.git/HEAD').chomp.match(/ref: (.*)/)[1]
      @ref.split('/').last
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
    
    def link_lighthouse(log)
      log.gsub(/\[#(\d+).*\]/){|r|
        %{<a href="http://#{ ENV['TM_LH_ACCOUNT'] }.lighthouseapp.com/projects/#{ ENV['TM_LH_PROJECT_ID'] }/tickets/#{$1}">#{r}</a>}
      }
    end
    
  end
end

if __FILE__ == $0
  abort %Q{This only works with projects, not individual files :(} unless PROJECT_PATH
  j GitGUI::send(ARGV[0])
end

#!/usr/bin/env ruby
require 'rubygems'
require 'json'
require ENV['TM_SUPPORT_PATH'] + '/lib/escape'

TM_BUNDLE_SUPPORT    = ENV['TM_BUNDLE_SUPPORT']    || File.expand_path('~/Library/Application Support/TextMate/Bundles/GuiMate.tmbundle/Support')
# $PROJECT_PATH = ENV['GIT_PROJECT_DIRECTORY'] || ENV['TM_PROJECT_DIRECTORY']

pwd = ENV['GIT_PROJECT_DIRECTORY'] || ENV['TM_PROJECT_DIRECTORY'] || ENV['TM_DIRECTORY'] || ENV['PWD'] || File.dirname($0)

until $PROJECT_PATH or pwd == '/'
  pwd.gsub(/\/$/,'')
  $PROJECT_PATH = pwd and next if File.exists?(pwd+'/.git')
  pwd = File.expand_path(pwd + '/..')
end

def j(result, wait=false)
  STDOUT.flush
  print result.to_json
  print '/**/'
  STDOUT.flush unless wait
end

class String
  def paths_to_tm_links
    %{<a href="txmt://open?url=file://#$PROJECT_PATH/#{self}">#{self}</a>}
  end
  def paths_to_tm_links!
    self.replace self.paths_to_tm_links
  end
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
      `cd "#{$PROJECT_PATH}"; git diff|mate &>/dev/null &`
    end
    
    def log
      message "Log", "\n"
      @log = `cd "#{$PROJECT_PATH}"; git log -10 --pretty=format:'Hash‹%H› Author‹%an %ae› Date‹%ad %ar› Note‹%s %b›'`
      # @log = link_lighthouse @log
      # replace_hash_with_html
      
      
      @log.split("\n").map do |log|
        log = log.split(/› ?/)
        hsh = {}
        log.each do|kv|
          k,v = kv.split('‹')
          hsh[k] = v
        end
        hsh
      end
    end
    
    def status
      message 'Status'
      ls_files(%w[modified deleted unmerged others killed])
    end
    
    def status_raw
      message 'Status'
      `cd "#{$PROJECT_PATH}"; git status`
    end
    
    def nub
      `cd "#{$PROJECT_PATH}"; nub . &>/dev/null &`
    end
    
    def add_remove!
      j ls_files(%w[modified deleted unmerged others])
      j `cd "#{$PROJECT_PATH}"; git ls-files --deleted|xargs git rm`
      `cd "#{$PROJECT_PATH}"; git add .; git st`
    end
    
    def commit(message=nil)
      message "Committing…"
      ENV['GIT_EDITOR'] ||= 'mate -w'
      cmd = %`cd "#{$PROJECT_PATH}"; git commit -v`
      cmd << " -m #{e_sh message}" if message
      %x{#{cmd}}
    end
    
    def commit_all!
      message "Committing…"
      ENV['GIT_EDITOR'] ||= 'mate -w'
      `cd "#{$PROJECT_PATH}"; git commit -va`
    end
    
    # x_fast_commit! is really dumb, you should probly NEVER use it!
    def x_fast_commit!
      require ENV['TM_SUPPORT_PATH'] + '/lib/ui'
      
      j add_remove!
      j commit(TextMate::UI.request_string({:title => %Q{Fast Commit?! DON'T DO IT!!1!}, :default => 'WIP', :prompt => 'Commit message:'}))
      j "\nWIP Commit Done." => "You are a terrible, terrible person!!!1! :'("
      default
    end
    
    def push!
      message "Pushing #{branch?} to Origin…"
      `cd "#{$PROJECT_PATH}"; git push origin #{branch?}`
    end
    
    def stage!
      message "Pushing #{branch?} to Stage…"
      `cd "#{$PROJECT_PATH}"; git push stage #{branch?}`
    end
    
    def pull!
      message "Pulling #{branch?} from Origin…"
      `cd "#{$PROJECT_PATH}"; git pull origin #{branch?}`
    end
    
    def pull_stage!
      message "Pulling #{branch?} from Stage…"
      `cd "#{$PROJECT_PATH}"; git pull stage #{branch?}`
    end
    
    def fetch
      message "Fetching from Origin…"
      j `cd "#{$PROJECT_PATH}"; git fetch origin`
      message "Diffing from Origin…"
      `cd "#{$PROJECT_PATH}"; git log -p #{branch?}..origin/#{branch?} > /tmp/.fetch_origin_#{branch?}.diff        ;mate -a /tmp/.fetch_origin_#{branch?}.diff`
      `cd "#{$PROJECT_PATH}"; git log -p #{branch?}..origin/master     > /tmp/.fetch_origin_#{branch?}_master.diff ;mate -a /tmp/.fetch_origin_#{branch?}_master.diff` unless branch? == 'master'
      
      message "Fetching from Stage…"
      j `cd "#{$PROJECT_PATH}"; git fetch stage`
      message "Diffing from Stage…"
      `cd "#{$PROJECT_PATH}"; git log -p #{branch?}..stage/#{branch?} > /tmp/.fetch_stage_#{branch?}.diff        ;mate -a /tmp/.fetch_stage_#{branch?}.diff`
      `cd "#{$PROJECT_PATH}"; git log -p #{branch?}..stage/master     > /tmp/.fetch_stage_#{branch?}_master.diff ;mate -a /tmp/.fetch_stage_#{branch?}_master.diff` unless branch? == 'master'
      
      diffs = []
      diffs << ".fetch_origin_#{branch?}.diff"
      diffs << ".fetch_origin_#{branch?}_master.diff" unless branch? == 'master'
      diffs << ".fetch_stage_#{branch?}.diff"
      diffs << ".fetch_stage_#{branch?}_master.diff" unless branch? == 'master'
      diffs
    end
    
    def ignore_filepaths
      return @ignore_filepaths ||= [
        
        `git config --global core.excludesfile`.chomp, 
        $PROJECT_PATH + '/.gitignore'
        
      ].select do |ignore_filepath|
        
        ignore_filepath and File.exists?(ignore_filepath)
        
      end
    end
    
    def ls_files(types=%w[modified deleted unmerged cached others stage killed])
      @ls_files = {}
      
      cmd = %`cd "#{$PROJECT_PATH}"; git ls-files --directory --no-empty-directory`
      ignore_filepaths.each do |ignore_filepath|
        cmd << " --exclude-from=#{e_sh ignore_filepath}"
      end
      
      types.each do |kind|
        filepaths = `#{cmd} --#{kind}`
        next if filepaths.empty?
        
        # TODO: Make the paths absolute again once we need it
        # filepaths.gsub!(/^/,$PROJECT_PATH+'/')
        filepaths = filepaths.split("\n")
        
        filepaths.map { |p| p.paths_to_tm_links! }
        
        @ls_files[kind] = filepaths 
      end
      @ls_files
    end
    
    def default
      message 'Loading…'
      status
    end
    
    def message(txt, donetxt=' Done')
      j({'message' => txt})
      j({'message' => $PROJECT_PATH}, true)
    end
    
    private
    def branch?
      @ref ||= File.read($PROJECT_PATH + '/.git/HEAD').chomp.match(/ref: (.*)/)[1]
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
  abort %Q{Not a git project :'(} unless $PROJECT_PATH
  j GitGUI::send(ARGV[0])
end

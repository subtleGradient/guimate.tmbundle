#!/usr/bin/env ruby

TM_BUNDLE_SUPPORT    = ENV['TM_BUNDLE_SUPPORT']    || File.expand_path('~/Library/Application Support/TextMate/Bundles/GuiMate.tmbundle/Support')
TM_PROJECT_DIRECTORY = ENV['TM_PROJECT_DIRECTORY']
ENV.delete 'RUBYLIB'

module RailsGUI
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
    
    def server(command='info')
      if command==='start'
        cmd=%!cd '#{TM_PROJECT_DIRECTORY}';"./script/server" -d -e development!
        puts cmd
        system(cmd)
				browse!
        log
      end
      if command==='stop'
        cmd=%!cd '#{TM_PROJECT_DIRECTORY}';kill `cat "./tmp/pids"/*.pid`!
        puts cmd
        system(cmd)
      end
      if command==='info'
        pids = Dir[TM_PROJECT_DIRECTORY + '/tmp/pids/*.pid'].length
        print 'Server running' if pids >  0
        print 'Server stopped' if pids <= 0
      end
    end
    
    def log
      system %!cd '#{TM_PROJECT_DIRECTORY}';tail -f ./log/development.log!
    end
    
    def default
      server 'info'
    end
    
		def browse!
			`open http://0.0.0.0:3000`
		end
		
    private
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
  RailsGUI::send ARGV[0], *ARGV[1...ARGV.length]
end

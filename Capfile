
set :user, "james"
set :runner, user
set :server_name, "home"


set :use_sudo, false
set :application, "next_muni_mobile"
set :repository, "git@github.com:hjhart/next_muni_mobile.git"
set :scm, 'git'
set :deploy_via, :remote_cache
set :deploy_to, "/Users/james/Sites/next_muni_mobile"
set :scm_command, "/usr/local/bin/git"

set :server, "home"
set :use_sqlite3, false

ssh_options[:forward_agent] = true

load 'deploy'

role :web, server_name.to_s
role :app, server_name.to_s
role :db, server_name.to_s

# Paths
set :shared_database_path,        "#{shared_path}/databases"
set :shared_config_path,          "#{shared_path}/config"


namespace :deploy do
  desc "Restarting mod_rails with restart.txt"
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{current_path}/tmp/restart.txt"
  end

   [:start, :stop].each do |t|
    desc "#{t} task is a no-op with mod_rails"
    task t, :roles => :app do ; end
  end
end
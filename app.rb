require "rubygems"
require "sinatra"
require 'next_muni'
require 'json'

get "/" do
  redirect "index.html"
end

get "/from.json" do
  times_1 = NextMuni.get_times('30x', 5336)
  times_2 = NextMuni.get_times('41', 5336)
  times_1 = ["No current predictions"] if times_1.empty? 
  times_2 = ["No current predictions"] if times_2.empty?

  content_type :json 
  [
    { :bus_number => "30x", :times => times_1 },
    { :bus_number => "41", :times => times_2 }
  ].to_json

end


get '/to.json' do
  franklin_30 = NextMuni.get_times('30x', 3944)
  franklin_41 = NextMuni.get_times('41', 6787)
  franklin_45 = NextMuni.get_times('45', 6787)
  franklin_30 = ["No current predictions"] if franklin_30.empty?
  franklin_41 = ["No current predictions"] if franklin_41.empty?
  franklin_45 = ["No current predictions"] if franklin_45.empty?
  
  content_type :json 

  [
    { :bus_number => "30x", :times => franklin_30 },
    { :bus_number => "41", :times => franklin_41 },
    { :bus_number => "45", :times => franklin_45 }
  ].to_json
  
  # laguna_30 = NextMuni.get_times('30x', 3948)
  # laguna_41 = NextMuni.get_times('41', 6771)
  # laguna_45 = NextMuni.get_times('45', 6771)

  # @laguna_30 = ["No current predictions"] if @laguna_30.empty?
  # @laguna_41 = ["No current predictions"] if @laguna_41.empty?
  # @laguna_45 = ["No current predictions"] if @laguna_45.empty?
end

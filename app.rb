require "rubygems"
require "sinatra"
require 'next_muni'
require 'json'
require 'awesome_print'

get "/" do
  redirect "index.html"
end

get "/routes/:route.json" do
  content_type :json
  NextMuni.get_stops(params[:route]).to_json
end

get '/times/:route/:stop.json' do
  content_type :json
  NextMuni.get_times(params[:route], params[:stop]).to_json
end

get "/routes.json" do
  content_type :json
  routes = NextMuni.get_routes('sf-muni').map { |route|
    {
      :id => route[:id],
      :title => [route[:title]]
    }
  }
  ap routes
  routes.to_json
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

get "/1_market.json" do
  f_times = NextMuni.get_times("F", 5669)
  cable_car_times = NextMuni.get_times("61", 3860)
  f_times = ["No current predictions"] if f_times.empty?
  cable_car_times = ["No current predictions"] if cable_car_times.empty?

  content_type :json
  [
    { :bus_number => "F", :times => f_times },
    { :bus_number => "Cable Car", :times => cable_car_times },
  ].to_json
end

get "/other.json" do
  times_45 = NextMuni.get_times("45", 4821)
  times_45 = ["No current predictions"] if times_45.empty?
  market_and_third = NextMuni.get_times("F", 5640)
  market_and_third = ["No current predictions"] if market_and_third.empty?

  content_type :json
  [
    { :bus_number => "45 Geary & Kearny", :times => times_45 },
    { :bus_number => "F 3rd & Market", :times => market_and_third },
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
end

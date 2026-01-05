-- Jenna's Dashboard Stopper
-- Stops the server and auto-sync

on run
	set dashboardPath to "/Users/yoojinseon/Develop/Sourcetree/jenna-dashboard"

	display notification "Stopping dashboard..." with title "🛑 Jenna's Dashboard"

	-- Stop server
	try
		do shell script "cd " & quoted form of dashboardPath & " && if [ -f .server.pid ]; then kill $(cat .server.pid) 2>/dev/null; rm .server.pid; fi"
	end try

	-- Stop auto-sync
	try
		do shell script "cd " & quoted form of dashboardPath & " && if [ -f .sync.pid ]; then kill $(cat .sync.pid) 2>/dev/null; rm .sync.pid; fi"
	end try

	-- Clean up any remaining processes on port 8888
	try
		do shell script "lsof -ti:8888 | xargs kill -9 2>/dev/null"
	end try

	display notification "Server and auto-sync stopped" with title "✅ Dashboard Stopped"

end run

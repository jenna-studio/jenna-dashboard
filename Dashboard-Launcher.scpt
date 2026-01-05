-- Jenna's Dashboard Auto-Launcher
-- This AppleScript starts the server, syncs calendar, and opens the dashboard

on run
	set dashboardPath to "/Users/yoojinseon/Develop/Sourcetree/jenna-dashboard"

	-- Show startup notification
	display notification "Starting your dashboard..." with title "🎀 Jenna's Dashboard"

	-- Check if server is already running
	try
		set serverCheck to do shell script "lsof -i :8888 | grep LISTEN"
		set serverRunning to true
	on error
		set serverRunning to false
	end try

	-- Start server if not running
	if not serverRunning then
		-- Start the Python server in background
		do shell script "cd " & quoted form of dashboardPath & " && python3 -m http.server 8888 > /dev/null 2>&1 & echo $! > .server.pid &"
		delay 2
	end if

	-- Sync calendar
	try
		do shell script "cd " & quoted form of dashboardPath & " && ./sync-calendar.sh"
	end try

	-- Open dashboard in Chrome
	try
		tell application "Google Chrome"
			if it is not running then
				activate
				delay 1
			end if

			-- Check if dashboard is already open
			set foundTab to false
			repeat with w in windows
				repeat with t in tabs of w
					if URL of t contains "localhost:8888" then
						set foundTab to true
						set active tab index of w to index of t
						set index of w to 1
						exit repeat
					end if
				end repeat
				if foundTab then exit repeat
			end repeat

			-- Open new tab if not found
			if not foundTab then
				tell window 1
					make new tab with properties {URL:"http://localhost:8888"}
				end tell
			end if

			activate
		end tell
	on error
		-- Fallback to default browser
		do shell script "open http://localhost:8888"
	end try

	-- Start auto-sync loop in background
	do shell script "cd " & quoted form of dashboardPath & " && nohup bash -c 'while true; do sleep 300; ./sync-calendar.sh >> dashboard-auto-start.log 2>&1; done' > /dev/null 2>&1 & echo $! > .sync.pid &"

	-- Success notification
	display notification "Dashboard is live at http://localhost:8888
Calendar syncs every 5 minutes" with title "✨ Dashboard Ready!"

end run

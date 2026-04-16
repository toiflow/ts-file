#!/bin/zsh
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

# fetch Google Sheet CSV
SHEET_DATA=$(curl -sL "https://docs.google.com/spreadsheets/d/1VsRoh9Wg3TSAGJNtJHnovIqxzqKT-1ti1xbM7_DPEG0/export?format=csv&gid=1433072521")

PROMPT="Read the following CSV data from the task spreadsheet. Use win=completed, tie=in progress, lost=incomplete. Indicate KPIs — summarize what tasks are completed, in progress, and incomplete. Highlight anything urgent or needing attention.

$SHEET_DATA"

# run ollama directly
ANALYSIS=$(curl -s http://127.0.0.1:11434/api/generate \
  -d "{\"model\":\"qwen2.5:7b\",\"prompt\":$(echo "$PROMPT" | /usr/bin/jq -Rs .),\"stream\":false}" \
  | /usr/bin/jq -r '.response')

# save analysis to md file
echo "$ANALYSIS" > /tmp/must-file.md

# send email with md attachment via Mail app
osascript <<EOF
tell application "Mail"
    set newMsg to make new outgoing message with properties {subject:"must-file", visible:false}
    tell newMsg
        make new to recipient with properties {address:"jayreck996@gmail.com"}
        make new cc recipient with properties {address:"jayreck@gmail.com"}
        make new attachment with properties {file name:(POSIX file "/tmp/must-file.md") as alias}
    end tell
    send newMsg
end tell
EOF

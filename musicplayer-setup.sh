# TODO: proper intro and the like

set -e

echo "
MusicPlayer V4 Setup
"

read -p "Do you wish to install the backend via Docker (d) or locally (l)? (D/l) " backend_mode
read -p "Do you wish to install the frontend via Docker (d) or using an existing Webserver (w)? (d/W) " frontend_mode

# If backend local, then download executable, else download correct docker-compose file

if [[ $frontend_mode == "d" && $backend_mode != "l" ]]; then
    read -p "Installing both through docker. Enter to proceed, Ctrl + C to cancel"
else
if [[ $frontend_mode != "d" ]]; then
    read -p "Installing frontend through docker, backend locally. Enter to proceed, Ctrl + C to cancel"
elif [[ $backend_mode == "l" ]]; then
    
fi
fi

# TODO: proper intro and the like

set -e

echo "
MusicPlayer V4 Setup
"

read -p "Do you wish to install the backend via Docker (d) or locally (l)? (D/l) " backend_mode
read -p "Do you wish to install the frontend via Docker (d) or using an existing Webserver (w)? (d/W) " frontend_mode

# If backend local, then download executable, else download correct docker-compose file

if [[ $frontend_mode == "d" && $backend_mode != "l" ]]; then
    read -p "Installing both through docker, will download docker compose file. Enter to proceed, Ctrl + C to cancel"
else
    if [[ $frontend_mode != "d" ]]; then
        read -p "Installing frontend locally. Will download the built frontend from GitHub releases. Enter to proceed, Ctrl + C to cancel"
    else
        read -p "Installing frontend through docker, will download docker compose file. Enter to proceed, Ctrl + C to cancel"
    fi
    if [[ $backend_mode == "l" ]]; then
        read -p "Installing backend locally, will download the binary from GitHub releases. Enter to proceed, Ctrl + C to cancel"
    else
        read -p "Installing backend through docker, will download docker compose file. Enter to proceed, Ctrl + C to cancel"
    fi
fi

echo "Downloading config file"

echo "Creating .env file"

echo "Please edit the .env and config file."

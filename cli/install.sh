#!/bin/bash

echo "Downloading latest Pipelinit binary" &&
  curl -s https://api.github.com/repos/pipelinit/pipelinit-cli/releases/latest | grep -E 'browser_download_url.*linux*' | cut -d '"' -f 4 | wget -qi - &&
  echo "Download completed! Unpacking the file" &&
  tar -xf pipelinit-v*.tar.gz && rm pipelinit-v*.tar.gz &&
  echo "Moving the file to the default PATH: $HOME/.local/bin/" &&
  mv pipelinit-v* "$HOME/.local/bin/pipelinit" &&
  echo -e "\e[1;32mInstalled with success! If you have $HOME/.local/bin/ in your PATH run with 'pipelinit' case not run with the full path '$HOME/.local/bin/pipelinit'"

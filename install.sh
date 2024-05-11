#!/bin/bash

# Define source and target directories
source_dir=$(dirname "$0")
target_dir="$HOME/.local/share/gnome-shell/extensions/openvpn-tray@dr-shakya.github.com"

# Create the target directory if it doesn't exist
mkdir -p "$target_dir"

# Copy all contents except install.sh from source directory to target directory
for file in "$source_dir"/*; do
  if [[ "$(basename "$file")" != "install.sh" && "$filename" != "README.md" ]]; then
    cp -r "$file" "$target_dir"
  fi
done

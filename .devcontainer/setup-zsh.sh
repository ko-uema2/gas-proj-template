#!/bin/bash

###############################################
# NOTE: This script is executed automatically #
#       as part of the postCreateCommand in   #
#       devcontainer.json.                    #
###############################################

# Clone dotfiles repository
git clone https://github.com/ko-uema2/dotfiles.git /tmp/dotfiles
cp /tmp/dotfiles/.zshrc ~/.zshrc
rm -rf /tmp/dotfiles

# Install oh-my-zsh plugins
ZSH_CUSTOM=${ZSH_CUSTOM:-~/.oh-my-zsh/custom}
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-completions.git $ZSH_CUSTOM/plugins/zsh-completions
git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-history-substring-search.git $ZSH_CUSTOM/plugins/zsh-history-substring-search

# Source the updated zsh configuration
zsh -c 'source ~/.zshrc'
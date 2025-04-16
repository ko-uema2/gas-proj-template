FROM node:23-slim

# Set working directory
WORKDIR /usr/app

RUN apt update && \
    apt install -y git && \
    apt install -y curl && \
    apt install -y zsh && \
    chsh -s $(which zsh)

# Install oh-my-zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install LazyGit
RUN LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | \grep -Po '"tag_name": *"v\K[^"]*') && \
    curl -Lo /tmp/lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/download/v${LAZYGIT_VERSION}/lazygit_${LAZYGIT_VERSION}_Linux_arm64.tar.gz" && \
    tar -xzf /tmp/lazygit.tar.gz -C /usr/local/bin/ lazygit && \
    chmod +x /usr/local/bin/lazygit && \
    rm /tmp/lazygit.tar.gz

# Install clasp globally
RUN npm install -g @google/clasp

COPY  ../package*.json ./

# Install dependencies
RUN npm install

# Note: The postCreateCommand in devcontainer.json executes setup-zsh.sh to configure zsh settings.

# Default command
CMD [ "zsh" ]

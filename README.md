# CloudChain

A comprehensive blockchain development environment that combines a local Ethereum blockchain with remote-controlled Ubuntu virtual machines through a web interface.

## Overview

CloudChain integrates Hardhat for smart contract development and deployment with Docker-based Ubuntu VMs accessible via Apache Guacamole. This setup enables you to develop, test, and interact with blockchain applications while managing virtual environments through your browser.

## Features

- **Local Ethereum Blockchain**: Hardhat-powered development network
- **Smart Contract Development**: Full Solidity development environment
- **Remote VM Access**: Browser-based access to Ubuntu desktops via Guacamole
- **Dual VM Support**: LXDE and XFCE desktop environments
- **Containerized Infrastructure**: Docker-based for easy deployment and management

## Prerequisites

- Node.js v22.21.1 or compatible
- npm 10.9.4 or higher
- Docker Desktop (latest version)
- Terminal access (3 terminal windows recommended)

## Installation

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd CloudChain
npm install
```

### 2. Verify Hardhat Installation

```bash
npx hardhat --version
```

Expected output: `3.0.15`

## Quick Start

### Terminal 1: Start Blockchain

```bash
npx hardhat compile
npx hardhat node
```

The blockchain node will be available at `http://127.0.0.1:8545`

### Terminal 2: Deploy Contracts

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### Terminal 3: Setup Virtual Machines

#### Start Guacamole Server

```bash
docker run -d --name guac-easy -p 8080:8080 oznu/guacamole
```

Access Guacamole at `http://localhost:8080/guacamole`

**Default credentials:**
- Username: `guacadmin`
- Password: `guacadmin`

#### Start Ubuntu VMs

**Main VM (XFCE):**
```bash
docker run -d --name ubuntu-xfce -p 5901:5901 accetto/ubuntu-vnc-xfce
```

**Secondary VM (LXDE):**
```bash
docker run -d --name ubuntu-vnc -p 5902:5901 dorowu/ubuntu-desktop-lxde-vnc
```

## Virtual Machine Configuration

### Ubuntu XFCE (Main VM)

Configure in Guacamole UI:
- **Name**: Ubuntu xfce
- **Protocol**: VNC
- **Hostname**: `172.17.0.4` (or check with inspect command below)
- **Port**: `5901`
- **Password**: `headless`

To verify IP address:
```bash
docker inspect -f "{{ range .NetworkSettings.Networks }}{{ .IPAddress }}{{ end }}" ubuntu-xfce
```

### Ubuntu LXDE (Secondary VM)

Configure in Guacamole UI:
- **Name**: Ubuntu lxde
- **Protocol**: VNC
- **Hostname**: `172.17.0.3` (or check with inspect command)
- **Port**: `5900`
- **Password**: `vncpassword`

To verify IP address:
```bash
docker inspect -f "{{ .NetworkSettings.Networks.bridge.IPAddress }}" ubuntu-vnc
```

## Docker Management

### Start Existing Containers

```bash
# Main VM
docker start ubuntu-xfce

# Secondary VM
docker start ubuntu-vnc

# Guacamole
docker start guac-easy
```

### Stop All Containers

```bash
docker stop guac-client guac-daemon guac-mysql ubuntu-xfce ubuntu-vnc
```

### Clean Up

```bash
# Remove stopped containers
docker container prune -f

# Remove specific containers
docker rm -f guac-client guac-daemon guac-mysql ubuntu-xfce ubuntu-vnc
```

### View Running Containers

```bash
docker ps
```

## Project Structure

```
CloudChain/
├── artifacts/              # Compiled contract artifacts
│   ├── build-info/        # Build metadata
│   └── contracts/         # Contract ABIs and metadata
│       ├── CloudVM.sol/
│       └── VMAccess.sol/
├── cache/                 # Hardhat cache files
├── node_modules           # Auto Generated
├── cloudchain-client/     # Browser client application
│   ├── blockchain.js      # Blockchain interaction logic
│   ├── index.html         # Client UI
│   ├── launch.js          # VM launcher
│   ├── main.js            # Main application logic
│   ├── popup.js           # Popup functionality
│   └── styles.css         # Client styles
├── contracts/             # Solidity smart contracts
│   ├── CloudVM.sol        # Cloud VM management contract
│   └── VMAccess.sol       # VM access control contract
├── node_modules/          # Dependencies (auto-generated)
├── scripts/               # Deployment and utility scripts
│   └── deploy.cjs         # Contract deployment script
├── types/                 # TypeScript definitions
│   └── hardhat.d.ts
├── .gitignore            # Git ignore rules
├── hardhat.config.cjs    # Hardhat configuration
├── index.html            # Main application interface
├── package.json          # Node.js dependencies
├── package-lock.json     # Dependency lock file
├── vm-controller.js      # VM controller logic
└── README.md             # This file
```

## Common Commands Reference

### Hardhat Commands

```bash
# Compile contracts
npx hardhat compile

# Start local node
npx hardhat node

# Deploy to localhost
npx hardhat run scripts/deploy.ts --network localhost
```

### Docker Commands

```bash
# Inspect container details
docker ps

# Get container IP address
docker inspect -f "{{ .NetworkSettings.Networks.bridge.IPAddress }}" <container-name>

# View logs
docker logs <container-name>
```

## Troubleshooting

### Container IP Address Changes

If you can't connect to a VM through Guacamole, the container IP may have changed. Check the current IP:

```bash
docker inspect -f "{{ range .NetworkSettings.Networks }}{{ .IPAddress }}{{ end }}" <container-name>
```

Update the hostname in Guacamole connection settings accordingly.

### Port Conflicts

If ports 8080, 5901, or 5902 are already in use, modify the port mapping in the docker run commands:

```bash
docker run -d --name ubuntu-xfce -p <your-port>:5901 accetto/ubuntu-vnc-xfce
```

### Hardhat Node Issues

If the Hardhat node fails to start, ensure no other process is using port 8545:

```bash
lsof -i :8545  # macOS/Linux
netstat -ano | findstr :8545  # Windows
```

## Network Architecture

- **Hardhat Node**: `http://127.0.0.1:8545`
- **Guacamole Web UI**: `http://localhost:8080/guacamole`
- **Docker Bridge Network**: `172.17.0.0/16` (default)
  - Container IPs typically range from `172.17.0.2` onwards

## Important Notes

- The LXDE container uses VNC port **5900** internally
- The XFCE container uses VNC port **5901** internally
- ethers.js version **5.7.2** is required for compatibility
- Docker assigns IPs dynamically; always verify container IPs after restart
- Guacamole connections may need reconfiguration after container restarts

## Contributing

Contributions are welcome! Please follow standard Git workflows and ensure all tests pass before submitting pull requests.

## Support

For issues and questions, please open an issue in the repository or contact the maintainers.
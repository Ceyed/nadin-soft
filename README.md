# Task Management System

- [Overview](#overview)
- [Functionality](#functionality)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [UnInstallation](#uninstallation)

## Overview

This project is a task management system designed to facilitate task tracking and organization. It provides users with the ability to create, view, update, and delete tasks, with role-based access control ensuring that users only have access to their own tasks. The system also includes features for user profile management, including profile updates and avatar uploads.

## Functionality

- **User Roles:** The system supports two roles: base-user and admin. Base users can manage their own tasks and profiles, while admins have additional privileges, such as viewing all user profiles and tasks, as well as promoting base users to admin status and revoking admin privileges.

## Technologies Used

- **Framework:** NestJS
- **Database:** MySQL
- **In-memory Storage:** Redis
- **ORM:** TypeORM
- **Documentation:** Swagger

## Installation

### Automatic Installation

To install the project automatically, navigate to the project folder in your terminal and run the following command:

```bash
./install.sh
```

### Manual Installation

For manual installation, follow these steps:
1. Create `.env` file:

   ```bash
   cp .env.sample .env
   ```

2. Start the Docker containers by running the following command in the project folder:

   ```bash
   docker compose up -d
   ```

3. Install project dependencies using pnpm:

   ```bash
   pnpm i
   ```

4. Start the server:

   ```bash
   pnpm start
   ```

## UnInstallation

### Automatic UnInstallation

Navigate to the project folder in your terminal and run the following command:

```bash
./uninstall.sh
```

### Manual UnInstallation

For manual un-installation, follow these steps:

1. Stop and remove the Docker containers:

   ```bash
   docker compose down
   ```

2. Remove Docker volumes associated with the project:

   **Note:** By default, volume names are: 'nadin-soft_mysql-data' and 'nadin-soft_redis-data'.

   ```bash
   docker volume rm nadin-soft_mysql-data nadin-soft_redis-data
   ```

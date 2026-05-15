# Mini Jeera

Mini Jeera is a collaborative project management application inspired by Jira, built to simulate real-world team workflow and task management systems.

The platform allows users to:
- Create workspaces
- Invite team members
- Manage projects
- Create and assign tasks
- Track task progress with role-based access control

--------------------------------------------------

# Architecture

The project follows a modular full-stack architecture.

Backend:
- FastAPI for REST API development
- SQLAlchemy ORM for database management
- PostgreSQL as the relational database
- JWT Authentication for secure access
- Pydantic for request/response validation

Frontend:
- React for UI development
- REST API integration for client-server communication

Architecture Layers:
- Routes Layer
- Service Layer
- Database Models
- Authentication Layer
- Schema Validation Layer

--------------------------------------------------

# Core Features

- JWT-based Authentication
- Workspace and Project Management
- Member Invitation System
- Role-Based Access Control (RBAC)
- Task Assignment and Status Tracking
- Relational Database Design
- RESTful API Architecture

--------------------------------------------------

# Database Design

Main Entities:
- User
- Workspace
- WorkspaceMember
- Project
- Task

Relationships:
- One-to-Many
- Many-to-Many

--------------------------------------------------

# Tech Stack

Backend:
Python, FastAPI, SQLAlchemy, PostgreSQL

Frontend:
React, JavaScript

Authentication:
JWT Tokens

--------------------------------------------------

# What This Project Demonstrates

- Scalable Backend Architecture
- Real-world Collaboration System Design
- Authentication & Authorization
- API Development
- Database Relationship Management
- Full-Stack Integration

--------------------------------------------------

# Future Improvements

- WebSocket-based Real-time Updates
- Kanban Board
- Activity Logs
- Docker Deployment
- AI-powered Task Prioritization

# MeridianOps Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close Spring Boot + Angular + GraphQL gaps in one monorepo: enterprise ops board with tickets and inventory, JWT auth, and MySQL.

**Architecture:** Angular 19 SPA authenticates via REST login, then queries tickets/inventory over GraphQL against Spring Boot 3.3 + JPA. MySQL via Docker; H2 for quick local smoke.

**Tech Stack:** Spring Boot 3.3, Java 17, Spring Security JWT, Spring GraphQL, MySQL/H2, Angular 19 standalone

---

## Scope (honest portfolio)

- Demonstrates structure and wiring for Spring Boot 3.3+, JPA, Security JWT, GraphQL, Angular 19 standalone SPA.
- Not a production ops platform. Seed data and simplified auth for local demos.
- Built / documented August 2026 for portfolio use.

## Architecture detail

```
Browser (Angular 19 SPA)
  |-- REST /api/auth/login, /api/health
  |-- GraphQL /graphql (tickets, inventoryItems)
Spring Boot 3.3+ (Java 17)
  |-- JPA entities: Ticket, InventoryItem, User
MySQL 8 (docker-compose) or H2 default
```

## Status

Scaffold complete (2026-08-29). Demo login: ops / ops123.

import { type User, type InsertUser, type ActivationRequest, type InsertActivationRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createActivationRequest(request: InsertActivationRequest): Promise<ActivationRequest>;
  updateActivationRequest(id: string, updates: Partial<ActivationRequest>): Promise<ActivationRequest | undefined>;
  getActivationRequest(id: string): Promise<ActivationRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private activationRequests: Map<string, ActivationRequest>;

  constructor() {
    this.users = new Map();
    this.activationRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createActivationRequest(insertRequest: InsertActivationRequest): Promise<ActivationRequest> {
    const id = randomUUID();
    const request: ActivationRequest = {
      ...insertRequest,
      id,
      confirmationId: null,
      status: "pending",
      errorMessage: null,
      processingTime: null,
      createdAt: new Date(),
    };
    this.activationRequests.set(id, request);
    return request;
  }

  async updateActivationRequest(id: string, updates: Partial<ActivationRequest>): Promise<ActivationRequest | undefined> {
    const existing = this.activationRequests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.activationRequests.set(id, updated);
    return updated;
  }

  async getActivationRequest(id: string): Promise<ActivationRequest | undefined> {
    return this.activationRequests.get(id);
  }
}

export const storage = new MemStorage();

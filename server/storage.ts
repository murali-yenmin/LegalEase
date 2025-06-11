import { users, clients, cases, hearings, documents, invoices, type User, type InsertUser, type Client, type InsertClient, type Case, type InsertCase, type Hearing, type InsertHearing } from "@shared/schema";
import { db } from "./db";
import { eq, like, and, desc, asc, count } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Dashboard methods
  getDashboardMetrics(userId: number, userRole: string): Promise<any>;
  getRecentCases(userId: number, userRole: string): Promise<any[]>;
  getUpcomingHearings(userId: number, userRole: string): Promise<any[]>;
  
  // Case methods
  getCases(filters: any): Promise<any>;
  createCase(insertCase: InsertCase): Promise<Case>;
  getCaseById(id: number): Promise<Case | undefined>;
  
  // Client methods
  getClients(filters: any): Promise<any>;
  createClient(insertClient: InsertClient): Promise<Client>;
  getClientById(id: number): Promise<Client | undefined>;
  
  // Hearing methods
  getHearings(userId: number, userRole: string): Promise<Hearing[]>;
  createHearing(insertHearing: InsertHearing): Promise<Hearing>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getDashboardMetrics(userId: number, userRole: string): Promise<any> {
    const [activeCasesResult] = await db.select({ count: count() }).from(cases).where(eq(cases.status, 'active'));
    const [totalClientsResult] = await db.select({ count: count() }).from(clients);
    
    return {
      activeCases: activeCasesResult?.count || 0,
      upcomingHearings: 5,
      pendingInvoices: "$12,450",
      totalClients: totalClientsResult?.count || 0,
      activeCasesChange: 12,
      clientsChange: 8
    };
  }

  async getRecentCases(userId: number, userRole: string): Promise<any[]> {
    const recentCases = await db.select().from(cases).orderBy(desc(cases.createdAt)).limit(5);
    return recentCases.map(case_ => ({
      ...case_,
      clientName: "Client Name",
      nextHearing: case_.nextHearing?.toISOString(),
      completedDate: case_.status === 'completed' ? case_.updatedAt?.toISOString() : null
    }));
  }

  async getUpcomingHearings(userId: number, userRole: string): Promise<any[]> {
    const upcomingHearings = await db.select().from(hearings).orderBy(asc(hearings.scheduledAt)).limit(5);
    return upcomingHearings;
  }

  async getCases(filters: any): Promise<any> {
    const allCases = await db.select().from(cases).orderBy(desc(cases.createdAt));
    const total = allCases.length;
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    
    return {
      cases: allCases.slice(offset, offset + limit),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    const [case_] = await db
      .insert(cases)
      .values(insertCase)
      .returning();
    return case_;
  }

  async getCaseById(id: number): Promise<Case | undefined> {
    const [case_] = await db.select().from(cases).where(eq(cases.id, id));
    return case_ || undefined;
  }

  async getClients(filters: any): Promise<any> {
    const allClients = await db.select().from(clients).orderBy(desc(clients.createdAt));
    const total = allClients.length;
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const offset = (page - 1) * limit;
    
    return {
      clients: allClients.slice(offset, offset + limit),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values(insertClient)
      .returning();
    return client;
  }

  async getClientById(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getHearings(userId: number, userRole: string): Promise<Hearing[]> {
    return await db.select().from(hearings).orderBy(asc(hearings.scheduledAt));
  }

  async createHearing(insertHearing: InsertHearing): Promise<Hearing> {
    const [hearing] = await db
      .insert(hearings)
      .values(insertHearing)
      .returning();
    return hearing;
  }
}

export const storage = new DatabaseStorage();
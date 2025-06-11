import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertClientSchema, insertCaseSchema, insertHearingSchema, loginSchema } from "@shared/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware for JWT authentication
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
const authorize = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.status(201).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role
    });
  });

  // Dashboard routes
  app.get("/api/dashboard/metrics", authenticateToken, async (req: any, res) => {
    try {
      const metrics = await storage.getDashboardMetrics(req.user.id, req.user.role);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  app.get("/api/dashboard/recent-cases", authenticateToken, async (req: any, res) => {
    try {
      const recentCases = await storage.getRecentCases(req.user.id, req.user.role);
      res.json(recentCases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent cases" });
    }
  });

  app.get("/api/dashboard/upcoming-hearings", authenticateToken, async (req: any, res) => {
    try {
      const upcomingHearings = await storage.getUpcomingHearings(req.user.id, req.user.role);
      res.json(upcomingHearings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming hearings" });
    }
  });

  // Cases routes
  app.get("/api/cases", authenticateToken, async (req: any, res) => {
    try {
      const { search, status, caseType, assignedTo, page = 1, limit = 10 } = req.query;
      const cases = await storage.getCases({
        search,
        status,
        caseType,
        assignedTo,
        page: parseInt(page),
        limit: parseInt(limit),
        userId: req.user.id,
        userRole: req.user.role
      });
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  app.post("/api/cases", authenticateToken, authorize(["admin", "advocate", "staff"]), async (req, res) => {
    try {
      const caseData = insertCaseSchema.parse(req.body);
      const newCase = await storage.createCase({
        ...caseData,
        createdById: (req as any).user.id
      });
      res.status(201).json(newCase);
    } catch (error) {
      res.status(400).json({ message: "Invalid case data" });
    }
  });

  app.get("/api/cases/:id", authenticateToken, async (req: any, res) => {
    try {
      const caseId = parseInt(req.params.id);
      const caseData = await storage.getCaseById(caseId);
      if (!caseData) {
        return res.status(404).json({ message: "Case not found" });
      }
      res.json(caseData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case" });
    }
  });

  // Clients routes
  app.get("/api/clients", authenticateToken, async (req: any, res) => {
    try {
      const { search, clientType, status, page = 1, limit = 12 } = req.query;
      const clients = await storage.getClients({
        search,
        clientType,
        status,
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.post("/api/clients", authenticateToken, authorize(["admin", "advocate", "staff"]), async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const newClient = await storage.createClient(clientData);
      res.status(201).json(newClient);
    } catch (error) {
      res.status(400).json({ message: "Invalid client data" });
    }
  });

  app.get("/api/clients/:id", authenticateToken, async (req: any, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const client = await storage.getClientById(clientId);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  // Hearings routes
  app.get("/api/hearings", authenticateToken, async (req: any, res) => {
    try {
      const hearings = await storage.getHearings(req.user.id, req.user.role);
      res.json(hearings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hearings" });
    }
  });

  app.post("/api/hearings", authenticateToken, authorize(["admin", "advocate", "staff"]), async (req, res) => {
    try {
      const hearingData = insertHearingSchema.parse(req.body);
      const newHearing = await storage.createHearing(hearingData);
      res.status(201).json(newHearing);
    } catch (error) {
      res.status(400).json({ message: "Invalid hearing data" });
    }
  });

  // Users management routes (admin only)
  app.get("/api/users", authenticateToken, authorize(["admin"]), async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

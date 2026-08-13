import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../modules/user/user.model";
import { Project } from "../modules/project/project.model";
import { Post } from "../modules/post/post.model";

// Load environment variables
dotenv.config();

const dbUrl = process.env.DATABASE_URL || process.env.DB_URL;

if (!dbUrl) {
  console.error("❌ Database URL is not defined in environment variables");
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log("🔄 Connecting to the database...");
    await mongoose.connect(dbUrl);
    console.log("✅ DB connected successfully");

    // Clean existing data
    console.log("🧹 Cleaning existing data...");
    await User.deleteMany({});
    await Project.deleteMany({});
    await Post.deleteMany({});
    console.log("✅ Database cleared");

    // 1. Seed Users
    console.log("🌱 Seeding users...");
    const users = await User.create([
      {
        name: "Mayesha Mumtaz",
        email: "soumyrhmn234@gmail.com",
        password: "123456",
        role: "SUPER_ADMIN",
        phone: "+8801700000000",
        picture: "https://res.cloudinary.com/dtb6o7zzr/image/upload/v1761590871/e789a464-ae43-49ea-b6ee-6f1aad2d2d94_gwdliu.jpg",
        status: "ACTIVE",
        isVerified: true,
      },
    ]);
    console.log(`✅ Seeded ${users.length} users successfully`);

    const superAdmin = users[0];
    const admin = users[0];

    // 2. Seed Projects
    console.log("🌱 Seeding projects...");
    const projects = await Project.create([
      {
        title: "AI-Driven Employee Recognition Platform",
        content: "An enterprise-grade Full-Stack SaaS application enabling companies to appreciate and recognize employees. Integrates OpenAI API for smart recognition templates, AWS S3 for secure file attachments, and Stripe for subscription management.",
        thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
        livelink: "https://recognition-system.vercel.app",
        repolink: "https://github.com/mayesha6/recognition-frontend",
        techStack: ["Next.js", "React", "Redux Toolkit", "Node.js", "Express", "MongoDB", "Redis", "OpenAI API", "AWS S3", "Stripe"],
        views: 340,
      },
      {
        title: "Digital Wallet Fintech System",
        content: "A secure digital wallet system with real-time transaction tracking. It features automated 2-Factor authentication (2FA) via Twilio SMS API, transactional caching via Redis, and dynamic visual dashboards using Recharts.",
        thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44",
        livelink: "https://digital-wallet-system.vercel.app",
        repolink: "https://github.com/mayesha6/Digital_Wallet_System_Frontend",
        techStack: ["React", "Vite", "Redux Toolkit", "Framer Motion", "Recharts", "Node.js", "Express", "Mongoose", "Twilio", "Redis"],
        views: 210,
      },
      {
        title: "Babysitter Booking Marketplace",
        content: "An on-demand booking marketplace matching parents with babysitters. Features include real-time WebSocket communication using Socket.io, background notifications using Node-Cron, secure bookings processing with Stripe, and profile verification uploads to AWS S3.",
        thumbnail: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368",
        livelink: "https://babysitter-booking.vercel.app",
        repolink: "https://github.com/mayesha6/babysitter-system",
        techStack: ["Node.js", "Express", "Mongoose", "Socket.io", "AWS S3", "Stripe", "Redis", "Node-Cron", "OpenAI"],
        views: 156,
      },
      {
        title: "Multi-Tenant E-Commerce SaaS Backend",
        content: "A multi-tenant e-commerce platform back-end featuring dynamic tenant schema isolation. Supports dynamic store setups, vendor payouts, checkout flow processing, and inventory updates using Prisma ORM with PostgreSQL, Redis, and Stripe.",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        livelink: "https://multi-tenant-saas.vercel.app",
        repolink: "https://github.com/mayesha6/Multi_tenant_store_backend",
        techStack: ["Node.js", "Express", "Prisma ORM", "PostgreSQL", "Redis", "Stripe", "Socket.io", "Zod"],
        views: 198,
      },
      {
        title: "Travel Buddy Meetup & Itinerary Builder",
        content: "A social platform for travelers to plan meetups, share itineraries, and group up. Features dynamic travel slip generation using PDFKit, buddy matching algorithms, and fluid page transitions using Framer Motion.",
        thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
        livelink: "https://travel-buddy-meetup.vercel.app",
        repolink: "https://github.com/mayesha6/Travel_Buddy_Meetup_Frontend",
        techStack: ["Next.js", "Framer Motion", "Radix UI", "Node.js", "Express", "Mongoose", "PDFKit", "Redis"],
        views: 275,
      },
    ]);
    console.log(`✅ Seeded ${projects.length} projects successfully`);

    // 3. Seed Posts
    console.log("🌱 Seeding posts...");
    const posts = await Post.create([
      {
        title: "Mastering Next.js Server Components",
        content: "React Server Components (RSC) represent a paradigm shift in building modern web applications. In this article, we delve deep into the differences between Server and Client Components, when to use which, and how to optimize data fetching using async/await directly in your components.",
        thumbnail: "https://images.unsplash.com/photo-1618401471353-b98aedd07871",
        isFeatured: true,
        tags: ["Next.js", "React", "Web Dev"],
        views: 340,
        author: superAdmin._id,
      },
      {
        title: "Demystifying MongoDB Indexing",
        content: "Indexes are crucial for database performance. Without indexes, MongoDB must perform a collection scan to select documents matching a query. Learn how single-field, compound, text, and geospatial indexes work, and how to use explain() to analyze and optimize your queries.",
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
        isFeatured: false,
        tags: ["MongoDB", "Database", "Backend"],
        views: 150,
        author: superAdmin._id,
      },
      {
        title: "The Power of TypeScript Generic Types",
        content: "Generics allow developers to write flexible, reusable code components that work with a variety of types rather than a single one. This guide explains generic interfaces, constraints, default types, and practical utility patterns to make your TypeScript codebase cleaner and type-safe.",
        thumbnail: "https://images.unsplash.com/photo-1516116211223-5c359a36298a",
        isFeatured: false,
        tags: ["TypeScript", "JavaScript", "Programming"],
        views: 98,
        author: admin._id,
      },
      {
        title: "Designing RESTful APIs: Best Practices",
        content: "Creating clean, scalable, and self-documenting APIs is a fundamental backend skill. We discuss URL naming conventions, proper HTTP method usage, standard status codes, pagination, error formatting, and versioning strategies like /api/v1.",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
        isFeatured: true,
        tags: ["API Design", "REST", "Node.js", "Backend"],
        views: 180,
        author: admin._id,
      },
    ]);
    console.log(`✅ Seeded ${posts.length} posts successfully`);

    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
  }
};

seedDatabase();

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so that the connection
  // is reused between hot-reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Factory function for getting database connections
export async function getDatabases() {
  const client = await clientPromise;

  const UserDB = client.db("users");
  const Services = client.db("services");
  const Stats = client.db("stats");
  const Projects = client.db("projects");
  const Blogs = client.db("blogs");
  const Events = client.db("events");
  const Linkedin = client.db("linkedin");
  const Contact = client.db("contact");
  const WebVitals = client.db("webvitas");
  const Positions = client.db("positions");
  const Subscriptions = client.db("subscriptions");

  return {
    UserDB,
    Services,
    Stats,
    Projects,
    Positions,
    userCollection: UserDB.collection("users"),
    servicesCollection: Services.collection("services"),
    statsCollection: Stats.collection("stats"),
    projectsCollection: Projects.collection("projects"),
    blogsCollection: Blogs.collection("blogs"),
    eventsCollection: Events.collection("events"),
    linkedinCollection: Linkedin.collection("linkedin"),
    contactCollection: Contact.collection("contact"),
    webVitalsCollection: WebVitals.collection("webvitas"),
    positionsCollection: Positions.collection("positions"),
    subscriptionsCollection: Subscriptions.collection("subscriptions"),
  };
}

// Export the clientPromise for use in other contexts
export default clientPromise;

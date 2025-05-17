export const Technology = [
  {
    name: "React",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "#61DAFB",
  },
  {
    name: "Next.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-line.svg",
    color: "#000000",
  },
  {
    name: "TypeScript",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "#3178C6",
  },
  {
    name: "JavaScript",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    color: "#F7DF1E",
  },
  {
    name: "Node.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    color: "#339933",
  },
  {
    name: "Python",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    color: "#3776AB",
  },
  {
    name: "Tailwind CSS",
    iconUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAPFBMVEX////G6fxsyvk/v/g4vfhhyPmz4vuK1PoAtfckufgvu/hTxPn6/f+h2/tGwPjS7v255fxMwviT1/qn3vsZjXhWAAAAbElEQVR4AeWOCQqAMAwEq11r06b3//9qAwiI0QfowHINC2N+yLJabE53uycgUGTtF11CmDqLLVdZ57iJhSt9V+4cCQB5a1RGJgr9FrrW866GbmpoGylISlNC3RxnsbY+hLbX0GSJIKE6zOajHN4ZA8/fNs9XAAAAAElFTkSuQmCC",
    color: "#38B2AC",
  },
  {
    name: "MongoDB",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    color: "#47A248",
  },
  {
    name: "GraphQL",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    color: "#E10098",
  },
  {
    name: "Azure",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
    color: "#0078D4",
  },
  {
    name: "AWS",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    color: "#FF9900",
  },
  {
    name: "Docker",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    color: "#2496ED",
  },
  {
    name: "Kubernetes",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    color: "#326CE5",
  },
  {
    name: "Azure DevOps",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuredevops/azuredevops-original.svg",
    color: "#0078D7",
  },
];

const stats = {
  websiteVisitors: 12450,
  linkedinFollowers: 852,
  profileViews: 3280,
  projectsCompleted: 15,
  clientSatisfaction: "98%",
  countriesReached: 12,
};

export const Stats = [
  {
    title: "Website Visitors",
    value: stats.websiteVisitors.toLocaleString(),
    icon: "👁️",
    description: "Monthly unique visitors",
    color: "from-[#5E60CE]/20 to-[#7209B7]/20",
  },
  {
    title: "LinkedIn Followers",
    value: stats.linkedinFollowers.toLocaleString(),
    icon: "👥",
    description: "Growing network",
    color: "from-[#7209B7]/20 to-[#5E60CE]/20",
  },
  {
    title: "Profile Views",
    value: stats.profileViews.toLocaleString(),
    icon: "📊",
    description: "Past 90 days",
    color: "from-[#5E60CE]/20 to-[#5E60CE]/10",
  },
  {
    title: "Projects Completed",
    value: stats.projectsCompleted.toString(),
    icon: "🚀",
    description: "Enterprise & startups",
    color: "from-[#7209B7]/20 to-[#7209B7]/10",
  },
  {
    title: "Client Satisfaction",
    value: stats.clientSatisfaction,
    icon: "⭐",
    description: "Average rating",
    color: "from-[#5E60CE]/20 to-[#7209B7]/20",
  },
  {
    title: "Global Reach",
    value: stats.countriesReached.toString(),
    icon: "🌎",
    description: "Countries served",
    color: "from-[#7209B7]/20 to-[#5E60CE]/20",
  },
];
// This file handles fetching statistics from various sources

export const EventsData = [
  {
    id: 1,
    name: "React Advanced Conference",
    host: "TechEvents Global",
    date: "June 15-17, 2025",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    registerLink: "https://reactadvanced.com/register",
    location: "San Francisco, CA",
    skills: ["React", "JavaScript", "Web Development"],
    category: "upcoming",
  },
  {
    id: 2,
    name: "Machine Learning Summit 2025",
    host: "DataScience Foundation",
    date: "July 5-8, 2025",
    image:
      "https://images.unsplash.com/photo-1591779051696-1c3fa6469309?q=80&w=2070&auto=format&fit=crop",
    registerLink: "https://mlsummit.org/register",
    location: "Boston, MA",
    skills: ["Machine Learning", "AI", "Data Science"],
    category: "upcoming",
  },
  {
    id: 3,
    name: "Developer Week Hackathon",
    host: "DeveloperWeek",
    date: "May 12-14, 2025",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2070&auto=format&fit=crop",
    registerLink: "https://developerweek.com/hackathon",
    location: "Online",
    skills: ["Coding", "Problem Solving", "Teamwork"],
    category: "upcoming",
  },
  {
    id: 4,
    name: "Cloud Architecture Summit",
    host: "CloudTech Alliance",
    date: "March 21-23, 2025",
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
    registerLink: null, // Past event, no registration
    location: "Seattle, WA",
    skills: ["Cloud Computing", "Architecture", "DevOps"],
    category: "past",
  },
  {
    id: 5,
    name: "UX/UI Design Workshop",
    host: "Design Masters",
    date: "January 10, 2025",
    image:
      "https://images.unsplash.com/photo-1559223607-a43c990c692c?q=80&w=2070&auto=format&fit=crop",
    registerLink: null, // Past event, no registration
    location: "Chicago, IL",
    skills: ["UI/UX", "Design", "User Research"],
    category: "past",
  },
  {
    id: 6,
    name: "Blockchain & Web3 Conference",
    host: "Decentralized Future",
    date: "August 18-20, 2025",
    image:
      "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2071&auto=format&fit=crop",
    registerLink: "https://blockchain-web3-conf.io/register",
    location: "Miami, FL",
    skills: ["Blockchain", "Web3", "Smart Contracts"],
    category: "upcoming",
  },
];

export const ServicesData = [
  {
    id: 1,
    title: "Full Stack Web Development (MERN)",
    description:
      "Custom web applications built with MongoDB, Express.js, React, and Node.js. Includes responsive design, authentication, and database integration.",
    price: "$2,500 - $10,000",
    timeframe: "4-12 weeks",
    category: "web",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        ></path>
      </svg>
    ),
  },
  {
    id: 2,
    title: "WordPress Development",
    description:
      "Custom WordPress websites with responsive design, SEO optimization, and plugin integration. Perfect for blogs, business sites, or e-commerce stores.",
    price: "$1,200 - $5,000",
    timeframe: "2-6 weeks",
    category: "cms",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Shopify Store Development",
    description:
      "Custom Shopify stores with theme development, product setup, and payment gateway integration. Includes mobile optimization and SEO best practices.",
    price: "$1,500 - $6,000",
    timeframe: "2-8 weeks",
    category: "cms",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        ></path>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Video Editing (DaVinci Resolve)",
    description:
      "Professional video editing services using DaVinci Resolve. Includes color grading, visual effects, audio enhancement, and final export in multiple formats.",
    price: "$300 - $1,500 per video",
    timeframe: "3-14 days",
    category: "video",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        ></path>
      </svg>
    ),
  },
  {
    id: 5,
    title: "Full Stack Development (Django)",
    description:
      "Scalable web applications built with Django and Python. Includes database design, API development, user authentication, and front-end integration.",
    price: "$3,000 - $12,000",
    timeframe: "5-14 weeks",
    category: "web",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
    ),
  },
  {
    id: 6,
    title: "FastAPI Backend Development",
    description:
      "High-performance API development using FastAPI and Python. Perfect for microservices, data-intensive applications, and real-time systems.",
    price: "$2,000 - $8,000",
    timeframe: "3-10 weeks",
    category: "web",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        ></path>
      </svg>
    ),
  },
  {
    id: 7,
    title: "Go Lang (Gin) Backend Development",
    description:
      "Highly efficient and scalable web services built with Go and Gin framework. Ideal for high-traffic applications requiring optimal performance.",
    price: "$3,500 - $15,000",
    timeframe: "4-12 weeks",
    category: "web",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        ></path>
      </svg>
    ),
  },
  {
    id: 8,
    title: "Mobile App Development (React Native)",
    description:
      "Cross-platform mobile applications for iOS and Android using React Native. Includes UI/UX design, API integration, and app store deployment.",
    price: "$4,000 - $15,000",
    timeframe: "6-16 weeks",
    category: "app",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        ></path>
      </svg>
    ),
  },
  {
    id: 9,
    title: "AWS Cloud Solutions & Deployment",
    description:
      "Complete AWS cloud architecture and deployment services. Includes EC2, S3, Lambda, RDS setup, and CloudFront CDN configuration with CI/CD pipelines.",
    price: "$1,500 - $7,000",
    timeframe: "1-6 weeks",
    category: "cloud",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        ></path>
      </svg>
    ),
  },
  {
    id: 10,
    title: "Azure Cloud Solutions",
    description:
      "Microsoft Azure cloud architecture and deployment services. Includes Azure App Service, Functions, SQL Database, Blob Storage, and DevOps setup.",
    price: "$1,800 - $8,000",
    timeframe: "1-6 weeks",
    category: "cloud",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
        ></path>
      </svg>
    ),
  },
  {
    id: 11,
    title: "Flask Web Application Development",
    description:
      "Lightweight web applications built with Flask and Python. Perfect for startups and MVPs requiring quick deployment and flexibility.",
    price: "$2,000 - $7,000",
    timeframe: "3-8 weeks",
    category: "web",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        ></path>
      </svg>
    ),
  },
  {
    id: 12,
    title: "Google Cloud Platform Solutions",
    description:
      "GCP architecture and deployment services. Includes Compute Engine, Cloud Run, Cloud Functions, Firebase integration, and CI/CD setup.",
    price: "$1,600 - $7,500",
    timeframe: "1-6 weeks",
    category: "cloud",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        ></path>
      </svg>
    ),
  },
];

export async function GetStatistics() {
  try {
    // You would normally fetch these from APIs or databases
    // Here are placeholder values for demonstration

    // For a real implementation, you might connect to:
    // 1. LinkedIn API for followers/views
    // 2. Google Analytics for website visitors
    // 3. Your database for project counts

    return {
      websiteVisitors: 12450,
      linkedinFollowers: 852,
      profileViews: 3280,
      projectsCompleted: 15,
    };

    // Example with real LinkedIn API (would need proper authentication)
    /*
    const linkedinData = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    
    // Would need to add more API calls here for other stats
    */
  } catch (error) {
    console.error("Error fetching statistics:", error);

    // Fallback data in case of errors
    return {
      websiteVisitors: 10000,
      linkedinFollowers: 500,
      profileViews: 2000,
      projectsCompleted: 10,
    };
  }
}

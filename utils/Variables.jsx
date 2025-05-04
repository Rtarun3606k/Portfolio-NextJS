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
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
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
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
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
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
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
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
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

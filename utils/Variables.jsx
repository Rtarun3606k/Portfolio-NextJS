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

export const siteConfig = {
  name: "Connor Riley",
  tab: "Portfolio\n",
  title: "Aspiring Software Engineer Actively Seeking New Employment Opportunities\n", //MS in Computer Science - University of Tennessee, 2026", //\nBS in Computer Science - University of Tennessee, 2025
  description: "Portfolio website of Connor Riley",
  accentColor: "#770eb4",
  social: {
    email: "connorpriley@gmail.com",
    linkedin: "https://www.linkedin.com/in/connor-riley-01a209290/",
    github: "https://github.com/Criley71",
  },
  aboutMe:
    "I am a data engineer and software developer, holding an MS in Computer Science from the University of Tennessee. My engineering foundation didn't start in a terminal—it started in the Sheldon Entomology Lab. Originally a microbiology major, I spent my early university years managing complex laboratory data for graduate theses. Wrangling that scientific data sparked a fascination with backend systems and large-scale computation, prompting my full transition into software engineering.Today, I focus on building robust architectures and solving complex algorithmic problems. I enjoy jumping across sectors to tackle hard technical challenges, whether that is building .NET desktop applications to parse gaming hardware requirements, applying evolutionary algorithms to F1 racing lines, or reverse-engineering the FLAC compression algorithm to analyze lossless audio.",
  skills: ["C++", "Python", "Git", "Pytorch", "C#", ".NET", "ReactJS"],
  projects: [
    {
      name: "Steam Game Requirement Checker",
      description:
        "A .NET based hardware scanner to compare your PC hardware against a games listed requirements on Steam",
      link: "https://github.com/Criley71/Steam-Game-Requirement-Checker",
      skills: ["C#", ".NET", "Webscraping", "XAML"],
    },
    {
      name: "Formula 1 Racing Line Analysis Using Evolutionary Algorithms",
      description:
        "Uses the Library for Evolutionary Algorithms in Python for Formula 1 Racing Line Generation and Analysis",
      link: "https://github.com/Criley71/Steam-Game-Requirement-Checker",
      skills: ["Python", "Numpy", "LEAP"],
    },
    {
      name: "FLAC Algorithm Encoding Analysis",
      description:
        "A deep dive into the Free Lossless Audio Codec (FLAC) algorithm and analyzing its performance",
      link: "https://criley71.github.io/FLAC-Analysis-Report/",
      skills: ["Python", "MatPlotLib", "Algorithms"],
    },
  ],
  experience: [
    // {
    //   company: "Tech Company",
    //   title: "Senior Software Engineer",
    //   dateRange: "Jan 2022 - Present",
    //   bullets: [
    //     "Led development of microservices architecture serving 1M+ users",
    //     "Reduced API response times by 40% through optimization",
    //     "Mentored team of 5 junior developers",
    //   ],
    // },
    // {
    //   company: "Startup Inc",
    //   title: "Full Stack Developer",
    //   dateRange: "Jun 2020 - Dec 2021",
    //   bullets: [
    //     "Built and launched MVP product from scratch using React and Node.js",
    //     "Implemented CI/CD pipeline reducing deployment time by 60%",
    //     "Collaborated with product team to define technical requirements",
    //   ],
    // },
    // {
    //   company: "Digital Agency",
    //   title: "Frontend Developer",
    //   dateRange: "Aug 2018 - May 2020",
    //   bullets: [
    //     "Developed responsive web applications for 20+ clients",
    //     "Improved site performance scores by 35% on average",
    //     "Introduced modern JavaScript frameworks to legacy codebases",
    //   ],
    // },
  ],
  education: [
    {
      school: "University of Tennessee",
      degree: "Bachelor of Science in Computer Science",
      dateRange: "2019 - 2025",
      achievements: [
        "3.47/4.00 GPA",
        "Classes: Data Structires and Algorithms, Machine Learning, Systems Programming",
      ],
    },
    {
      school: "University of Tennessee",
      degree: "Master of Science in Computer Science",
      dateRange: "2025-2026",
      achievements: [
        "3.87/4.00 GPA",
        "Classes: Data Engineering, Deep Learning, Software Engineering, Software Security",
      ],
    },
  ],
};

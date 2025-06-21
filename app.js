
  import express from 'express';
  import cors from 'cors';
  import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
  import nodemailer from 'nodemailer';
  import twilio from 'twilio';
  import dotenv from 'dotenv';
  import fs from 'fs';
  import multer from 'multer';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import { dirname } from 'path';

  // Load environment variables
  dotenv.config();

  // Create __dirname equivalent for ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Define upload directory
  const uploadDir = path.join(__dirname, 'uploads');

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
  }

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  // Configure Multer storage
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
      }
  });

  // File filter for allowed file types
  const fileFilter = (req, file, cb) => {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
      } else {
          cb(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'), false);
      }
  };

  // Initialize Multer with limits and file filter
  const upload = multer({
      storage: storage,
      limits: {
          fileSize: 5 * 1024 * 1024 // 5MB limit
      },
      fileFilter: fileFilter
  });

  // API endpoint for resume upload
  app.post('/api/upload-resume', upload.single('resume'), (req, res) => {
      try {
          if (!req.file) {
              return res.status(400).json({ error: 'No file uploaded' });
          }

          // File upload successful
          const fileDetails = {
              filename: req.file.filename,
              originalName: req.file.originalname,
              size: req.file.size,
              mimetype: req.file.mimetype,
              path: req.file.path
          };

          res.status(200).json({
              message: 'Resume uploaded successfully',
              file: fileDetails
          });
      } catch (error) {
          console.error('Upload error:', error);
          res.status(500).json({ error: 'Failed to upload resume' });
      }
  });

  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Basic error handling middleware
  app.use((err, req, res, next) => {
      if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(400).json({ error: 'File size exceeds 5MB limit' });
          }
          return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Internal server error' });
  });

  // Mock job data with corrected IDs
  const jobs = [
    {
      id: 1,
      designation: "Frontend Developer",
      experience: "2 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-05-20",
      description: "Seeking a skilled frontend developer with experience in HTML, CSS, and JavaScript.",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      company: "Tech Innovations Ltd.",
      salary: "₹ 5-7 Lakhs P.A.",
      rating: "4.2",
      reviews: "150 reviews",
      role: "Develop and maintain user-facing features using modern frontend technologies.",
      openings: 1,
      applicants: 50,
      requirements: [
        "We are seeking a highly skilled and experienced FrontEnd Developer to join our team.",

  "The ideal candidate will be responsible for developing and maintaining dynamic web applications while ensuring high performance and responsiveness to requests from the front end. You will work closely with other developers, designers, and stakeholders to deliver cutting-edge solutions",
        "1+ years of full stack development experience",
        "The ideal candidate should be able to build and maintain web applications, write clean code, and work well with a team.",
        "Know about the internet and can-do email, WhatsApp, browse website."
      ],
      img:"https://apna-organization-logos.gumlet.io/production/logos/093948dc-1513-4182-8bd9-3ec5bee3797e/67e5b7667ade36697fa81973.jpg?w=128"
    },
    
    {
      id: 2,
      designation: "Frontend Developer",
      experience: "4 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-05-20",
      description: "Seeking a skilled frontend developer with experience in HTML, CSS, and JavaScript.",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      company: "Tech Innovations Ltd.",
      salary: "₹ 5-7 Lakhs P.A.",
      rating: "4.2",
      reviews: "150 reviews",
      role: "Develop and maintain user-facing features using modern frontend technologies.",
      openings: 1,
      applicants: 50,
    },
    {
      id: 3,
      designation: "Backend Developer",
      experience: "3 years",
      location: "Mumbai",
      type: "Full-Time",
      postedAt: "2025-05-19",
      description: "Responsible for server-side logic and database management.",
      skills: ["Node.js", "Express", "MongoDB", "REST API"],
      company: "CodeCrafters Inc.",
      salary: "₹ 8-10 Lakhs P.A.",
      rating: "4.0",
      reviews: "200 reviews",
      role: "Build and maintain server-side applications and APIs.",
      openings: 2,
      applicants: 75,
    },
    {
      id: 4,
      designation: "Backend Developer",
      experience: "1 year",
      location: "Mumbai",
      type: "Full-Time",
      postedAt: "2025-05-19",
      description: "Responsible for server-side logic and database management.",
      skills: ["Node.js", "Express", "MongoDB", "REST API"],
      company: "CodeCrafters Inc.",
      salary: "₹ 8-10 Lakhs P.A.",
      rating: "4.0",
      reviews: "200 reviews",
      role: "Build and maintain server-side applications and APIs.",
      openings: 2,
      applicants: 75,
    },
    {
      id: 5,
      designation: "Full Stack Developer",
      experience: "4 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-05-18",
      description: "Work on both frontend and backend technologies.",
      skills: ["React", "Node.js", "MongoDB", "HTML", "CSS"],
      company: "NextGen Solutions",
      salary: "₹ 10-15 Lakhs P.A.",
      rating: "4.5",
      reviews: "300 reviews",
      role: "Develop full-stack applications, integrating frontend and backend technologies.",
      openings: 3,
      applicants: 100,
    },
    {
      id: 6,
      designation: "Full Stack Developer",
      experience: "1 year",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-05-18",
      description: "Work on both frontend and backend technologies.",
      skills: ["React", "Node.js", "MongoDB", "HTML", "CSS"],
      company: "NextGen Solutions",
      salary: "₹ 10-15 Lakhs P.A.",
      rating: "4.5",
      reviews: "300 reviews",
      role: "Develop full-stack applications, integrating frontend and backend technologies.",
      openings: 3,
      applicants: 100,
    },
    {
      id: 7,
      designation: "UI/UX Designer",
      experience: "1 year",
      location: "Pune",
      type: "Full-Time",
      postedAt: "2025-05-17",
      description: "Design intuitive user interfaces and improve user experience.",
      skills: ["Figma", "Sketch", "Adobe XD", "User Research"],
      company: "Creative Designs Pvt. Ltd.",
      salary: "₹ 3-5 Lakhs P.A.",
      rating: "3.8",
      reviews: "80 reviews",
      role: "Create wireframes, prototypes, and design user interfaces.",
      img: 'https://apna-organization-logos.gumlet.io/production/logos/d5501838-8576-415d-8a46-48f63f973042/IMG_2636.png?w=128',
    requirements: [
        " 1+ years of experience in UI/UX design with a focus on websites, SaaS platforms, or dashboards.",
        " A portfolio that showcases both platform/interface design and creative marketing work (image posts, reels, etc.).",
        "Strong command of Figma, Adobe Creative Suite, Canva, and and similar tools.",
        " Understanding of responsive design, accessibility, and basic HTML/CSS principles (coding not required but a plus).",
        "Ability to switch contexts between B2B structure and B2C emotion seamlessly."
      ],
      openings: 1,
      applicants: 40,
    },
    {
      id: 8,
      designation: "UI/UX Designer",
      experience: "4 years",
      location: "Pune",
      type: "Part-Time",
      postedAt: "2025-05-17",
      description: "Design intuitive user interfaces and improve user experience.",
      skills: ["Figma", "Sketch", "Adobe XD", "User Research"],
      company: "Creative Designs Pvt. Ltd.",
      salary: "₹ 3-5 Lakhs P.A.",
      rating: "3.8",
      reviews: "80 reviews",
      role: "Create wireframes, prototypes, and design user interfaces.",
      openings: 1,
      applicants: 40,
    },
    {
      id: 9,
      designation: "DevOps Engineer",
      experience: "4 years",
      location: "Hyderabad",
      type: "Full-Time",
      postedAt: "2025-05-16",
      description: "Implement CI/CD pipelines and manage cloud infrastructure.",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      company: "CloudMasters Inc.",
      salary: "₹ 12-18 Lakhs P.A.",
      rating: "4.3",
      reviews: "250 reviews",
      role: "Manage infrastructure and automate deployment processes.",
      openings: 2,
      applicants: 90,
    },
    {
      id: 10,
      designation: "QA Engineer",
      experience: "2 years",
      location: "Noida",
      type: "Full-Time",
      postedAt: "2025-05-15",
      description: "Responsible for ensuring software quality and reliability.",
      skills: ["Selenium", "Manual Testing", "Postman", "JIRA"],
      company: "QualityAssure Ltd.",
      salary: "₹ 4-6 Lakhs P.A.",
      rating: "3.9",
      reviews: "120 reviews",
      role: "Perform manual and automated testing to ensure software quality.",
      openings: 1,
      applicants: 60,
    },
    {
      id: 11,
      designation: "Project Manager",
      experience: "4 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-05-14",
      description: "Oversee software projects from planning to execution.",
      skills: ["Agile", "Scrum", "Project Planning", "Leadership"],
      company: "ProManage Solutions",
      salary: "₹ 15-20 Lakhs P.A.",
      rating: "4.1",
      reviews: "180 reviews",
      role: "Basic Computer Knowledge. Typing Speed and Accuracy. Basic knowledge of Digital Marketing will be added advantage. Understanding the Content and updating Text, Image, Videos in the business profiles of social media accounts on day to day basis. Replying to the comments. Managing and Organizing the data of Company.",
      openings: 1,
      applicants: 30,
    },
    {
      id: 12,
      designation: "Data Scientist",
      experience: "2 years",
      location: "Kolkata",
      type: "Full-Time",
      postedAt: "2025-05-13",
      description: "Analyze data and build predictive models.",
      skills: ["Python", "Machine Learning", "Pandas", "Scikit-learn"],
      company: "DataInsights Pvt. Ltd.",
      salary: "₹ 9-12 Lakhs P.A.",
      rating: "4.0",
      reviews: "160 reviews",
      role: "Analyze data and develop machine learning models.",
      openings: 2,
      applicants: 85,
    },
    {
      id: 13,
      designation: "ML Engineer",
      experience: "2 years",
      location: "Ahmedabad",
      type: "Full-Time",
      postedAt: "2025-05-12",
      description: "Build machine learning pipelines for various applications.",
      skills: ["Python", "TensorFlow", "ML Models", "Data Preprocessing"],
      company: "AI Pioneers Ltd.",
      salary: "₹ 6-8 Lakhs P.A.",
      rating: "3.7",
      reviews: "90 reviews",
      role: "Develop and deploy machine learning models.",
      openings: 1,
      applicants: 45,
    },
    {
      id: 14,
      designation: "Product Manager",
      experience: "7 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-05-11",
      description: "Define product vision and coordinate with cross-functional teams.",
      skills: ["Product Strategy", "Roadmapping", "Stakeholder Communication"],
      company: "Visionary Products Inc.",
      salary: "₹ 18-25 Lakhs P.A.",
      rating: "4.4",
      reviews: "220 reviews",
      role: "Lead product development and strategy.",
      openings: 1,
      applicants: 20,
    },
    {
      id: 15,
      designation: "Back Office Executive (Neelankarai)",
      experience: "0-1 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-05-20",
      description: "Handle back-office operations and data management.",
      skills: ["Data Entry", "Basic Computer Skills"],
      company: "Cameo Corporate Services",
      salary: "₹ 2-3 Lakhs P.A.",
      rating: "3.4",
      reviews: "206 reviews",
      role: "Manage data entry and administrative tasks.",
      openings: 5,
      applicants: 120,
    },
    {
      id: 16,
      designation: "Data Entry (Fresher)",
      experience: "0 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-05-14",
      description: "Entry-level data entry role for freshers.",
      skills: ["Typing", "Accuracy"],
      company: "Rapid Care",
      salary: "₹ 1.5-2.5 Lakhs P.A.",
      rating: "4.4",
      reviews: "104 reviews",
      role: "Perform data entry tasks with high accuracy.",
      openings: 10,
      applicants: 200,
    },
    {
      id: 17,
      designation: "Data Entry (Fresher)",
      experience: "0 years",
      location: "Chennai",
      type: "Part time",
      postedAt: "2025-05-14",
      description: "Part time data entry role for freshers.",
      skills: ["Typing", "Accuracy"],
      company: "Rapid Care",
      salary: "₹ 1.5-2.5 Lakhs P.A.",
      rating: "4.4",
      reviews: "104 reviews",
      role: "Perform data entry tasks with high accuracy.",
      openings: 10,
      applicants: 200,
    },
    {
      id: 18,
      designation: "International Non Voice Process",
      experience: "1-2 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-05-12",
      description: "Handle non-voice customer support processes.",
      skills: ["Communication", "Data Management"],
      company: "Niftany Creative Services",
      salary: "₹ 2-4 Lakhs P.A.",
      rating: "3.5",
      reviews: "61 reviews",
      role: "Support international clients through non-voice channels.",
      openings: 3,
      applicants: 80,
    },
    {
      id: 19,
      designation: "Back Office Assistant Lady",
      experience: "0-1 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-05-07",
      description: "Assist with back-office tasks, female candidates preferred.",
      skills: ["Organization", "Basic Computer Skills"],
      company: "Headphonezone Private Limited",
      salary: "₹ 1.8-2.8 Lakhs P.A.",
      rating: "2.1",
      reviews: "8 reviews",
      role: "Assist in administrative and back-office duties.",
      openings: 2,
      applicants: 50,
    },
    {
      id: 20,
      designation: "Frontend Developer",
      experience: "3 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-05-19",
      description: "We are looking for a talented and detail-oriented Front-End Developer with strong experience in React.js with Redux. The ideal candidate will collaborate with UI/UX designers, product managers, and back-end developers to build modern, scalable, and user-friendly web applications.",
      skills: ["HTML", "CSS", "JavaScript", "Vue"],
      company: "WebCraft Solutions",
      salary: "₹ 6-8 Lakhs P.A.",
      rating: "4.0",
      reviews: "120 reviews",
      role: "Develop responsive and user-friendly web interfaces.",
      openings: 2,
      applicants: 60,
      img:"https://apna-organization-logos.gumlet.io/production/logos/939e6db3-40a5-4207-9b9b-a6a7a3f3e8f4/65d3516fb2c35a9b48d2bc32.jpeg?w=128",
      requirements: [
        "Develop responsive and high-performance web interfaces using React.js with Redux.",
        "Collaborate with designers to translate Figma mock-ups into clean, maintainable code.",
        "Integrate front-end components with RESTful APIs.",
        "Write clean, reusable, and well-documented code.",
          "Optimize application for maximum speed and scalability. Participate in code reviews, team meetings, and sprint planning."
      ],
    },
    {
      id: 21,
      designation: "International Non Voice Process",
      experience: "1-2 years",
      location: "Mumbai",
      type: "Full-Time",
      postedAt: "2025-05-12",
      description: "Handle non-voice customer support processes.",
      skills: ["Communication", "Data Management"],
      company: "Niftany Creative Services",
      salary: "₹ 2-4 Lakhs P.A.",
      rating: "3.5",
      reviews: "61 reviews",
      role: "Support international clients through non-voice channels.",
      openings: 3,
      applicants: 80,
    },



    {
      id: 22,
      designation: "UI/UX Designer",
      experience: "2 years",
      location: "Pune",
      type: "Word from office",
      postedAt: "2025-11-17",
      description: "Develop engaging UI components focused on usability and smooth user interaction.",
      skills: ["Figma", "Wordpress", "Javascript", "User Research"],
      company: "Wayfarer E Commerce pvt ltd.",
      salary: "₹ 0-1 Lakhs P.A.",
      rating: "5.8",
      reviews: "40 reviews",
      role: "Create wireframes, prototypes, and design user interfaces.",
      openings: 1,
      img: 'https://apna-organization-logos.gumlet.io/production/logos/d5501838-8576-415d-8a46-48f63f973042/IMG_2636.png?w=128',

      applicants: 40,
    },
    {
      id: 23,
      designation: "UI/UX Designer",
      experience: "2 years",
      location: "Pune",
      type: "Word from field",
      postedAt: "2021-05-17",
      description: "Create seamless and user-friendly interfaces to enhance overall user satisfaction.",
      skills: ["Figma", "Sketch", "Html", "Css"],
      company: "Bizzonline.",
      salary: "₹ 1-2 Lakhs P.A.",
      rating: "3.2",
      reviews: "20 reviews",
      role: "Create wireframes, prototypes, and design user interfaces.",
      openings: 1,
    img: 'https://apna-organization-logos.gumlet.io/production/363418-33353237-3661-6234-3139-386364336265?w=128',

      applicants: 40,
    },
    {
      id: 24,
      designation: "UI/UX Designer",
      experience: "1 year",
      location: "Pune",
      type: "Full-Time",
      postedAt: "2025-05-17",
      description: "ssHiring freshers for digital marketing activities who want to kick start their career. Candidates will learn SEO and other digital marketing tactics.",
      skills: ["Figma", "Sketch", "Adobe XD", "User Research"],
      responsibilities: "Task will be assigned by team leader or manager on daily basis which included the submission, classified submission, bookmarking, content posting, social media postings etc.",
      company: "Creative Designs Pvt. Ltd.",
      salary: "₹ 3-5 Lakhs P.A.",
      rating: "3.8",
      reviews: "80 reviews",
      img: 'https://apna-organization-logos.gumlet.io/production/logos/ad57f0c5-d0fa-4e97-9549-7feb9478f2f1/svt.PNG?w=128',

      role: "Create wireframes, prototypes, and design user interfaces.",
      openings: 5,
      requirements: [
        "Must have a bachelor's degree or pursuing a bachelor's degree (final year/last semester).",
        "Must be proficient in using MS Office applications like MS Word, MS Excel, MS PowerPoint etc.",
        "Read and Speak English.",
        "Know about the internet and can-do email, WhatsApp, browse website."
      ],
      openings: 1,
      applicants: 40,
    },
      {
      id: 23,
      designation: "Frontend Developer",
      experience: "2 years",
      location: "Delhi",
      type: "Work from home",
      postedAt: "2021-05-20",
      description: "Seeking a skilled frontend developer with experience in HTML, CSS, JavaScript and Nextjs",
      skills: ["HTML", "CSS", "JavaScript", "React" , "Nextjs"],
      company: "Vedanta Pvt Ltd.",
      salary: "₹ 5-7 Lakhs P.A.",
      rating: "8.2",
      reviews: "180 reviews",
      role: "Develop and maintain user-facing features using modern frontend technologies and a little bit backend also.",
      openings: 2,
      applicants: 10,
      requirements: [
        "We are seeking a highly skilled and experienced FrontEnd Developer to join our team.",

  "The ideal candidate will be responsible for developing and maintaining dynamic web applications while ensuring high performance and responsiveness to requests from the front end. You will work closely with other developers, designers, and stakeholders to deliver cutting-edge solutions",
        "1+ years of full stack development experience",
        "The ideal candidate should be able to build and maintain web applications, write clean code, and work well with a team.",
        "Know about the internet and can-do email, WhatsApp, browse website."
      ],
      img:"https://apna-organization-logos.gumlet.io/production/logos/22d31db3-8432-4ce3-ab09-55b422d8bb55/R%20logo.jpg?w=128"
    },

    {
      id: 25,
      designation: "Frontend Developer",
      experience: "0 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-05-20",
      description: "Seeking a skilled frontend developer with experience in HTML, CSS, and JavaScript.",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      company: "Tech Innovations Ltd.",
      salary: "₹ 5-7 Lakhs P.A.",
      rating: "4.2",
      reviews: "150 reviews",
      role: "Develop and maintain user-facing features using modern frontend technologies.",
      openings: 1,
      applicants: 50,
      requirements: [
        "We are seeking a highly skilled and experienced FrontEnd Developer to join our team.",

  "The ideal candidate will be responsible for developing and maintaining dynamic web applications while ensuring high performance and responsiveness to requests from the front end. You will work closely with other developers, designers, and stakeholders to deliver cutting-edge solutions",
        "1+ years of full stack development experience",
        "The ideal candidate should be able to build and maintain web applications, write clean code, and work well with a team.",
        "Know about the internet and can-do email, WhatsApp, browse website."
      ],
      img:"https://apna-organization-logos.gumlet.io/production/logos/093948dc-1513-4182-8bd9-3ec5bee3797e/67e5b7667ade36697fa81973.jpg?w=128"
    },
      {
      id: 28,
      designation: "AI Research Scientist",
      experience: "5 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-06-03",
      description: "Develop advanced AI models for real-world applications.",
      skills: ["Python", "TensorFlow", "Deep Learning", "NLP"],
      company: "AI Innovations Ltd.",
      salary: "₹ 20-25 Lakhs P.A.",
      rating: "4.5",
      reviews: "280 reviews",
      role: "Research and implement cutting-edge AI algorithms.",
      openings: 1,
      applicants: 40,
      requirements: [
        "5+ years in AI/ML research or development.",
        "Experience with PyTorch or TensorFlow.",
        "Published papers in AI conferences are a plus.",
        "Strong problem-solving skills."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/ai-innovations.jpg?w=128"
    },
    {
      id: 29,
      designation: "Graphic Designer",
      experience: "2 years",
      location: "Mumbai",
      type: "Full-Time",
      postedAt: "2025-06-04",
      description: "Create visually appealing designs for marketing campaigns.",
      skills: ["Photoshop", "Illustrator", "Canva", "Branding"],
      company: "Creative Minds Studio",
      salary: "₹ 4-6 Lakhs P.A.",
      rating: "3.8",
      reviews: "90 reviews",
      role: "Design graphics for digital and print media.",
      openings: 2,
      applicants: 70,
      requirements: [
        "2+ years of graphic design experience.",
        "Proficiency in Adobe Creative Suite.",
        "Strong portfolio showcasing creative work.",
        "Knowledge of typography and color theory."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/creative-minds.jpg?w=128"
    },
    {
      id: 30,
      designation: "Customer Support Executive",
      experience: "0 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-06-05",
      description: "Assist customers with queries and complaints.",
      skills: ["Communication", "Problem Solving", "CRM Tools"],
      company: "CareConnect Services",
      salary: "₹ 2-3 Lakhs P.A.",
      rating: "3.6",
      reviews: "110 reviews",
      role: "Provide excellent customer service via phone and email.",
      openings: 10,
      applicants: 200,
      requirements: [
        "Good communication skills in English and Hindi.",
        "Basic computer knowledge.",
        "Ability to handle customer issues calmly."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/careconnect.jpg?w=128"
    },
    {
      id: 31,
      designation: "Cloud Architect",
      experience: "6 years",
      location: "Hyderabad",
      type: "Full-Time",
      postedAt: "2025-06-06",
      description: "Design and manage cloud infrastructure solutions.",
      skills: ["AWS", "Azure", "Terraform", "Cloud Security"],
      company: "CloudWave Technologies",
      salary: "₹ 18-22 Lakhs P.A.",
      rating: "4.3",
      reviews: "220 reviews",
      role: "Architect scalable and secure cloud environments.",
      openings: 1,
      applicants: 35,
      requirements: [
        "6+ years in cloud architecture or engineering.",
        "Expertise in AWS or Azure certifications.",
        "Experience with Infrastructure as Code.",
        "Strong understanding of cloud security."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/cloudwave.jpg?w=128"
    },
    {
      id: 32,
      designation: "Digital Marketing Specialist",
      experience: "3 years",
      location: "Delhi",
      type: "Work from home",
      postedAt: "2025-06-07",
      description: "Plan and execute digital marketing campaigns.",
      skills: ["SEO", "Google Ads", "Social Media Marketing", "Analytics"],
      company: "GrowEasy Digital",
      salary: "₹ 5-8 Lakhs P.A.",
      rating: "4.0",
      reviews: "130 reviews",
      role: "Optimize online presence through SEO and paid ads.",
      openings: 2,
      applicants: 80,
      requirements: [
        "3+ years in digital marketing.",
        "Experience with Google Analytics and SEMrush.",
        "Strong understanding of social media platforms.",
        "Creative campaign planning skills."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/groweasy.jpg?w=128"
    },
    {
      id: 33,
      designation: "Mobile App Developer",
      experience: "4 years",
      location: "Pune",
      type: "Full-Time",
      postedAt: "2025-06-08",
      description: "Develop and maintain mobile applications for iOS and Android.",
      skills: ["Flutter", "React Native", "Swift", "Kotlin"],
      company: "AppCraft Solutions",
      salary: "₹ 8-12 Lakhs P.A.",
      rating: "4.2",
      reviews: "160 reviews",
      role: "Build user-friendly mobile apps with cross-platform frameworks.",
      openings: 3,
      applicants: 90,
      requirements: [
        "4+ years in mobile app development.",
        "Proficiency in Flutter or React Native.",
        "Experience with REST APIs and third-party libraries.",
        "Published apps on App Store or Play Store."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/appcraft.jpg?w=128"
    },
    {
      id: 34,
      designation: "HR Executive",
      experience: "1 year",
      location: "Noida",
      type: "Full-Time",
      postedAt: "2025-06-09",
      description: "Manage recruitment and employee relations.",
      skills: ["Recruitment", "Employee Engagement", "HRMS", "Communication"],
      company: "PeopleFirst Solutions",
      salary: "₹ 3-5 Lakhs P.A.",
      rating: "3.7",
      reviews: "100 reviews",
      role: "Handle hiring processes and employee onboarding.",
      openings: 2,
      applicants: 60,
      requirements: [
        "1+ years in HR or recruitment.",
        "Familiarity with HR software like Zoho People.",
        "Strong interpersonal skills.",
        "Knowledge of labor laws is a plus."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/peoplefirst.jpg?w=128"
    },
    {
      id: 35,
      designation: "Blockchain Developer",
      experience: "3 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-06-10",
      description: "Build decentralized applications using blockchain technology.",
      skills: ["Solidity", "Ethereum", "Smart Contracts", "Web3.js"],
      company: "ChainTech Innovations",
      salary: "₹ 12-16 Lakhs P.A.",
      rating: "4.4",
      reviews: "190 reviews",
      role: "Develop and deploy blockchain-based solutions.",
      openings: 1,
      applicants: 50,
      requirements: [
        "3+ years in blockchain development.",
        "Experience with Solidity and Ethereum.",
        "Understanding of cryptographic principles.",
        "Familiarity with DApp development."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/chaintech.jpg?w=128"
    },
    {
      id: 36,
      designation: "Video Editor",
      experience: "2 years",
      location: "Mumbai",
      type: "Part-Time",
      postedAt: "2025-06-11",
      description: "Edit videos for social media and promotional content.",
      skills: ["Premiere Pro", "After Effects", "Storytelling", "Color Grading"],
      company: "VisualVibe Studio",
      salary: "₹ 3-4 Lakhs P.A.",
      rating: "3.9",
      reviews: "70 reviews",
      role: "Create engaging video content for various platforms.",
      openings: 2,
      applicants: 55,
      requirements: [
        "2+ years in video editing.",
        "Proficiency in Adobe Premiere Pro and After Effects.",
        "Strong sense of visual storytelling.",
        "Portfolio of edited videos required."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/visualvibe.jpg?w=128"
    },
    {
      id: 37,
      designation: "Sales Executive",
      experience: "1 year",
      location: "Kolkata",
      type: "Full-Time",
      postedAt: "2025-06-12",
      description: "Drive sales through client interactions and lead generation.",
      skills: ["Sales", "Negotiation", "CRM", "Lead Generation"],
      company: "GrowFast Enterprises",
      salary: "₹ 2.5-4 Lakhs P.A.",
      rating: "3.5",
      reviews: "80 reviews",
      role: "Meet sales targets and build client relationships.",
      openings: 5,
      applicants: 120,
      requirements: [
        "1+ years in sales or business development.",
        "Strong communication and negotiation skills.",
        "Familiarity with CRM tools like Salesforce.",
        "Ability to work in a target-driven environment."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/growfast.jpg?w=128"
    },
    {
      id: 38,
      designation: "Game Developer",
      experience: "4 years",
      location: "Pune",
      type: "Full-Time",
      postedAt: "2025-06-13",
      description: "Develop interactive games for mobile and PC platforms.",
      skills: ["Unity", "C#", "Unreal Engine", "3D Modeling"],
      company: "GameZone Creations",
      salary: "₹ 7-10 Lakhs P.A.",
      rating: "4.1",
      reviews: "140 reviews",
      role: "Design and code engaging gaming experiences.",
      openings: 2,
      applicants: 75,
      requirements: [
        "4+ years in game development.",
        "Expertise in Unity or Unreal Engine.",
        "Experience with 2D/3D game assets.",
        "Published games are a plus."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/gamezone.jpg?w=128"
    },
    {
      id: 39,
      designation: "Operations Manager",
      experience: "6 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-06-14",
      description: "Oversee daily operations and optimize processes.",
      skills: ["Process Optimization", "Team Management", "ERP", "Analytics"],
      company: "OptiCore Solutions",
      salary: "₹ 15-20 Lakhs P.A.",
      rating: "4.3",
      reviews: "200 reviews",
      role: "Ensure efficient operations and team performance.",
      openings: 1,
      applicants: 30,
      requirements: [
        "6+ years in operations management.",
        "Experience with ERP systems like SAP.",
        "Strong leadership and analytical skills.",
        "Proven track record in process improvement."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/opticore.jpg?w=128"
    },
    {
      id: 40,
      designation: "AR/VR Developer",
      experience: "3 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-06-15",
      description: "Create immersive AR/VR experiences for various applications.",
      skills: ["Unity", "C#", "ARCore", "VR SDKs"],
      company: "RealityTech Labs",
      salary: "₹ 10-14 Lakhs P.A.",
      rating: "4.2",
      reviews: "150 reviews",
      role: "Develop AR/VR applications for education and entertainment.",
      openings: 2,
      applicants: 60,
      requirements: [
        "3+ years in AR/VR development.",
        "Proficiency in Unity and AR/VR SDKs.",
        "Experience with 3D modeling tools.",
        "Portfolio of AR/VR projects preferred."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/realitytech.jpg?w=128"
    },
    {
      id: 41,
      designation: "Social Media Manager",
      experience: "2 years",
      location: "Remote",
      type: "Work from home",
      postedAt: "2025-06-16",
      description: "Manage social media accounts and create engaging content.",
      skills: ["Content Creation", "Social Media Analytics", "Hootsuite", "Canva"],
      company: "ConnectSphere Media",
      salary: "₹ 4-6 Lakhs P.A.",
      rating: "3.9",
      reviews: "85 reviews",
      role: "Grow social media presence through strategic campaigns.",
      openings: 3,
      applicants: 100,
      requirements: [
        "2+ years in social media management.",
        "Experience with platforms like Instagram and LinkedIn.",
        "Strong content creation and analytical skills.",
        "Familiarity with scheduling tools."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/connectsphere.jpg?w=128"
    },
    {
      id: 42,
      designation: "Network Engineer",
      experience: "4 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-06-17",
      description: "Manage and optimize network infrastructure.",
      skills: ["Cisco", "Routing", "Switching", "Network Security"],
      company: "NetCore Technologies",
      salary: "₹ 8-11 Lakhs P.A.",
      rating: "4.0",
      reviews: "170 reviews",
      role: "Ensure reliable and secure network operations.",
      openings: 2,
      applicants: 55,
      requirements: [
        "4+ years in network engineering.",
        "Cisco certifications like CCNA or CCNP.",
        "Experience with firewalls and VPNs.",
        "Strong troubleshooting skills."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/netcore.jpg?w=128"
    },
    {
      id: 43,
      designation: "Technical Writer",
      experience: "2 years",
      location: "Hyderabad",
      type: "Full-Time",
      postedAt: "2025-06-18",
      description: "Create user manuals and technical documentation.",
      skills: ["Technical Writing", "Markdown", "API Documentation", "Confluence"],
      company: "TechDocs Solutions",
      salary: "₹ 5-7 Lakhs P.A.",
      rating: "3.8",
      reviews: "95 reviews",
      role: "Write clear and concise technical content.",
      openings: 2,
      applicants: 65,
      requirements: [
        "2+ years in technical writing.",
        "Experience with tools like MadCap Flare.",
        "Ability to simplify complex technical concepts.",
        "Familiarity with Agile workflows."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/techdocs.jpg?w=128"
    },
    {
      id: 44,
      designation: "Business Analyst",
      experience: "3 years",
      location: "Gurgaon",
      type: "Full-Time",
      postedAt: "2025-06-19",
      description: "Analyze business processes and recommend solutions.",
      skills: ["Requirements Gathering", "JIRA", "SQL", "Visio"],
      company: "GrowSmart Consulting",
      salary: "₹ 7-10 Lakhs P.A.",
      rating: "4.1",
      reviews: "120 reviews",
      role: "Bridge the gap between business needs and technical solutions.",
      openings: 2,
      applicants: 70,
      requirements: [
        "3+ years in business analysis.",
        "Proficiency in SQL and process modeling.",
        "Experience with Agile/Scrum methodologies.",
        "Strong stakeholder communication skills."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/growsmart.jpg?w=128"
    },
    {
      id: 45,
      designation: "SEO Analyst",
      experience: "1 year",
      location: "Remote",
      type: "Work from home",
      postedAt: "2025-06-20",
      description: "Optimize websites for search engine rankings.",
      skills: ["SEO", "Keyword Research", "Google Analytics", "Ahrefs"],
      company: "RankUp Digital",
      salary: "₹ 3-5 Lakhs P.A.",
      rating: "3.7",
      reviews: "60 reviews",
      role: "Improve organic search performance through SEO strategies.",
      openings: 3,
      applicants: 90,
      requirements: [
        "1+ years in SEO or digital marketing.",
        "Familiarity with tools like SEMrush or Moz.",
        "Understanding of on-page and off-page SEO.",
        "Analytical mindset for performance tracking."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/rankup.jpg?w=128"
    },
    {
      id: 46,
      designation: "Database Administrator",
      experience: "5 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-06-21",
      description: "Manage and optimize database systems.",
      skills: ["SQL", "MySQL", "Oracle", "Database Tuning"],
      company: "DataSafe Technologies",
      salary: "₹ 10-15 Lakhs P.A.",
      rating: "4.2",
      reviews: "180 reviews",
      role: "Ensure database performance, security, and backups.",
      openings: 1,
      applicants: 45,
      requirements: [
        "5+ years in database administration.",
        "Expertise in MySQL or Oracle.",
        "Experience with database optimization.",
        "Knowledge of cloud databases like RDS."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/datasafe.jpg?w=128"
    },
    {
      id: 47,
      designation: "Event Coordinator",
      experience: "2 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-06-22",
      description: "Plan and manage corporate and social events.",
      skills: ["Event Planning", "Budget Management", "Vendor Coordination", "Communication"],
      company: "EventSpark Solutions",
      salary: "₹ 4-6 Lakhs P.A.",
      rating: "3.9",
      reviews: "75 reviews",
      role: "Organize seamless events from planning to execution.",
      openings: 2,
      applicants: 80,
      requirements: [
        "2+ years in event management.",
        "Strong organizational and multitasking skills.",
        "Experience with vendor negotiations.",
        "Ability to work under tight deadlines."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/eventspark.jpg?w=128"
    },
    {
      id: 48,
      designation: "Embedded Systems Engineer",
      experience: "4 years",
      location: "Hyderabad",
      type: "Full-Time",
      postedAt: "2025-06-23",
      description: "Develop firmware for embedded devices.",
      skills: ["C", "C++", "RTOS", "Microcontrollers"],
      company: "TechEmbed Innovations",
      salary: "₹ 8-12 Lakhs P.A.",
      rating: "4.0",
      reviews: "130 reviews",
      role: "Design and test embedded software solutions.",
      openings: 2,
      applicants: 60,
      requirements: [
        "4+ years in embedded systems development.",
        "Proficiency in C/C++ and RTOS.",
        "Experience with hardware debugging tools.",
        "Knowledge of IoT protocols is a plus."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/techembed.jpg?w=128"
    },
    {
      id: 49,
      designation: "Copywriter",
      experience: "1 year",
      location: "Mumbai",
      type: "Full-Time",
      postedAt: "2025-06-24",
      description: "Write compelling copy for advertisements and campaigns.",
      skills: ["Copywriting", "Creative Writing", "Brand Voice", "Proofreading"],
      company: "AdWords Agency",
      salary: "₹ 3-5 Lakhs P.A.",
      rating: "3.8",
      reviews: "65 reviews",
      role: "Craft persuasive copy for marketing materials.",
      openings: 2,
      applicants: 70,
      requirements: [
        "1+ years in copywriting or content creation.",
        "Strong portfolio of ad copy or campaigns.",
        "Ability to adapt to different brand voices.",
        "Excellent grammar and editing skills."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/adwords.jpg?w=128"
    },
    {
      id: 50,
      designation: "IT Support Specialist",
      experience: "2 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-06-25",
      description: "Provide technical support for hardware and software issues.",
      skills: ["Troubleshooting", "Windows", "Linux", "Ticketing Systems"],
      company: "TechAid Solutions",
      salary: "₹ 4-6 Lakhs P.A.",
      rating: "3.9",
      reviews: "110 reviews",
      role: "Resolve IT issues and maintain systems.",
      openings: 3,
      applicants: 85,
      requirements: [
        "2+ years in IT support or helpdesk.",
        "Familiarity with Windows and Linux OS.",
        "Experience with tools like ServiceNow.",
        "Strong problem-solving skills."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/techaid.jpg?w=128"
    },
    {
      id: 51,
      designation: "Financial Analyst",
      experience: "3 years",
      location: "Gurgaon",
      type: "Full-Time",
      postedAt: "2025-06-26",
      description: "Analyze financial data and prepare reports.",
      skills: ["Excel", "Financial Modeling", "Tableau", "Budgeting"],
      company: "WealthGrow Advisors",
      salary: "₹ 7-10 Lakhs P.A.",
      rating: "4.1",
      reviews: "140 reviews",
      role: "Support financial planning and forecasting.",
      openings: 2,
      applicants: 65,
      requirements: [
        "3+ years in financial analysis.",
        "Proficiency in Excel and financial modeling.",
        "Experience with BI tools like Tableau.",
        "Strong analytical and reporting skills."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/wealthgrow.jpg?w=128"
    },
    {
      id: 52,
      designation: "E-commerce Manager",
      experience: "4 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-06-27",
      description: "Manage online store operations and sales strategies.",
      skills: ["Shopify", "Amazon Seller Central", "Digital Marketing", "Inventory Management"],
      company: "ShopTrendy Pvt. Ltd.",
      salary: "₹ 8-12 Lakhs P.A.",
      rating: "4.0",
      reviews: "120 reviews",
      role: "Drive e-commerce growth and optimize platforms.",
      openings: 1,
      applicants: 50,
      requirements: [
        "4+ years in e-commerce management.",
        "Experience with Shopify or Magento.",
        "Strong understanding of digital marketing.",
        "Ability to manage inventory and logistics."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/shoptrendy.jpg?w=128"
    },
    {
      id: 53,
      designation: "Motion Graphics Designer",
      experience: "2 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-06-28",
      description: "Create animated graphics for videos and presentations.",
      skills: ["After Effects", "Cinema 4D", "Animation", "Storyboarding"],
      company: "MotionCraft Studio",
      salary: "₹ 5-7 Lakhs P.A.",
      rating: "3.9",
      reviews: "80 reviews",
      role: "Produce engaging motion graphics for media projects.",
      openings: 2,
      applicants: 60,
      requirements: [
        "2+ years in motion graphics or animation.",
        "Proficiency in After Effects and Cinema 4D.",
        "Strong portfolio of animation work.",
        "Ability to collaborate with video editors."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/motioncraft.jpg?w=128"
    },
    {
      id: 54,
      designation: "Supply Chain Analyst",
      experience: "3 years",
      location: "Mumbai",
      type: "Full-Time",
      postedAt: "2025-06-29",
      description: "Optimize supply chain processes and reduce costs.",
      skills: ["Supply Chain Management", "SAP", "Excel", "Data Analysis"],
      company: "LogiCore Solutions",
      salary: "₹ 6-9 Lakhs P.A.",
      rating: "4.0",
      reviews: "110 reviews",
      role: "Analyze and improve supply chain efficiency.",
      openings: 2,
      applicants: 70,
      requirements: [
        "3+ years in supply chain or logistics.",
        "Experience with SAP or Oracle SCM.",
        "Strong data analysis skills in Excel.",
        "Knowledge of inventory management."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/logicore.jpg?w=128"
    },
    {
      id: 55,
      designation: "Robotics Engineer",
      experience: "4 years",
      location: "Pune",
      type: "Full-Time",
      postedAt: "2025-06-30",
      description: "Design and develop robotic systems for automation.",
      skills: ["ROS", "Python", "C++", "Mechatronics"],
      company: "RoboTech Innovations",
      salary: "₹ 10-14 Lakhs P.A.",
      rating: "4.3",
      reviews: "150 reviews",
      role: "Build and test robotic solutions for industry.",
      openings: 1,
      applicants: 45,
      requirements: [
        "4+ years in robotics or automation.",
        "Proficiency in ROS and Python.",
        "Experience with sensor integration.",
        "Knowledge of mechanical design tools."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/robotech.jpg?w=128"
    },
    {
      id: 56,
      designation: "Legal Assistant",
      experience: "1 year",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-07-01",
      description: "Support legal team with documentation and research.",
      skills: ["Legal Research", "Documentation", "MS Office", "Organization"],
      company: "LawPoint Associates",
      salary: "₹ 3-4.5 Lakhs P.A.",
      rating: "3.7",
      reviews: "70 reviews",
      role: "Assist lawyers with case preparation and filings.",
      openings: 2,
      applicants: 80,
      requirements: [
        "1+ years in legal or administrative support.",
        "Familiarity with legal terminology.",
        "Proficiency in MS Office and case management tools.",
        "Strong organizational skills."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/lawpoint.jpg?w=128"
    },
    {
      id: 57,
      designation: "Data Engineer",
      experience: "3 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-07-02",
      description: "Build and maintain data pipelines for analytics.",
      skills: ["Python", "SQL", "Spark", "ETL"],
      company: "DataFlow Technologies",
      salary: "₹ 9-13 Lakhs P.A.",
      rating: "4.2",
      reviews: "160 reviews",
      role: "Design and optimize data pipelines.",
      openings: 2,
      applicants: 75,
      requirements: [
        "3+ years in data engineering.",
        "Experience with Apache Spark or Hadoop.",
        "Proficiency in SQL and Python.",
        "Knowledge of cloud platforms like AWS."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/dataflow.jpg?w=128"
    },
    {
      id: 58,
      designation: "Product Designer",
      experience: "2 years",
      location: "Remote",
      type: "Work from home",
      postedAt: "2025-07-03",
      description: "Design user-centric products and interfaces.",
      skills: ["Figma", "Prototyping", "User Research", "Wireframing"],
      company: "DesignWave Studio",
      salary: "₹ 6-8 Lakhs P.A.",
      rating: "4.0",
      reviews: "90 reviews",
      role: "Create intuitive product designs and prototypes.",
      openings: 2,
      applicants: 85,
      requirements: [
        "2+ years in product or UI/UX design.",
        "Proficiency in Figma or Sketch.",
        "Experience with user testing and research.",
        "Strong portfolio of design projects."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/designwave.jpg?w=128"
    },
    {
      id: 59,
      designation: "Quality Control Analyst",
      experience: "2 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-07-04",
      description: "Ensure product quality through testing and inspections.",
      skills: ["Quality Assurance", "Testing", "SPC", "Documentation"],
      company: "QualityFirst Industries",
      salary: "₹ 4-6 Lakhs P.A.",
      rating: "3.8",
      reviews: "100 reviews",
      role: "Perform quality checks and maintain standards.",
      openings: 3,
      applicants: 90,
      requirements: [
        "2+ years in quality control or assurance.",
        "Knowledge of statistical process control (SPC).",
        "Experience with ISO standards.",
        "Strong attention to detail."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/qualityfirst.jpg?w=128"
    },
    {
      id: 60,
      designation: "IoT Engineer",
      experience: "3 years",
      location: "Hyderabad",
      type: "Full-Time",
      postedAt: "2025-07-05",
      description: "Develop IoT solutions for smart devices.",
      skills: ["Python", "MQTT", "Embedded Systems", "AWS IoT"],
      company: "SmartConnect Technologies",
      salary: "₹ 8-12 Lakhs P.A.",
      rating: "4.1",
      reviews: "130 reviews",
      role: "Design and implement IoT architectures.",
      openings: 2,
      applicants: 70,
      requirements: [
        "3+ years in IoT or embedded systems.",
        "Experience with MQTT and IoT protocols.",
        "Proficiency in Python and cloud platforms.",
        "Knowledge of hardware interfacing."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/smartconnect.jpg?w=128"
    },
    {
      id: 61,
      designation: "Corporate Trainer",
      experience: "4 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-07-06",
      description: "Deliver training programs for employees.",
      skills: ["Training", "Presentation", "Leadership Development", "Content Creation"],
      company: "SkillUp Academy",
      salary: "₹ 6-9 Lakhs P.A.",
      rating: "4.0",
      reviews: "110 reviews",
      role: "Facilitate professional development workshops.",
      openings: 2,
      applicants: 60,
      requirements: [
        "4+ years in corporate training or teaching.",
        "Strong presentation and communication skills.",
        "Experience with e-learning platforms.",
        "Ability to design training modules."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/skillup.jpg?w=128"
    },
    {
      id: 62,
      designation: "Frontend Developer",
      experience: "0 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-07-07",
      description: "Build user interfaces using modern web technologies.",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      company: "WebSpace Innovations",
      salary: "₹ 3-5 Lakhs P.A.",
      rating: "3.9",
      reviews: "80 reviews",
      role: "Develop responsive web applications.",
      openings: 4,
      applicants: 150,
      requirements: [
        "Basic knowledge of HTML, CSS, and JavaScript.",
        "Familiarity with React or similar frameworks.",
        "Strong problem-solving skills.",
        "Portfolio of small projects preferred."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/webspace.jpg?w=128"
    },
    {
      id: 63,
      designation: "Backend Developer",
      experience: "2 years",
      location: "Mumbai",
      type: "Full-Time",
      postedAt: "2025-07-08",
      description: "Develop server-side logic and APIs.",
      skills: ["Node.js", "Express", "MongoDB", "GraphQL"],
      company: "CodeBase Solutions",
      salary: "₹ 6-9 Lakhs P.A.",
      rating: "4.0",
      reviews: "120 reviews",
      role: "Build and maintain backend services.",
      openings: 3,
      applicants: 80,
      requirements: [
        "2+ years in backend development.",
        "Experience with Node.js and MongoDB.",
        "Familiarity with GraphQL is a plus.",
        "Strong understanding of REST APIs."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/codebase.jpg?w=128"
    },
    {
      id: 64,
      designation: "UI/UX Designer",
      experience: "1 year",
      location: "Pune",
      type: "Full-Time",
      postedAt: "2025-07-09",
      description: "Design intuitive and visually appealing interfaces.",
      skills: ["Figma", "Sketch", "Prototyping", "User Testing"],
      company: "DesignCore Studio",
      salary: "₹ 4-6 Lakhs P.A.",
      rating: "3.8",
      reviews: "90 reviews",
      role: "Create wireframes and prototypes for web and mobile apps.",
      openings: 2,
      applicants: 70,
      requirements: [
        "1+ years in UI/UX design.",
        "Proficiency in Figma or Adobe XD.",
        "Basic knowledge of user research methods.",
        "Portfolio of design projects required."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/designcore.jpg?w=128"
    },
    {
      id: 65,
      designation: "DevOps Engineer",
      experience: "3 years",
      location: "Hyderabad",
      type: "Full-Time",
      postedAt: "2025-07-10",
      description: "Automate and manage CI/CD pipelines.",
      skills: ["Docker", "Kubernetes", "Jenkins", "AWS"],
      company: "CloudOps Technologies",
      salary: "₹ 10-14 Lakhs P.A.",
      rating: "4.2",
      reviews: "140 reviews",
      role: "Streamline deployment and infrastructure processes.",
      openings: 2,
      applicants: 65,
      requirements: [
        "3+ years in DevOps or system administration.",
        "Experience with Docker and Kubernetes.",
        "Proficiency in CI/CD tools like Jenkins.",
        "Knowledge of cloud platforms like AWS."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/cloudops.jpg?w=128"
    },
    {
      id: 66,
      designation: "Data Scientist",
      experience: "2 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-07-11",
      description: "Analyze data and develop predictive models.",
      skills: ["Python", "R", "Machine Learning", "SQL"],
      company: "InsightAnalytics Ltd.",
      salary: "₹ 8-12 Lakhs P.A.",
      rating: "4.1",
      reviews: "130 reviews",
      role: "Build data-driven solutions for business problems.",
      openings: 2,
      applicants: 80,
      requirements: [
        "2+ years in data science or analytics.",
        "Proficiency in Python and machine learning libraries.",
        "Experience with SQL and data visualization.",
        "Strong statistical knowledge."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/insightanalytics.jpg?w=128"
    },
    {
      id: 67,
      designation: "Project Manager",
      experience: "5 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-07-12",
      description: "Lead projects and coordinate with teams.",
      skills: ["Agile", "PMP", "Stakeholder Management", "JIRA"],
      company: "PlanEasy Solutions",
      salary: "₹ 15-20 Lakhs P.A.",
      rating: "4.3",
      reviews: "170 reviews",
      role: "Ensure timely delivery of projects within budget.",
      openings: 1,
      applicants: 40,
      requirements: [
        "5+ years in project management.",
        "PMP or Scrum Master certification preferred.",
        "Experience with JIRA and Agile methodologies.",
        "Strong leadership and communication skills."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/planeasy.jpg?w=128"
    },
    {
      id: 68,
      designation: "Content Writer",
      experience: "1 year",
      location: "Remote",
      type: "Work from home",
      postedAt: "2025-07-13",
      description: "Write engaging content for websites and blogs.",
      skills: ["Content Writing", "SEO", "WordPress", "Grammar"],
      company: "WriteWell Media",
      salary: "₹ 3-4.5 Lakhs P.A.",
      rating: "3.9",
      reviews: "70 reviews",
      role: "Produce high-quality content for digital platforms.",
      openings: 3,
      applicants: 100,
      requirements: [
        "1+ years in content writing.",
        "Basic knowledge of SEO and WordPress.",
        "Strong grammar and research skills.",
        "Portfolio of published articles preferred."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/writewell.jpg?w=128"
    },
    {
      id: 69,
      designation: "Cybersecurity Analyst",
      experience: "2 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-07-14",
      description: "Monitor and protect systems from cyber threats.",
      skills: ["SIEM", "Penetration Testing", "Firewall", "Incident Response"],
      company: "SafeGuard Tech",
      salary: "₹ 7-10 Lakhs P.A.",
      rating: "4.0",
      reviews: "110 reviews",
      role: "Conduct security assessments and respond to threats.",
      openings: 2,
      applicants: 70,
      requirements: [
        "2+ years in cybersecurity.",
        "Experience with SIEM tools like Splunk.",
        "Knowledge of network security protocols.",
        "Certifications like CompTIA Security+ preferred."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/safeguard.jpg?w=128"
    },
    {
      id: 70,
      designation: "Customer Success Manager",
      experience: "3 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-07-15",
      description: "Ensure client satisfaction and retention.",
      skills: ["Customer Relationship", "SaaS", "Account Management", "Analytics"],
      company: "SuccessPoint Solutions",
      salary: "₹ 8-12 Lakhs P.A.",
      rating: "4.2",
      reviews: "140 reviews",
      role: "Support clients and drive product adoption.",
      openings: 2,
      applicants: 60,
      requirements: [
        "3+ years in customer success or account management.",
        "Experience with SaaS products.",
        "Strong communication and analytical skills.",
        "Familiarity with CRM tools like HubSpot."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/successpoint.jpg?w=128"
    },
    {
      id: 71,
      designation: "Full Stack Developer",
      experience: "3 years",
      location: "Pune",
      type: "Full-Time",
      postedAt: "2025-07-16",
      description: "Develop end-to-end web applications.",
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      company: "StackCraft Technologies",
      salary: "₹ 9-13 Lakhs P.A.",
      rating: "4.1",
      reviews: "130 reviews",
      role: "Build and maintain full-stack applications.",
      openings: 2,
      applicants: 75,
      requirements: [
        "3+ years in full-stack development.",
        "Proficiency in React and Node.js.",
        "Experience with cloud platforms like AWS.",
        "Strong understanding of databases."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/stackcraft.jpg?w=128"
    },
    {
      id: 72,
      designation: "Marketing Manager",
      experience: "5 years",
      location: "Delhi",
      type: "Full-Time",
      postedAt: "2025-07-17",
      description: "Lead marketing strategies and campaigns.",
      skills: ["Marketing Strategy", "Brand Management", "Digital Marketing", "Analytics"],
      company: "BrandBuzz Agency",
      salary: "₹ 12-18 Lakhs P.A.",
      rating: "4.3",
      reviews: "160 reviews",
      role: "Drive brand growth through innovative marketing.",
      openings: 1,
      applicants: 50,
      requirements: [
        "5+ years in marketing or brand management.",
        "Experience with digital and offline campaigns.",
        "Strong leadership and analytical skills.",
        "Proficiency in marketing tools like Google Ads."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/brandbuzz.jpg?w=128"
    },
    {
      id: 73,
      designation: "QA Engineer",
      experience: "2 years",
      location: "Hyderabad",
      type: "Full-Time",
      postedAt: "2025-07-18",
      description: "Ensure software quality through testing.",
      skills: ["Selenium", "JIRA", "Test Automation", "Manual Testing"],
      company: "QualityTech Solutions",
      salary: "₹ 5-8 Lakhs P.A.",
      rating: "4.0",
      reviews: "120 reviews",
      role: "Perform automated and manual testing.",
      openings: 2,
      applicants: 70,
      requirements: [
        "2+ years in QA or software testing.",
        "Experience with Selenium or similar tools.",
        "Familiarity with Agile testing processes.",
        "Strong attention to detail."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/qualitytech.jpg?w=128"
    },
    {
      id: 74,
      designation: "Product Manager",
      experience: "6 years",
      location: "Bangalore",
      type: "Full-Time",
      postedAt: "2025-07-19",
      description: "Define product strategy and lead development.",
      skills: ["Product Roadmap", "Agile", "Stakeholder Management", "Analytics"],
      company: "VisionCraft Solutions",
      salary: "₹ 18-25 Lakhs P.A.",
      rating: "4.4",
      reviews: "180 reviews",
      role: "Drive product vision and execution.",
      openings: 1,
      applicants: 40,
      requirements: [
        "6+ years in product management.",
        "Experience with Agile and product analytics.",
        "Strong communication and leadership skills.",
        "Proven track record of successful products."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/visioncraft.jpg?w=128"
    },
    {
      id: 75,
      designation: "Data Entry Operator",
      experience: "0 years",
      location: "Chennai",
      type: "Full-Time",
      postedAt: "2025-07-20",
      description: "Perform data entry tasks with accuracy.",
      skills: ["Typing", "MS Excel", "Accuracy", "Data Management"],
      company: "DataQuick Services",
      salary: "₹ 1.8-2.5 Lakhs P.A.",
      rating: "3.6",
      reviews: "90 reviews",
      role: "Enter and manage data in company systems.",
      openings: 10,
      applicants: 200,
      requirements: [
        "Basic computer skills and typing speed.",
        "Proficiency in MS Excel and Word.",
        "Strong attention to detail.",
        "Ability to work in a fast-paced environment."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/dataquick.jpg?w=128"
    },
    {
      id: 76,
      designation: "AI Engineer",
      experience: "3 years",
      location: "Pune",
      type: "Full-Time",
      postedAt: "2025-07-21",
      description: "Develop AI solutions for business applications.",
      skills: ["Python", "TensorFlow", "ML Models", "Data Preprocessing"],
      company: "AIEdge Technologies",
      salary: "₹ 10-14 Lakhs P.A.",
      rating: "4.2",
      reviews: "140 reviews",
      role: "Build and deploy AI models for real-world use.",
      openings: 2,
      applicants: 65,
      requirements: [
        "3+ years in AI or machine learning.",
        "Proficiency in Python and TensorFlow.",
        "Experience with data preprocessing.",
        "Knowledge of cloud AI services."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/aiedge.jpg?w=128"
    },
    {
      id: 77,
      designation: "Social Media Analyst",
      experience: "1 year",
      location: "Remote",
      type: "Work from home",
      postedAt: "2025-07-22",
      description: "Analyze social media performance and trends.",
      skills: ["Social Media Analytics", "Google Analytics", "Content Strategy", "Reporting"],
      company: "TrendTrack Media",
      salary: "₹ 3-5 Lakhs P.A.",
      rating: "3.8",
      reviews: "80 reviews",
      role: "Provide insights to optimize social media campaigns.",
      openings: 2,
      applicants: 90,
      requirements: [
        "1+ years in social media or digital analytics.",
        "Experience with tools like Sprout Social.",
        "Strong data interpretation skills.",
        "Familiarity with content strategies."
      ],
      img: "https://apna-organization-logos.gumlet.io/production/logos/trendtrack.jpg?w=128"
    }
  ];

  // API endpoint to search jobs based on query parameters
  // Search jobs endpoint
  app.get('/api/jobs/search', (req, res) => {
    const { designation, experience, location } = req.query;

    let filteredJobs = jobs;

    if (designation) {
      const searchDesignation = designation.toLowerCase().trim();
      filteredJobs = filteredJobs.filter((job) =>
        job.designation.toLowerCase().includes(searchDesignation)
      );
    }

    if (location) {
      const searchLocation = location.toLowerCase().trim();
      filteredJobs = filteredJobs.filter((job) =>
        job.location.toLowerCase().includes(searchLocation)
      );
    }

    if (experience) {
      const [minExp, maxExp] = experience.split('-').map(Number);
      filteredJobs = filteredJobs.filter((job) => {
        const jobExp = Number(job.experience.split(' ')[0]);
        if (maxExp) {
          return jobExp >= minExp && jobExp <= maxExp;
        } else {
          return jobExp >= minExp;
        }
      });
    }

    console.log('Filtered Jobs in API:', filteredJobs);
    res.json(filteredJobs);
  });

  // Suggested jobs endpoint
  app.get('/api/jobs/suggested', async (req, res) => {
    try {
      const { location, designation } = req.query;
      let suggestedJobs = jobs;

      if (location) {
        const searchLocation = location.toLowerCase().trim();
        suggestedJobs = suggestedJobs.filter((job) =>
          job.location.toLowerCase().includes(searchLocation)
        );
      }

      if (designation) {
        const searchDesignation = designation.toLowerCase().trim();
        suggestedJobs = suggestedJobs.filter((job) =>
          job.designation.toLowerCase().includes(searchDesignation)
        );
      }

      res.status(200).json(suggestedJobs.slice(0, 5));
    } catch (err) {
      console.error('Error in /api/jobs/suggested:', err);
      res.status(500).json({ error: 'Failed to fetch suggested jobs' });
    }
  });

  // Get job by ID endpoint
  app.get('/api/jobs/:id', (req, res) => {
    const jobId = String(req.params.id);
    console.log('Jobs array:', jobs.map(job => ({ id: job.id })));
    console.log('Requested jobId:', jobId);
    const job = jobs.find((job) => String(job.id) === jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  });



  app.post('/api/top-companies', async (req, res) => {
    try {
      const company = new TopCompany(req.body);
      await company.save();
      res.status(201).json({ data: company });
    } catch (error) {
      console.error('Error creating top company:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  const seedData = async () => {
    try {
      // Clear existing data
      await TopCompanyJob.deleteMany({});

      // Seed TopCompanyJob data
      const topCompanyJobs = [
        {
          title: 'Software Engineer',
          company: 'Google',
          location: 'Bangalore, India',
          salary: 20,
          experience: '2 years',
          skills: ['JavaScript', 'React', 'Node.js'],
          postedAt: new Date('2025-06-01'),
          type: 'Work from office',
          workType: 'Full-Time',
          level: 'Mid',
          role: 'Frontend Developer',
          description: 'Develop and maintain web applications.',
          responsibilities: 'Build UI components and integrate APIs.',
          openings: 3,
          requirements: ['Communication', 'Teamwork'],
          urgent: false,
          applicants: 5,
          img: 'https://via.placeholder.com/64',
        },
        {
          title: 'Data Scientist',
          company: 'Google',
          location: 'Hyderabad, India',
          salary: 25,
          experience: '3 years',
          skills: ['Python', 'Machine Learning', 'SQL'],
          postedAt: new Date('2025-06-02'),
          type: 'Work from home',
          workType: 'Full-Time',
          level: 'Senior',
          role: 'Data Scientist',
          description: 'Analyze data and build predictive models.',
          responsibilities: 'Develop ML models and present insights.',
          openings: 2,
          requirements: ['Analytical Thinking', 'Problem Solving'],
          urgent: true,
          applicants: 8,
          img: 'https://via.placeholder.com/64',
        },
        {
          title: 'Product Manager',
          company: 'Microsoft',
          location: 'Pune, India',
          salary: 30,
          experience: '5 years',
          skills: ['Product Management', 'Agile', 'Leadership'],
          postedAt: new Date('2025-06-03'),
          type: 'Work from office',
          workType: 'Full-Time',
          level: 'Senior',
          role: 'Product Manager',
          description: 'Lead product development and strategy.',
          responsibilities: 'Define product roadmap and collaborate with teams.',
          openings: 1,
          requirements: ['Communication', 'Strategic Thinking'],
          urgent: false,
          applicants: 3,
          img: 'https://via.placeholder.com/64',
        },
        {
      id: "68505db4c4166d6480a027a6", // Matching the requested jobId
      designation: "Software Engineer",
      company: "Tech Corp",
      location: "Delhi",
      salary: "₹ 1.5 - 3 Lakhs",
      experience: "0 years",
      workMode: "Work from office",
      workType: "Full-Time",
      skills: ["JavaScript", "React"],
      postedAt: "2025-06-15T12:00:00Z",
      description: "This is a software engineering role for freshers.",
    },
      ];

      await TopCompanyJob.insertMany(topCompanyJobs);
      console.log('Top company jobs seeded successfully');
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  };// Placeholder Routes for /api/top-companies (assumed to exist)
  app.get('/api/top-companies', async (req, res) => {
    try {
      const companies = await TopCompany.find();
      res.status(200).json({ data: companies });
    } catch (error) {
      console.error('Error fetching top companies:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  // Define the TopCompanyJob Schema and Model
  const topCompanyJobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    experience: { type: String, required: true },
    skills: [{ type: String }],
    postedAt: { type: Date, default: Date.now },
    type: { type: String, required: true }, // Work from home, Work from office, etc.
    workType: { type: String, required: true }, // Full-Time, Part-Time
    level: { type: String, required: true }, // Junior, Mid, Senior
    role: { type: String, required: true },
    description: { type: String, required: true },
    responsibilities: { type: String, required: true },
    openings: { type: Number, required: true, min: 1 },
    requirements: [{ type: String }],
    urgent: { type: Boolean, default: false },
    applicants: { type: Number, default: 0 },
    img: { type: String }, // Company logo URL
  });

  const TopCompanyJob = mongoose.model('TopCompanyJob', topCompanyJobSchema);



  // Placeholder for TopCompany Schema (assumed to exist for /api/top-companies)
  const topCompanySchema = new mongoose.Schema({
    company: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
  });

  const TopCompany = mongoose.model('TopCompany', topCompanySchema);

  // Routes for /api/top-companies-jobs
  // GET /api/top-companies-jobs?company=<companyName>
  // Fetch jobs for a specific top company
  app.get('/api/top-companies-jobs', async (req, res) => {
    try {
      const { company } = req.query;

      if (!company) {
        return res.status(400).json({ message: 'Company name is required' });
      }

      const jobs = await TopCompanyJob.find({ company });
      res.status(200).json({ data: jobs });
    } catch (error) {
      console.error('Error fetching top company jobs:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // PATCH /api/top-companies-jobs/:id/apply
  // Increment the applicants count for a specific job
  app.patch('/api/top-companies-jobs/:id/apply', async (req, res) => {
    try {
      const { id } = req.params;
      const { applicants } = req.body;

      if (typeof applicants !== 'number') {
        return res.status(400).json({ message: 'Applicants count must be a number' });
      }

      const job = await TopCompanyJob.findById(id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      job.applicants = applicants;
      await job.save();

      res.status(200).json({ data: job });
    } catch (error) {
      console.error('Error updating job applicants:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


  app.post('/api/google-login', async (req, res) => {
    const { email, googleId, name, picture } = req.body;
    try {
      // Check if user exists in your database or create a new one
      let user = await User.findOne({ googleId });
      if (!user) {
        user = await User.create({ email, googleId, name, picture });
      }
      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Google login failed' });
    }
  });



  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  });

  let users = []; 




const validUser = {
  email: process.env.VALID_EMAIL,
  password: process.env.VALID_PASSWORD,
  name: process.env.VALID_NAME,
  avatar: process.env.VALID_AVATAR,
};

  // Candidate Schema (kept for reference, not used in this fix)
  const candidateSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    avatar: { type: String },
  });

  const Candidate = mongoose.model('Candidate', candidateSchema);




// Login endpoint
app.post('/api/candidatelogin', async (req, res) => {
  const { email, password } = req.body;
  console.log('📥 Login attempt:', { email });

  try {
    // Check for demo credentials
    if (
      email === process.env.DEMO_EMAIL &&
      password === process.env.DEMO_PASSWORD
    ) {
      console.log('✅ Demo login successful');
      return res.json({
        _id: 'demo-user-id',
        name: 'Admin',
        email,
        token: process.env.DEMO_TOKEN,
      });
    }

    // Check database for candidate
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      console.log('❌ No candidate found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      console.log('❌ Password does not match for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful:', candidate.email);
    return res.json({
      _id: candidate._id,
      name: candidate.name || candidate.email.split('@')[0],
      email: candidate.email,
      token: process.env.JWT_TOKEN,
    });
  } catch (error) {
    console.error('❌ Login error:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Insert test user
const insertTestUser = async () => {
  const existingUser = await Candidate.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(process.env.DEMO_PASSWORD, 10); // Securely hash
    const newCandidate = new Candidate({
      email: process.env.DEMO_EMAIL,
      password: hashedPassword,
      name: 'Admin User',
      avatar: '/default-avatar.png',
    });
    await newCandidate.save();
    console.log('Test user inserted');
  }
};
insertTestUser();


  app.get('/api/jobs/user/:userId', async (req, res) => {
    try {
      const jobs = await Job.find({ postedBy: req.params.userId });
      res.status(200).json(jobs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get job count by user
  app.get('/api/jobs/count/:userId', async (req, res) => {
    try {
      const count = await Job.countDocuments({ postedBy: req.params.userId });
      res.status(200).json({ count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Application Schema
  const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    appliedAt: { type: Date, default: Date.now },
  });

  const Application = mongoose.model('Application', applicationSchema);


  // Get All Jobs Posted by a Candidate (Manage Jobs)
  app.get('/api/jobs/:postedBy', async (req, res) => {
    const { postedBy } = req.params;

    try {
      const jobs = await Job.find({ postedBy });
      res.status(200).json(jobs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch jobs' });
    }
  });

  // Get Applications for a Job (View Applications)
  app.get('/api/applications/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
      const applications = await Application.find({ jobId }).populate('candidateId', 'name email');
      res.status(200).json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch applications' });
    }
  });

  // Get Total Jobs Posted by a Candidate
  app.get('/api/jobs/count/:postedBy', async (req, res) => {
    const { postedBy } = req.params;

    try {
      const count = await Job.countDocuments({ postedBy });
      res.status(200).json({ totalJobs: count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch job count' });
    }
  });

  // Get Total Applications for Jobs Posted by a Candidate
  app.get('/api/applications/count/:postedBy', async (req, res) => {
    const { postedBy } = req.params;

    try {
      const jobs = await Job.find({ postedBy }).select('_id');
      const jobIds = jobs.map(job => job._id);
      const count = await Application.countDocuments({ jobId: { $in: jobIds } });
      res.status(200).json({ totalApplications: count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch application count' });
    }
  });

  // Your signup route (line 719 area)
  app.post('/api/signup', async (req, res) => {
    const { email, password, name, avatar } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    
    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Validate name
    if (name.trim().length === 0) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }
    
    // Validate avatar (if provided)
    if (avatar && !/^https?:\/\/.+\..+/.test(avatar)) {
      return res.status(400).json({ error: 'Avatar must be a valid URL' });
    }
    
    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Generate new user ID (auto-increment)
      const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      
      // Create new user
      const newUser = {
        id: newId,
        email,
        password: hashedPassword,
        name: name.trim(),
        avatar: avatar || 'https://via.placeholder.com/150', // Default avatar if not provided
      };
      
      // Add to users array
      users.push(newUser);
      
      // Return user data (excluding password)
      res.status(201).json({
        message: 'Signup successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
        },
      });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Failed to sign up. Please try again.' });
    }
  });

  const resumes = {};


  const resumesFilePath = path.join(__dirname, 'resumes.json');

  if (fs.existsSync(resumesFilePath)) {
    resumes = JSON.parse(fs.readFileSync(resumesFilePath));
  }

  // Save resumes to the JSON file
  const saveResumes = () => {
    fs.writeFileSync(resumesFilePath, JSON.stringify(resumes, null, 2));
  };

  app.post('/api/upload-resume', upload.single('resume'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only PDF, JPG, and PNG files are allowed' });
    }

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }

    const userId = req.body.userId || 'user1';
    resumes[userId] = req.file.path;
    saveResumes(); // Save to file
    console.log(`Resume uploaded for user ${userId}: ${req.file.path}`);
    console.log('Current resumes:', resumes);
    res.status(200).json({ message: 'Resume uploaded successfully' });
  });

  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

  // User Schema
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  const User = mongoose.model('User', userSchema);

  // Job Schema
  const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    experience: { type: String, required: true },
    skills: [String],
    postedAt: { type: Date, default: Date.now },
    type: { type: String, enum: ['Work from home', 'Work from office', 'Work from field'], required: true },
    workType: { type: String, enum: ['Full-Time', 'Part-Time'], required: true },
    role: { type: String },
    description: { type: String },
    responsibilities: { type: String },
    openings: { type: Number },
    applicants: { type: Number, default: 0 },
    requirements: [String],
    urgent: { type: Boolean, default: false },
    img: { type: String },
    level: { type: String, default: 'Junior' },
  });
  const Job = mongoose.model('Job', jobSchema);

  // Login Route
  app.post('/api/candidatelogin', async (req, res) => {
    const { email, password } = req.body;
    console.log('📥 Login attempt:', { email, password });

    try {
      // Check for demo credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
  console.log('✅ Demo login successful');
  return res.json({
    _id: 'demo-user-id',
    name: 'Admin',
    email: email,
    token: process.env.ADMIN_TOKEN,
 
  });
}


      // Check database for other users
      const user = await User.findOne({ email, password });
      
      if (!user) {
        console.log('❌ No user found or credentials do not match');
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      console.log('✅ Login successful:', user.email);
      return res.json({
        _id: user._id,
        name: user.email.split('@')[0],
        email: user.email,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZhaXphbjJAZ21haWwuY29tIiwiaWF0IjoxNzQ4ODkwMjYwfQ.JRN3Kn2lVKqstN2scRw5Dn5k2thkaSYsfU0fyyEir8w',
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


  // GET all jobs with filters
  app.get('/api/jobs', async (req, res) => {
    console.log('Received GET request for /api/jobs with query:', req.query);
    try {
      const { title, location, salary, experience, type, level } = req.query;
      const query = {};

      if (title) query.title = { $regex: title, $options: 'i' };
      if (location) query.location = { $regex: location, $options: 'i' };
      if (salary) query.salary = { $gte: parseFloat(salary) };
      if (experience) query.experience = experience;
      if (type) query.type = type;
      if (level) query.level = level;

      const jobs = await Job.find(query).sort({ postedAt: -1 }); // Sort by latest first
      res.json({ success: true, data: jobs });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // POST create a new job
  app.post('/api/jobs', async (req, res) => {
    console.log('Received POST request for /api/jobs with body:', req.body);
    try {
      const jobData = req.body;
      const requiredFields = ['title', 'company', 'location', 'salary', 'experience', 'type', 'workType'];
      for (const field of requiredFields) {
        if (!jobData[field]) {
          return res.status(400).json({ success: false, message: `${field} is required` });
        }
      }

      const newJob = new Job({
        ...jobData,
        postedAt: jobData.postedAt ? new Date(jobData.postedAt) : Date.now(),
        applicants: 0,
        skills: jobData.skills || [],
        requirements: jobData.requirements || [],
        urgent: jobData.urgent || false,
        img: jobData.img || 'https://via.placeholder.com/64',
        level: jobData.level || 'Junior',
      });

      await newJob.save();
      res.status(201).json({ success: true, message: 'Job created successfully', data: newJob });
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // POST apply for a job
  app.post('/api/jobs/:jobId/apply', async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      job.applicants = (job.applicants || 0) + 1; // Increment applicants count
      await job.save();
      res.json({ success: true, message: 'Application submitted' });
    } catch (error) {
      console.error('Error applying for job:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  // backend app.js
  app.get('/api/jobs/:jobId', async (req, res) => {
    console.log('Received GET request for /api/jobs/:jobId with jobId:', req.params.jobId);
    try {
      const job = await Job.findById(req.params.jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      res.json({ success: true, data: job });
    } catch (error) {
      console.error('Error fetching job details:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  // Default Route
  app.get('/', (req, res) => {
    res.send('✅ Candidate Login API is running!');
  });

  // Start Server
  app.listen(5006, () => {
    console.log('🚀 Server running at http://localhost:5006');
  });













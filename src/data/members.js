// ============================================================
// Decode Animation Lab (24fps) — Members Data
// ============================================================
// Single source of truth for all member information.
// To add/update a member, edit this file only.
//
// PHOTOS: Add to /public/images/team/
//   Real photo:  /images/team/[slug]-photo.jpg
//   Avatar:      /images/team/[slug]-avatar.png
//
// CATEGORY: "faculty" | "alumni" | "student"
// To move a student to alumni, change category to "alumni"
//
// PROGRAM: "Communication Design (Film & Animation)"
//          "Communication Design (Visual Communication)"
//          "Communication Design (Advertising Design)"
//          "Industrial Design" — no bracket if no specialization
//
// ALL FIELDS ARE COMPULSORY.
// email and portfolio are compulsory and separate from socials.
// socials: only include platforms the person actually uses.
// ============================================================

export const members = [

  // ── FACULTY ─────────────────────────────────────────────
  {
    slug: "benjamin-prempeh",
    name: "Dr. Benjamin Prempeh",
    nickname: null,
    initials: "BP",

    category: "faculty",
    program: "Communication Design",

    department: "Leadership",
    role: "Lab Director",
    isLead: true,
    featured: true,

    expertise: ["Multimedia Production", "Animation", "Film"],

    bio: "Dr. Benjamin Prempeh is a lecturer in the Department of Communication Design at KNUST, where he teaches Multimedia Production and Animation. He heads the Decode Animation Lab — the department's official animation group — which provides students with a real industry production environment.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },

  // ── ALUMNI ──────────────────────────────────────────────
  {
    slug: "eugene-ampadu-antwi",
    name: "Eugene Ampadu Antwi",
    nickname: null,
    initials: "EA",

    category: "alumni",
    program: "Communication Design (Film & Animation)",

    department: "Leadership",
    role: "Technical & Creative Supervisor",
    isLead: true,
    featured: true,

    expertise: ["VFX", "Compositing", "Look Development", "3D Animation", "Motion Design"],

    bio: "Eugene Ampadu Antwi is the co-founder of 24fps and Technical & Creative Supervisor of the Decode Animation Lab. A designer, animator and look developer with professional industry experience, he co-founded 24fps after noticing that Ghana's emerging animation industry was struggling with a lack of professionals trained in real production workflows. He built the studio to simulate that environment for KNUST students before they graduate.",

    featuredWorks: [],

    email: "hello@eugene-antwi.com",
    portfolio: "https://eugene-antwi.com",
    socials: {},
  },
  {
    slug: "eshun-kofi-badu",
    name: "Eshun Kofi Badu",
    nickname: "Kobesh",
    initials: "KB",

    category: "alumni",
    program: "Communication Design (Film & Animation)",

    department: "Leadership",
    role: "Studio Supervisor",
    isLead: true,
    featured: true,

    expertise: ["Animation", "Production Management", "Editing", "Quality Control"],

    bio: "Eshun Kofi Badu, known as Kobesh, is the co-founder of 24fps and Studio Supervisor of the Decode Animation Lab. He co-founded the studio alongside Eugene to give KNUST animation students hands-on experience in a structured production environment that mirrors the real industry.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },

  // ── STUDENTS — PRE-PRODUCTION ────────────────────────────
  {
    slug: "lois-dekalu",
    name: "Lois Dekalu",
    nickname: null,
    initials: "LD",

    category: "student",
    program: null,

    department: "Pre-Production",
    role: "Story Writer",
    isLead: false,
    featured: false,

    expertise: ["Story Development", "Scriptwriting"],

    bio: "Lois works on story concept and script development, helping shape the narrative foundation of every 24fps production.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "elikem",
    name: "Elikem",
    nickname: null,
    initials: "EL",

    category: "student",
    program: null,

    department: "Pre-Production",
    role: "Story Writer",
    isLead: false,
    featured: false,

    expertise: ["Story Development", "3D Modeling"],

    bio: "Elikem contributes to story development and doubles as a 3D modeler in production, making him one of the studio's cross-department members.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "mary-ann",
    name: "Mary Ann",
    nickname: null,
    initials: "MA",

    category: "student",
    program: null,

    department: "Pre-Production",
    role: "Story Writer",
    isLead: false,
    featured: false,

    expertise: ["Story Development", "Environment Concept Art"],

    bio: "Mary Ann works across story and visual development, contributing to both the narrative and the environmental concept art that defines the world of each project.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "jesse-mante",
    name: "Jesse Mante",
    nickname: null,
    initials: "JM",

    category: "student",
    program: null,

    department: "Pre-Production",
    role: "Storyboard Artist",
    isLead: false,
    featured: false,

    expertise: ["Storyboarding", "Shot Planning", "3D Modeling"],

    bio: "Jesse handles storyboards and shot planning for productions, and also contributes to 3D modeling during the production phase.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "samuel-jerome",
    name: "Samuel Jerome",
    nickname: null,
    initials: "SJ",

    category: "student",
    program: null,

    department: "Pre-Production",
    role: "Storyboard Artist",
    isLead: false,
    featured: false,

    expertise: ["Storyboarding", "Layout Planning", "Environment Concept Art"],

    bio: "Samuel supports storyboarding and layout planning, and contributes to environment and prop concept work alongside the pre-production team.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "joshua-billy-howard",
    name: "Joshua Billy Howard",
    nickname: null,
    initials: "JB",

    category: "student",
    program: null,

    department: "Pre-Production",
    role: "Storyboard Artist",
    isLead: false,
    featured: false,

    expertise: ["Storyboarding", "Layout Planning"],

    bio: "Joshua provides storyboard support and assists with layout planning across the pre-production pipeline.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "adzo-precious",
    name: "Adzo Precious",
    nickname: null,
    initials: "AP",

    category: "student",
    program: null,

    department: "Pre-Production",
    role: "Storyboard Artist",
    isLead: false,
    featured: false,

    expertise: ["Storyboarding", "Layout Planning"],

    bio: "Adzo supports the storyboard team and contributes to layout planning as part of the studio's pre-production department.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "cotu",
    name: "Cotu",
    nickname: null,
    initials: "CT",

    category: "student",
    program: null,

    department: "Pre-Production",
    role: "Concept Artist",
    isLead: false,
    featured: false,

    expertise: ["Character Design", "Environment Concept Art"],

    bio: "Cotu handles character design and also contributes to environment and prop concepts, bringing the visual world of each production to life.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "maame-kyeremaah",
    name: "Maame Kyeremaah",
    nickname: null,
    initials: "MK",

    category: "student",
    program: null,

    department: "Pre-Production",
    role: "Concept Artist",
    isLead: false,
    featured: false,

    expertise: ["Environment Design", "Prop Design"],

    bio: "Maame designs the environments and props that ground each production visually, working closely with the storyboard and production teams.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },

  // ── STUDENTS — PRODUCTION ────────────────────────────────
  {
    slug: "ta-maxwell",
    name: "TA Maxwell",
    nickname: null,
    initials: "TM",

    category: "student",
    program: null,

    department: "Production",
    role: "Animator",
    isLead: false,
    featured: false,

    expertise: ["Character Animation"],

    bio: "TA Maxwell is responsible for character animation, bringing the studio's characters to life frame by frame.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "delali",
    name: "Delali",
    nickname: null,
    initials: "DL",

    category: "student",
    program: null,

    department: "Production",
    role: "Animator",
    isLead: false,
    featured: false,

    expertise: ["Character Animation", "Effects Animation"],

    bio: "Delali handles character and effects animation, adding the motion and energy that makes scenes come alive.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "charlene-panyin",
    name: "Charlene Panyin",
    nickname: null,
    initials: "CP",

    category: "student",
    program: null,

    department: "Production",
    role: "3D Modeler",
    isLead: false,
    featured: false,

    expertise: ["3D Modeling", "Asset Creation", "Scene Setup"],

    bio: "Charlene models characters and props and handles scene setup, ensuring every asset is production-ready.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "boasiako-ransford",
    name: "Boasiako Ransford",
    nickname: null,
    initials: "BR",

    category: "student",
    program: null,

    department: "Production",
    role: "3D Modeler",
    isLead: false,
    featured: false,

    expertise: ["3D Modeling", "Asset Creation", "Scene Setup"],

    bio: "Boasiako builds characters and props and contributes to scene setup across the studio's 3D productions.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "wilfred-nabyaazoare",
    name: "Wilfred Nabyaazoare",
    nickname: null,
    initials: "WN",

    category: "student",
    program: null,

    department: "Production",
    role: "3D Modeler",
    isLead: false,
    featured: false,

    expertise: ["3D Modeling", "Asset Creation", "Scene Setup"],

    bio: "Wilfred contributes to character and prop modeling and scene setup, helping build the visual assets that drive each production.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "umar",
    name: "Umar",
    nickname: null,
    initials: "UM",

    category: "student",
    program: null,

    department: "Production",
    role: "3D Modeler",
    isLead: false,
    featured: false,

    expertise: ["3D Modeling", "Asset Creation", "Scene Setup"],

    bio: "Umar handles character and prop modeling and scene setup as part of the studio's production team.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },

  // ── STUDENTS — POST-PRODUCTION ───────────────────────────
  {
    slug: "mador-prince",
    name: "Mador Prince",
    nickname: null,
    initials: "MP",

    category: "student",
    program: null,

    department: "Post-Production",
    role: "Editor",
    isLead: false,
    featured: false,

    expertise: ["Video Editing", "Final Cut"],

    bio: "Mador Prince handles scene editing and the final cut, shaping the rhythm and flow of every production before it goes out.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },
  {
    slug: "parody",
    name: "Parody",
    nickname: null,
    initials: "PD",

    category: "student",
    program: null,

    department: "Post-Production",
    role: "Sound Designer",
    isLead: false,
    featured: false,

    expertise: ["Sound Design", "Music Composition", "Scoring", "Voice Direction"],

    bio: "Parody is the studio's sound designer, composer, and voice director. He handles everything from sound effects and dialogue cleanup to music scoring and audio mood.",

    featuredWorks: [],

    email: null,
    portfolio: null,
    socials: {},
  },

];

// ── DISPLAY CONFIG ───────────────────────────────────────────

export const categories = ["faculty", "alumni", "student"];

export const categoryLabels = {
  faculty: "Faculty",
  alumni: "Alumni",
  student: "Students",
};

export const departments = [
  "Leadership",
  "Pre-Production",
  "Production",
  "Post-Production",
];

export const departmentInfo = {
  "Leadership": "Creative vision and production oversight",
  "Pre-Production": "Story, storyboards, and visual development",
  "Production": "Animation, modelling, and rigging",
  "Post-Production": "Editing, sound, and final output",
};
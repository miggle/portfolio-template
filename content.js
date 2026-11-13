// This is the only file you usually need to edit.
// Photos go in the images folder. Any section with nothing in it stays off the page.

const site = {
  // Change this to any new word if you replace a photo but keep its file name.
  rev: "1",

  // The web address, without https://. Leave empty until the domain is set up.
  domain: "",

  // true keeps the site out of Google and other search engines.
  hideFromSearch: true,

  name: "Sam Example",
  role: "Young footballer",
  location: "Brighton",
  // Short lines under the name: what you study, what you are looking for.
  lines: [
    "Year 11 at a local school, playing for an under-16s club side.",
    "Looking for a summer coaching placement.",
  ],
  summary: "Hard-working, calm under pressure and always keen to learn.",
  // Shown in search results and link previews. Leave empty to build one from the lines above.
  description: "",

  // Leave either one empty to hide it.
  contact: {
    email: "",
    phone: "",
  },

  // Colours for the page. accent is used for links and the small bar above the name.
  theme: {
    accent: "#8f3b28",
    paper: "#f4efe4",
    ink: "#221b16",
  },

  // The picture shown when the link is shared. A .jpg works best.
  shareImage: "images/sample-1.svg",

  gallery: {
    heading: "Highlights",
    items: [
      {
        image: "images/sample-1.svg",
        title: "First match photo",
        caption: "Replace this with a real photo and caption.",
      },
      {
        image: "images/sample-2.svg",
        title: "Second photo",
        caption: "Swipe or use the buttons to move between photos.",
      },
    ],
  },

  videos: {
    heading: "Videos",
    items: [
      // {
      //   title: "Training session",
      //   url: "https://www.youtube.com/watch?v=VIDEO_ID",
      // },
    ],
  },

  experience: {
    heading: "Experience",
    items: [
      {
        role: "Volunteer coach",
        place: "Saturday junior sessions",
        when: "September 2026 – present",
      },
    ],
  },

  other: {
    heading: "Training and other",
    items: ["FA Playmaker course", "Duke of Edinburgh Bronze award"],
  },

  reference: {
    heading: "References",
    text: "Available on request.",
  },
};

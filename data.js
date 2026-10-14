/* ==========================================================================
   data.js — SINGLE SOURCE OF TRUTH. Edit content here only.
   Screens: put PNG/JPG files in assets/projects/<folder>/ with the names below.
   Missing images automatically show a clean "add screenshot" placeholder.
   ========================================================================== */
window.PORTFOLIO = {
  site: {
    email: '',            // e.g. 'you@gmail.com'  (empty = hidden)
    formEndpoint: 'https://formsubmit.co/ajax/waniyakhan696@gmail.com',
    // CV: put your PDF in assets/cv/ with exactly this name (or change the path here)
    cv: 'assets/cv/Wania_Naeem_CV_.pdf',
    // Socials: PASTE YOUR OWN PROFILE LINKS below. (Placeholders open the LinkedIn / GitHub home page. Empty = hidden.)
    socials: { LinkedIn: 'https://www.linkedin.com/in/wania-naeem17', GitHub: 'https://github.com/Wania-Naeem', Behance: '', Dribbble: '' }
  },

  // Looping strip under Home: it automatically shows ALL your real project screens (assets/projects/...).
  // Keep this empty so no dummy screens appear. (Optional: add extra image files from assets/marquee/ here.)
  marquee: [],

  projects: [
    {
      id: 'donation', layout: 'case', folder: 'donation-routing',
      title: 'Donation Routing System', category: 'UI/UX Design', tools: ['Figma'],
      status: 'Case Study', figmaUrl: 'https://www.figma.com/design/HsMrANVWxFyrVXNttS95u3/Donation-Routing-System?node-id=133-138&t=x5eh5ipSSpFZjnoO-1', prototypeUrl: '',
      description: 'A UI/UX concept focused on making the donation journey easier to understand and navigate through connected screens.',
      images: [
        { src: '01-registration.png', label: 'Registration' },
        { src: '02-login.png', label: 'Login' },
        { src: '03-donation.png', label: 'Donation' },
        { src: '04-donation-tracking.png', label: 'Donation Tracking' }
      ],
      caseStudy: {
        overview: 'A UI/UX concept focused on making the donation journey easier to understand and navigate through connected screens for registration, login, donation and donation tracking.',
        journey: ['Registration', 'Login', 'Donation', 'Donation Tracking'],
        approach: 'The interface was designed directly in Figma, with focus on:',
        approachPoints: ['Clear navigation', 'Visual hierarchy', 'Consistent layouts', 'Straightforward forms', 'Easy-to-understand donation interactions', 'Consistent UI across connected screens'],
        process: ['Understanding the flow', 'Structuring the screens', 'Designing the UI', 'Connecting the experience', 'Refining the interface'],
        takeaway: 'This project helped me practice designing a connected user journey and maintaining consistency across multiple screens.'
      }
    },
    {
      id: 'styra', layout: 'wip', folder: 'styra',
      title: 'STYRA', category: 'UI/UX Design', tools: ['Figma'],
      status: 'Currently Designing', figmaUrl: 'https://www.figma.com/design/VVouue9YsKWUdrsPElWHzL/Styra?node-id=277-369&t=6pqRjxxdOKn1RMUb-1', prototypeUrl: '',
      description: 'An ongoing UI/UX design project. These are the screens designed so far — more will be added as the work continues.',
      images: [ // add or remove entries as you design more screens
        { src: 'screen-01.png', label: 'Screen 01' },
        { src: 'screen-02.png', label: 'Screen 02' },
        { src: 'screen-03.png', label: 'Screen 03' }
      ]
    },
    {
      id: 'ecommerce', layout: 'flow', folder: 'ecommerce',
      title: 'E-commerce Product Experience', category: 'UI Showcase', tools: ['Figma'],
      status: '3 Screens', figmaUrl: 'https://www.figma.com/design/Q9Ue0D7F8W5Dnlhx5NVwKN/design?node-id=2001-218&t=EntmRS8Lx168kmaQ-1', prototypeUrl: '',
      description: 'A visual showcase of three e-commerce screens: onboarding, home and product.',
      images: [
        { src: '01-onboarding.png', label: 'Onboarding' },
        { src: '02-home.png', label: 'Home' },
        { src: '03-product.png', label: 'Product' }
      ]
    },
    {
      id: 'screens', layout: 'gallery', folder: 'screens',
      title: 'Designing Different Screens', category: 'UI Explorations', tools: ['Figma'],
      status: 'Practice Gallery', figmaUrl: 'https://www.figma.com/design/qa13rLarG28bubppeBijrJ/BANO-QABIL-100-ASSIGNMENTS?node-id=0-1&t=sQs78oSjU42QFM0O-1', prototypeUrl: '',
      description: 'A collection of independent UI screens designed for practice and learning. They are separate explorations and do not belong to one product or flow.',
      labels: ['UI Design', 'Visual Hierarchy', 'Layout', 'Typography', 'Color & Composition', 'Interaction Design', 'Screen Design'],
       images: [ // add as many as you like (put files in assets/projects/screens/)
        { src: '01-calculator.png', label: 'Calculator' },
        { src: '02-credit-card-checkout.png', label: 'Credit Card Checkout' },
        { src: '03-virtual-reality.png', label: 'Virtual Reality' },
        { src: '04-download-app.png', label: 'Download App' }
      ]
    }
  ],

  journey: [
    { n: '01', tag: 'MATRICULATION', title: 'F.C. Morris Wala Girls Secondary School', sub: 'Karachi', detail: 'Stream: Science' },
    { n: '02', tag: 'COLLEGE', title: 'Govt. College for Women, Shahrah-e-Liaquat', sub: 'Stream: Pre-Engineering', detail: '' },
    { n: '03', tag: 'UNIVERSITY', title: 'Sindh Madressatul Islam University', sub: 'Bachelors in Software Engineering', detail: 'Currently pursuing' },
    { n: '04', tag: 'UI/UX LEARNING', title: 'Bano Qabil', sub: 'Course: UI/UX Designing', detail: '' },
    { n: '05', tag: 'UI/UX INTERNSHIP', title: 'Styra', sub: 'Internship in Startup', detail: 'On-site Internship' }
  ]
};

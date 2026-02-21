import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import InfoPage from './InfoPage';
import { ResearchType } from '../DataTypes';

// Base sample research data
const sampleResearch: ResearchType = {
  id: '1',
  name: 'Sample Research Project',
  description: 'This is a sample description for the research project. It covers various aspects of modern science and technology.',
  email: 'sample@example.com',
  officeHours: 'Mon-Fri, 9 AM - 5 PM',
  website: 'https://www.example.com/research',
  colleges: ['Engineering', 'Science'],
  department: ['Computer Science'],
  keywords: ['AI', 'Machine Learning', 'Data Science'],
  pastPapers: ['Paper 1 Title', 'Paper 2 Title'],
  requestedYear: 'Junior, Senior',
  requestedExp: '2+ years',
  timeAvail: '10-15 hours/week',
  type: 'Faculty Research',
  topics: ['Artificial Intelligence', 'Computer Vision'],
  researches: ['Research A', 'Research B'],
  labs: ['AI Lab'],
};

const sampleStudentData = {
  savedResearch: [sampleResearch]
};

// Initialize MSW worker
const worker = setupWorker(
  http.get('/research.json', () => {
    return HttpResponse.json({ research: [sampleResearch] });
  }),
  http.get('/studentdata.json', () => {
    return HttpResponse.json(sampleStudentData);
  }),
  http.put('/studentdata.json', () => {
    return new HttpResponse(null, { status: 200 });
  })
);

worker.start();

const meta: Meta<typeof InfoPage> = {
  title: 'Pages/InfoPage',
  component: InfoPage,
  decorators: [
    (Story) => (
      <Router>
        <Story />
      </Router>
    ),
  ],
  parameters: {
    reactRouter: {
      routePath: '/info/:id',
      routeParams: { id: '1' },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof InfoPage>;

// ========== STANDARD SCENARIOS ==========

export const Default: Story = {
  name: 'Default - Standard Research',
  parameters: {
    docs: {
      description: {
        story: 'Standard research opportunity with typical data fields populated.',
      },
    },
  },
};

export const MinimalData: Story = {
  name: 'Minimal Data - Missing Optional Fields',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const minimalResearch: ResearchType = {
            id: 'minimal-1',
            name: 'Minimal Research Project',
            description: 'Basic description only.',
            email: 'minimal@example.com',
            officeHours: '',
            website: '',
            colleges: [],
            department: ['Computer Science'],
            keywords: [],
            pastPapers: [],
            requestedYear: '',
            requestedExp: '',
            timeAvail: '',
            type: 'research',
            topics: [],
            researches: [],
            labs: [],
          };
          return HttpResponse.json({ research: [minimalResearch] });
        }),
      ],
    },
  },
};

export const MaximumData: Story = {
  name: 'Maximum Data - All Fields Filled',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const maxResearch: ResearchType = {
            id: 'max-1',
            name: 'Comprehensive Research Project with Extensive Details and Multiple Collaborators',
            description: 'This is an extremely detailed research description that covers multiple aspects including methodology, expected outcomes, collaboration opportunities, funding sources, publication history, and long-term impact. '.repeat(10),
            email: 'comprehensive.research.project@university.edu',
            officeHours: 'Monday 9:00 AM - 11:00 AM, Wednesday 2:00 PM - 4:00 PM, Friday 10:00 AM - 12:00 PM, By Appointment',
            website: 'https://www.university.edu/departments/computer-science/research/comprehensive-project',
            colleges: ['Engineering', 'Science', 'Business', 'Arts', 'Humanities'],
            department: ['Computer Science', 'Electrical Engineering', 'Mathematics', 'Statistics'],
            keywords: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Neural Networks', 'Computer Vision', 'Natural Language Processing', 'Robotics', 'Data Science', 'Big Data', 'Cloud Computing'],
            pastPapers: [
              'Paper 1: Advanced Techniques in Machine Learning',
              'Paper 2: Deep Learning Applications',
              'Paper 3: Computer Vision Systems',
              'Paper 4: NLP Breakthroughs',
              'Paper 5: Robotics Integration',
              'Paper 6: Data Science Methodologies',
            ],
            requestedYear: 'Sophomore, Junior, Senior, Graduate',
            requestedExp: '2+ years programming experience, familiarity with Python, machine learning coursework preferred',
            timeAvail: '15-20 hours per week during semester, full-time during summer',
            type: 'Faculty Research',
            topics: ['AI', 'ML', 'DL', 'CV', 'NLP', 'Robotics', 'Data Science'],
            researches: ['Research Area 1', 'Research Area 2', 'Research Area 3', 'Research Area 4'],
            labs: ['AI Lab', 'ML Lab', 'Robotics Lab', 'Data Science Lab'],
          };
          return HttpResponse.json({ research: [maxResearch] });
        }),
      ],
    },
  },
};

// ========== EDGE CASES - TEXT LENGTH ==========

export const VeryLongTitle: Story = {
  name: 'Edge Case - Very Long Title',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const longTitleResearch: ResearchType = {
            ...sampleResearch,
            id: 'long-title-1',
            name: 'This is an Extremely Long Research Project Title That Should Test How the UI Handles Very Long Text Without Breaking the Layout or Causing Visual Issues with Wrapping and Overflow'.repeat(2),
          };
          return HttpResponse.json({ research: [longTitleResearch] });
        }),
      ],
    },
  },
};

export const VeryLongDescription: Story = {
  name: 'Edge Case - Very Long Description',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const longDescResearch: ResearchType = {
            ...sampleResearch,
            id: 'long-desc-1',
            description: 'This is a very long description that tests how the component handles extensive text content. '.repeat(50) + 
                        'It includes multiple paragraphs, detailed explanations, and comprehensive information about the research project. '.repeat(20),
          };
          return HttpResponse.json({ research: [longDescResearch] });
        }),
      ],
    },
  },
};

export const VeryLongEmail: Story = {
  name: 'Edge Case - Very Long Email',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const longEmailResearch: ResearchType = {
            ...sampleResearch,
            id: 'long-email-1',
            email: 'very.long.email.address.for.testing.purposes@university.department.research.division.edu',
          };
          return HttpResponse.json({ research: [longEmailResearch] });
        }),
      ],
    },
  },
};

export const VeryLongWebsite: Story = {
  name: 'Edge Case - Very Long Website URL',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const longWebsiteResearch: ResearchType = {
            ...sampleResearch,
            id: 'long-website-1',
            website: 'https://www.university.edu/departments/computer-science/research/projects/very-long-project-name-that-tests-url-display',
          };
          return HttpResponse.json({ research: [longWebsiteResearch] });
        }),
      ],
    },
  },
};

// ========== EDGE CASES - ARRAYS ==========

export const ManyTags: Story = {
  name: 'Edge Case - Many Tags/Keywords',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const manyTagsResearch: ResearchType = {
            ...sampleResearch,
            id: 'many-tags-1',
            keywords: Array.from({ length: 30 }, (_, i) => `Keyword ${i + 1}`),
            colleges: Array.from({ length: 10 }, (_, i) => `College ${i + 1}`),
            department: Array.from({ length: 8 }, (_, i) => `Department ${i + 1}`),
          };
          return HttpResponse.json({ research: [manyTagsResearch] });
        }),
      ],
    },
  },
};

export const EmptyArrays: Story = {
  name: 'Edge Case - Empty Arrays',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const emptyArraysResearch: ResearchType = {
            ...sampleResearch,
            id: 'empty-arrays-1',
            keywords: [],
            colleges: [],
            department: [],
            pastPapers: [],
            topics: [],
            researches: [],
            labs: [],
          };
          return HttpResponse.json({ research: [emptyArraysResearch] });
        }),
      ],
    },
  },
};

export const SingleItemArrays: Story = {
  name: 'Edge Case - Single Item Arrays',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const singleItemResearch: ResearchType = {
            ...sampleResearch,
            id: 'single-item-1',
            keywords: ['Only One Keyword'],
            colleges: ['Only One College'],
            department: ['Only One Department'],
            pastPapers: ['Only One Paper'],
          };
          return HttpResponse.json({ research: [singleItemResearch] });
        }),
      ],
    },
  },
};

// ========== EDGE CASES - SPECIAL CHARACTERS ==========

export const SpecialCharacters: Story = {
  name: 'Edge Case - Special Characters',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const specialCharResearch: ResearchType = {
            ...sampleResearch,
            id: 'special-char-1',
            name: 'Research with Special Characters: <>&"\'/\\',
            description: 'Testing special characters: <script>alert("test")</script>, &amp; entities, "quotes", \'apostrophes\', /slashes/, \\backslashes\\',
            email: 'test+special@example.com',
            keywords: ['C++', 'C#', '.NET', 'Node.js', 'React.js', 'SQL/NoSQL'],
          };
          return HttpResponse.json({ research: [specialCharResearch] });
        }),
      ],
    },
  },
};

export const UnicodeCharacters: Story = {
  name: 'Edge Case - Unicode Characters',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const unicodeResearch: ResearchType = {
            ...sampleResearch,
            id: 'unicode-1',
            name: '研究项目 - Projet de Recherche - Проект Исследования',
            description: 'This research involves: 中文, العربية, русский, 日本語, 한국어, and emoji: 🚀 🔬 📊 💻 🎓',
            email: '研究@example.com',
            keywords: ['中文', '日本語', '한국어', 'العربية', 'Русский', '🚀', '🔬'],
          };
          return HttpResponse.json({ research: [unicodeResearch] });
        }),
      ],
    },
  },
};

// ========== EDGE CASES - REQUIREMENTS ==========

export const NoRequirements: Story = {
  name: 'Edge Case - No Requirements',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const noReqsResearch: ResearchType = {
            ...sampleResearch,
            id: 'no-reqs-1',
            requestedYear: '',
            requestedExp: '',
            timeAvail: '',
          };
          return HttpResponse.json({ research: [noReqsResearch] });
        }),
      ],
    },
  },
};

export const LongRequirements: Story = {
  name: 'Edge Case - Long Requirements Text',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const longReqsResearch: ResearchType = {
            ...sampleResearch,
            id: 'long-reqs-1',
            requestedYear: 'Freshman, Sophomore, Junior, Senior, Graduate, Post-Doctoral, Visiting Scholar',
            requestedExp: 'Extensive experience in multiple programming languages including Python, Java, C++, JavaScript, TypeScript, Rust, Go, and familiarity with machine learning frameworks such as TensorFlow, PyTorch, Scikit-learn, and data processing tools like Pandas, NumPy, and Spark',
            timeAvail: 'Minimum 20 hours per week during academic year, full-time availability during summer and winter breaks, flexible scheduling required for international collaboration meetings',
          };
          return HttpResponse.json({ research: [longReqsResearch] });
        }),
      ],
    },
  },
};

// ========== EDGE CASES - CONTACTS & OPPORTUNITIES ==========

export const ManyContacts: Story = {
  name: 'Edge Case - Many Contacts',
  parameters: {
    docs: {
      description: {
        story: 'Tests the ContactsSection with a large number of contact cards. Note: This requires modifying the component to accept more contacts.',
      },
    },
  },
};

export const NoContacts: Story = {
  name: 'Edge Case - No Contacts',
  parameters: {
    docs: {
      description: {
        story: 'Tests the ContactsSection with no contacts. Note: This requires modifying the component to handle empty contacts array.',
      },
    },
  },
};

export const ManyRelatedOpportunities: Story = {
  name: 'Edge Case - Many Related Opportunities',
  parameters: {
    docs: {
      description: {
        story: 'Tests the RelatedOpportunitiesSection with many opportunities. Note: This requires modifying the component to accept more opportunities.',
      },
    },
  },
};

// ========== ERROR STATES ==========

export const Loading: Story = {
  name: 'Error State - Loading',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          return new HttpResponse(null, { status: 202 });
        }),
      ],
    },
  },
};

export const NetworkError: Story = {
  name: 'Error State - Network Error',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          return HttpResponse.error();
        }),
        http.get('/studentdata.json', () => {
          return HttpResponse.error();
        }),
      ],
    },
  },
};

export const ServerError: Story = {
  name: 'Error State - Server Error (500)',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

export const NotFound: Story = {
  name: 'Error State - Not Found (404)',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          return new HttpResponse(null, { status: 404 });
        }),
      ],
    },
  },
};

// ========== DATA VARIATIONS ==========

export const UnsavedResearch: Story = {
  name: 'Data Variation - Unsaved Research',
  parameters: {
    reactRouter: {
      routePath: '/info/:id',
      routeParams: { id: '2' },
    },
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const unsavedResearch = { ...sampleResearch, id: '2', name: 'Unsaved Research' };
          return HttpResponse.json({ research: [unsavedResearch] });
        }),
        http.get('/studentdata.json', () => {
          return HttpResponse.json({ savedResearch: [] });
        }),
      ],
    },
  },
};

export const SavedResearch: Story = {
  name: 'Data Variation - Saved Research',
  parameters: {
    reactRouter: {
      routePath: '/info/:id',
      routeParams: { id: '1' },
    },
    msw: {
      handlers: [
        http.get('/research.json', () => {
          return HttpResponse.json({ research: [sampleResearch] });
        }),
        http.get('/studentdata.json', () => {
          return HttpResponse.json({ savedResearch: [sampleResearch] });
        }),
      ],
    },
  },
};

export const DifferentFieldTypes: Story = {
  name: 'Data Variation - Different Field Types',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const differentTypesResearch: ResearchType = {
            id: 'types-1',
            name: 'Research with Different Field Types',
            description: 'Short description.',
            email: 'types@example.com',
            officeHours: 'TBD',
            website: 'http://example.com',
            colleges: ['Engineering'],
            department: ['CS'],
            keywords: ['A', 'B', 'C'],
            pastPapers: ['Paper'],
            requestedYear: 'Any',
            requestedExp: 'None',
            timeAvail: 'Flexible',
            type: 'research',
            topics: ['Topic'],
            researches: ['Research'],
            labs: ['Lab'],
          };
          return HttpResponse.json({ research: [differentTypesResearch] });
        }),
      ],
    },
  },
};

// ========== STRESS TEST SCENARIOS ==========

export const StressTestAllFields: Story = {
  name: 'Stress Test - All Edge Cases Combined',
  parameters: {
    msw: {
      handlers: [
        http.get('/research.json', () => {
          const stressTestResearch: ResearchType = {
            id: 'stress-1',
            name: 'Stress Test: Very Long Title with Special Characters <>&"\' and Unicode 研究项目 🚀'.repeat(3),
            description: 'Combined stress test: '.repeat(100) + 'Special chars: <script></script> & "quotes" \'apostrophes\' /slashes/ \\backslashes\\ Unicode: 中文 العربية русский 日本語 한국어 🚀🔬📊💻🎓',
            email: 'very.long.email.address.with.special.chars+test@university.department.research.division.edu',
            officeHours: 'Monday 9:00 AM - 11:00 AM, Wednesday 2:00 PM - 4:00 PM, Friday 10:00 AM - 12:00 PM, By Appointment, Flexible Hours Available',
            website: 'https://www.university.edu/departments/computer-science/research/projects/very-long-project-name-that-tests-url-display-and-handling',
            colleges: Array.from({ length: 15 }, (_, i) => `College ${i + 1} with Special Chars <>&"`),
            department: Array.from({ length: 10 }, (_, i) => `Department ${i + 1}`),
            keywords: Array.from({ length: 25 }, (_, i) => `Keyword ${i + 1} with Special: <>&"`),
            pastPapers: Array.from({ length: 20 }, (_, i) => `Paper ${i + 1}: Very Long Paper Title That Tests Display`),
            requestedYear: 'Freshman, Sophomore, Junior, Senior, Graduate, Post-Doctoral, Visiting Scholar, Any Year Level Accepted',
            requestedExp: 'Extensive experience required in multiple areas: '.repeat(5),
            timeAvail: 'Minimum 20 hours per week during academic year, full-time availability during summer and winter breaks, flexible scheduling required',
            type: 'Faculty Research',
            topics: Array.from({ length: 12 }, (_, i) => `Topic ${i + 1}`),
            researches: Array.from({ length: 8 }, (_, i) => `Research ${i + 1}`),
            labs: Array.from({ length: 6 }, (_, i) => `Lab ${i + 1}`),
          };
          return HttpResponse.json({ research: [stressTestResearch] });
        }),
      ],
    },
  },
};

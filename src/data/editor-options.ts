// Industry options for dropdown
export const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance & Banking',
  'Real Estate',
  'E-commerce',
  'Manufacturing',
  'Education',
  'Hospitality & Tourism',
  'Food & Beverage',
  'Retail',
  'Professional Services',
  'Marketing & Advertising',
  'Construction',
  'Transportation & Logistics',
  'Energy & Utilities',
  'Non-profit',
  'Government',
  'Entertainment & Media',
  'Automotive',
  'Agriculture',
  'Consulting',
  'Legal Services',
  'Insurance',
  'Telecommunications',
  'Software as a Service (SaaS)'
]

// US States for geography selection
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 
  'West Virginia', 'Wisconsin', 'Wyoming'
]

// Major US Cities grouped by region
export const US_CITIES_BY_REGION = {
  'West Coast': [
    'Los Angeles, CA', 'San Francisco, CA', 'San Diego, CA', 'San Jose, CA',
    'Seattle, WA', 'Portland, OR', 'Oakland, CA', 'Sacramento, CA',
    'Fresno, CA', 'Long Beach, CA', 'Santa Ana, CA', 'Anaheim, CA'
  ],
  'East Coast': [
    'New York, NY', 'Boston, MA', 'Philadelphia, PA', 'Miami, FL',
    'Atlanta, GA', 'Washington, DC', 'Baltimore, MD', 'Virginia Beach, VA',
    'Jacksonville, FL', 'Tampa, FL', 'Newark, NJ', 'Buffalo, NY'
  ],
  'Texas': [
    'Houston, TX', 'Dallas, TX', 'San Antonio, TX', 'Austin, TX',
    'Fort Worth, TX', 'El Paso, TX', 'Arlington, TX', 'Corpus Christi, TX',
    'Plano, TX', 'Laredo, TX', 'Garland, TX', 'Irving, TX'
  ],
  'Midwest': [
    'Chicago, IL', 'Detroit, MI', 'Indianapolis, IN', 'Columbus, OH',
    'Milwaukee, WI', 'Kansas City, MO', 'Omaha, NE', 'Minneapolis, MN',
    'Cleveland, OH', 'Wichita, KS', 'St. Louis, MO', 'Cincinnati, OH'
  ],
  'Southwest': [
    'Phoenix, AZ', 'Denver, CO', 'Las Vegas, NV', 'Albuquerque, NM',
    'Tucson, AZ', 'Mesa, AZ', 'Colorado Springs, CO', 'Aurora, CO',
    'Henderson, NV', 'Chandler, AZ', 'Scottsdale, AZ', 'Glendale, AZ'
  ],
  'Southeast': [
    'Charlotte, NC', 'Nashville, TN', 'Memphis, TN', 'Louisville, KY',
    'New Orleans, LA', 'Raleigh, NC', 'Orlando, FL', 'St. Petersburg, FL',
    'Greensboro, NC', 'Durham, NC', 'Norfolk, VA', 'Chesapeake, VA'
  ]
}

// Flatten all cities for search
export const ALL_US_CITIES = Object.values(US_CITIES_BY_REGION).flat()

// Geography options combining nationwide, states, and cities
export const GEOGRAPHY_OPTIONS = [
  'United States (Nationwide)',
  ...US_STATES.map(state => `${state} (State)`),
  ...ALL_US_CITIES
]

// Geography options organized by category for multi-select
export const GEOGRAPHY_OPTIONS_GROUPED = {
  'Nationwide': ['United States (Nationwide)'],
  'States': US_STATES.map(state => `${state} (State)`),
  'West Coast': US_CITIES_BY_REGION['West Coast'],
  'East Coast': US_CITIES_BY_REGION['East Coast'],
  'Texas': US_CITIES_BY_REGION['Texas'],
  'Midwest': US_CITIES_BY_REGION['Midwest'],
  'Southwest': US_CITIES_BY_REGION['Southwest'],
  'Southeast': US_CITIES_BY_REGION['Southeast']
}

// Job titles for dropdown
export const JOB_TITLE_OPTIONS = [
  'CEO',
  'COO',
  'CFO',
  'CTO',
  'CMO',
  'VP of Sales',
  'VP of Marketing',
  'VP of Operations',
  'Sales Director',
  'Marketing Director',
  'Operations Director',
  'Sales Manager',
  'Marketing Manager',
  'Operations Manager',
  'Account Manager',
  'Business Development Manager',
  'Project Manager',
  'Product Manager',
  'General Manager',
  'Regional Manager',
  'Territory Manager',
  'Channel Manager',
  'Partnership Manager',
  'Customer Success Manager',
  'Procurement Manager',
  'Purchasing Manager',
  'Buyer',
  'Senior Buyer',
  'Procurement Director',
  'Supply Chain Manager',
  'Logistics Manager',
  'Event Coordinator',
  'Event Manager',
  'Event Director',
  'Marketing Coordinator',
  'Sales Coordinator',
  'Business Analyst',
  'Decision Maker',
  'Key Stakeholder',
  'Department Head',
  'Team Lead',
  'Senior Manager',
  'Director',
  'Vice President',
  'Executive',
  'Owner',
  'Founder',
  'Partner'
]

// Department options
export const DEPARTMENT_OPTIONS = [
  'Sales',
  'Marketing',
  'Operations',
  'Business Development',
  'Customer Success',
  'Procurement',
  'Supply Chain',
  'Logistics',
  'Events',
  'Human Resources',
  'Finance',
  'Accounting',
  'Legal',
  'IT',
  'Technology',
  'Product',
  'Engineering',
  'Design',
  'Customer Service',
  'Support',
  'Administration',
  'Executive',
  'Management',
  'Strategy',
  'Planning',
  'Quality Assurance',
  'Research & Development',
  'Manufacturing',
  'Production',
  'Facilities',
  'Security',
  'Compliance',
  'Risk Management'
]

// Communication style presets
export const COMMUNICATION_STYLES = [
  'Professional and formal',
  'Warm and friendly',
  'Casual and conversational',
  'Direct and to-the-point',
  'Enthusiastic and energetic',
  'Consultative and advisory',
  'Empathetic and understanding',
  'Confident and authoritative',
  'Helpful and supportive',
  'Humorous and light-hearted',
  'Technical and detailed',
  'Simple and clear',
  'Personal and relatable',
  'Inspiring and motivational'
]

// Company size presets
export const COMPANY_SIZE_PRESETS = [
  { employees: 10, label: '1-10 employees (Startup)' },
  { employees: 25, label: '11-25 employees (Small)' },
  { employees: 50, label: '26-50 employees (Small)' },
  { employees: 100, label: '51-100 employees (Medium)' },
  { employees: 250, label: '101-250 employees (Medium)' },
  { employees: 500, label: '251-500 employees (Large)' },
  { employees: 1000, label: '501-1000 employees (Large)' },
  { employees: 2500, label: '1001-2500 employees (Enterprise)' },
  { employees: 5000, label: '2501-5000 employees (Enterprise)' },
  { employees: 10000, label: '5000+ employees (Enterprise)' }
]
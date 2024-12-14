import { useState } from "react";
import api from "../api";
import { data, useNavigate } from "react-router-dom";

function CustomSearch(){
    const [medianHomePrice, setMedianHomePrice] = useState(0);
    const [crimeRate, setCrimeRate] = useState(0);
    const [population, setPopulation] = useState(0);
    const [populationDensity, setPopulationDensity] = useState(0);
    const [costOfLiving, setCostOfLiving] = useState(0);
    const [medianFamilyIncome, setMedianFamilyIncome] = useState(0);
    const [naturalDisasterCount, setNaturalDisasterCount] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [industry, setIndustry] = useState("");
    const [salary, setSalary] = useState(0);
    const [industryJobs1000, setIndustryJobs1000] = useState(0);
    const [medianHomePriceImportance, setMedianHomePriceImportance] = useState(0);
    const [crimeRateImportance, setCrimeRateImportance] = useState(0);
    const [populationImportance, setPopulationImportance] = useState(0);
    const [populationDensityImportance, setPopulationDensityImportance] = useState(0);
    const [costOfLivingImportance, setCostOfLivingImportance] = useState(0);
    const [medianFamilyIncomeImportance, setMedianFamilyIncomeImportance] = useState(0);
    const [naturalDisasterCountImportance, setNaturalDisasterCountImportance] = useState(0);
    const [locationImportance, setLocationImportance] = useState(0);
    const [salaryImportance, setSalaryImportance] = useState(0);
    const [industryJobs1000Importance, setIndustryJobs1000Importance] = useState(0);
    const jobs = ['Select An Industry', 'Accountants and Auditors', 'Actors', 'Actuaries', 'Acupuncturists', 'Adhesive Bonding Machine Operators and Tenders', 'Administrative Law Judges, Adjudicators, and Hearing Officers', 'Administrative Services Managers', 'Adult Basic Education, Adult Secondary Education, and English as a Second Language Instructors', 'Advertising Sales Agents', 'Advertising and Promotions Managers', 'Aerospace Engineering and Operations Technologists and Technicians', 'Aerospace Engineers', 'Agents and Business Managers of Artists, Performers, and Athletes', 'Agricultural Engineers', 'Agricultural Equipment Operators', 'Agricultural Inspectors', 'Agricultural Sciences Teachers, Postsecondary', 'Agricultural Technicians', 'Agricultural Workers, All Other', 'Air Traffic Controllers', 'Aircraft Cargo Handling Supervisors', 'Aircraft Service Attendants', 'Aircraft Structure, Surfaces, Rigging, and Systems Assemblers', 'Airfield Operations Specialists', 'Airline Pilots, Copilots, and Flight Engineers', 'Ambulance Drivers and Attendants, Except Emergency Medical Technicians', 'Amusement and Recreation Attendants', 'Anesthesiologists', 'Animal Breeders', 'Animal Caretakers', 'Animal Control Workers', 'Animal Scientists', 'Animal Trainers', 'Anthropologists and Archeologists', 'Anthropology and Archeology Teachers, Postsecondary', 'Arbitrators, Mediators, and Conciliators', 'Architects, Except Landscape and Naval', 'Architectural and Civil Drafters', 'Architectural and Engineering Managers', 'Architecture Teachers, Postsecondary', 'Archivists', 'Area, Ethnic, and Cultural Studies Teachers, Postsecondary', 'Art Directors', 'Art, Drama, and Music Teachers, Postsecondary', 'Artists and Related Workers, All Other', 'Arts, Design, Entertainment, Sports, and Media Occupations', 'Astronomers', 'Athletes and Sports Competitors', 'Athletic Trainers', 'Atmospheric and Space Scientists', 'Atmospheric, Earth, Marine, and Space Sciences Teachers, Postsecondary', 'Audio and Video Technicians', 'Audiologists', 'Audiovisual Equipment Installers and Repairers', 'Automotive Glass Installers and Repairers', 'Automotive and Watercraft Service Attendants', 'Avionics Technicians', 'Baggage Porters and Bellhops', 'Bailiffs', 'Bakers', 'Barbers', 'Bartenders', 'Bicycle Repairers', 'Bill and Account Collectors', 'Billing and Posting Clerks', 'Biochemists and Biophysicists', 'Bioengineers and Biomedical Engineers', 'Biological Science Teachers, Postsecondary', 'Biological Scientists, All Other', 'Biological Technicians', 'Boilermakers', 'Bookkeeping, Accounting, and Auditing Clerks', 'Brickmasons and Blockmasons', 'Bridge and Lock Tenders', 'Broadcast Announcers and Radio Disc Jockeys', 'Broadcast Technicians', 'Brokerage Clerks', 'Budget Analysts', 'Building Cleaning Workers, All Other', 'Bus Drivers, School', 'Bus Drivers, Transit and Intercity', 'Business Operations Specialists, All Other', 'Business Teachers, Postsecondary', 'Butchers and Meat Cutters', 'Buyers and Purchasing Agents', 'Cabinetmakers and Bench Carpenters', 'Calibration Technologists and Technicians', 'Camera Operators, Television, Video, and Film', 'Camera and Photographic Equipment Repairers', 'Captains, Mates, and Pilots of Water Vessels', 'Cardiologists', 'Cardiovascular Technologists and Technicians', 'Career/Technical Education Teachers, Middle School', 'Career/Technical Education Teachers, Postsecondary', 'Career/Technical Education Teachers, Secondary School', 'Cargo and Freight Agents', 'Carpenters', 'Carpet Installers', 'Cartographers and Photogrammetrists', 'Cashiers', 'Cement Masons and Concrete Finishers', 'Chefs and Head Cooks', 'Chemical Engineers', 'Chemical Equipment Operators and Tenders', 'Chemical Plant and System Operators', 'Chemical Technicians', 'Chemistry Teachers, Postsecondary', 'Chemists', 'Chief Executives', 'Child, Family, and School Social Workers', 'Childcare Workers', 'Chiropractors', 'Choreographers', 'Civil Engineering Technologists and Technicians', 'Civil Engineers', 'Claims Adjusters, Examiners, and Investigators', 'Cleaners of Vehicles and Equipment', 'Cleaning, Washing, and Metal Pickling Equipment Operators and Tenders', 'Clergy', 'Clinical Laboratory Technologists and Technicians', 'Clinical and Counseling Psychologists', 'Coating, Painting, and Spraying Machine Setters, Operators, and Tenders', 'Coil Winders, Tapers, and Finishers', 'Coin, Vending, and Amusement Machine Servicers and Repairers', 'Commercial Divers', 'Commercial Pilots', 'Commercial and Industrial Designers', 'Communications Equipment Operators, All Other', 'Communications Teachers, Postsecondary', 'Community Health Workers', 'Community and Social Service Specialists, All Other', 'Compensation and Benefits Managers', 'Compensation, Benefits, and Job Analysis Specialists', 'Compliance Officers', 'Computer Hardware Engineers', 'Computer Network Architects', 'Computer Network Support Specialists', 'Computer Numerically Controlled Tool Operators', 'Computer Numerically Controlled Tool Programmers', 'Computer Occupations, All Other', 'Computer Programmers', 'Computer Science Teachers, Postsecondary', 'Computer Systems Analysts', 'Computer User Support Specialists', 'Computer and Information Research Scientists', 'Computer and Information Systems Managers', 'Computer, Automated Teller, and Office Machine Repairers', 'Concierges', 'Conservation Scientists', 'Construction Laborers', 'Construction Managers', 'Construction and Building Inspectors', 'Continuous Mining Machine Operators', 'Control and Valve Installers and Repairers, Except Mechanical Door', 'Conveyor Operators and Tenders', 'Cooks, All Other', 'Cooks, Fast Food', 'Cooks, Institution and Cafeteria', 'Cooks, Restaurant', 'Cooks, Short Order', 'Cooling and Freezing Equipment Operators and Tenders', 'Correctional Officers and Jailers', 'Correspondence Clerks', 'Cost Estimators', 'Costume Attendants', 'Counselors, All Other', 'Counter and Rental Clerks', 'Couriers and Messengers', 'Court Reporters and Simultaneous Captioners', 'Court, Municipal, and License Clerks', 'Craft Artists', 'Crane and Tower Operators', 'Credit Analysts', 'Credit Authorizers, Checkers, and Clerks', 'Credit Counselors', 'Crematory Operators', 'Criminal Justice and Law Enforcement Teachers, Postsecondary', 'Crossing Guards and Flaggers', 'Crushing, Grinding, and Polishing Machine Setters, Operators, and Tenders', 'Curators', 'Customer Service Representatives', 'Cutters and Trimmers, Hand', 'Cutting and Slicing Machine Setters, Operators, and Tenders', 'Cutting, Punching, and Press Machine Setters, Operators, and Tenders, Metal and Plastic', 'Dancers', 'Data Entry Keyers', 'Data Scientists', 'Database Administrators', 'Database Architects', 'Demonstrators and Product Promoters', 'Dental Assistants', 'Dental Hygienists', 'Dental Laboratory Technicians', 'Dentists, All Other Specialists', 'Dentists, General', 'Dermatologists', 'Derrick Operators, Oil and Gas', 'Designers, All Other', 'Desktop Publishers', 'Detectives and Criminal Investigators', 'Diagnostic Medical Sonographers', 'Dietetic Technicians', 'Dietitians and Nutritionists', 'Dining Room and Cafeteria Attendants and Bartender Helpers', 'Directors, Religious Activities and Education', 'Disc Jockeys, Except Radio', 'Dishwashers', 'Dispatchers, Except Police, Fire, and Ambulance', 'Door-to-Door Sales Workers, News and Street Vendors, and Related Workers', 'Drafters, All Other', 'Dredge Operators', 'Drilling and Boring Machine Tool Setters, Operators, and Tenders, Metal and Plastic', 'Driver/Sales Workers', 'Drywall and Ceiling Tile Installers', 'Earth Drillers, Except Oil and Gas', 'Economics Teachers, Postsecondary', 'Economists', 'Editors', 'Education Administrators, All Other', 'Education Administrators, Kindergarten through Secondary', 'Education Administrators, Postsecondary', 'Education Teachers, Postsecondary', 'Education and Childcare Administrators, Preschool and Daycare', 'Educational Instruction and Library Workers, All Other', 'Educational, Guidance, and Career Counselors and Advisors', 'Electric Motor, Power Tool, and Related Repairers', 'Electrical Engineers', 'Electrical and Electronic Engineering Technologists and Technicians', 'Electrical and Electronics Drafters', 'Electrical and Electronics Installers and Repairers, Transportation Equipment', 'Electrical and Electronics Repairers, Commercial and Industrial Equipment', 'Electrical and Electronics Repairers, Powerhouse, Substation, and Relay', 'Electrical, Electronic, and Electromechanical Assemblers, Except Coil Winders, Tapers, and Finishers', 'Electricians', 'Electro-Mechanical and Mechatronics Technologists and Technicians', 'Electronic Equipment Installers and Repairers, Motor Vehicles', 'Electronics Engineers, Except Computer', 'Elementary School Teachers, Except Special Education', 'Elevator and Escalator Installers and Repairers', 'Eligibility Interviewers, Government Programs', 'Embalmers', 'Emergency Management Directors', 'Emergency Medical Technicians', 'Emergency Medicine Physicians', 'Engine and Other Machine Assemblers', 'Engineering Teachers, Postsecondary', 'Engineering Technologists and Technicians, Except Drafters, All Other', 'Engineers, All Other', 'English Language and Literature Teachers, Postsecondary', 'Entertainers and Performers, Sports and Related Workers, All Other', 'Entertainment Attendants and Related Workers, All Other', 'Entertainment and Recreation Managers, Except Gambling', 'Environmental Engineering Technologists and Technicians', 'Environmental Engineers', 'Environmental Science Teachers, Postsecondary', 'Environmental Science and Protection Technicians, Including Health', 'Environmental Scientists and Specialists, Including Health', 'Epidemiologists', 'Etchers and Engravers', 'Excavating and Loading Machine and Dragline Operators, Surface Mining', 'Executive Secretaries and Executive Administrative Assistants', 'Exercise Physiologists', 'Exercise Trainers and Group Fitness Instructors', 'Explosives Workers, Ordnance Handling Experts, and Blasters', 'Extraction Workers, All Other', 'Extruding and Drawing Machine Setters, Operators, and Tenders, Metal and Plastic', 'Extruding and Forming Machine Setters, Operators, and Tenders, Synthetic and Glass Fibers', 'Extruding, Forming, Pressing, and Compacting Machine Setters, Operators, and Tenders', 'Fabric and Apparel Patternmakers', 'Facilities Managers', 'Fallers', 'Family Medicine Physicians', 'Family and Consumer Sciences Teachers, Postsecondary', 'Farm Equipment Mechanics and Service Technicians', 'Farm Labor Contractors', 'Farm and Home Management Educators', 'Farmers, Ranchers, and Other Agricultural Managers', 'Farmworkers and Laborers, Crop, Nursery, and Greenhouse', 'Farmworkers, Farm, Ranch, and Aquacultural Animals', 'Fashion Designers', 'Fast Food and Counter Workers', 'Fence Erectors', 'Fiberglass Laminators and Fabricators', 'File Clerks', 'Film and Video Editors', 'Financial Clerks, All Other', 'Financial Examiners', 'Financial Managers', 'Financial Risk Specialists', 'Financial Specialists, All Other', 'Financial and Investment Analysts', 'Fine Artists, Including Painters, Sculptors, and Illustrators', 'Fire Inspectors and Investigators', 'Firefighters', 'First-Line Supervisors of Construction Trades and Extraction Workers', 'First-Line Supervisors of Correctional Officers', 'First-Line Supervisors of Entertainment and Recreation Workers, Except Gambling Services', 'First-Line Supervisors of Farming, Fishing, and Forestry Workers', 'First-Line Supervisors of Firefighting and Prevention Workers', 'First-Line Supervisors of Food Preparation and Serving Workers', 'First-Line Supervisors of Gambling Services Workers', 'First-Line Supervisors of Housekeeping and Janitorial Workers', 'First-Line Supervisors of Landscaping, Lawn Service, and Groundskeeping Workers', 'First-Line Supervisors of Mechanics, Installers, and Repairers', 'First-Line Supervisors of Non-Retail Sales Workers', 'First-Line Supervisors of Office and Administrative Support Workers', 'First-Line Supervisors of Personal Service Workers', 'First-Line Supervisors of Police and Detectives', 'First-Line Supervisors of Production and Operating Workers', 'First-Line Supervisors of Protective Service Workers, All Other', 'First-Line Supervisors of Retail Sales Workers', 'First-Line Supervisors of Security Workers', 'First-Line Supervisors of Transportation and Material Moving Workers, Except Aircraft Cargo Handling Supervisors', 'Fish and Game Wardens', 'Flight Attendants', 'Floor Layers, Except Carpet, Wood, and Hard Tiles', 'Floor Sanders and Finishers', 'Floral Designers', 'Food Batchmakers', 'Food Cooking Machine Operators and Tenders', 'Food Preparation Workers', 'Food Preparation and Serving Related Workers, All Other', 'Food Processing Workers, All Other', 'Food Science Technicians', 'Food Scientists and Technologists', 'Food Servers, Nonrestaurant', 'Food Service Managers', 'Food and Tobacco Roasting, Baking, and Drying Machine Operators and Tenders', 'Foreign Language and Literature Teachers, Postsecondary', 'Forensic Science Technicians', 'Forest Fire Inspectors and Prevention Specialists', 'Forest and Conservation Technicians', 'Forest and Conservation Workers', 'Foresters', 'Forestry and Conservation Science Teachers, Postsecondary', 'Forging Machine Setters, Operators, and Tenders, Metal and Plastic', 'Foundry Mold and Coremakers', 'Fundraisers', 'Fundraising Managers', 'Funeral Attendants', 'Funeral Home Managers', 'Furnace, Kiln, Oven, Drier, and Kettle Operators and Tenders', 'Furniture Finishers', 'Gambling Cage Workers', 'Gambling Change Persons and Booth Cashiers', 'Gambling Dealers', 'Gambling Managers', 'Gambling Service Workers, All Other', 'Gambling Surveillance Officers and Gambling Investigators', 'Gambling and Sports Book Writers and Runners', 'Gas Compressor and Gas Pumping Station Operators', 'Gas Plant Operators', 'General Internal Medicine Physicians', 'General and Operations Managers', 'Genetic Counselors', 'Geographers', 'Geography Teachers, Postsecondary', 'Geological Technicians, Except Hydrologic Technicians', 'Geoscientists, Except Hydrologists and Geographers', 'Glaziers', 'Graders and Sorters, Agricultural Products', 'Grinding and Polishing Workers, Hand', 'Grinding, Lapping, Polishing, and Buffing Machine Tool Setters, Operators, and Tenders, Metal and Plastic', 'Grounds Maintenance Workers, All Other', 'Hairdressers, Hairstylists, and Cosmetologists', 'Hazardous Materials Removal Workers', 'Health Education Specialists', 'Health Information Technologists and Medical Registrars', 'Health Specialties Teachers, Postsecondary', 'Health Technologists and Technicians, All Other', 'Health and Safety Engineers, Except Mining Safety Engineers and Inspectors', 'Healthcare Diagnosing or Treating Practitioners, All Other', 'Healthcare Practitioners and Technical Workers, All Other', 'Healthcare Social Workers', 'Healthcare Support Workers, All Other', 'Hearing Aid Specialists', 'Heat Treating Equipment Setters, Operators, and Tenders, Metal and Plastic', 'Heating, Air Conditioning, and Refrigeration Mechanics and Installers', 'Heavy and Tractor-Trailer Truck Drivers', 'Helpers, Construction Trades, All Other', 'Helpers--Brickmasons, Blockmasons, Stonemasons, and Tile and Marble Setters', 'Helpers--Carpenters', 'Helpers--Electricians', 'Helpers--Extraction Workers', 'Helpers--Installation, Maintenance, and Repair Workers', 'Helpers--Painters, Paperhangers, Plasterers, and Stucco Masons', 'Helpers--Pipelayers, Plumbers, Pipefitters, and Steamfitters', 'Helpers--Production Workers', 'Helpers--Roofers', 'Highway Maintenance Workers', 'Historians', 'History Teachers, Postsecondary', 'Hoist and Winch Operators', 'Home Appliance Repairers', 'Home Health and Personal Care Aides', 'Hosts and Hostesses, Restaurant, Lounge, and Coffee Shop', 'Hotel, Motel, and Resort Desk Clerks', 'Human Resources Assistants, Except Payroll and Timekeeping', 'Human Resources Managers', 'Human Resources Specialists', 'Hydrologic Technicians', 'Hydrologists', 'Industrial Engineering Technologists and Technicians', 'Industrial Engineers', 'Industrial Production Managers', 'Industrial Truck and Tractor Operators', 'Industrial-Organizational Psychologists', 'Information Security Analysts', 'Information and Record Clerks, All Other', 'Inspectors, Testers, Sorters, Samplers, and Weighers', 'Installation, Maintenance, and Repair Occupations', 'Installation, Maintenance, and Repair Workers, All Other', 'Instructional Coordinators', 'Insulation Workers, Floor, Ceiling, and Wall', 'Insulation Workers, Mechanical', 'Insurance Appraisers, Auto Damage', 'Insurance Claims and Policy Processing Clerks', 'Insurance Sales Agents', 'Insurance Underwriters', 'Interior Designers', 'Interpreters and Translators', 'Interviewers, Except Eligibility and Loan', 'Janitors and Cleaners, Except Maids and Housekeeping Cleaners', 'Jewelers and Precious Stone and Metal Workers', 'Judges, Magistrate Judges, and Magistrates', 'Judicial Law Clerks', 'Kindergarten Teachers, Except Special Education', 'Labor Relations Specialists', 'Laborers and Freight, Stock, and Material Movers, Hand', 'Landscape Architects', 'Landscaping and Groundskeeping Workers', 'Lathe and Turning Machine Tool Setters, Operators, and Tenders, Metal and Plastic', 'Laundry and Dry-Cleaning Workers', 'Law Teachers, Postsecondary', 'Lawyers', 'Layout Workers, Metal and Plastic', 'Legal Secretaries and Administrative Assistants', 'Legal Support Workers, All Other', 'Legislators', 'Librarians and Media Collections Specialists', 'Library Assistants, Clerical', 'Library Science Teachers, Postsecondary', 'Library Technicians', 'Licensed Practical and Licensed Vocational Nurses', 'Life Scientists, All Other', 'Life, Physical, and Social Science Occupations', 'Life, Physical, and Social Science Technicians, All Other', 'Lifeguards, Ski Patrol, and Other Recreational Protective Service Workers', 'Light Truck Drivers', 'Lighting Technicians', 'Loading and Moving Machine Operators, Underground Mining', 'Loan Interviewers and Clerks', 'Loan Officers', 'Locker Room, Coatroom, and Dressing Room Attendants', 'Locksmiths and Safe Repairers', 'Locomotive Engineers', 'Lodging Managers', 'Log Graders and Scalers', 'Logging Equipment Operators', 'Logging Workers, All Other', 'Logisticians', 'Machine Feeders and Offbearers', 'Machinists', 'Magnetic Resonance Imaging Technologists', 'Maids and Housekeeping Cleaners', 'Mail Clerks and Mail Machine Operators, Except Postal Service', 'Maintenance Workers, Machinery', 'Maintenance and Repair Workers, General', 'Makeup Artists, Theatrical and Performance', 'Management Analysts', 'Managers, All Other', 'Manicurists and Pedicurists', 'Manufactured Building and Mobile Home Installers', 'Marine Engineers and Naval Architects', 'Market Research Analysts and Marketing Specialists', 'Marketing Managers', 'Marriage and Family Therapists', 'Massage Therapists', 'Material Moving Workers, All Other', 'Materials Engineers', 'Materials Scientists', 'Mathematical Science Occupations, All Other', 'Mathematical Science Teachers, Postsecondary', 'Mathematicians', 'Meat, Poultry, and Fish Cutters and Trimmers', 'Mechanical Door Repairers', 'Mechanical Drafters', 'Mechanical Engineering Technologists and Technicians', 'Mechanical Engineers', 'Media and Communication Equipment Workers, All Other', 'Media and Communication Workers, All Other', 'Medical Appliance Technicians', 'Medical Assistants', 'Medical Dosimetrists', 'Medical Equipment Preparers', 'Medical Equipment Repairers', 'Medical Records Specialists', 'Medical Scientists, Except Epidemiologists', 'Medical Secretaries and Administrative Assistants', 'Medical Transcriptionists', 'Medical and Health Services Managers', 'Meeting, Convention, and Event Planners', 'Mental Health and Substance Abuse Social Workers', 'Metal Workers and Plastic Workers, All Other', 'Metal-Refining Furnace Operators and Tenders', 'Meter Readers, Utilities', 'Microbiologists', 'Middle School Teachers, Except Special and Career/Technical Education', 'Milling and Planing Machine Setters, Operators, and Tenders, Metal and Plastic', 'Millwrights', 'Mining and Geological Engineers, Including Mining Safety Engineers', 'Miscellaneous Assemblers and Fabricators', 'Miscellaneous Construction and Related Workers', 'Mixing and Blending Machine Setters, Operators, and Tenders', 'Mobile Heavy Equipment Mechanics, Except Engines', 'Model Makers, Metal and Plastic', 'Models', 'Molders, Shapers, and Casters, Except Metal and Plastic', 'Molding, Coremaking, and Casting Machine Setters, Operators, and Tenders, Metal and Plastic', 'Morticians, Undertakers, and Funeral Arrangers', 'Motion Picture Projectionists', 'Motor Vehicle Operators, All Other', 'Motorboat Mechanics and Service Technicians', 'Motorboat Operators', 'Motorcycle Mechanics', 'Multiple Machine Tool Setters, Operators, and Tenders, Metal and Plastic', 'Museum Technicians and Conservators', 'Music Directors and Composers', 'Musical Instrument Repairers and Tuners', 'Musicians and Singers', 'Natural Sciences Managers', 'Network and Computer Systems Administrators', 'Neurologists', 'New Accounts Clerks', 'News Analysts, Reporters, and Journalists', 'Nuclear Engineers', 'Nuclear Medicine Technologists', 'Nuclear Power Reactor Operators', 'Nuclear Technicians', 'Nurse Anesthetists', 'Nurse Midwives', 'Nurse Practitioners', 'Nursing Assistants', 'Nursing Instructors and Teachers, Postsecondary', 'Obstetricians and Gynecologists', 'Occupational Health and Safety Technicians', 'Occupational Therapists', 'Occupational Therapy Aides', 'Occupational Therapy Assistants', 'Office Clerks, General', 'Office Machine Operators, Except Computer', 'Office and Administrative Support Workers, All Other', 'Operating Engineers and Other Construction Equipment Operators', 'Operations Research Analysts', 'Ophthalmic Laboratory Technicians', 'Ophthalmic Medical Technicians', 'Ophthalmologists, Except Pediatric', 'Opticians, Dispensing', 'Optometrists', 'Oral and Maxillofacial Surgeons', 'Order Clerks', 'Orderlies', 'Orthodontists', 'Orthopedic Surgeons, Except Pediatric', 'Orthotists and Prosthetists', 'Outdoor Power Equipment and Other Small Engine Mechanics', 'Packaging and Filling Machine Operators and Tenders', 'Packers and Packagers, Hand', 'Painters, Construction and Maintenance', 'Painting, Coating, and Decorating Workers', 'Paper Goods Machine Setters, Operators, and Tenders', 'Paperhangers', 'Paralegals and Legal Assistants', 'Paramedics', 'Parking Attendants', 'Parking Enforcement Workers', 'Parts Salespersons', 'Passenger Attendants', 'Patternmakers, Metal and Plastic', 'Paving, Surfacing, and Tamping Equipment Operators', 'Payroll and Timekeeping Clerks', 'Pediatric Surgeons', 'Pediatricians, General', 'Personal Care and Service Workers, All Other', 'Personal Financial Advisors', 'Personal Service Managers, All Other', 'Pest Control Workers', 'Pesticide Handlers, Sprayers, and Applicators, Vegetation', 'Petroleum Engineers', 'Petroleum Pump System Operators, Refinery Operators, and Gaugers', 'Pharmacists', 'Pharmacy Aides', 'Pharmacy Technicians', 'Philosophy and Religion Teachers, Postsecondary', 'Phlebotomists', 'Photographers', 'Photographic Process Workers and Processing Machine Operators', 'Physical Scientists, All Other', 'Physical Therapist Aides', 'Physical Therapist Assistants', 'Physical Therapists', 'Physician Assistants', 'Physicians, All Other', 'Physicians, Pathologists', 'Physicists', 'Physics Teachers, Postsecondary', 'Pile Driver Operators', 'Pipelayers', 'Plant and System Operators, All Other', 'Plasterers and Stucco Masons', 'Plating Machine Setters, Operators, and Tenders, Metal and Plastic', 'Plumbers, Pipefitters, and Steamfitters', 'Podiatrists', "Police and Sheriff's Patrol Officers", 'Political Science Teachers, Postsecondary', 'Political Scientists', 'Postal Service Clerks', 'Postal Service Mail Carriers', 'Postal Service Mail Sorters, Processors, and Processing Machine Operators', 'Postmasters and Mail Superintendents', 'Postsecondary Teachers, All Other', 'Pourers and Casters, Metal', 'Power Distributors and Dispatchers', 'Power Plant Operators', 'Precision Instrument and Equipment Repairers, All Other', 'Prepress Technicians and Workers', 'Preschool Teachers, Except Special Education', 'Pressers, Textile, Garment, and Related Materials', 'Print Binding and Finishing Workers', 'Printing Press Operators', 'Private Detectives and Investigators', 'Probation Officers and Correctional Treatment Specialists', 'Procurement Clerks', 'Production Workers, All Other', 'Production, Planning, and Expediting Clerks', 'Project Management Specialists', 'Proofreaders and Copy Markers', 'Property Appraisers and Assessors', 'Property, Real Estate, and Community Association Managers', 'Protective Service Workers, All Other', 'Psychiatric Aides', 'Psychiatric Technicians', 'Psychiatrists', 'Psychologists, All Other', 'Psychology Teachers, Postsecondary', 'Public Relations Managers', 'Public Safety Telecommunicators', 'Pump Operators, Except Wellhead Pumpers', 'Purchasing Managers', 'Radiation Therapists', 'Radio, Cellular, and Tower Equipment Installers and Repairers', 'Radiologic Technologists and Technicians', 'Radiologists', 'Rail Car Repairers', 'Rail Transportation Workers, All Other', 'Rail Yard Engineers, Dinkey Operators, and Hostlers', 'Rail-Track Laying and Maintenance Equipment Operators', 'Railroad Brake, Signal, and Switch Operators and Locomotive Firers', 'Railroad Conductors and Yardmasters', 'Real Estate Brokers', 'Real Estate Sales Agents', 'Receptionists and Information Clerks', 'Recreation Workers', 'Recreation and Fitness Studies Teachers, Postsecondary', 'Recreational Therapists', 'Recreational Vehicle Service Technicians', 'Refuse and Recyclable Material Collectors', 'Registered Nurses', 'Rehabilitation Counselors', 'Reinforcing Iron and Rebar Workers', 'Religious Workers, All Other', 'Reservation and Transportation Ticket Agents and Travel Clerks', 'Residential Advisors', 'Respiratory Therapists', 'Retail Salespersons', 'Riggers', 'Rock Splitters, Quarry', 'Rolling Machine Setters, Operators, and Tenders, Metal and Plastic', 'Roof Bolters, Mining', 'Roofers', 'Rotary Drill Operators, Oil and Gas', 'Roustabouts, Oil and Gas', 'Sailors and Marine Oilers', 'Sales Engineers', 'Sales Managers', 'Sales Representatives of Services, Except Advertising, Insurance, Financial Services, and Travel', 'Sales Representatives, Wholesale and Manufacturing, Except Technical and Scientific Products', 'Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products', 'Sales and Related Workers, All Other', 'Sawing Machine Setters, Operators, and Tenders, Wood', 'School Bus Monitors', 'Secondary School Teachers, Except Special and Career/Technical Education', 'Secretaries and Administrative Assistants, Except Legal, Medical, and Executive', 'Securities, Commodities, and Financial Services Sales Agents', 'Security Guards', 'Security and Fire Alarm Systems Installers', 'Self-Enrichment Teachers', 'Semiconductor Processing Technicians', 'Separating, Filtering, Clarifying, Precipitating, and Still Machine Setters, Operators, and Tenders', 'Septic Tank Servicers and Sewer Pipe Cleaners', 'Service Unit Operators, Oil and Gas', 'Set and Exhibit Designers', 'Sewers, Hand', 'Sewing Machine Operators', 'Shampooers', 'Sheet Metal Workers', 'Ship Engineers', 'Shipping, Receiving, and Inventory Clerks', 'Shoe Machine Operators and Tenders', 'Shoe and Leather Workers and Repairers', 'Shuttle Drivers and Chauffeurs', 'Signal and Track Switch Repairers', 'Skincare Specialists', 'Slaughterers and Meat Packers', 'Social Science Research Assistants', 'Social Sciences Teachers, Postsecondary, All Other', 'Social Scientists and Related Workers, All Other', 'Social Work Teachers, Postsecondary', 'Social Workers, All Other', 'Social and Community Service Managers', 'Social and Human Service Assistants', 'Sociologists', 'Sociology Teachers, Postsecondary', 'Software Developers', 'Software Quality Assurance Analysts and Testers', 'Soil and Plant Scientists', 'Solar Photovoltaic Installers', 'Sound Engineering Technicians', 'Special Education Teachers, All Other', 'Special Education Teachers, Kindergarten and Elementary School', 'Special Education Teachers, Middle School', 'Special Education Teachers, Preschool', 'Special Education Teachers, Secondary School', 'Special Effects Artists and Animators', 'Speech-Language Pathologists', 'Stationary Engineers and Boiler Operators', 'Statistical Assistants', 'Statisticians', 'Stockers and Order Fillers', 'Stonemasons', 'Structural Iron and Steel Workers', 'Structural Metal Fabricators and Fitters', 'Substance Abuse, Behavioral Disorder, and Mental Health Counselors', 'Substitute Teachers, Short-Term', 'Subway and Streetcar Operators', 'Surgeons, All Other', 'Surgical Assistants', 'Surgical Technologists', 'Survey Researchers', 'Surveying and Mapping Technicians', 'Surveyors', 'Switchboard Operators, Including Answering Service', 'Tailors, Dressmakers, and Custom Sewers', 'Tank Car, Truck, and Ship Loaders', 'Tapers', 'Tax Examiners and Collectors, and Revenue Agents', 'Tax Preparers', 'Taxi Drivers', 'Teachers and Instructors, All Other', 'Teaching Assistants, Except Postsecondary', 'Teaching Assistants, Postsecondary', 'Technical Writers', 'Telecommunications Equipment Installers and Repairers, Except Line Installers', 'Telemarketers', 'Telephone Operators', 'Tellers', 'Terrazzo Workers and Finishers', 'Textile Bleaching and Dyeing Machine Operators and Tenders', 'Textile Cutting Machine Setters, Operators, and Tenders', 'Textile Knitting and Weaving Machine Setters, Operators, and Tenders', 'Textile Winding, Twisting, and Drawing Out Machine Setters, Operators, and Tenders', 'Textile, Apparel, and Furnishings Workers, All Other', 'Therapists, All Other', 'Tile and Stone Setters', 'Timing Device Assemblers and Adjusters', 'Tire Builders', 'Title Examiners, Abstractors, and Searchers', 'Tool Grinders, Filers, and Sharpeners', 'Tool and Die Makers', 'Tour and Travel Guides', 'Traffic Technicians', 'Training and Development Managers', 'Training and Development Specialists', 'Transit and Railroad Police', 'Transportation Inspectors', 'Transportation Security Screeners', 'Transportation Workers, All Other', 'Transportation, Storage, and Distribution Managers', 'Travel Agents', 'Tree Trimmers and Pruners', 'Tutors', 'Umpires, Referees, and Other Sports Officials', 'Underground Mining Machine Operators, All Other', 'Upholsterers', 'Urban and Regional Planners', 'Ushers, Lobby Attendants, and Ticket Takers', 'Veterinarians', 'Veterinary Assistants and Laboratory Animal Caretakers', 'Veterinary Technologists and Technicians', 'Waiters and Waitresses', 'Watch and Clock Repairers', 'Water and Wastewater Treatment Plant and System Operators', 'Web Developers', 'Web and Digital Interface Designers', 'Weighers, Measurers, Checkers, and Samplers, Recordkeeping', 'Welders, Cutters, Solderers, and Brazers', 'Welding, Soldering, and Brazing Machine Setters, Operators, and Tenders', 'Wellhead Pumpers', 'Woodworkers, All Other', 'Woodworking Machine Setters, Operators, and Tenders, Except Sawing', 'Word Processors and Typists', 'Writers and Authors', 'Zoologists and Wildlife Biologists']
    let responseData = [];
    const navigate = useNavigate();

    
    return <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Custom Search
        </h2>
        <p className="text-base text-gray-800 mb-8">
            Enter your desired values for the following parameters. Empty fields will be ignored.
        </p>

        {/* Custom Search Rows */}
        <div className="space-y-6">
            {/* Row 1 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Median Home Price:
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={medianHomePrice}
                        onChange={(e) => setMedianHomePrice(e.target.value) || 0}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={medianHomePriceImportance}
                        onChange={(e) => setMedianHomePriceImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{medianHomePriceImportance}</span>
                </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Crime Rate:
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={crimeRate}
                        onChange={(e) => setCrimeRate(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={crimeRateImportance}
                        onChange={(e) => setCrimeRateImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{crimeRateImportance}</span>
                </div>
            </div>
            
            {/* Row 3 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Population:
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={population}
                        onChange={(e) => setPopulation(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={populationImportance}
                        onChange={(e) => setPopulationImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{populationImportance}</span>
                </div>
            </div>

            {/* Row 4 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Population Density:
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={populationDensity}
                        onChange={(e) => setPopulationDensity(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={populationDensityImportance}
                        onChange={(e) => setPopulationDensityImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{populationDensityImportance}</span>
                </div>
            </div>

            {/* Row 5 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Cost of Living
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={costOfLiving}
                        onChange={(e) => setCostOfLiving(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={costOfLivingImportance}
                        onChange={(e) => setCostOfLivingImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{costOfLivingImportance}</span>
                </div>
            </div>

            {/* Row 6 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Median Family Income:
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={medianFamilyIncome}
                        onChange={(e) => setMedianFamilyIncome(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={medianFamilyIncomeImportance}
                        onChange={(e) => setMedianFamilyIncomeImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{medianFamilyIncomeImportance}</span>
                </div>
            </div>

            {/* Row 7 */}
            <div className="flex items-center justify-between">
            {/* Label Section */}
                <div className="flex items-center">
                    <label htmlFor="customInput1" className="text-gray-700 font-medium w-48">
                        Natural Disaster Count
                    </label>
                </div>

                {/* Input Section */}
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customInput1"
                        className="border border-gray-300 rounded px-2 py-1 w-24 ml-4"
                        placeholder="Value"
                        value={naturalDisasterCount}
                        onChange={(e) => setNaturalDisasterCount(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={naturalDisasterCountImportance}
                        onChange={(e) => setNaturalDisasterCountImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{naturalDisasterCountImportance}</span>
                </div>
            </div>

            {/* Row 8 */}
            <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <label htmlFor="latitude" className="text-gray-700 font-medium w-48">
                            Latitude:
                        </label>
                        <input
                            type="text"
                            id="latitude"
                            className="border border-gray-300 rounded px-2 py-1 w-24 mr-14"
                            placeholder="Value"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                        />
                        <label htmlFor="longitude" className="text-gray-700 font-medium w-40">
                            Longitude:
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="text"
                            id="longitude"
                            className="border border-gray-300 rounded px-2 py-1 w-24 mr-0"
                            placeholder="Value"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                        />
                        <input
                            type="range"
                            className="ml-4"
                            style={{ width: "200px" }}
                            min="0"
                            max="100"
                            value={locationImportance}
                            onChange={(e) => setLocationImportance(Number(e.target.value))}
                        />
                        <span className="ml-2">{locationImportance}</span>
                    </div>
                </div>

            {/* Row 9 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <select
                        id="industry"
                        className="border border-gray-300 rounded px-3 py-1 bg-white text-gray-700 mr-7"
                        style={{ width: "290px" }}
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                    >
                    {jobs.map((job) => (
                        <option key={job} value={job}>
                            {job}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="flex items-center">
                    <label htmlFor="salary" className="text-gray-700 font-medium mr-24">
                        Salary:
                    </label>
                    <input
                        type="text"
                        id="salary"
                        className="border border-gray-300 rounded px-3 py-1 flex-grow"
                        placeholder="value"
                        style={{ width: "98px" }}
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                    <input
                        type="range"
                        className="ml-4"
                        style={{ width: "200px" }}
                        min="0"
                        max="100"
                        value={salaryImportance}
                        onChange={(e) => setSalaryImportance(Number(e.target.value))}
                    />
                    <span className="ml-2">{salaryImportance}</span>
                </div>
            </div>

            {/* Row 10 */}
            <div className="flex items-center justify-end">
                <label htmlFor="salary" className="text-gray-700 font-medium mr-24">
                    Jobs 1000:
                </label>
                <input
                    type="text"
                    id="jobs1000"
                    className="border border-gray-300 rounded px-2 py-1"
                    placeholder="value"
                    style={{ width: "98px" }}
                    value={industryJobs1000}
                    onChange={(e) => setIndustryJobs1000(e.target.value)}
                />
                <input
                    type="range"
                    className="ml-4"
                    style={{ width: "200px" }}
                    min="0"
                    max="100"
                    value={industryJobs1000Importance}
                    onChange={(e) => setIndustryJobs1000Importance(Number(e.target.value))}
                />
                <span className="ml-2">{industryJobs1000Importance}</span>
            </div>
        </div>
        <div className="flex justify-center mt-8">
            <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
                // Handle button click
                if(industry === "Select An Industry" || industry === ""){
                    alert("Please select an industry");
                    return;
                }
                console.log("Button clicked");
                const searchParams = {
                    "preferred_median_home_price": parseInt(medianHomePrice) || 0,
                    "preferred_crime_rate": parseInt(crimeRate) || 0,
                    "preferred_population": parseInt(population) || 0,
                    "preferred_population_density": parseInt(populationDensity) || 0,
                    "preferred_cost_of_living": parseInt(costOfLiving) || 0,
                    "preferred_median_family_income": parseInt(medianFamilyIncome) || 0,
                    "preferred_natural_disaster_count": parseInt(naturalDisasterCount) || 0,
                    "preferred_latitude": parseInt(latitude) || 0,
                    "preferred_longitude": parseInt(longitude) || 0,
                    "industry_name": industry, // Assuming `industry` is a string
                    "preferred_industry_salary": parseInt(salary) || 0,
                    "preferred_industry_jobs_1000": parseInt(industryJobs1000) || 0,
                    "importance_median_home_price": parseInt(medianHomePriceImportance) || 0,
                    "importance_crime_rate": parseInt(crimeRateImportance) || 0,
                    "importance_population": parseInt(populationImportance) || 0,
                    "importance_population_density": parseInt(populationDensityImportance) || 0,
                    "importance_cost_of_living": parseInt(costOfLivingImportance) || 0,
                    "importance_median_family_income": parseInt(medianFamilyIncomeImportance) || 0,
                    "importance_natural_disaster_count": parseInt(naturalDisasterCountImportance) || 0,
                    "importance_location": parseInt(locationImportance) || 0,
                    "importance_industry_salary": parseInt(salaryImportance) || 0,
                    "importance_industry_jobs_1000": parseInt(industryJobs1000Importance) || 0,
                };
            console.log(searchParams);
            api.post("/api/neighborhoods/preference-ranking/", searchParams)
                .then((response) => {
                    console.log("Search results:", response.data);
                    responseData = response.data;
                    console.log(responseData);
                    // Redirect to the list page
                    navigate("/list", { state: { data: responseData } });
                })
                .catch((error) => {
                    console.error("There was an error searching!", error);
                    alert("Search failed. Please try again.");
                });
            }}
            >
            Search
            </button>
        </div>
    </div>
}

export default CustomSearch
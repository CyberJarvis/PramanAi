#!/usr/bin/env python3
"""
Script to generate a comprehensive India humanitarian dataset PDF
for demonstrating the inference engine's RAG capabilities.
"""

from fpdf import FPDF

class IndiaPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.cell(0, 10, 'INDIA HUMANITARIAN SITUATION REPORT 2024', 0, 1, 'C')
        self.ln(5)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_fill_color(0, 51, 102)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, title, 0, 1, 'L', fill=True)
        self.set_text_color(0, 0, 0)
        self.ln(5)

    def chapter_body(self, body):
        self.set_font('Helvetica', '', 10)
        self.multi_cell(0, 6, body)
        self.ln()

    def section_title(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(0, 51, 102)
        self.cell(0, 8, title, 0, 1, 'L')
        self.set_text_color(0, 0, 0)

def create_india_report():
    pdf = IndiaPDF()
    pdf.set_auto_page_break(auto=True, margin=15)

    # ----- PAGE 1: Executive Summary -----
    pdf.add_page()
    pdf.chapter_title('EXECUTIVE SUMMARY')
    pdf.chapter_body("""This comprehensive report provides an in-depth analysis of India's humanitarian situation in 2024, covering climate vulnerability, internal displacement, economic factors, and governance indicators. India, with a population of 1.44 billion people, faces multifaceted challenges ranging from climate-induced disasters to socioeconomic disparities.

Key Findings:
- Baseline Risk Score: 5.2/10 (Moderate)
- Climate Vulnerability Index: 6.7/10 (High)
- Governance Index: 6.5/10 (Moderate-Good)
- Conflict Index: 4.8/10 (Moderate)

The report draws data from INFORM 2024, World Bank Climate assessments, UNHCR displacement statistics, and internal government sources. It aims to provide actionable intelligence for humanitarian response planning and policy formulation.""")

    pdf.section_title('Report Scope and Methodology')
    pdf.chapter_body("""This assessment covers:
1. Climate-induced displacement patterns across 28 states
2. Monsoon-related flooding impact in vulnerable regions
3. Drought conditions in semi-arid zones
4. Urban migration patterns and informal settlements
5. Protection concerns for vulnerable populations
6. Economic resilience indicators and livelihood impacts

Data collection methodologies include satellite imagery analysis, ground-level assessments, household surveys, and administrative data aggregation from state disaster management authorities.""")

    # ----- PAGE 2: Climate Vulnerability -----
    pdf.add_page()
    pdf.chapter_title('CLIMATE VULNERABILITY ASSESSMENT')
    
    pdf.section_title('Overview')
    pdf.chapter_body("""India's climate vulnerability score of 6.7 reflects the country's significant exposure to multiple climate hazards. The nation experiences approximately 80% of its precipitation during the June-September monsoon season, making it highly susceptible to both flooding and drought conditions.

Climate Risk Factors:
- Rising sea levels threatening 7,500 km coastline
- Increasing frequency of cyclonic storms in Bay of Bengal
- Glacial melt in Himalayan regions affecting river flows
- Heat wave intensification in northern plains
- Changing monsoon patterns affecting agriculture""")

    pdf.section_title('Regional Climate Hotspots')
    pdf.chapter_body("""High-Risk Regions (Climate Vulnerability > 8.0):

1. BIHAR (Score: 8.9)
   - Annual flood displacement: 4.2 million people
   - Primary Rivers: Kosi, Gandak, Bagmati
   - Critical Period: July-September
   - Economic Loss: USD 2.1 billion annually

2. ASSAM (Score: 8.7)
   - Brahmaputra flood basin affects 5.6 million annually
   - Erosion displaces 100,000+ families per year
   - Flash floods from Himalayan tributaries
   - Infrastructure damage: 45% of roads affected yearly

3. ODISHA (Score: 8.5)
   - Cyclone frequency: 4-5 major events per decade
   - Coastal erosion: 400 km of vulnerable coastline
   - Super Cyclone history: 1999, 2013, 2019, 2021
   - Population at risk: 18 million coastal residents

4. WEST BENGAL (Score: 8.3)
   - Sundarbans ecosystem under threat
   - Salinity intrusion affecting 2.8 million
   - Annual cyclone exposure: 3-4 events
   - Agricultural land loss: 12,000 hectares/year""")

    pdf.section_title('Monsoon Impact Analysis 2024')
    pdf.chapter_body("""The 2024 monsoon season recorded 108% of the Long Period Average (LPA) rainfall, resulting in significant flooding across eastern and northeastern states.

Displacement Statistics (2024 Monsoon):
- Total displaced: 8.7 million people
- Temporary shelters established: 4,500 camps
- Emergency food assistance: 12.3 million beneficiaries
- Healthcare interventions: 3.2 million treatments
- Water and sanitation support: 6.1 million beneficiaries

Financial Response:
- State Disaster Response Fund utilized: INR 8,500 crores
- Central assistance released: INR 3,200 crores
- International humanitarian aid: USD 45 million
- NGO sector contribution: USD 78 million""")

    # ----- PAGE 3: Internal Displacement -----
    pdf.add_page()
    pdf.chapter_title('INTERNAL DISPLACEMENT DYNAMICS')
    
    pdf.section_title('Disaster-Induced Displacement')
    pdf.chapter_body("""India experiences the highest absolute numbers of disaster-induced displacement globally. According to IDMC (Internal Displacement Monitoring Centre) data:

Annual Displacement Figures (2020-2024):
- 2020: 3.9 million displacements
- 2021: 4.9 million displacements
- 2022: 2.5 million displacements
- 2023: 2.1 million displacements
- 2024 (projected): 5.2 million displacements

Primary Displacement Triggers:
1. Floods: 65% of all displacements
2. Cyclones: 18% of all displacements
3. Drought-induced migration: 10%
4. Landslides: 4%
5. Other disasters: 3%

Duration Patterns:
- Short-term (< 1 month): 45%
- Medium-term (1-6 months): 35%
- Long-term (> 6 months): 15%
- Permanent relocation: 5%""")

    pdf.section_title('Vulnerable Population Groups')
    pdf.chapter_body("""Special protection considerations apply to:

Women and Girls (52% of displaced population):
- Increased vulnerability to gender-based violence
- Limited access to reproductive healthcare in camps
- Loss of livelihoods affecting economic independence
- Education disruption for adolescent girls

Children (38% of displaced population):
- 2.1 million children displaced annually
- School disruption averaging 45 days per event
- Malnutrition rates 23% higher in displacement settings
- Psychosocial trauma requiring specialized support

Elderly and Persons with Disabilities:
- 4.3 million elderly persons in high-risk zones
- Accessibility challenges in emergency shelters
- Medication continuity issues during displacement
- Higher mortality rates during displacement events

Scheduled Castes and Scheduled Tribes:
- Disproportionate representation in flood-prone areas
- Limited access to early warning systems
- Lower recovery rates post-disaster
- Land rights complications affecting return""")

    # ----- PAGE 4: Economic Impact -----
    pdf.add_page()
    pdf.chapter_title('ECONOMIC IMPACT ASSESSMENT')
    
    pdf.section_title('Macroeconomic Indicators')
    pdf.chapter_body("""India's economic resilience to climate shocks varies significantly across sectors and regions.

GDP Impact of Climate Events:
- Average annual loss: 2.1% of GDP (USD 70 billion)
- Agricultural sector losses: 35% of total
- Infrastructure damage: 28% of total
- Healthcare costs: 12% of total
- Productivity losses: 25% of total

Agricultural Vulnerability:
- 51% of agricultural land is rain-fed
- 147 million hectares under food crops
- Crop insurance coverage: 42% of farmers
- Average climate-related crop loss: 18% annually

Employment Impact:
- Temporary unemployment post-disaster: 12 million workers
- Informal sector disruption: 85% of affected workforce
- Recovery period: 6-18 months for full livelihood restoration
- Migration to urban areas: 2.3 million climate migrants annually""")

    pdf.section_title('Cost-Benefit Analysis of Interventions')
    pdf.chapter_body("""Early Warning Systems:
- Coverage: 92% of high-risk districts
- Estimated lives saved annually: 15,000-20,000
- Economic value of early warning: USD 9 for every USD 1 invested
- Current investment: USD 120 million annually

Flood Protection Infrastructure:
- Embankment coverage: 38,000 km constructed
- Drainage improvement projects: 450 ongoing
- Cost per km of embankment: USD 500,000
- ROI of flood protection: 4:1 over 20 years

Social Protection Programs:
- MGNREGA employment during disasters: 24 million workdays
- Food distribution through PDS: 820 million beneficiaries
- Cash transfer programs: 145 million accounts
- Housing reconstruction scheme: 2.1 million houses since 2016

International Development Assistance:
- World Bank climate financing: USD 4.2 billion (2020-2025)
- ADB infrastructure support: USD 2.8 billion
- USAID humanitarian programs: USD 180 million annually
- UN system coordination: USD 95 million annually""")

    # ----- PAGE 5: Governance and Response -----
    pdf.add_page()
    pdf.chapter_title('GOVERNANCE AND RESPONSE CAPACITY')
    
    pdf.section_title('Institutional Framework')
    pdf.chapter_body("""India's disaster management architecture operates at three levels:

National Level:
- National Disaster Management Authority (NDMA)
- National Disaster Response Force (NDRF): 16 battalions, 18,000 personnel
- National Emergency Response Centre: 24/7 monitoring
- Cabinet Committee on Security oversight
- Budget allocation: INR 12,000 crores annually

State Level:
- 28 State Disaster Management Authorities
- State Disaster Response Forces: 42,000 personnel total
- District-level Emergency Operations Centres: 645 active
- State-specific vulnerability mapping completed: 85%
- Multi-hazard early warning systems: 72% coverage

Legal Framework:
- Disaster Management Act, 2005
- National Policy on Disaster Management, 2009
- National Cyclone Risk Mitigation Project
- National Flood Risk Management Programme
- State-specific disaster response protocols""")

    pdf.section_title('Response Capacity Assessment')
    pdf.chapter_body("""Strengths:
- Robust institutional framework at all levels
- Dedicated disaster response forces with specialized training
- Large volunteer network through National Cadet Corps
- Community-based disaster risk reduction programs
- Proven large-scale evacuation capabilities

Challenges:
- Inter-state coordination during multi-state disasters
- Private sector engagement in relief operations
- Technology integration for real-time monitoring
- Post-disaster recovery program effectiveness
- Climate adaptation mainstreaming in development

Recommendations:
1. Enhance forecast-based financing mechanisms
2. Strengthen community early warning systems
3. Improve shelter standards and pre-positioning
4. Integrate climate risk into urban planning
5. Expand social protection coverage for vulnerable groups""")

    # ----- PAGE 6: Regional Analysis -----
    pdf.add_page()
    pdf.chapter_title('STATE-WISE VULNERABILITY ANALYSIS')
    
    pdf.section_title('High Priority States')
    pdf.chapter_body("""Bihar - Extreme Flood Risk:
Population: 128 million | Poverty Rate: 33.7% | HDI: 0.574
Primary Hazards: Riverine flooding, waterlogging
Displaced annually: 4.2 million | Recovery time: 8 months average
Key Rivers: Kosi, Gandak, Bagmati, Ganga
Critical Infrastructure: 45% of schools flood-affected, 38% health facilities at risk

Assam - Multiple Hazards:
Population: 35 million | Poverty Rate: 31.9% | HDI: 0.614
Primary Hazards: Floods, erosion, earthquakes
Displaced annually: 5.6 million | Erosion victims: 100,000+ families
Brahmaputra basin: 70% of state territory | Annual flood damage: USD 450 million

Kerala - Landslide and Flood Prone:
Population: 35 million | Poverty Rate: 7.1% | HDI: 0.779
Primary Hazards: Landslides, flash floods, cyclones
2018 floods: 1.4 million displaced | 2019 floods: 1.5 million affected
Western Ghats vulnerability: 14 districts at high risk

Odisha - Cyclone Corridor:
Population: 46 million | Poverty Rate: 32.6% | HDI: 0.606
Primary Hazards: Cyclones, storm surge, drought
Coastal population: 18 million at risk | Historic cyclones: 1999 Super Cyclone
Evacuation capacity: 1.2 million within 24 hours | Cyclone shelters: 892 built

Rajasthan - Drought and Heat Extreme:
Population: 82 million | Poverty Rate: 14.7% | HDI: 0.621
Primary Hazards: Drought, heat waves, flash floods
Arid zone: 60% of state | Temperature extremes: 48C recorded
Water scarcity affects: 45 million people | Migration rate: 2.5 million annually""")

    # ----- PAGE 7: Protection Concerns -----
    pdf.add_page()
    pdf.chapter_title('PROTECTION AND HUMAN RIGHTS')
    
    pdf.section_title('Protection Risks in Displacement')
    pdf.chapter_body("""Gender-Based Violence:
- Reported increase of 35% during displacement periods
- Limited privacy in temporary shelters
- Inadequate lighting and security in camps
- Separated families and protection gaps
- Child marriage risks increase by 40% post-disaster

Child Protection:
- Separated and unaccompanied children: 8,500 cases (2023)
- Child labor exploitation post-disaster: 23% increase
- Birth registration disruption affecting 1.2 million
- Education continuity: only 45% access temporary learning spaces
- Child trafficking risks in disaster-affected areas

Documentation and Legal Identity:
- Lost documents during displacement: 45% of affected families
- Ration card replacement average: 3 months
- Land record recovery: 6-12 months
- Bank account access disruption: 2.3 million affected
- Government benefits interruption: 4.5 million cases annually""")

    pdf.section_title('International Protection Framework')
    pdf.chapter_body("""Applicable Standards:
- Guiding Principles on Internal Displacement (1998)
- Sendai Framework for Disaster Risk Reduction
- SPHERE Humanitarian Standards
- Protection from Sexual Exploitation and Abuse (PSEA) protocols
- UN Convention on the Rights of the Child

India's Commitments:
- SDG 1: No Poverty - Climate resilience integration
- SDG 11: Sustainable Cities - Disaster-resilient urban planning
- SDG 13: Climate Action - Adaptation finance mobilization
- Paris Agreement: NDC implementation for resilience

Monitoring Mechanisms:
- National Human Rights Commission oversight
- State Human Rights Commissions (28 states)
- Civil society organizations: 2,400+ active in disaster response
- International monitoring through UPR process
- Joint UN-Government vulnerability assessments""")

    # ----- PAGE 8: Future Projections -----
    pdf.add_page()
    pdf.chapter_title('CLIMATE PROJECTIONS AND SCENARIOS')
    
    pdf.section_title('2030 Climate Scenarios')
    pdf.chapter_body("""Temperature Projections:
- Average temperature increase: 1.2-1.8C above 2000 baseline
- Heat wave frequency: 3x increase expected
- Heat-related mortality: 25,000-40,000 annually projected
- Agricultural productivity impact: 15-25% reduction in vulnerable zones

Precipitation Changes:
- Monsoon variability increase: 20% higher deviation from mean
- Extreme rainfall events: 40% more frequent
- Drought intensity in semi-arid regions: 30% increase
- Glacier melt acceleration: 15-20% faster than 2020 baseline

Sea Level Rise Impact:
- Coastal zone inundation risk: 12% increase by 2030
- Population in low-elevation coastal zones: 65 million
- Economic assets at risk: USD 150 billion
- Critical infrastructure exposure: 45% of coastal ports""")

    pdf.section_title('Displacement Projections')
    pdf.chapter_body("""Conservative Scenario (RCP 4.5):
- Annual displacement: 6-8 million by 2030
- Permanent climate migration: 25-30 million by 2050
- Coastal retreat requirement: 2.8 million by 2050
- Agricultural livelihood disruption: 45 million affected

High-Impact Scenario (RCP 8.5):
- Annual displacement: 10-15 million by 2030
- Permanent climate migration: 40-50 million by 2050
- Urban informal settlement growth: 35% increase
- Food security crisis: 180 million at risk

Recommended Interventions:
1. Planned relocation programs for high-risk communities
2. Climate-resilient infrastructure investment: USD 50 billion over 10 years
3. Social protection expansion to cover climate risks
4. Urban planning reform for climate adaptation
5. Agricultural diversification and drought-resistant crops
6. Ecosystem-based adaptation in flood-prone areas
7. Regional cooperation for transboundary river management""")

    # ----- PAGE 9: Data Tables -----
    pdf.add_page()
    pdf.chapter_title('KEY DATA TABLES')
    
    pdf.section_title('State-wise Risk Indicators')
    pdf.chapter_body("""
State                 | Risk Score | Climate Vuln | Displacement Rate | Response Cap
----------------------|------------|--------------|-------------------|-------------
Bihar                 | 8.9        | 9.2          | 4.2M/year         | Moderate
Assam                 | 8.7        | 8.8          | 5.6M/year         | Moderate
Odisha                | 8.5        | 8.7          | 2.1M/year         | High
West Bengal           | 8.3        | 8.1          | 1.8M/year         | Moderate
Uttar Pradesh         | 7.8        | 7.5          | 2.3M/year         | Moderate
Rajasthan             | 7.2        | 7.8          | 0.8M/year         | Low-Moderate
Kerala                | 6.8        | 7.4          | 1.2M/year         | High
Maharashtra           | 6.5        | 6.9          | 0.9M/year         | Moderate-High
Gujarat               | 6.2        | 6.8          | 0.6M/year         | High
Tamil Nadu            | 5.9        | 6.5          | 0.5M/year         | High
Karnataka             | 5.5        | 6.1          | 0.4M/year         | Moderate-High
Andhra Pradesh        | 5.8        | 6.7          | 0.7M/year         | Moderate

Note: Risk scores on scale of 1-10; Displacement rates are annual averages 2020-2024.
Source: INFORM 2024, NDMA, IDMC, State Disaster Management Authorities.""")
    
    pdf.section_title('Historical Disaster Impact (2014-2024)')
    pdf.chapter_body("""
Year | Major Events                      | Deaths | Displaced   | Economic Loss (USD)
-----|-----------------------------------|--------|-------------|--------------------
2014 | Kashmir Floods, Hudhud Cyclone    | 6,054  | 8.5M        | 12.8 billion
2015 | Chennai Floods, Heat Waves        | 3,842  | 4.2M        | 8.5 billion
2016 | Assam Floods, Multiple Cyclones   | 1,876  | 6.3M        | 5.2 billion
2017 | Bihar Floods, Gujarat Floods      | 1,234  | 9.1M        | 7.8 billion
2018 | Kerala Floods, Cyclone Titli      | 1,419  | 6.1M        | 14.5 billion
2019 | Cyclone Fani, Bihar Floods        | 1,089  | 7.8M        | 8.9 billion
2020 | Cyclone Amphan, Assam Floods      | 687    | 5.2M        | 13.2 billion
2021 | Cyclone Tauktae, Yaas, Floods     | 892    | 4.9M        | 7.4 billion
2022 | Urban Floods, Flash Floods        | 654    | 2.5M        | 4.8 billion
2023 | Cyclone Biparjoy, Heat Waves      | 1,235  | 3.1M        | 6.2 billion
2024 | Monsoon Floods, Cyclone Remal     | 1,100* | 8.7M*       | 9.5 billion*

*2024 figures are provisional estimates as of October 2024.
Source: National Disaster Management Authority, Emergency Events Database (EM-DAT).""")

    # ----- PAGE 10: Resources and References -----
    pdf.add_page()
    pdf.chapter_title('RESOURCES AND REFERENCES')
    
    pdf.section_title('Primary Data Sources')
    pdf.chapter_body("""1. INFORM Risk Index 2024 - European Commission Joint Research Centre
2. Internal Displacement Monitoring Centre (IDMC) Global Report 2024
3. World Bank Climate Change Knowledge Portal - India Country Profile
4. UNHCR India Operations Data Portal
5. National Disaster Management Authority (NDMA) Annual Reports
6. India Meteorological Department (IMD) Monsoon Reports
7. Census of India 2011 (Population Statistics)
8. NITI Aayog SDG India Index 2024
9. Reserve Bank of India State-wise Economic Data
10. Ministry of Home Affairs Disaster Statistics

International Framework Documents:
- Sendai Framework for Disaster Risk Reduction 2015-2030
- UNFCCC Paris Agreement (India's NDC)
- IPCC Special Report on Climate Change and Land
- Global Compact on Refugees 2018
- Guiding Principles on Internal Displacement""")

    pdf.section_title('Key Contacts and Coordination')
    pdf.chapter_body("""Government Agencies:
- National Disaster Management Authority: ndma.gov.in
- India Meteorological Department: mausam.imd.gov.in
- Ministry of Environment, Forest and Climate Change: moef.gov.in
- National Remote Sensing Centre: nrsc.gov.in

UN Agencies Operating in India:
- UN Resident Coordinator's Office
- UNDP India - Climate and Disaster Resilience
- UNICEF India - Child Protection in Emergencies
- WFP India - Food Security and Nutrition
- WHO India - Health Emergency Response
- UNHCR India - Protection and Solutions

Humanitarian Partners:
- Indian Red Cross Society
- Oxfam India
- Save the Children India
- World Vision India
- SEEDS (Sustainable Environment and Ecological Development Society)
- ActionAid India
- Helpage India

This report is intended for humanitarian planning purposes. Data should be verified with primary sources for operational decision-making.

Report compiled: January 2024
Next update: July 2024
Classification: Public

For questions regarding this assessment, contact:
Humanitarian Affairs Division
Email: humanitarian.india@example.org""")

    # Save the PDF
    output_path = "/Users/roshanajith/Documents/Products/codebyte2.0/public/samples/india_humanitarian_report_2024.pdf"
    pdf.output(output_path)
    print(f"PDF created successfully: {output_path}")
    return output_path

if __name__ == "__main__":
    create_india_report()

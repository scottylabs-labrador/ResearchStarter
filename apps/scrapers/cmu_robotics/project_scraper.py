import requests
from bs4 import BeautifulSoup

robotics_data = []

def scrape_robotics(link):
    response = requests.get(link)
    soup = BeautifulSoup(response.content, 'html.parser')

    cards = soup.find_all(class_="info-card")
    project_list = {}

    for card in cards:
        page_link = card.find('a').get('href')
        name = card.find(class_="info-card__title").string
        project = scrape_project_page(page_link, name, link)
        project_list[name] = project
        print(f"added project {name}")
    return project_list
        

def scrape_project_page(link, name, source):
    #add time added when finally going into mongo
    project = {"Project Title": name, "Contact": {}, "Description": "", "Prereqs": [], "Time Committment": "", 
               "Relevant Links": [], "College": ["School of Computer Science"], "Department": ["Robotics Institute"], 
               "Position": "", "Paid/Unpaid": "", "Desired Skill Level": "", "Source": source, 
               "Time Added": "3/21/26", "Anticipated End Date": "", "Keywords": [], "Enable Apply": False}

    response = requests.get(link)
    soup = BeautifulSoup(response.content, 'html.parser')
    links = []

    desc = soup.find(class_='statement-inner')
    if (desc):
        project["Description"] = desc.get_text(separator='\n', strip=True)

    external = soup.find(class_ = "external_link")
    if (external):
        links.append(external.find("a").get("href"))
    links.append(link)
    project["Relevant Links"] = links
    
    members = soup.find_all(class_="person-container")
    if (members):
        people_images = soup.find_all('div', class_='RIpersonimage')
        for item in people_images:
            link_tag = item.find('a')
            contact = item.find('div', class_='name')
            if not contact:
                continue
            
            contact_name = contact.get_text(separator='\n', strip=True)
            
            if not link_tag:
                continue
            
            url = link_tag.get('href')
            try:
                page = requests.get(url)
                page_soup = BeautifulSoup(page.content, 'html.parser')
            except:
                continue
            
            title_tag = page_soup.find('title')
            if title_tag and 'page not found' in title_tag.get_text().lower():
                continue
            
            email = None
            for a in page_soup.find_all('a', href=True):
                href = a.get('href')
                if 'mailto:' in href:
                    email = href.replace('mailto:', '').strip()
                    break
            
            project["Contact"][contact_name] = email
    return project
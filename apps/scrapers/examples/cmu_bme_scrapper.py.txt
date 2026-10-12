import requests
from bs4 import BeautifulSoup

def scrape_engr(link):
    people = [];

    response = requests.get(link)
    soup = BeautifulSoup(response.content, 'html.parser');

    content_div = soup.find_all('tr')

    for tr in content_div:
        text = tr.find_all('td')

        person_name = text[0].get_text(strip=True)

        link = "https://www.cmu.edu/bme" + text[0].find_all('a')[0].get('href')

        person = scrape_faulty_page(link)
        
        person["name"] = person_name

    return people;

def get_href()

def scrape_faulty_page(link):
    person = {"name": "", "college": "", "department": "", "bio": "", "phone number": "", "email": ""};

    response = requests.get(link);
    soup = BeautifulSoup(response.content, 'html.parser');

    person["email"] = soup.select(".icon.email").get("href");
    person["phone"] = soup.select(".icon.tel")[0].get("href");

    header = soup.css.select("#sitename");
    header_text = header.find_all("a");

    person["department"] = header_text[0].get_text(strip=True);
    person["college"] = header_text[1].get_text(strip=True);

    bio_header = soup.find_all(lambda tag: tag.name == "h1" and tag.get_text() == "Bio")
    bio = bio_header.next_sibling.get_text()

    research_header = soup.find_all(lambda tag: tag.name == "h1" and tag.get_text() == "Research")
    research = bio_header.next_sibling.get_text();

    person["bio"] = bio
    person["research"] = research
    
    return person;


print(scrape_engr('https://www.cmu.edu/bme/Research/research_faculty_listing.html#bio')[0])
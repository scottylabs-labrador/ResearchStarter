#Import statements for webscraping

#requests used for link formatting for webscraper
import requests
#uses beautiful soup as webscraper
from bs4 import BeautifulSoup

#defining url to be scraped
url = 'https://www.cmu.edu/math/research/'

#arrays to store scraped data before (potentially) moved elsewhere
professor_links = []
professor_names = []
base_professor_attrs = (professor_links,professor_names)

#rewritting url from string for beautiful soup
page = requests.get(url)
#parsing through html code in the website
soup = BeautifulSoup(page.content, "html.parser")

#iterating through all tags (<b>,<a>,etc.) with the specific attribute 'class:'cta''
for vals in soup.find_all('a', attrs={'class':'cta'}):
	#appending link to links array
	professor_links.append(vals['href'])
	#appending displayed text (professor's name) to name array
	professor_names.append(vals.string)
base_professor_attrs = (professor_links,professor_names)

#exploring professor's page for relevant info if exists
professor_attrs = ([],[])
for pos,link in enumerate(professor_links):
	try:
		new_url = url + link
		page = requests.get(new_url)
		soup = BeautifulSoup(page.content, "html.parser")
	except:
		continue
	for vals in soup.find_all('a'):
		if vals.string == 'Website':
			professor_attrs[0].append(vals['href'])
			professor_attrs[1].append(professor_names[pos])

research_attrs = ([],[])
teaching_attrs = ([],[])
for pos, link in enumerate(professor_attrs[0]):
	page = requests.get(link)
	soup = BeautifulSoup(page.content, "html.parser")
	for vals in soup.find_all('a'):
		if not vals.string is None and (vals.string.lower() == 'research' or vals.string.lower() == 'publications'):
			if vals['href'][:5] != 'https':
				research_attrs[0].append(link+vals['href'])
			else:
				research_attrs[0].append(vals['href'])
			research_attrs[1].append(professor_attrs[1][pos])
		if not vals.string is None and vals.string.lower() == 'teaching':
			if vals['href'][:5]!='https':
				teaching_attrs[0].append(link+vals['href'])
			else:
				teaching_attrs[0].append(vals['href'])
			teaching_attrs[1].append(professor_attrs[1][pos])

print(research_attrs[0])
print(teaching_attrs[1])

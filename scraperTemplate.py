#Import statements for webscraping

#requests used for link formatting for webscraper
import requests
#uses beautiful soup as webscraper
from bs4 import BeautifulSoup

#defining url to be scraped
url = 'https://www.cmu.edu/math/research/index.html'

#arrays to store scraped data before (potentially) moved elsewhere
professor_links = []
professor_names = []

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

#printing out first values in each array
print(professor_links[0])
print(professor_names[0])

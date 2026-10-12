from urllib.parse import quote
import requests
import json

def cmu_scholar_scrape():
  url = "https://scholars.cmu.edu/api/users"
  groupUrl = "https://scholars.cmu.edu/api/groups"
  groupIdToCollege = {}
  existingGroups = {"School of Computer Science", "College of Engineering", "College of Fine Arts", "Dietrich College of Humanities and Social Sciences", "Mellon College of Science", "Heinz College of Information Systems and Public Policy", "Tepper School of Business", "Carnegie Mellon University Qatar"}

  try:
    payload = json.dumps({
      "params": {
        "by": "text",
        "category": "group"
      },
      "filters": []
    })
    headers = {
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      'Connection': 'keep-alive',
      'Origin': 'https://scholars.cmu.edu',
      'Referer': 'https://scholars.cmu.edu/search?by=text&type=group',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
      'accept': 'application/json',
      'content-type': 'application/json',
      'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',

    }

    response = requests.request("POST", groupUrl, headers=headers, data=payload)
    resource_dict = response.json()["resource"]
    for resource in resource_dict:
      name = resource["name"]
      if name == "Software Engineering Institute":
        name = "School of Computer Science"
      elif name not in existingGroups:
        name = "UnAffliated"
      groupIdToCollege[resource["discoveryId"]] = name
  except Exception as e:
      print(f"Error: {e}")

  i=0
  professors = {}
  while i <= 600:
    try:
      payload = json.dumps({
        "params": {
          "by": "text",
          "category": "user",
          "text": ""
        },
        "pagination": {
          "startFrom": i,
          "perPage": 25
        },
        "sort": "lastNameAsc",
        "filters": [
          {
            "name": "customFilterOne",
            "matchDocsWithMissingValues": True,
            "useValuesToFilter": False
          },
          {
            "name": "tags",
            "matchDocsWithMissingValues": True,
            "useValuesToFilter": False
          },
          {
            "name": "customFilterTwo",
            "matchDocsWithMissingValues": True,
            "useValuesToFilter": False
          },
          {
            "name": "customFilterThree",
            "matchDocsWithMissingValues": True,
            "useValuesToFilter": False
          },
          {
            "name": "department",
            "matchDocsWithMissingValues": True,
            "useValuesToFilter": False
          }
        ]
      })
      headers = {
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Connection': 'keep-alive',
        'Origin': 'https://scholars.cmu.edu',
        'Referer': 'https://scholars.cmu.edu/search?back&by=text&type=user&v=',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'accept': 'application/json',
        'content-type': 'application/json',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',

      }
      response_users = requests.request("POST", url, headers=headers, data=payload)
      data_dict = response_users.json()
      for j in data_dict["resource"]:
        iD = j["discoveryId"]
        firstName = j["firstName"]
        lastName = j["lastName"]
        prof_name = firstName + ' ' + lastName
        
        prof_url = f"https://scholars.cmu.edu/api/users/{iD}"

        headers = {
          'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
          'Connection': 'keep-alive',
          'Referer': f'https://scholars.cmu.edu/{iD}-{quote(firstName)}-{quote(lastName)}',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
          'accept': 'application/json',
          'content-type': 'application/json',
          'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',

        }

        response = requests.request("GET", prof_url, headers=headers)
        prof_data = response.json()
        bio = number = ''
        college = tags = position = media = []
        department = [prof_data["positions"][0]["department"]]
        email = prof_data["emailAddress"]["address"]
        for k in prof_data["explicitGroupMemberships"]:
          if str(k) in groupIdToCollege:
            college.append(groupIdToCollege[str(k)])
          else:
            pass
          if ("tabSummaryAbout" in prof_data):
            bio = prof_data["tabSummaryAbout"]
          if ("phoneNumbers" in prof_data):
            number = prof_data["phoneNumbers"][0]["number"]
          if ("embeddableMediaList" in prof_data):
            media = prof_data["embeddableMediaList"]
          if ("academicAppointments" in prof_data):
            position = prof_data["academicAppointments"]
          if ("tags" in prof_data):
            tags = prof_data["tags"]["implicit"]
          data = {
              "Name": prof_name,
              "College": college,
              "Department": department,
              "Email": email,
              "Phone Number": number,
              "Bio": bio,
              "Media": media,
              "Positions": position,
              "Tags": tags
          }
          professors[prof_name] = data
        i += 25
    except Exception as e:
      print(f"Error: {e}")
  return professors


#cmu_scholar_scrape()
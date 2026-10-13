# CMU research scrapers

Imported from [cmu-research-backend](https://github.com/scottylabs-labrador/cmu-research-backend) at commit [`576c126a53b7d90c5f1714b388d192f151d50252`](https://github.com/scottylabs-labrador/cmu-research-backend/tree/576c126a53b7d90c5f1714b388d192f151d50252). This is a source snapshot, not a merged Git history. Original contributor attribution is in [UPSTREAM.md](UPSTREAM.md).

The original `scrapers/` contents are directly inside this app. CSV inputs are retained, file paths are relative to each script, and embedded browser cookies and `.DS_Store` files are excluded. Database names, collections, document formats, and write behavior are preserved.

## Setup

From the repository root:

```sh
python -m venv apps/scrapers/.venv
```

Activate the environment with `apps/scrapers/.venv/Scripts/Activate.ps1` in PowerShell or `source apps/scrapers/.venv/bin/activate` on macOS/Linux, then:

```sh
python -m pip install -r apps/scrapers/requirements.txt
python -m unittest discover -s apps/scrapers/tests -v
```

Writers require `apps/scrapers/private.json`. Copy `private.example.json` to that name and fill in the separately supplied MongoAccess password. The credential file and virtual environment are ignored by Git. Do not put database passwords into frontend environment variables or commit them.

## Commands and effects

Run from the repository root (absolute script paths also work from another directory):

| Command | Effect |
| --- | --- |
| `python apps/scrapers/cmu_hcii/HCII.py` | Converts adjacent `data.csv` into `cleaned_project.csv`; no database access |
| `python apps/scrapers/cmu_hcii/hciUpload.py` | Inserts cleaned HCII rows into `CMUResearchDatabase.ResearchProjects` |
| `python apps/scrapers/cmu_robotics/mango_upload.py` | Scrapes Robotics and inserts projects into `ResearchProjects` |
| `python apps/scrapers/cmu_scholar/mango_upload.py` | Scrapes CMU Scholars and inserts into `Professors` |
| `python apps/scrapers/research_opportunities/SCS.py` | Inserts the adjacent opportunity CSV into `ResearchProjects` |
| `python apps/scrapers/mango_upload.py` | Legacy example: inserts a `Mackey` document into `Users` |
| `python apps/scrapers/delete_script.py` | Deletes **all documents** in `ResearchOpportunities` |

Writers execute immediately when run (and some when imported), with no dry-run flag. Repeated inserts may create duplicates. They retain the original Atlas destination and credentials format. Only run a writer when you intend its stated database operation. Tests substitute all credentials, network calls, and database clients; they do not access production.

## Known incomplete code

- `examples/cmu_bme_scrapper.py.txt` is the unfinished upstream BME scraper, including its incomplete function declaration.
- `examples/scraperTemplate.py.txt` is the original ResearchStarter draft with non-Python comments.
- `research_opportunities/ECE.py` is the upstream empty placeholder.

The two drafts are preserved as text and are not runnable Python. Other pre-existing scraper parsing behavior and limitations are unchanged. There are no automated scraper schedules in this repository.

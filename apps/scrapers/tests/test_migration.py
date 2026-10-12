"""Exercise relocated writers with real CSVs and no network/database access."""
import builtins
import contextlib
import csv
import io
import os
from pathlib import Path
import runpy
import sys
import tempfile
import unittest
from unittest.mock import MagicMock, patch

ROOT = Path(__file__).resolve().parents[1]


class WriterMigrationTests(unittest.TestCase):
    def run_writer(self, relative_path):
        client = MagicMock()
        client.list_database_names.return_value = ['CMUResearchDatabase']
        real_open = builtins.open
        credentials_read = []

        def isolated_open(path, *args, **kwargs):
            if Path(path).name == 'private.json':
                self.assertEqual(Path(path).resolve(), ROOT / 'private.json')
                credentials_read.append(path)
                return io.StringIO('{"password": "test-only"}')
            return real_open(path, *args, **kwargs)

        robotics = MagicMock()
        robotics.scrape_robotics.return_value = {'Project': {'Project Title': 'Project'}}
        scholars = MagicMock()
        scholars.cmu_scholar_scrape.return_value = {'Person': {'Name': 'Person'}}
        previous_cwd = Path.cwd()
        try:
            with tempfile.TemporaryDirectory() as temp, \
                 patch('builtins.open', side_effect=isolated_open), \
                 patch('pymongo.mongo_client.MongoClient', return_value=client), \
                 patch('requests.sessions.Session.request', side_effect=AssertionError('Network forbidden')), \
                 patch('socket.create_connection', side_effect=AssertionError('Network forbidden')), \
                 patch.dict(sys.modules, {'project_scraper': robotics, 'scraper': scholars}), \
                 contextlib.redirect_stdout(io.StringIO()):
                os.chdir(temp)
                try:
                    runpy.run_path(str(ROOT / relative_path), run_name='__main__')
                finally:
                    os.chdir(previous_cwd)
        finally:
            os.chdir(previous_cwd)
        self.assertEqual(len(credentials_read), 1)
        return client['CMUResearchDatabase']

    def test_hcii_uses_adjacent_csv_and_preserves_field_conversion(self):
        db = self.run_writer('cmu_hcii/hciUpload.py')
        rows = db['ResearchProjects'].insert_many.call_args.args[0]
        with (ROOT / 'cmu_hcii/cleaned_project.csv').open(encoding='utf-8', newline='') as f:
            expected = list(csv.DictReader(f))
        self.assertEqual(len(rows), len(expected))
        self.assertGreater(len(rows), 0)
        self.assertEqual(rows[0]['Project Title'], expected[0]['Project Title'])
        self.assertIsInstance(rows[0]['Contact'], dict)
        self.assertIsInstance(rows[0]['College'], list)
        self.assertIsInstance(rows[0]['Enable Apply'], bool)

    def test_scs_uses_adjacent_csv(self):
        db = self.run_writer('research_opportunities/SCS.py')
        rows = db['ResearchProjects'].insert_many.call_args.args[0]
        with (ROOT / 'research_opportunities/example_json/Undergraduate Research Opportunities.csv').open(encoding='utf-8', newline='') as f:
            expected = list(csv.DictReader(f))
        self.assertEqual(len(rows), len(expected))
        self.assertGreater(len(rows), 0)
        self.assertEqual(rows[0]['Project Title'], expected[0]['Project Title'])

    def test_robotics_keeps_collection_and_payload(self):
        db = self.run_writer('cmu_robotics/mango_upload.py')
        db['ResearchProjects'].insert_one.assert_called_once_with({'Project Title': 'Project'})

    def test_scholars_keeps_collection_and_payload(self):
        db = self.run_writer('cmu_scholar/mango_upload.py')
        db['Professors'].insert_one.assert_called_once_with({'Name': 'Person'})

    def test_example_writer(self):
        db = self.run_writer('mango_upload.py')
        db['Users'].insert_one.assert_called_once_with({'name': 'Mackey'})

    def test_deletion_scope_is_unchanged(self):
        db = self.run_writer('delete_script.py')
        db['ResearchOpportunities'].delete_many.assert_called_once_with({})


if __name__ == '__main__':
    unittest.main()

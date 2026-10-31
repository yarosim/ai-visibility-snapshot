import unittest
from promiseguard import check
class Tests(unittest.TestCase):
    def test_required(self):
        self.assertEqual(check('<p>Hello world</p>',[{'id':'x','kind':'required_text','value':'hello world'}])[0]['status'],'PASS')
    def test_script_ignored(self):
        self.assertEqual(check('<script>approved</script>',[{'id':'x','kind':'required_text','value':'approved'}])[0]['status'],'REVIEW')
    def test_bad_link(self):
        self.assertEqual(check('<a href="/old">Book</a>',[{'id':'x','kind':'required_link','value':'/book'}])[0]['status'],'REVIEW')
    def test_forbidden(self):
        self.assertEqual(check('<p>24/7 service</p>',[{'id':'x','kind':'forbidden_text','value':'24/7'}])[0]['status'],'REVIEW')
if __name__=='__main__': unittest.main()

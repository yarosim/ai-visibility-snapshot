"""PromiseGuard local evidence checker. Python 3.10+, no dependencies.
Checks saved HTML, not live URLs. Not a hosted or production-ready service.
"""
import argparse, json, re
from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime, timezone

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.text=[]; self.links=[]; self.hidden=0
    def handle_starttag(self, tag, attrs):
        if tag in ('script','style'): self.hidden+=1
        if tag=='a': self.links += [v for k,v in attrs if k=='href' and v]
    def handle_endtag(self, tag):
        if tag in ('script','style'): self.hidden=max(0,self.hidden-1)
    def handle_data(self, text):
        if not self.hidden: self.text.append(text)

def check(html, rules):
    page=Page(); page.feed(html)
    text=re.sub(r'\s+', ' ', ' '.join(page.text)).strip()
    findings=[]
    for r in rules:
        kind=r['kind']; expected=r['value']
        if kind=='required_text':
            passed=expected.casefold() in text.casefold()
            pos=text.casefold().find(expected.casefold())
            evidence=text[max(0,pos-60):pos+len(expected)+60] if passed else 'Required text not found in parsed HTML.'
        elif kind=='forbidden_text':
            pos=text.casefold().find(expected.casefold()); passed=pos<0
            evidence='Forbidden text absent.' if passed else text[max(0,pos-60):pos+len(expected)+60]
        elif kind=='required_link':
            passed=expected in page.links
            evidence=expected if passed else 'Exact href absent; observed links: '+repr(page.links[:12])
        else: raise ValueError('Unsupported rule: '+kind)
        findings.append({'id':r['id'],'status':'PASS' if passed else 'REVIEW', 'kind':kind,'expected':expected,'evidence':evidence})
    return findings

def main():
    a=argparse.ArgumentParser(); a.add_argument('config'); a.add_argument('--output',default='report.json'); args=a.parse_args()
    config_path=Path(args.config).resolve(); cfg=json.loads(config_path.read_text())
    results=[]
    for page in cfg['pages']:
        try:
            html=(config_path.parent/page['file']).read_text(encoding='utf-8')
            results.append({'page':page['label'],'findings':check(html,page['rules'])})
        except (OSError, ValueError, KeyError) as e:
            results.append({'page':page.get('label','unknown'),'status':'CHECK_ERROR','error':str(e)})
    report={'checked_at':datetime.now(timezone.utc).isoformat(),'mode':'local_saved_html','results':results}
    Path(args.output).write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2))
if __name__=='__main__': main()

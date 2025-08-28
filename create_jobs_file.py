import json

json_content = '''
[
    {
        "name": "Simran Khan",
        "country": "India",
        "location": "Delhi",
        "company": "IBM",
        "job_title": "Project Manager"
    },
    {
        "name": "Sneha Patel",
        "country": "India",
        "location": "Delhi",
        "company": "NETSOL",
        "job_title": "Marketing Specialist"
    },
    {
        "name": "Ayesha Gupta",
        "country": "India",
        "location": "Delhi",
        "company": "Google",
        "job_title": "Data Analyst"
    },
    {
        "name": "Sneha Chowdhury",
        "country": "India",
        "location": "Delhi",
        "company": "Microsoft",
        "job_title": "Marketing Specialist"
    },
    {
        "name": "Rahul Gupta",
        "country": "India",
        "location": "Pune",
        "company": "NETSOL",
        "job_title": "Accountant"
    },
    {
        "name": "Ahmed Sharma",
        "country": "Pakistan",
        "location": "Faisalabad",
        "company": "Oracle",
        "job_title": "Accountant"
    },
    {
        "name": "Priya Shaikh",
        "country": "Pakistan",
        "location": "Peshawar",
        "company": "NETSOL",
        "job_title": "UI/UX Designer"
    },
    {
        "name": "Ahmed Patel",
        "country": "India",
        "location": "Kolkata",
        "company": "Tata Consultancy Services",
        "job_title": "Cybersecurity Specialist"
    },
    {
        "name": "Simran Chowdhury",
        "country": "India",
        "location": "Delhi",
        "company": "Microsoft",
        "job_title": "Software Engineer"
    },
    {
        "name": "Ahmed Gupta",
        "country": "India",
        "location": "Pune",
        "company": "Tech Mahindra",
        "job_title": "Cybersecurity Specialist"
    }
]
'''

data = json.loads(json_content)

transformed_data = []
for i, item in enumerate(data):
    transformed_data.append({
        'id': i,
        'title': item['job_title'],
        'company': item['company'],
        'location': item['location'],
        'country': item['country'],
        'description': 'This is a placeholder description.',
        'image': ''
    })

with open('C:\\Users\\Fahad Mushtaq\\Downloads\\sponsorshipsvisajobs-master\\sponsorshipsvisajobs-master\\jobs.json', 'w', encoding='utf-8') as f:
    json.dump(transformed_data, f, indent=4, ensure_ascii=False)

print("Successfully created jobs.json")

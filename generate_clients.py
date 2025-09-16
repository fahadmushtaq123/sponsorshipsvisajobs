import json
import random

# Sample first and last names for variety
pakistani_first_names = ["Ali", "Ayesha", "Ahmed", "Fatima", "Bilal", "Zara"]
pakistani_last_names = ["Khan", "Malik", "Iqbal", "Ansari", "Shaikh"]

indian_first_names = ["Rahul", "Sneha", "Arjun", "Priya", "Ravi", "Simran"]
indian_last_names = ["Sharma", "Gupta", "Patel", "Chowdhury", "Verma"]

# Sample companies (international + regional)
companies = [
    "Amazon", "Google", "Microsoft", "Apple", "Meta", "Tesla", "SpaceX", "IBM", "Intel", "Oracle",
    "Tata Consultancy Services", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra",
    "Systems Limited", "NETSOL", "10Pearls", "Careem", "Bykea"
]

# Job titles
job_titles = [
    "Software Engineer", "Data Analyst", "HR Manager", "Marketing Specialist",
    "IT Support", "Project Manager", "Accountant", "Sales Executive",
    "UI/UX Designer", "Cybersecurity Specialist"
]

# Pakistani and Indian locations
pakistan_locations = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"]
india_locations = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"]

people = []

# Generate 100 Pakistani clients
for i in range(100):
    person = {
        "name": f"{random.choice(pakistani_first_names)} {random.choice(pakistani_last_names)}",
        "country": "Pakistan",
        "location": random.choice(pakistan_locations),
        "company": random.choice(companies),
        "job_title": random.choice(job_titles)
    }
    people.append(person)

# Generate 100 Indian clients
for i in range(100):
    person = {
        "name": f"{random.choice(indian_first_names)} {random.choice(indian_last_names)}",
        "country": "India",
        "location": random.choice(india_locations),
        "company": random.choice(companies),
        "job_title": random.choice(job_titles)
    }
    people.append(person)

# Save JSON file
file_path = "new_clients.json"
with open(file_path, "w", encoding="utf-8") as f:
    json.dump(people, f, indent=4, ensure_ascii=False)

print(f"Generated {len(people)} clients and saved to {file_path}")
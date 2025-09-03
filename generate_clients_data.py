import json
import random

# Sample first and last names for variety
first_names = ["Ali", "Ayesha", "Rahul", "Sneha", "Ahmed", "Fatima", "Arjun", "Priya", "Bilal", "Zara", "Ravi", "Simran"]
last_names = ["Khan", "Malik", "Sharma", "Gupta", "Patel", "Iqbal", "Chowdhury", "Verma", "Ansari", "Shaikh"]

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

# Generate 700 random job records with country-specific locations
people = []
for i in range(700):
    country = random.choice(["Pakistan", "India"])
    location = random.choice(pakistan_locations if country == "Pakistan" else india_locations)
    
    person = {
        "name": f"{random.choice(first_names)} {random.choice(last_names)}",
        "country": country,
        "location": location,
        "company": random.choice(companies),
        "job_title": random.choice(job_titles)
    }
    people.append(person)

# Save JSON file
file_path = "C:\\Users\\Fahad Mushtaq\\Desktop\\job-board\\random_people_jobs_with_locations_700.json"
with open(file_path, "w", encoding="utf-8") as f:
    json.dump(people, f, indent=4, ensure_ascii=False)

print(file_path)

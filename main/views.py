from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

# Importe requests y json
import requests
import json

from datetime import datetime
from collections import Counter

# Function to convert date string to datetime object
def convert_date(date_str):
    # Remove spaces and periods from 'a. m.' and 'p. m.'
    date_str = date_str.replace(" a. m.", " AM").replace(" p. m.", " PM")
    return datetime.strptime(date_str, '%d/%m/%Y, %I:%M:%S %p')

# Function to extract the date part from the 'saved' timestamp
def extract_date(date_str):
    # Remove spaces and periods from 'a. m.' and 'p. m.'
    date_str = date_str.replace(" a. m.", " AM").replace(" p. m.", " PM")
    return datetime.strptime(date_str, '%d/%m/%Y, %I:%M:%S %p').date()

def index(request):
     # Arme el endpoint del REST API
     current_url = request.build_absolute_uri()
     url = current_url + '/api/v1/landing'

     # Petición al REST API
     response_http = requests.get(url)
     response_dict = json.loads(response_http.content)

     print("Endpoint ", url)
     print("Response ", response_dict)

     # Respuestas totales
     total_responses = len(response_dict.keys())

     # Valores de la respuesta
     responses = response_dict.values()
     
     # Sort the dictionary by date
     sorted_data = sorted(response_dict.items(), key=lambda x: convert_date(x[1]['saved']))

     # Get the earliest and latest
     earliest = sorted_data[0][1]
     latest = sorted_data[-1][1]
     
     # Extract the dates from the saved timestamps
     dates = [extract_date(entry['saved']) for entry in response_dict.values()]

     # Count occurrences of each date
     date_counts = Counter(dates)

     # Find the date with the most responses
     most_responses_date = date_counts.most_common(1)[0][0]

     # Objeto con los datos a renderizar
     data = {
         'title': 'Landing - Dashboard',
         'total_responses': total_responses,
         'responses': responses,
         "earliest": earliest["saved"],
         "latest": latest["saved"],
          "most_responses_date": most_responses_date
     }

     # Renderización en la plantilla
     return render(request, 'main/index.html', data)
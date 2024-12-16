# Dwello

## Introduction
Dwello is a web app that recommends neighborhoods based on many different user preferences, including salary ranges for different industries, crime rate, population density, median income, cost of living, etc.
We haven't written code yet, but we'll have a backend folder for our django backend and a frontend folder for our React frontend.

## Features
Interactive map for exploring locations

Search filters for customizing results

Relevance based lookup

Common queries

List view and Detailed views for neighborhoods, cities, zip codes, and states

## Tech Stack
Django, Postgres, Redis, JWT, React, Tailwind CSS, Vite, Google Maps API

## Installation
Clone the Repo. 

Enter a Google Maps API key in `frontend/.env`.

For the frontend, run:

`cd frontend`

`nvm install node`

`npm install`

For the backend, run:

`cd backend`

`pipenv shell`

`pipenv install`

## Usage

Open two terminals. 

In the first, go to the frontend directory and run `npm run dev`

In the second, go to the backend directory and run `python manage.py runserver`

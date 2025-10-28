# ☕ Saintgits Café Hub


A full-stack web application designed to streamline online ordering for the Saintgits campus cafe. This project features a real-time menu, a reactive shopping cart, and secure order processing, built with React, Supabase, and Tailwind CSS.

## Features

* *Secure Authentication:* User sign-up and sign-in handled by *Supabase Auth*.
* *Email Validation:* Restricts registration to **@saintgits.org** email addresses only.
* *Dynamic Menu:* Browse menu items (snacks and beverages) loaded from the Supabase database.
* *Reactive Shopping Cart:* Add/remove items and see your cart update instantly using React Context.
* *Responsive UI:* A modern, mobile-first design built with *Tailwind CSS* and custom themeing.
* *Checkout Flow:* A multi-step process to collect user details (Name, Roll No, Hostel) and proceed to payment.
* *Secure Order Processing:* Uses a *Supabase Edge Function* (place-order) to securely validate and insert order data into the database, preventing client-side tampering.

## Tech Stack

This project is built using a modern frontend stack with a Supabase backend.

* *Frontend:*
    * [*React.js (with TypeScript)*](https://reactjs.org/) - A JavaScript library for building user interfaces.
    * [*React Router*](https://reactrouter.com/) - For client-side routing.
    * [*Tailwind CSS*](https://tailwindcss.com/) - A utility-first CSS framework.
    * [**@tanstack/react-query**]([https://tanstack.com/query/latest](https://tanstack.com/query/latest)) - For data fetching, caching, and state management.
    * [*React Context*](https://reactjs.org/docs/context.html) (useCart) - For global shopping cart state.
    * [*lucide-react*](https://lucide.dev/) - For icons.

* *Backend-as-a-Service (BaaS):*
    * [*Supabase*](https://supabase.io/)
        * *Supabase Auth:* Manages user login, registration, and sessions.
        * *Supabase (PostgreSQL):* The database used to store users, menu items, and orders.
        * *Supabase Edge Functions:* Serverless functions (e.g., place-order) for secure backend logic.

## Database Schema

The application uses a *Supabase (PostgreSQL)* database. The data is organized into tables:

### 1. users (Managed by Supabase Auth)
Stores user authentication information. Additional user profile data (like name) is added to the auth.users metadata on sign-up.

| Column | Data Type | Description |
| :--- | :--- | :--- |
| id | uuid | *Primary Key* (Managed by Supabase Auth) |
| email | varchar | User's email (unique) |
| name | text | User's name |
| created_at | time | timestamp when account created |


### 2. menu_items Table
Stores all available food and drink items.

| Column | Data Type | Description |
| :--- | :--- | :--- |
| id | text | *Primary Key* (e.g., 'uzhunnu-vada') |
| name | text | Name of the item (e.g., 'Uzhunnu Vada') |
| price | numeric | Price of the item (e.g., 10) |
| category | text | Item category (e.g., 'snacks', 'beverages') |
| image_url | text | URL for the item's image |

### 3. orders Table
Stores header information for all orders placed by users. This data is collected during checkout.

| Column | Data Type | Description |
| :--- | :--- | :--- |
| order_id | uuid | *Primary Key* |
| user_id | uuid | *Foreign Key* (references auth.users(id)) |
| total_price | numeric | The total cost of the order |
| status | text | Current status (e.g., 'Pending', 'Completed') |
| created_at | timestamp | Timestamp when the order was placed |
| name | text | User's name from checkout |
| roll_number | text | User's roll number from checkout |
| hostel_block | text | User's hostel block from checkout |


## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You will need the following tools installed on your system:

* [Node.js (v18.x or later)](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/) (comes with Node.js)
* [Git](https://git-scm.com/)
* [Supabase CLI](https://supabase.com/docs/guides/cli)
* A [Supabase](https://supabase.com/) account.

### Installation & Setup

1.  *Clone the repository:*
    sh
    git clone https://github.com/Suj93s/campus-cafe-craft.git
    cd campus-cafe-craft
    

2.  *Set up Supabase Project:*
    * Go to your [Supabase Dashboard](https://app.supabase.com/) and create a new project.
    * Go to the *SQL Editor* and run your SQL scripts to create the menu_items, orders, and order_items tables.
    * Go to *Settings* > *API. Find your **Project URL* and **anon Public Key**.

3.  *Set up the Frontend (Client):*
    * Navigate to the client directory:
        sh
        cd client
        
    * Install frontend dependencies:
        sh
        npm install
        
    * Create a .env.local file in the client directory:
        env
        # .env.local (in client/ directory)
        
        # Supabase Project URL
        VITE_SUPABASE_URL=YOUR_PROJECT_URL_HERE
        
        # Supabase Anon Public Key
        VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
        
        *Note: Verify these variable names (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) match what's in your @/integrations/supabase/client.ts file.*

4.  *Set up Supabase Edge Functions:*
    * From the root of the project, link your local project to Supabase:
        sh
        supabase login
        supabase link --project-ref YOUR_PROJECT_ID
        
    * Deploy the place-order function (which Payment.tsx depends on):
        sh
        supabase functions deploy place-order
        

5.  *Run the application:*
    * From the client directory, run the frontend development server:
        sh
        npm run dev
        
    * The React app should now be running and accessible in your browser (e.g., http://localhost:5173).

## Project Structure


campus-cafe-craft/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── FoodCard.tsx
│   │   │   └── CartSidebar.tsx
│   │   ├── contexts/
│   │   │   └── CartContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx
│   │   │   └── use-toast.ts
│   │   ├── integrations/
│   │   │   └── supabase/
│   │   │       └── client.ts
│   │   ├── pages/
│   │   │   ├── Index.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── Payment.tsx
│   │   │   └── NotFound.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.local.example
│   ├── package.json
│   └── ...
│
├── supabase/               # Supabase backend config
│   ├── functions/
│   │   └── place-order/    # Serverless Edge Function
│   │       └── index.ts
│   └── ...
│
└── README.md               # You are here!

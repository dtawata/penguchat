## Getting Started

1. Import MySQL schema:
```bash
mysql -u root < schema.sql
```

2. Run the development server:
```bash
npm run dev
```

3. Run the socket server in a new terminal:
```bash
npm run chat
```

4. Open http://localhost:3000/register with your browser and fill in information to create an account.
New users will be automatically added to mock groups/friends to start testing the application immediately.
You can create a second account in incognito or in a new browser to test the messaging on your own.

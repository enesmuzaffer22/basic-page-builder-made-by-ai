# Firebase Security Rules for Page Builder

The "Missing or insufficient permissions" error occurs because Firebase Firestore's default security rules are very restrictive. Here's how to update your security rules to allow authenticated users to access their data.

## Steps to update Firebase security rules:

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. In the left sidebar, click on "Firestore Database"
4. Go to the "Rules" tab
5. Replace the current rules with the ones below
6. Click "Publish"

## Security Rules to use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write only their own data
    match /pages/{pageId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Default rules - deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## What these rules do:

- They allow any authenticated user to create a new page
- They allow users to read, update, or delete only their own pages (where the userId matches their auth ID)
- They deny all other access to your database

## Testing the rules:

After updating the rules, try creating a page again. If you still encounter permission issues, verify that:

1. You are properly authenticated (logged in)
2. The userId saved in the page document matches your auth user ID
3. There are no typos in your security rules

## Advanced security:

For more complex rules and validation (such as field validation, rate limiting, etc.), refer to the [Firebase Security Rules documentation](https://firebase.google.com/docs/firestore/security/get-started).

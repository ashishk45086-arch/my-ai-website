# Security Specification for Phagwara Renters Portal

## 1. Data Invariants
- Users can only read or write their own user profile document at `/users/{userId}`.
- Users can only create or delete favorites subdocuments inside their own `/users/{userId}/favorites/{propertyId}` path.
- Users can only manage or read visits inside their own subcollection `/users/{userId}/visits/{visitId}`.

## 2. Dirty Dozen payloads (Rejected Cases)
1. Write to user profile of a different user.
2. Direct update of shadow isVerified profile flag.
3. Overwrite of a target favorite for a different signed-in user.
4. Setting temporal createdAt fields to a client-controlled future date rather than server timestamp.
5. Saving favorite with empty propertyId.
6. Creating a visit booking under someone else's userId.
7. Injecting 10MB dummy data into fullName fields.
8. Deleting other users' visit records.
9. Writing custom client claims inside Auth structures.
10. Anonymous unauthenticated profile registration bypassing emails.
11. Reading the private list of booked visits across the platform.
12. Forging foreign ownerIDs on creation.

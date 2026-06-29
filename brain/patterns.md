# Codebase Patterns

## Authentication Pattern
- **Backends**: JWT tokens with bcrypt for password hashing.
- **Frontends**: Axios interceptors are typically used to attach JWT tokens to API requests. Firebase is also used in some frontends.

## API Pattern
- **Frontends**: Axios is the standard HTTP client.
- **Backends**: Express Routers are used to modularize endpoints.

## Database Access Pattern
- **Backends**: Mongoose ORM is used for MongoDB interactions. Models are defined and exported.

## UI Component Pattern
- **Customer Frontend**: Next.js components, Tailwind CSS styling.
- **Admin Frontends**: React Functional components, React Router for navigation, Recharts for data visualization, and component libraries like MUI/Ant Design.

# Register Screen

This is the user registration page for the bidMarket application.

## Features

- Email and password validation
- Option to register as a seller or bidder
- Password strength indicator
- Responsive design
- Success/error notifications
- Form validation with error messages

## Usage

The Register component handles user registration through the backend API. When a user successfully registers:

1. The form data is validated
2. A POST request is sent to `/users/signup`
3. On success, the user token is stored in localStorage
4. A success notification is displayed

## Form Fields

- **Email**: Required, must be valid email format
- **Password**: Required, minimum 6 characters
- **Confirm Password**: Must match the password
- **I want to sell items**: Checkbox to register as a seller

## Validation

- Email format validation
- Password minimum length (6 characters)
- Password confirmation matching
- Real-time error display

## API Integration

Uses the `authService` to communicate with the backend:
- Endpoint: `POST /users/signup`
- Request body: `{ email, password, isSeller }`
- Response: User object with JWT token

## Styling

- Uses custom CSS with modern design
- Responsive layout for mobile devices
- Smooth animations and hover effects
- Consistent color scheme matching bidMarket branding

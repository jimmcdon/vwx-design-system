/**
 * Test Fixtures
 * Reusable test data and component configurations
 */

/**
 * Sample user data for testing
 */
export const mockUsers = {
  admin: {
    id: '1',
    name: 'Admin User',
    email: 'admin@vw.com',
    role: 'admin',
  },
  developer: {
    id: '2',
    name: 'Dev User',
    email: 'dev@vw.com',
    role: 'developer',
  },
  designer: {
    id: '3',
    name: 'Designer User',
    email: 'designer@vw.com',
    role: 'designer',
  },
};

/**
 * Sample theme configurations
 */
export const mockThemes = {
  light: {
    name: 'Light Theme',
    colors: {
      primary: '#001E50',
      secondary: '#00B0F0',
      background: '#FFFFFF',
      text: '#000000',
    },
  },
  dark: {
    name: 'Dark Theme',
    colors: {
      primary: '#00B0F0',
      secondary: '#001E50',
      background: '#121212',
      text: '#FFFFFF',
    },
  },
  vwBlue: {
    name: 'VW Blue Theme',
    colors: {
      primary: '#001E50',
      secondary: '#00B0F0',
      background: '#F5F5F5',
      text: '#333333',
    },
  },
};

/**
 * Sample component props
 */
export const mockComponentProps = {
  button: {
    primary: {
      variant: 'primary',
      label: 'Primary Button',
      disabled: false,
    },
    secondary: {
      variant: 'secondary',
      label: 'Secondary Button',
      disabled: false,
    },
    disabled: {
      variant: 'primary',
      label: 'Disabled Button',
      disabled: true,
    },
  },
  input: {
    text: {
      type: 'text',
      placeholder: 'Enter text',
      value: '',
      required: false,
    },
    email: {
      type: 'email',
      placeholder: 'Enter email',
      value: 'test@example.com',
      required: true,
    },
    password: {
      type: 'password',
      placeholder: 'Enter password',
      value: '',
      required: true,
    },
  },
};

/**
 * Sample API responses
 */
export const mockAPIResponses = {
  success: {
    status: 200,
    data: {
      message: 'Success',
      timestamp: new Date().toISOString(),
    },
  },
  error: {
    status: 500,
    error: {
      message: 'Internal server error',
      code: 'ERR_INTERNAL',
    },
  },
  notFound: {
    status: 404,
    error: {
      message: 'Resource not found',
      code: 'ERR_NOT_FOUND',
    },
  },
};

/**
 * Sample form data
 */
export const mockFormData = {
  login: {
    email: 'user@vw.com',
    password: 'password123',
  },
  registration: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@vw.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
  },
  profile: {
    name: 'Jane Smith',
    title: 'Senior Designer',
    department: 'UX Design',
    bio: 'Passionate about creating accessible and beautiful interfaces.',
  },
};

/**
 * Sample accessibility tree data
 */
export const mockA11yData = {
  button: {
    role: 'button',
    name: 'Submit',
    accessible: true,
  },
  input: {
    role: 'textbox',
    name: 'Email address',
    required: true,
    invalid: false,
  },
  landmark: {
    role: 'navigation',
    name: 'Main navigation',
    accessible: true,
  },
};

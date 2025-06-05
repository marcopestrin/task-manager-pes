import { GetServerSidePropsContext } from 'next';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function redirectIfAuthenticated(context: GetServerSidePropsContext) {
  const currentPath = context.resolvedUrl;
  if (currentPath.startsWith('/edit-project')) {
    return { props: {} };
  }
  
  const cookies = context.req.headers.cookie;
  if (!cookies) return { props: {} };
  const parsed = cookie.parse(cookies);
  const token = parsed.token;
  if (!token) return { props: {} };

  try {
    jwt.verify(token, JWT_SECRET);
    // if token is valid redirect to restricted area
    return {
      redirect: {
        destination: '/projects',
        permanent: false,
      },
    };
  } catch (err) {
    // token no valid or expired. stay in public page
    return { props: {} };
  }
}

interface AuthenticatedResult {
  user: any; 
}

/**
  * Check if the user is authenticated.
  * If yes, return the decoded user.
  * Otherwise, redirect to login.
 */
export async function requireAuthentication(
  context: GetServerSidePropsContext
): Promise<{ redirect: { destination: string; permanent: false } } | AuthenticatedResult> {
  const cookies = context.req.headers.cookie;
  if (!cookies) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const parsed = cookie.parse(cookies);
  const token = parsed.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { user: decoded };
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}

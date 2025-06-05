import { GetServerSideProps, GetServerSidePropsContext } from "next";
import LoginForm from "../components/login/LoginForm";
import { redirectIfAuthenticated } from '../lib/auth';

export const getServerSideProps: GetServerSideProps = (context: GetServerSidePropsContext) => {
  return redirectIfAuthenticated(context);
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </main>
  );
}

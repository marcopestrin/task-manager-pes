import RegisterForm from "../components/register/RegisterForm";
import { redirectIfAuthenticated } from '../lib/auth';

export const getServerSideProps = async (context) => {
  return redirectIfAuthenticated(context);
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <RegisterForm />
    </main>
  );
}

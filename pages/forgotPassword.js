import ForgotPassword from "../components/forgotPassword";

export async function getStaticProps() {
  return { props: { isBlue: true } };
};

export default function Forgot() {
  return (
    <main>
      <div className="container">
        <ForgotPassword />
      </div>
    </main>
  );
};
